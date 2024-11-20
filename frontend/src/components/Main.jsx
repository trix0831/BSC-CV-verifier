import React, { useEffect, useState } from 'react';
import './css/HomePage.css';
import { ethers } from 'ethers';
import { abi } from './abi';
import Card from './Card';

const Main = () => {
  const [nftData, setNftData] = useState([]);
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
              const metadata = await (await fetch("https://gateway.pinata.cloud/ipfs/QmUg1cvS11CUgc2CfLCMam8ZdQ5dHTmyGxbNEteSC1LWMT")).json()
              tokens.push({ tokenId: tokenId.toString(), metadata, sender });
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
      <div className='text-3xl my-4'>Verified Token Page</div>
      <div className="grid grid-cols-4 gap-8">
      {nftData.length > 0 ? (
        nftData.map((nft) => (
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
