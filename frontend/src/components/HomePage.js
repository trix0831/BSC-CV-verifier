import React, { useEffect, useState } from 'react';
import './css/HomePage.css';
import { ethers } from 'ethers';
import { abi } from './abi';

function HomePage() {
  const [nftData, setNftData] = useState(null);
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_NETWORK);
  const contractABI = abi;
  const tokenId = 0;

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Call contract functions, e.g., tokenURI and ownerOf
        const tokenURI = await contract.tokenURI(tokenId);
        const owner = await contract.ownerOf(tokenId);

        console.log(`Token ID ${tokenId} tokenURI:`, tokenURI);
        console.log(`Token ID ${tokenId} owner:`, owner);

        // Fetch and display metadata from tokenURI
        const url = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
        const metadataResponse = await fetch(url);
        const metadata = await metadataResponse.json();
        console.log('NFT metadata:', metadata);

        // Update state with NFT data
        setNftData({
          tokenId: tokenId,
          owner: owner,
          ...metadata,
        });
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      }
    };
    fetchNFTData();
  }, []);

  return (
    <div className="homepage">
      <header className="header">
        <h1 className="title">CV Verifier</h1>
        <p className="subtitle">Experience the Future of Decentralization. Be your own verifier.</p>
      </header>
      <main className="main-content">
        <section className="info-section">
          {nftData ? (
            <div className="nft-display">
              <h2>
                NFT #{nftData.tokenId}: {nftData.name}
              </h2>
              <img
                src={nftData.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                alt={nftData.name}
                className="nft-image"
              />
              <p>{nftData.description}</p>
              <p>
                <strong>Owner:</strong> {nftData.owner}
              </p>
            </div>
          ) : (
            <p>Loading NFT data...</p>
          )}
        </section>
      </main>
      <footer className="footer">
        <p>trix hahaha FOR Taipei blockchain week</p>
      </footer>
    </div>
  );
}

export default HomePage;
