import React, { useEffect, useState, useRef } from 'react';
import { ethers } from 'ethers';
import { abi } from './abi';
import OverflowCard from './OverflowCard';
import { FaTimes } from 'react-icons/fa';
import getChainInfo from '../chain';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AvaxIcon from './svgs/Avax';
import BNBIcon from './svgs/BNB';
import './css/fadeIn.css'; // Import the fade-in animation CSS
import IconButton from '@mui/material/IconButton';
import { BsCopy } from "react-icons/bs";

const ChainNameToObject = {
  "BSC": getChainInfo(56, false),
  "AVAX": getChainInfo(43114, false),
  "BSCT": getChainInfo(97, false),
  "FUJI": getChainInfo(43113, false),
};

const Compare = () => {
  const [nftData, setNftData] = useState([]);
  const [compareAddresses, setCompareAddresses] = useState([]);
  const [addressInput, setAddressInput] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [chain, setChain] = useState('BSC');

  const handleChange = (event) => {
    setChain(event.target.value);
  };

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 9)}.....${addr.slice(-7)}`;
  };

  useEffect(() => {
    async function fetchAllNFTs() {
      try {
        const contractAddress = ChainNameToObject[chain].address;
        const provider = new ethers.JsonRpcProvider(ChainNameToObject[chain].rpc_url);
        const contractABI = abi;
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const tokenCount = await contract.tokenCount();
        const tokens = [];

        for (let tokenId = 0; tokenId < tokenCount; tokenId++) {
          const uri = await contract.tokenURI(tokenId);
          const sender = await contract.tokenSender(tokenId);
          const owner = await contract.ownerOf(tokenId);
          const metadata = await (await fetch(uri)).json();
          tokens.push({ tokenId: tokenId.toString(), metadata, sender, owner });
        }

        setNftData(tokens);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    }

    fetchAllNFTs();
  }, [chain]);

  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem('compareAddresses'));
    if (savedAddresses) {
      setCompareAddresses(savedAddresses);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('compareAddresses', JSON.stringify(compareAddresses));
    }
  }, [compareAddresses, loaded]);

  const handleAddAddress = () => {
    const address = addressInput.trim().toLowerCase();
    if (
      ethers.isAddress(address) &&
      !compareAddresses.some((item) => item.address === address)
    ) {
      setCompareAddresses([...compareAddresses, { address, nickname: '' }]);
      setAddressInput('');
    } else {
      alert('Invalid or duplicate address.');
    }
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = compareAddresses.filter((_, i) => i !== index);
    setCompareAddresses(newAddresses);
    if (compareAddresses[index].address === selectedCandidate) {
      setSelectedCandidate(null);
    }
  };

  const handleSelectCandidate = (address) => {
    if (selectedCandidate === address) {
      setSelectedCandidate(null);
    } else {
      setSelectedCandidate(address);
    }
  };

  const handleCopy = (event, address) => {
    event.stopPropagation(); 
    if (document.hasFocus()) {
      navigator.clipboard.writeText(address)
        .then(() => alert("Copied to clipboard!"))
        .catch((err) => console.error("Failed to copy text:", err));
    } else {
      alert("Please ensure the page is focused before copying.");
    }
  };

  const filteredNfts = (owner_address) =>
    nftData.filter(
      (nft) => owner_address && nft.owner.toLowerCase() === owner_address.toLowerCase()
    );

  const handleNicknameChange = (index, nickname) => {
    const updatedAddresses = [...compareAddresses];
    updatedAddresses[index].nickname = nickname;
    setCompareAddresses(updatedAddresses);
  };

  return (
    <div
      className="compare-page animate-fade-in-up delay-1"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <header className="header animate-fade-in-up delay-2" style={{ textAlign: 'center' }}>
        <p className="title">Compare NFTs</p>
        <p className="subtitle">
          Enter multiple candidate wallet addresses to display their CVV NFTs side-by-side.
          <br /> Quickly identify top talent by reviewing their verified achievements.
        </p>
      </header>

      <div className="flex items-center gap-8 animate-fade-in-up delay-3">
        <FormControl
          variant="standard"
          sx={{
            m: 0,
            minWidth: 200,
            "& .MuiInputLabel-root": {
              color: "white",
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "white",
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottomColor: "white",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "white",
            },
          }}
        >
          <InputLabel id="demo-simple-select-standard-label" className="text-white opacity-50">
            Chain
          </InputLabel>
          <Select
            sx={{ color: "white" }}
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={chain}
            onChange={handleChange}
            label="Chain"
          >
            <MenuItem value="BSC">BSC</MenuItem>
            <MenuItem value="AVAX">AVAX</MenuItem>
            <MenuItem value="BSCT">BSC-Test</MenuItem>
            <MenuItem value="FUJI">AVAX-Test (FUJI)</MenuItem>
          </Select>
        </FormControl>
        {['BSC', 'BSCT'].includes(chain) ? (
          <BNBIcon size={24} color="#F0B90B" />
        ) : (
          <AvaxIcon size={24} color="#ff0000" />
        )}
      </div>

      <div
        className="address-input-container animate-fade-in-up delay-4"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem',
          margin: '1rem 0',
          width: "100%",
        }}
      >
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          className="input-underline w-1/3"
          placeholder="Enter address to compare"
          style={{ color: 'white' }}
        />
        <button
          onClick={handleAddAddress}
          className="button"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#222126')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#39383f')}
        >
          <p style={{ position: "relative", zIndex: 1 }}>Add Address</p>
        </button>
      </div>

      <div className="nft-display animate-fade-in-up delay-5" style={{ display: 'flex', width: '100%' }}>
        <div
          style={{
            width: '25%',
            padding: '1rem',
            borderRight: '1px solid #6EACDA',
            overflowY: 'auto',
            height: '100%',
            scrollbarWidth: 'thin',
          }}
        >
          {compareAddresses.length > 0 ? (
            compareAddresses.map((item, index) => (
              <div key={index} style={{ height: '18rem' }}>
                <div
                  style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor:
                      selectedCandidate === item.address ? '#222126' : '#39383f',
                    transition: 'background-color 0.3s ease',
                    border: '1.5px solid #6EACDA',
                  }}
                  onClick={() => handleSelectCandidate(item.address)}
                >
                  <div style={{ flexGrow: 1 }}>
                    <NicknameInput
                      nickname={item.nickname}
                      onNicknameChange={(nickname) =>
                        handleNicknameChange(index, nickname)
                      }
                    />
                    <span style={{ fontSize: '0.875rem', color: '#e7dfdd' }}>
                      {truncateAddress(item.address)}
                    </span>
                    <IconButton
                      color="primary"
                      onClick={(event) => handleCopy(event, item.address)}
                      aria-label="Copy wallet address"
                      sx={{ width: 28, height: 20, ml: 1 }}
                    >
                      <BsCopy />
                    </IconButton> 
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAddress(index);
                    }}
                    style={{
                      color: '#f56565',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#c9c9c9' }}>No addresses selected.</p>
          )}
        </div>

        <div
          style={{
            width: '67%',
            padding: '1rem',
            overflowY: 'auto',
            height: '100%',
            scrollbarWidth: 'thin',
          }}
        >
          {compareAddresses.map((item, index) => (
            <div key={index} style={{ height: '18rem' }} className="overflow-x-auto">
              {filteredNfts(item.address).length > 0 ? (
                <div className="flex space-x-8 h-full">
                  {filteredNfts(item.address).map((nft) => (
                    <div
                      key={nft.tokenId}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <OverflowCard
                        name={nft.metadata.name}
                        competition_name={nft.metadata.competition_name}
                        award={nft.metadata.award}
                        description={nft.metadata.description}
                        honoree={nft.metadata.honoree}
                        honoree_address={nft.metadata._address}
                        image={nft.metadata.image}
                        issuer_address={nft.sender}
                        official_web={nft.metadata.official_web}
                        organizer={nft.metadata.organizer}
                        warning={nft.owner.toLowerCase() !== nft.metadata._address.toLowerCase()}
                        owner={nft.owner}
                        hover_scale={false}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    color: '#c9c9c9',
                    textAlign: 'center',
                    margin: '0 auto',
                  }}
                >
                  No NFTs found for the selected address.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NicknameInput = ({ nickname, onNicknameChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localNickname, setLocalNickname] = useState(nickname);
  const inputRef = useRef(null);

  const handleBlur = () => {
    setIsEditing(false);
    onNicknameChange(localNickname);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={localNickname}
      onChange={(e) => setLocalNickname(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleBlur();
        }
      }}
      style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#6EACDA' }}
    />
  ) : (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      style={{ fontWeight: 'bold', marginBottom: '0.5rem', cursor: 'pointer', color: '#6EACDA' }}
    >
      {nickname || 'Click to add nickname'}
    </div>
  );
};

export default Compare;
