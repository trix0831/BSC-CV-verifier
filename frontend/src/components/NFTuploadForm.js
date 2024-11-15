import React, { useState } from 'react';
import axios from 'axios';

function NFTUploadForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);

    try {
      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': '7c325a1ae342171ac341',
          'pinata_secret_api_key': '7ffc88092c6365110eaf827df719c07c199d92f8f07f0cb44d32383552253b73'
        }
      });
      setUploadStatus(`Metadata URL: https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
    } catch (error) {
      setUploadStatus('Failed to upload. Please try again.');
    }
  };

  return (
    <div className="nft-upload-form">
      <h2>Upload NFT Metadata</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Upload Image:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit">Upload to IPFS</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}

export default NFTUploadForm;
