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
    name: 'CVV token',
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
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showAutoFillDialog, setShowAutoFillDialog] = useState(false);
  const [showUploadingDialog, setShowUploadingDialog] = useState(false);
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
        const tx = await contract.safeMint(to, uri);
        await tx.wait();
        // alert("Minting successful!");
        setUploadStatus('Minting successful!');
        
    } catch (error) {
        console.error("Minting failed:", error);
        // alert("Minting failed, please try again.");
        setUploadStatus('Minting failed, please try again.');
    }
  }

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
      setShowConnectionDialog(false);
      setShowDialog(true);
    } catch (err) {
      console.warn("failed to connect..", err);
      alert("Fail to connect to MetaMask, please try again.");
    }
  };

  // Handle confirmation dialog
  const handleDialogClose = (confirm) => {
    setShowDialog(false);
    if (confirm) {
      setShowUploadingDialog(true);
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
        name: 'CVV token',
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
        name: 'CVV token',
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
      if (!entry._address) errors._address = true;

      return {
        ...entry,
        errors
      };
    });

    setMetadataEntries(updatedEntries);

    return !updatedEntries.some(entry => Object.keys(entry.errors).length > 0);
  };

  const handleSubmit = async () => {
    setUploadStatus('Uploading MetaData...');
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
          _address: entry._address
        };
        console.log(account)
        console.log(metadata)
        // Upload metadata to Pinata
        const metadataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
        headers: {
        'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
        'pinata_secret_api_key': `${REACT_APP_PINATA_SECRET_API_KEY}`
        }
        });
        const uri = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`
                console.log("'upload metadata successful, uploading NFT")
        await mintNFT(entry._address, uri) // first para is to
        return uri;
      } catch (error) {
        return `Upload failed for ${entry.name}`;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      console.log(results)
      // setUploadStatus('Upload successful!');
      // setUploadStatus(
      //   <div>
      //     <p>Upload Results:</p>
      //     <ul>
      //       {results.map((url, index) => (
      //         <li key={index}>{metadataEntries[index].name}: {url}</li>
      //       ))}
      //     </ul>
      //   </div>
      // );
    } catch (error) {
      setUploadStatus('Failed to upload MetaData. Please try again.');
    }
  };

  const handleConnectWallet = (e) => {
    e.preventDefault();
    
    const isValid = validateEntries();
    
    if (isValid) {
      setShowConnectionDialog(true);
    }
  };

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className='uploadFrame' 
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <header className="header" style={{ textAlign: 'center' }}>
        <p className="title">
          Issue NFTs
        </p>
        <p className="subtitle">
          After filling Metadata, connect to your MetaMask wallet and issue the award as CVV NFT.<br/>
          Enhance the credibility of your events by providing verifiable, tamper-proof digital accolades to recipients.
        </p>
      </header>

      {/* {connected ? (
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
      )} */}
      {connected ? (
        <div className="metadata-entries-container">
          {metadataEntries.map((entry, index) => (
            
            <div key={index} className="metadata-entry">
              <div className="entry-header">
                <p
                  style={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    fontDecoration: 'underline',
                    color: 'white',
                  }}
                >
                  Entry {index + 1}
                </p>
                {metadataEntries.length > 1 && (
                  <button 
                    onClick={() => removeMetadataEntry(index)} 
                    className="remove-entry-button"
                  >
                    Remove
                  </button>
                )}
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
                  value={entry._address}
                  onChange={(e) => updateMetadataEntry(index, '_address', e.target.value)}
                  required
                  className="futuristic-input"
                />
                {entry.errors._address && <span className="error-message">Honoree address is required</span>}
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
      
      <div
        style={{ 
          textAlign: 'center', 
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px'
      }}>
        <button 
          type="button" 
          onClick={addMetadataEntry}
          className="button"
          disabled={!connected}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            marginRight: '20px'
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
          onClick={handleConnectWallet} 
          className="button"
          disabled={!connected}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', 
            padding: '10px',
            marginLeft: '20px'
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

      {/* {uploadStatus && <p className="futuristic-status" style={{ textAlign: 'center' }}>{uploadStatus}</p>} */}

      {/* Connection Dialog */}
      {showConnectionDialog && (
        <div className="confirmation-overlay">
          <div
            className="confirmation-dialog scrollable-dialog"
            style={{ textAlign: 'center' }}
          >
            <h3>Please connect to you metamask wallet</h3>
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
                  zIndex: 1,
                }}
              >
                {account ? 'Wallet Connected' : 'Connect to MetaMask Wallet'}
              </p>
            </button>

            <button
              className="button"
              onClick={() => setShowConnectionDialog(false)}
              style={{
                margin: "0 auto",
                width: "30%",
              }}
            >
              <p
                style={{
                  position: 'relative',
                  zIndex: 1,
                }} 
              >
                Cancel
              </p>

            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog scrollable-dialog">
            <p
              style={{
                textAlign: 'center',
                marginBottom: '10px',
                fontSize: '1.5rem',
                zIndex: 1
              }}
            >
              Confirm Metadata Upload
            </p>
              
            <p
              style={{
                textAlign: 'center',
                marginBottom: '10px',
                fontSize: '1rem',
                zIndex: 1
              }}
            >
                  Your Address : {truncateAddress(account)} <br/>
                  Current Chain : {parseInt(chainId, 16)}
            </p>

            <div className="confirmation-content">
              {metadataEntries.map((entry, index) => (
                <div key={index} className="confirmation-entry">
                <p
                  style={{
                    zIndex: 1,
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    fontSize: '1.2rem',
                    textDecoration: 'underline',
                  }}
                >
                  Entry {index + 1}
                </p>
                <ul>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold'  }}>Name:</span>
                    <span style={{ textAlign: 'right' }}>{entry.name}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Description:</span>
                    <span style={{ textAlign: 'right' }}>{entry.description}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Competition Name:</span>
                    <span style={{ textAlign: 'right' }}>{entry.competitionName}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Organizer:</span>
                    <span style={{ textAlign: 'right' }}>{entry.organizer}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Official Web:</span>
                    <span style={{ textAlign: 'right' }}>{entry.officialWeb}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Award:</span>
                    <span style={{ textAlign: 'right' }}>{entry.award}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Honoree:</span>
                    <span style={{ textAlign: 'right' }}>{entry.honoree}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Honoree Address:</span>
                    <span style={{ textAlign: 'right' }}>{truncateAddress(entry._address)}</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>Image:</span>
                    <span>
                      <img src={entry.file ? URL.createObjectURL(entry.file) : ''} alt="Preview" width="100" />
                    </span>
                  </li>
                </ul>
              </div>      
              ))}
            </div>
            <div className="dialog-actions">
              <button onClick={() => handleDialogClose(true)} 
                className="button" disabled={![56, 97, 43113, 43114].includes(parseInt(chainId, 16))}
              >
                <p
                style={{
                  position: 'relative',
                  zIndex: 1,
                }}
                >
                  {[56, 97, 43113, 43114].includes(parseInt(chainId, 16))?"Correct, upload":"Unsupport chain"} 
                </p>
              </button>
              <button 
                onClick={() => handleDialogClose(false)} 
                className="button"                
              >
                <p
                style={{
                  position: 'relative',
                  zIndex: 1,
                }}
                >
                  Cancel
                </p>
              </button>
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

            <div 
              className="dialog-actions"
              style={{
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <button 
                onClick={() => handleAutoFillDialogClose(true)} 
                className="button"
              >
                <p
                  style={{
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  Apply Auto-fill
                </p>
              </button>
              <button 
                onClick={() => handleAutoFillDialogClose(false)} 
                className="button"
              >
                <p
                  style={{
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                    Cancel
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadingDialog && (
        <div className="confirmation-overlay">
          <div
            className="confirmation-dialog scrollable-dialog"
            style={{ textAlign: 'center'}}
          >
            <p
              className='upload-status'
              style={{
              }}
            >
              {uploadStatus}
            </p>
            
            <button
              className="button"
              onClick={() => setShowUploadingDialog(false)}
              style={{
                margin: "0 auto",
                width: "30%",
                marginTop: '20px'
              }}
            >
              <p
                style={{
                  position: 'relative',
                  zIndex: 1
                }} 
              >
                Done
              </p>

            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NFTUploadForm;
