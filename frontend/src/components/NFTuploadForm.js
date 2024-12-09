import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/NFTUploadForm.css';
import { ethers } from "ethers";
import { abi } from './abi';
import { useSDK } from "@metamask/sdk-react";
import { BrowserProvider } from 'ethers';
import MetamaskIcon from './svgs/MetamaskIcon';
import  getChainInfo from '../chain';

function NFTUploadForm() {
  const [metadataEntries, setMetadataEntries] = useState([{
    name: '',
    description: '',
    competitionName: '',
    organizer: '',
    officialWeb: '',
    award: '',
    honoree: '',
    file: null,
    errors: {}
  }]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showAutoFillDialog, setShowAutoFillDialog] = useState(false);
  const [lastEntryIndex, setLastEntryIndex] = useState(0);
  const [autoFillOptions, setAutoFillOptions] = useState({});

  const REACT_APP_PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY
  const REACT_APP_PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY
  const [account, setAccount] = useState();
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const contractABI = abi;
  
  async function mintNFT(to, uri) {
    try {
      const contractAddress =  getChainInfo(chainId).address;
      const ethersProvider = new BrowserProvider(window.ethereum); // Replace Web3Provider
      const signer = await ethersProvider.getSigner(); // Get current wallet signer
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const mintingFee = await contract.mintingFee();
        const tx = await contract.safeMint(to, uri, {
            value: mintingFee,
        });
        await tx.wait();
        alert("Minting successful!");
    } catch (error) {
        console.error("Minting failed:", error);
    }
  }

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("failed to connect..", err);
      alert("Fail to connect to MetaMask, please try again.");
    }
  };

  // Handle confirmation dialog
  const handleDialogClose = (confirm) => {
    setShowDialog(false);
    if (confirm) {
      handleSubmit();
    }
  };

  // Update a specific metadata entry
  const updateMetadataEntry = (index, field, value) => {
    const newEntries = [...metadataEntries];
    newEntries[index] = { 
      ...newEntries[index], 
      [field]: value,
      errors: {
        ...newEntries[index].errors,
        [field]: false
      }
    };
    setMetadataEntries(newEntries);
  };

  // Handle auto-fill dialog
  const handleAutoFillDialogClose = (confirm) => {
    if (confirm) {
      // Create new entry with selected auto-filled fields
      const newEntry = { ...metadataEntries[lastEntryIndex] };
      const fieldsToKeep = Object.keys(autoFillOptions).filter(field => autoFillOptions[field]);
      
      // Reset fields not selected for auto-fill
      const newEntryTemplate = {
        name: '',
        description: '',
        competitionName: '',
        organizer: '',
        officialWeb: '',
        award: '',
        honoree: '',
        file: null,
        errors: {}
      };

      fieldsToKeep.forEach(field => {
        newEntry[field] = metadataEntries[lastEntryIndex][field];
      });

      // Merge auto-filled fields with new entry template
      const finalNewEntry = { ...newEntryTemplate, ...newEntry };
      
      setMetadataEntries([...metadataEntries, finalNewEntry]);
    }
    
    setShowAutoFillDialog(false);
    setAutoFillOptions({});
  };

  // Add a new metadata entry
  const addMetadataEntry = () => {
    // If there's more than one entry, show auto-fill dialog
    if (metadataEntries.length > 0) {
      const prevEntry = metadataEntries[metadataEntries.length - 1];
      setLastEntryIndex(metadataEntries.length - 1);
      
      // Prepare auto-fill options
      const initialOptions = {
        competitionName: !!prevEntry.competitionName,
        organizer: !!prevEntry.organizer,
        officialWeb: !!prevEntry.officialWeb,
        award: !!prevEntry.award
      };
      
      setAutoFillOptions(initialOptions);
      setShowAutoFillDialog(true);
    } else {
      // If it's the first entry, just add a new blank entry
      setMetadataEntries([...metadataEntries, {
        name: '',
        description: '',
        competitionName: '',
        organizer: '',
        officialWeb: '',
        award: '',
        honoree: '',
        file: null,
        errors: {}
      }]);
    }
  };

  // Remove a metadata entry
  const removeMetadataEntry = (index) => {
    const newEntries = metadataEntries.filter((_, i) => i !== index);
    setMetadataEntries(newEntries);
  };

  const validateEntries = () => {
    const updatedEntries = metadataEntries.map(entry => {
      const errors = {};
      
      // Check each field
      if (!entry.name) errors.name = true;
      if (!entry.description) errors.description = true;
      if (!entry.competitionName) errors.competitionName = true;
      if (!entry.organizer) errors.organizer = true;
      if (!entry.officialWeb) errors.officialWeb = true;
      if (!entry.award) errors.award = true;
      if (!entry.honoree) errors.honoree = true;
      if (!entry.file) errors.file = true;

      return {
        ...entry,
        errors
      };
    });

    setMetadataEntries(updatedEntries);

    return !updatedEntries.some(entry => Object.keys(entry.errors).length > 0);
  };

  const handleSubmit = async () => {
    setUploadStatus('Uploading...');
    const uploadPromises = metadataEntries.map(async (entry) => {
      const formData = new FormData();
      formData.append('file', entry.file);

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
          name: entry.name,
          description: entry.description,
          competition_name: entry.competitionName,
          organizer: entry.organizer,
          official_web: entry.officialWeb,
          award: entry.award,
          honoree: entry.honoree,
          image: imageUrl,
          _address: account
        };

        // Upload metadata to Pinata
        const metadataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
          headers: {
            'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
            'pinata_secret_api_key': `${REACT_APP_PINATA_SECRET_API_KEY}`
          }
        });
        const uri = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`
        mintNFT(account, uri)
        return uri;
      } catch (error) {
        return `Upload failed for ${entry.name}`;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      console.log(results)
      setUploadStatus(
        <div>
          <p>Upload Results:</p>
          <ul>
            {results.map((url, index) => (
              <li key={index}>{metadataEntries[index].name}: {url}</li>
            ))}
          </ul>
        </div>
      );
    } catch (error) {
      setUploadStatus('Failed to upload. Please try again.');
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    
    const isValid = validateEntries();
    
    if (isValid) {
      setShowDialog(true);
    }
  };

  return (
    <div className='uploadFrame' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header className="header" style={{ textAlign: 'center' }}>
        <h1 className="title">Upload Your NFT</h1>
        <p className="subtitle">
          Filled in your metadata,
        </p>
      </header>

      <button 
        onClick={connect} 
        className='button'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <MetamaskIcon />
        <p 
          style={{ 
            marginLeft: '10px', 
            zIndex: 1,
          }}
        >
          {connected ? 'Wallet Connected' : 'Connect to MetaMask Wallet'}
        </p>
      </button>

      {connected ? (
        <div 
          className="wallet-info"
        >
          <div>
            <p>Connected chain: {parseInt(chainId, 16)}</p>
            <p>Connected account: {account}</p>
          </div>
        </div>
      ) : (
        <p
          style={{
            color: 'white',
            textAlign: 'center'
          }}
        >
          Please connect your wallet to continue.
        </p>
      )}
      {connected ? (
        <div className="metadata-entries-container">
          {metadataEntries.map((entry, index) => (
            <div key={index} className={`metadata-entry ${Object.keys(entry.errors).length > 0 ? 'has-errors' : ''}`}>
              <div className="entry-header">
                <h3>Entry {index + 1}</h3>
                {metadataEntries.length > 1 && (
                  <button 
                    onClick={() => removeMetadataEntry(index)} 
                    className="futuristic-button remove-entry-button"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className={`futuristic-input-group ${entry.errors.name ? 'error' : ''}`}>
                <label>Name:</label>
                <input
                  type="text"
                  value={entry.name}
                  onChange={(e) => updateMetadataEntry(index, 'name', e.target.value)}
                  required
                  className="futuristic-input"
                />
                {entry.errors.name && <span className="error-message">Name is required</span>}
              </div>
              <div className={`futuristic-input-group ${entry.errors.description ? 'error' : ''}`}>
                <label>Description:</label>
                <textarea
                  value={entry.description}
                  onChange={(e) => updateMetadataEntry(index, 'description', e.target.value)}
                  required
                  className="futuristic-textarea"
                />
                {entry.errors.description && <span className="error-message">Description is required</span>}
              </div>
              <div className={`futuristic-input-group ${entry.errors.competitionName ? 'error' : ''}`}>
                <label>Competition Name:</label>
                <input
                  type="text"
                  value={entry.competitionName}
                  onChange={(e) => updateMetadataEntry(index, 'competitionName', e.target.value)}
                  required
                  className="futuristic-input"
                />
                {entry.errors.competitionName && <span className="error-message">Competition Name is required</span>}
              </div>
              <div className={`futuristic-input-group ${entry.errors.organizer ? 'error' : ''}`}>
                <label>Organizer:</label>
                <input
                  type="text"
                  value={entry.organizer}
                  onChange={(e) => updateMetadataEntry(index, 'organizer', e.target.value)}
                  required
                  className="futuristic-input"
                />
                {entry.errors.organizer && <span className="error-message">Organizer is required</span>}
              </div>
              <div className={`futuristic-input-group ${entry.errors.officialWeb ? 'error' : ''}`}>
                <label>Official Web:</label>
                <input
                  type="text"
                  value={entry.officialWeb}
                  onChange={(e) => updateMetadataEntry(index, 'officialWeb', e.target.value)}
                  required
                  className="futuristic-input"
                />
                {entry.errors.officialWeb && <span className="error-message">Official Web is required</span>}
              </div>
              <div className={`futuristic-input-group ${entry.errors.award ? 'error' : ''}`}>
                <label>Award:</label>
                <input
                  type="text"
                  value={entry.award}
                  onChange={(e) => updateMetadataEntry(index, 'award', e.target.value)}
                  required
                  className="futuristic-input"
                />
                {entry.errors.award && <span className="error-message">Award is required</span>}
              </div>
              <div className={`futuristic-input-group ${entry.errors.honoree ? 'error' : ''}`}>
                <label>Honoree:</label>
                <input
                  type="text"
                  value={entry.honoree}
                  onChange={(e) => updateMetadataEntry(index, 'honoree', e.target.value)}
                  required
                  className="futuristic-input"
                />
                {entry.errors.honoree && <span className="error-message">Honoree is required</span>}
              </div>
              <div className={`futuristic-input-group`}>
                <label>Honoree's Address:</label>
                <input
                  type="text"
                  value={account}
                  disabled
                  className="futuristic-input"
                />
              </div>
              <div className={`futuristic-input-group ${entry.errors.file ? 'error' : ''}`}>
                <label>Upload Image:</label>
                <input
                  type="file"
                  onChange={(e) => updateMetadataEntry(index, 'file', e.target.files[0])}
                  required
                  className="futuristic-file-input"
                />
                {entry.errors.file && <span className="error-message">Image is required</span>}
                {entry.file && (
                  <img 
                    src={URL.createObjectURL(entry.file)} 
                    alt="Preview" 
                    className="file-preview" 
                    width="100" 
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      
      <div className="form-actions" style={{ textAlign: 'center' }}>
        <button 
          type="button" 
          onClick={addMetadataEntry} 
          className="button"
          disabled={!connected}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <p
            style={{
              zIndex: 100,
            }}
          >
            Add Another Entry
          </p>
        </button>

        <button 
          type="submit" 
          onClick={handleUpload} 
          className="button"
          disabled={!connected}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <p 
            style={{
              zIndex: 1,
            }}
          >
            Show confirmation
          </p>
        </button>
      </div>

      {uploadStatus && <p className="futuristic-status" style={{ textAlign: 'center' }}>{uploadStatus}</p>}

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog scrollable-dialog">
            <h3>Confirm Metadata Upload</h3>
            <div className="confirmation-content">
              {metadataEntries.map((entry, index) => (
                <div key={index} className="confirmation-entry">
                  <h4>Entry {index + 1}</h4>
                  <ul>
                    <li>Name: {entry.name}</li>
                    <li>Description: {entry.description}</li>
                    <li>Competition Name: {entry.competitionName}</li>
                    <li>Organizer: {entry.organizer}</li>
                    <li>Official Web: {entry.officialWeb}</li>
                    <li>Award: {entry.award}</li>
                    <li>Honoree: {entry.honoree}</li>
                    <li>Honoree Address: {account}</li>
                    <li>Image: <img src={entry.file ? URL.createObjectURL(entry.file) : ''} alt="Preview" width="100" /></li>
                  </ul>
                </div>
              ))}
            </div>
            <div className="dialog-actions">
              <button onClick={() => handleDialogClose(true)} className="futuristic-button">Yes, Upload</button>
              <button onClick={() => handleDialogClose(false)} className="futuristic-button">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-fill Confirmation Dialog */}
      {showAutoFillDialog && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>Auto-fill Options</h3>
            <p>Select which fields you want to keep from the previous entry:</p>
            <div className="autofill-options">
              {Object.keys(autoFillOptions).map(field => (
                <div key={field} className="autofill-option">
                  <input
                    type="checkbox"
                    id={field}
                    checked={autoFillOptions[field]}
                    onChange={(e) => setAutoFillOptions({
                      ...autoFillOptions,
                      [field]: e.target.checked
                    })}
                  />
                  <label htmlFor={field}>
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ 
                      return str.toUpperCase(); 
                    })}
                  </label>
                </div>
              ))}
            </div>
            <div className="dialog-actions">
              <button 
                onClick={() => handleAutoFillDialogClose(true)} 
                className="futuristic-button"
              >
                Apply Auto-fill
              </button>
              <button 
                onClick={() => handleAutoFillDialogClose(false)} 
                className="futuristic-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NFTUploadForm;
