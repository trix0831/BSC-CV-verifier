import React, { useEffect, useState } from 'react';
import './css/HomePage.css';
import { ethers } from 'ethers';
import { abi } from './abi';
import Card from './Card';

const Compare = () => {
  const [nftData, setNftData] = useState([]);
  const [compareAddresses, setCompareAddresses] = useState([]);
  const [addressInput, setAddressInput] = useState('');

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_NETWORK);
  const contractABI = abi;
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  useEffect(() => {
    async function fetchAllNFTs() {
      try {
        const tokenCount = await contract.tokenCount();
        const tokens = [];

        for (let tokenId = 0; tokenId < tokenCount; tokenId++) {
          const uri = await contract.tokenURI(tokenId);
          const sender = await contract.tokenSender(tokenId);
          const owner = await contract.ownerOf(tokenId);
          const metadata = await (await fetch(uri)).json();
          tokens.push({ tokenId: tokenId.toString(), metadata, sender, owner });
        }

        console.log('Token details:', tokens);
        setNftData(tokens);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    }

    fetchAllNFTs();
  }, []);

  // Function to handle adding a new address to the compare list
  const handleAddAddress = () => {
    const address = addressInput.trim().toLowerCase();
    if (ethers.isAddress(address) && !compareAddresses.includes(address)) {
      setCompareAddresses([...compareAddresses, address]);
      setAddressInput('');
    } else {
      alert('Invalid or duplicate address.');
    }
  };

  // Function to remove an address from the compare list
  const handleRemoveAddress = (index) => {
    setCompareAddresses(compareAddresses.filter((_, i) => i !== index));
  };

  // Filter NFTs based on the compareAddresses list
  const filteredNfts = nftData.filter((nft) =>
    compareAddresses.length === 0 || compareAddresses.includes(nft.owner.toLowerCase())
  );

  return (
    <div className="homepage flex-col items-center w-full">
      <div className="w-80 text-3xl my-4">Compare NFTs by Owner</div>

      {/* Input to add addresses to compare list */}
      <div className="w-screen flex justify-center gap-4 mt-4 mb-8">
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          className="input-underline w-1/3"
          placeholder="Enter address to compare"
        />
        <button onClick={handleAddAddress} className="btn-primary">
          Add Address
        </button>
      </div>

      {/* Display the list of addresses added for comparison */}
      <div className="w-screen flex flex-wrap justify-center gap-2 mb-8">
        {compareAddresses.map((address, index) => (
          <div key={index} className="address-item flex items-center">
            <span className="mr-2">{address}</span>
            <button onClick={() => handleRemoveAddress(index)} className="btn-secondary">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Display NFTs owned by addresses in the compare list */}
      <div className="grid grid-cols-4 gap-8">
        {filteredNfts.length > 0 ? (
          filteredNfts.map((nft) => (
            <Card
              key={nft.tokenId}
              name={nft.metadata.name}
              competition_name={nft.metadata.competition_name}
              award={nft.metadata.award}
              description={nft.metadata.description}
              honoree={nft.metadata.honoree}
              image={nft.metadata.image}
              issuer_address={nft.metadata.issuer_address}
              official_web={nft.metadata.official_web}
              organizer={nft.metadata.organizer}
            />
          ))
        ) : (
          <p>No NFTs found for the selected addresses.</p>
        )}
      </div>
    </div>
  );
};

export default Compare;
