import React, { useEffect, useState } from 'react';
import './css/YourToken.css';
import { ethers } from 'ethers';
import { abi } from './abi';
import { IoFilter } from "react-icons/io5";
import MetadataFilter from './MetadataFilter';
import OverflowCard from './OverflowCard';
import getChainInfo from '../chain';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AvaxIcon from './svgs/Avax';
import BNBIcon from './svgs/BNB';

const ChainNameToObject = {
  "BSC": getChainInfo(56, false),
  "AVAX": getChainInfo(43114, false),
  "BSCT": getChainInfo(97, false),
  "FUJI": getChainInfo(43113, false),
}

const YourToken = () => {
  const [nftData, setNftData] = useState([]);
  const [ownerFilter, setOwnerFilter] = useState('');
  const [senderFilter, setSenderFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [metadataFilters, setMetadataFilters] = useState([]);
  const [chain, setChain] = useState('BSC');

  const handleChange = (event) => {
    setChain(event.target.value);
  };

  const updateMetadataFilter = (index, key, value) => {
    const updatedFilters = [...metadataFilters];
    updatedFilters[index] = { key, value };
    setMetadataFilters(updatedFilters);
  };
  useEffect(() => {
    if(nftData.length > 0){
      setMetadataFilters(Object.entries(nftData[0].metadata).map(([key, value]) => ({ key, value: "" })))
    }
  }, [nftData]);

  useEffect(() => {
    async function fetchAllNFTs() {
      try {
        const contractAddress = ChainNameToObject[chain].address;
        const provider = new ethers.JsonRpcProvider(ChainNameToObject[chain].rpc_url);
        const contractABI = abi
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
          const tokenCount = await contract.tokenCount()
          const tokens = [];
      
          for (let tokenId = 0; tokenId < tokenCount; tokenId++) {
              const uri = await contract.tokenURI(tokenId);
              const sender = await contract.tokenSender(tokenId);
              const owner = await contract.ownerOf(tokenId)
              const metadata = await (await fetch(uri)).json()
              tokens.push({ tokenId: tokenId.toString(), metadata, sender, owner });
          }
          
        console.log("Token details:", tokens);
        setNftData(tokens)
  
      } catch (error) {
          console.error("Error fetching NFTs:", error);
      }
  }
  
  fetchAllNFTs();
  }, [chain]);

  return (
    <div 
      className="homepage flex-col items-center w-full py-8"
      
    >
      <div className='title  text-3xl my-4 mb-4 '>Verified Token Page</div>
<div className='flex items-center gap-8'>
<FormControl variant="standard" sx={{ m: 1, minWidth: 200, "& .MuiInputLabel-root": {
      color: "white" 
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "white"
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "white"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white" 
    }}} >
        <InputLabel id="demo-simple-select-standard-label" className="text-white opacity-50">Chain</InputLabel>
        <Select
         sx={{color: "white"}} 
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
      {['BSC', 'BSCT'].includes(chain)?<BNBIcon size={24} color="#F0B90B" />:<AvaxIcon size={24} color="#ff0000" />}
</div>

      <div className='w-screen flex items-center justify-center gap-8 mt-0 my-12'>
        <div className="w-1/4">
          <input
            type="text"
            id="owner filter"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="input-underline"
            placeholder="Honoree address"
            style={{color : "white"}}
          />
        </div>
        <div className="w-1/4">
          <input
            type="text"
            id="sender filter"
            value={senderFilter}
            onChange={(e) => setSenderFilter(e.target.value)}
            className="input-underline"
            placeholder="Issuer address"
            style={{color : "white"}}
          />
        </div>
      <div className="w-12 flex justify-center my-4">
        <button
          className="text-white"
        >
          <IoFilter onClick={() => setShowFilters(!showFilters)}/>
          {showFilters ? <MetadataFilter metadataFilters={metadataFilters} updateMetadataFilter={updateMetadataFilter}></MetadataFilter> : <></>}
        </button>
      </div>
      </div>
      <div className="grid grid-cols-4 gap-8">
      {nftData.length > 0 ? (
        nftData
        .filter((nft) => nft.metadata._address.toLowerCase().includes(ownerFilter.toLowerCase()))
        .filter((nft) => nft.sender.toLowerCase().includes(senderFilter.toLowerCase()))
        .filter((nft) =>
          metadataFilters.every((filter) =>
          nft.metadata[filter.key]
          ?.toString()
          .toLowerCase()
          .includes(filter.value.toLowerCase())
          )
        )
        .map((nft) => (
          <OverflowCard
            name={"name"}
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
          ></OverflowCard>
        ))
      ) : (
        <p
          style={{
            color:"white", 
            margin: "0 auto"
          }}
        >
          No NFTs found
        </p>
      )}
      </div>
    </div>
  );
};

export default YourToken;
