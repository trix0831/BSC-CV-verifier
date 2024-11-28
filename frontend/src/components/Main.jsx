import React, { useEffect, useState } from 'react';
import './css/HomePage.css';
import { ethers } from 'ethers';
import { abi } from './abi';
import Card from './Card';

const Main = () => {
  const [nftData, setNftData] = useState([]);
  const [ownerFilter, setOwnerFilter] = useState('');
  const [senderFilter, setSenderFilter] = useState('');
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_NETWORK);
  const contractABI = abi
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  useEffect(() => {
    async function fetchAllNFTs() {
      try {
          const tokenCount = await contract.tokenCount()
          const tokens = [];
      
          for (let tokenId = 0; tokenId < tokenCount; tokenId++) {
              const uri = await contract.tokenURI(tokenId);
              const sender = await contract.tokenSender(tokenId);
              const owner = await contract.ownerOf(tokenId)
              const metadata = await (await fetch("https://gateway.pinata.cloud/ipfs/QmUg1cvS11CUgc2CfLCMam8ZdQ5dHTmyGxbNEteSC1LWMT")).json()
              tokens.push({ tokenId: tokenId.toString(), metadata, sender, owner });
          }
          
        console.log("Token details:", tokens);
        setNftData(tokens)
  
      } catch (error) {
          console.error("Error fetching NFTs:", error);
      }
  }
  
  fetchAllNFTs();
  }, []);

  return (
    <div className="homepage flex-col items-center w-full">
      <div className='w-80 text-3xl my-4'>Verified Token Page</div>
      <div className='w-screen flex justify-center gap-8 mt-0 my-12'>
        <div className="w-1/4">
          <input
            type="text"
            id="owner filter"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="input-underline"
            placeholder="Ower address"
          />
        </div>
        <div className="w-1/4">
          <input
            type="text"
            id="sender filter"
            value={senderFilter}
            onChange={(e) => setSenderFilter(e.target.value)}
            className="input-underline"
            placeholder="Sender address"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-8">
      {nftData.length > 0 ? (
        nftData
        .filter((nft) => nft.owner.toLowerCase().includes(ownerFilter.toLowerCase()))
        .filter((nft) => nft.sender.toLowerCase().includes(senderFilter.toLowerCase()))
        .map((nft) => (
          <Card
          name={"name"}
          competition_name={nft.metadata.competition_name}
          award={nft.metadata.award}
          description={nft.metadata.description}
          honoree={nft.metadata.honoree}
          image="https://gateway.pinata.cloud/ipfs/Qmf8KyRhcFhCi6PeyGRUyNoZG9HfhGwKkat5NkmQdreyzL"
          issuer_address={nft.metadata.issuer_address}
          official_web={nft.metadata.official_web}
          organizer={nft.metadata.organizer}
          ></Card>
        ))
      ) : (
        <p>No NFTs found</p>
      )}
      </div>
    </div>
  );
};

export default Main;
