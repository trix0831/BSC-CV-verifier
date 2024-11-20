// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 public mintingFee = 0.001 ether;
    uint256 public tokenCount = 0;

    constructor(address initialOwner)
        ERC721("CVVerified", "CVV")
        Ownable(initialOwner)
    {}

    function safeMint(address to, string memory uri)
        public
        payable
    {
        require(msg.value >= mintingFee, "Insufficient fee");
        uint256 tokenId = tokenCount;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setSender(tokenId, msg.sender);
        tokenCount += 1;
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    // setting sender
    mapping(uint256 tokenId => address) private _senders;
    function _setSender(uint256 tokenId, address sender) internal virtual {
        _senders[tokenId] = sender;
        emit MetadataUpdate(tokenId);
    }

    function tokenSender(uint256 tokenId)
        public
        view
        returns (address)
    {
        return _senders[tokenId];
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

}