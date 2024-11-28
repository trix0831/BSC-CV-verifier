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
  const [showDialog, setShowDialog] = useState(false);  // State for controlling the dialog visibility
  const [missingFields, setMissingFields] = useState([]); // To track missing fields
  
  const REACT_APP_PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY
  const REACT_APP_PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY

  // Handle confirmation dialog
  const handleDialogClose = (confirm) => {
    setShowDialog(false); // Close the dialog
    if (confirm) {
      handleSubmit();  // Proceed with the upload if confirmed
    }
  };

  const checkMissingFields = () => {
    const missing = [];
    if (!name) missing.push('Name');
    if (!description) missing.push('Description');
    if (!competitionName) missing.push('Competition Name');
    if (!organizer) missing.push('Organizer');
    if (!officialWeb) missing.push('Official Web');
    if (!award) missing.push('Award');
    if (!honoree) missing.push('Honoree');
    if (!issuerAddress) missing.push('Issuer Address');
    if (!file) missing.push('Image');
    return missing;
  };

  const handleSubmit = async () => {
    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
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
      
    } catch (error) {
      setUploadStatus('Failed to upload. Please try again.');
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    
    const missing = checkMissingFields();
    setMissingFields(missing);
    
    if (missing.length === 0) {
      setShowDialog(true);  // Show the confirmation dialog if all fields are filled
    } else {
      setShowDialog(false);  // Hide dialog if fields are missing
    }
  };

  return (
    <div className="nft-upload-form futuristic-container">
      <h2 className="futuristic-title">Upload NFT Metadata</h2>
      <form onSubmit={handleUpload} className="futuristic-form">
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
        <button type="submit" className="futuristic-button">Show Confirmation</button>
      </form>

      {uploadStatus && <p className="futuristic-status">{uploadStatus}</p>}

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>Are you sure you want to upload the metadata?</h3>

            {/* Show missing fields */}
            {missingFields.length > 0 ? (
              <div>
                <p>The following fields are missing:</p>
                <ul>
                  {missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
                <button disabled className="futuristic-button">Upload Disabled</button>
              </div>
            ) : (
              <div>
                <p>Here is the data that will be uploaded:</p>
                <ul>
                  <li>Name: {name}</li>
                  <li>Description: {description}</li>
                  <li>Competition Name: {competitionName}</li>
                  <li>Organizer: {organizer}</li>
                  <li>Official Web: {officialWeb}</li>
                  <li>Award: {award}</li>
                  <li>Honoree: {honoree}</li>
                  <li>Issuer Address: {issuerAddress}</li>
                  <li>Image: <img src={file ? URL.createObjectURL(file) : ''} alt="Preview" width="100" /></li>
                </ul>
                <button onClick={() => handleDialogClose(true)} className="futuristic-button">Yes, Upload</button>
              </div>
            )}

            <button onClick={() => handleDialogClose(false)} className="futuristic-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NFTUploadForm;
