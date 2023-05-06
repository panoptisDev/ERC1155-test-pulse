// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract PolyMintERC721 is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {}

    function mint(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}

contract PolyMintERC1155 is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string) public lookupmap;

    constructor() ERC1155("") {}

    function mint(
        address recipient,
        string memory tokenURI,
        uint256 amount
    ) public {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        lookupmap[newItemId] = tokenURI;
        _mint(recipient, newItemId, amount, "");
    }
}

contract PolyMintFactory {
    mapping(address => PolyMint) public contracts;
    address[] public addresses;
    struct PolyMint {
        address contractAddress;
        uint256 contractType;
        string name;
        string symbol;
    }

    function mint(
        string memory name,
        string memory symbol,
        string memory tokenURI
    ) public {
        _mint721(name, symbol, tokenURI);
    }

    function mint(
        string memory name,
        string memory symbol,
        string memory tokenURI,
        uint256 amount
    ) public {
        _mint1155(name, symbol, tokenURI, amount);
    }

    function mint(
        address contractAddress,
        string memory tokenURI
    ) public {
        _mint721(contractAddress, tokenURI);
    }

    function mint(
        address contractAddress,
        string memory tokenURI,
        uint256 amount
    ) public {
        _mint1155(contractAddress, tokenURI, amount);
    }

    function _mint721(
        string memory name,
        string memory symbol,
        string memory tokenURI
    ) internal {
        PolyMintERC721 contract_ = new PolyMintERC721(name, symbol);
        address erc721Address = address(contract_);
        contract_.mint(msg.sender, tokenURI);
        contracts[erc721Address] = PolyMint(erc721Address, 721, name, symbol);
        addresses.push(erc721Address);
    }

    function _mint721(address contractAddress, string memory tokenURI)
        internal
    {
        PolyMintERC721 erc721 = PolyMintERC721(contractAddress);
        erc721.mint(msg.sender, tokenURI);
    }

    function _mint1155(
        string memory name,
        string memory symbol,
        string memory tokenURI,
        uint256 amount
    ) internal {
        PolyMintERC1155 contract_ = new PolyMintERC1155();
        address erc1155Address = address(contract_);
        contract_.mint(msg.sender, tokenURI, amount);
        contracts[erc1155Address] = PolyMint(
            erc1155Address,
            1155,
            name,
            symbol
        );
        addresses.push(erc1155Address);
    }

    function _mint1155(
        address contractAddress,
        string memory tokenURI,
        uint256 amount
    ) internal {
        PolyMintERC1155 erc1155 = PolyMintERC1155(contractAddress);
        erc1155.mint(msg.sender, tokenURI, amount);
    }

    function getContract(address addr)
        public
        view
        returns (
            string memory,
            string memory,
            uint256
        )
    {
        return (
            contracts[addr].name,
            contracts[addr].symbol,
            contracts[addr].contractType
        );
    }
}