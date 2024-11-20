import React, { useState } from 'react';
import axios from 'axios';
import './css/NFTUploadForm.css';
import { ethers } from "ethers";
import { abi } from './abi';

function NFTUploadForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [competitionName, setCompetitionName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [officialWeb, setOfficialWeb] = useState('');
  const [award, setAward] = useState('');
  const [honoree, setHonoree] = useState('');
  const [issuerAddress, setIssuerAddress] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const REACT_APP_PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY
  const REACT_APP_PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY

  const privateKey = process.env.REACT_APP_PRIVATE_KEY ; 
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_NETWORK);
  const signer = new ethers.Wallet(privateKey, provider);
  const contractABI = abi;
  
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
  async function mintNFT(to, uri) {
    try {
        const mintingFee = await contract.mintingFee();
        const tx = await contract.safeMint(to, uri, {
            value: mintingFee,
        });
        await tx.wait();
        console.log("Minting successful!");
    } catch (error) {
        console.error("Minting failed:", error);
    }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('API Key:', `${REACT_APP_PINATA_API_KEY}`);
      console.log('Secret Key:', `${REACT_APP_PINATA_SECRET_API_KEY}`);

      // Upload image to Pinata
      const imageResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
          'pinata_secret_api_key': `${REACT_APP_PINATA_SECRET_API_KEY}`
        }
      });

      const imageHash = imageResponse.data.IpfsHash;
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}`;

      // Create metadata JSON
      const metadata = {
        name: name,
        description: description,
        competition_name: competitionName,
        organizer: organizer,
        official_web: officialWeb,
        award: award,
        honoree: honoree,
        image: imageUrl,
        issuer_address: issuerAddress
      };

      // Upload metadata to Pinata
      const metadataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
        headers: {
          'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
          'pinata_secret_api_key': `${REACT_APP_PINATA_SECRET_API_KEY}`
        }
      });

      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;
      setUploadStatus(<a href={metadataUrl} target="_blank" rel="noopener noreferrer">Metadata URL: {metadataUrl}</a>);
      await mintNFT(issuerAddress, metadataUrl)
      // setUploadStatus(`Metadata URL: https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`);
    } catch (error) {
      setUploadStatus('Failed to upload. Please try again.');
    }
  };

  return (
    <div className="nft-upload-form futuristic-container">
      <h2 className="futuristic-title">Upload NFT Metadata</h2>
      <form onSubmit={handleSubmit} className="futuristic-form">
        <div className="futuristic-input-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="futuristic-input"
          />
        </div>
        <div className="futuristic-input-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="futuristic-textarea"
          />
        </div>
        <div className="futuristic-input-group">
          <label>Competition Name:</label>
          <input
            type="text"
            value={competitionName}
            onChange={(e) => setCompetitionName(e.target.value)}
            required
            className="futuristic-input"
          />
        </div>
        <div className="futuristic-input-group">
          <label>Organizer:</label>
          <input
            type="text"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            required
            className="futuristic-input"
          />
        </div>
        <div className="futuristic-input-group">
          <label>Official Web:</label>
          <input
            type="text"
            value={officialWeb}
            onChange={(e) => setOfficialWeb(e.target.value)}
            required
            className="futuristic-input"
          />
        </div>
        <div className="futuristic-input-group">
          <label>Award:</label>
          <input
            type="text"
            value={award}
            onChange={(e) => setAward(e.target.value)}
            required
            className="futuristic-input"
          />
        </div>
        <div className="futuristic-input-group">
          <label>Honoree:</label>
          <input
            type="text"
            value={honoree}
            onChange={(e) => setHonoree(e.target.value)}
            required
            className="futuristic-input"
          />
        </div>
        <div className="futuristic-input-group">
          <label>Issuer's Address:</label>
          <input
            type="text"
            value={issuerAddress}
            onChange={(e) => setIssuerAddress(e.target.value)}
            required
            className="futuristic-input"
          />
        </div>
        <div className="futuristic-input-group">
          <label>Upload Image:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="futuristic-file-input"
          />
        </div>
        <button type="submit" className="futuristic-button">Upload to IPFS</button>
      </form>
      {uploadStatus && <p className="futuristic-status">{uploadStatus}</p>}
    </div>
  );
}

export default NFTUploadForm;

// Note: Remove `dotenv` import and usage from the frontend.
// Instead, create a `.env` file in the project root with the following content:
// REACT_APP_PINATA_API_KEY=your_api_key_here
// REACT_APP_PINATA_SECRET_API_KEY=your_secret_key_here
// Environment variables in React need to start with `REACT_APP_` to be accessible.
