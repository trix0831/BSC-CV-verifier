import React, { useEffect, useState, useRef } from 'react';
import { ethers } from 'ethers';
import { abi } from './abi';
import Card from './Card';
import { FaTimes } from 'react-icons/fa';

const Compare = () => {
  const [nftData, setNftData] = useState([]);
  const [compareAddresses, setCompareAddresses] = useState([]);
  const [addressInput, setAddressInput] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loaded, setLoaded] = useState(false); // New state to track if data is loaded

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_NETWORK);
  const contractABI = abi;
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  useEffect(() => {
    async function fetchAllNFTs() {
      try {
        const tokenCount = await contract.tokenCount();
        const tokens = [];

        for (let tokenId = 0; tokenId < tokenCount; tokenId++) {
          const uri = await contract.tokenURI(tokenId);
          const sender = await contract.tokenSender(tokenId);
          const owner = await contract.ownerOf(tokenId);
          const metadata = await (await fetch(uri)).json();
          tokens.push({ tokenId: tokenId.toString(), metadata, sender, owner });
        }

        console.log('Token details:', tokens);
        setNftData(tokens);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    }

    fetchAllNFTs();
  }, []);

  // Load saved addresses and nicknames from localStorage on mount
  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem('compareAddresses'));
    if (savedAddresses) {
      setCompareAddresses(savedAddresses);
    }
    setLoaded(true); // Indicate that loading is complete
  }, []);

  // Save addresses and nicknames to localStorage whenever compareAddresses changes
  useEffect(() => {
    if (loaded) { // Only save if data has been loaded
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

  const filteredNfts = nftData.filter(
    (nft) => selectedCandidate && nft.owner.toLowerCase() === selectedCandidate
  );

  const handleNicknameChange = (index, nickname) => {
    const updatedAddresses = [...compareAddresses];
    updatedAddresses[index].nickname = nickname;
    setCompareAddresses(updatedAddresses);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <div style={{ fontSize: '1.875rem', margin: '1rem 0', color: '#c9c9c9'}}>
        Compare NFTs by Owner
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          margin: '1rem 0',
        }}
      >
        <div className="w-screen flex justify-center gap-4 mt-4 mb-8">
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            className="input-underline w-1/3"
            placeholder="Enter address to compare"
          />
          <button
            onClick={handleAddAddress}
            style={{
              border: '1.5px solid #6EACDA', // Light blue border
              backgroundColor: '#222126 hover:#39383f',      // Gray background
              color: '#c9c9c9',             // Text color
              padding: '10px 20px',         // Optional: Add some padding
              cursor: 'pointer',            // Optional: Change cursor to pointer
              transition: 'background-color 0.3s ease', // Smooth hover effect
              borderRadius: '0.5rem',       // Optional: Add some border radius
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#222126'} // Change background on hover
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#39383f'}    // Reset background on hover out
          >
            Add Address
          </button>

        </div>
      </div>

      <div
        style={{
          display: 'flex',
          width: '100%',
          height: 'calc(100vh - 200px)',
        }}
      >
        <div
          style={{
            width: '33%',
            padding: '1rem',
            borderRight: '1px solid #6EACDA',
            overflowY: 'auto',
            height: '100%',
            scrollbarWidth: 'thin',
          }}
        >
          {compareAddresses.length > 0 ? (
            compareAddresses.map((item, index) => (
              <div
                key={index}
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
                  border: '1.5px solid #6EACDA', // Added light blue border
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
                    {item.address}
                  </span>
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
                    marginLeft: '-1rem', // Adjusted margin
                    marginBottom: '1rem', // Adjusted margin
                    padding: '0.25rem', // Added padding
                  }}
                >
                  <FaTimes/>
                </button>
              </div>
            ))
          ) : (
            <p style={{color: '#c9c9c9'}}>No addresses selected.</p>
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
          {selectedCandidate ? (
            filteredNfts.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '2rem',
                }}
              >
                {filteredNfts.map((nft) => (
                  <div
                    key={nft.tokenId}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Card
                      name={nft.metadata.name}
                      competition_name={nft.metadata.competition_name}
                      award={nft.metadata.award}
                      description={nft.metadata.description}
                      honoree={nft.metadata.honoree}
                      image={nft.metadata.image}
                      issuer_address={nft.metadata.issuer_address}
                      official_web={nft.metadata.official_web}
                      organizer={nft.metadata.organizer}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No NFTs found for the selected address.</p>
            )
          ) : (
            <p>Please select a candidate to view their NFTs.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for editing the nickname
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
        e.stopPropagation(); // Prevent triggering the select handler
        setIsEditing(true);
      }}
      style={{ fontWeight: 'bold', marginBottom: '0.5rem', cursor: 'pointer', color: '#6EACDA' }}
    >
      {nickname || 'Click to add nickname'}
    </div>
  );
};

export default Compare;
