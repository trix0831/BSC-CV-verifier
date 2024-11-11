import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { abi } from './abi';

const Main = () => {
  const [nftData, setNftData] = useState([]);
  const contractAddress = "0x4232b1357eF1Bbd178EF5bCe7A0ACD7c8e3878c1"; // 您的合約地址
  const contractABI = abi
  const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
  const tokenId = 1
  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // 調用合約的函數，例如 tokenURI 和 ownerOf
        const tokenURI = await contract.tokenURI(tokenId);
        const owner = await contract.ownerOf(tokenId);

        console.log(`Token ID ${tokenId} 的 tokenURI:`, tokenURI);
        console.log(`Token ID ${tokenId} 的持有者:`, owner);

        // 如果需要，可以進一步獲取並顯示 tokenURI 的元數據
        const url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
        const metadataResponse = await fetch(url);
        const metadata = await metadataResponse.json();
        console.log("NFT 元數據:", metadata);
      } catch (error) {
        console.error("Error fetching NFT data:", error);
      }
    };

    fetchNFTData();
  }, []);

  return (
    <div>
      <h1>My NFTs</h1>
      {/* {nftData.length > 0 ? (
        nftData.map((nft) => (
          <div key={nft.tokenId}>
            <h2>NFT #{nft.tokenId}</h2>
            <img src={nft.image} alt={nft.name} width="200" />
            <p>{nft.description}</p>
          </div>
        ))
      ) : (
        <p>No NFTs found</p>
      )} */}
    </div>
  );
};

export default Main;
