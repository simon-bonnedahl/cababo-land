// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Land is ERC721 {
    uint256 public cost = 1 ether;
    uint256 public maxSupply = 100;
    uint256 public totalSupply = 0;
    uint256 public worldSize = 10;

    struct Plot {
        address owner;
        int256 id;
    }

    Plot[] public plots;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost
    ) ERC721(_name, _symbol) {
        cost = _cost;
        
         for(int256 id = 0; id<100; id++){
            plots.push(Plot(address(0x0), id));
            
        }
    
    }


    function mint(uint256 _id) public payable {
        uint256 supply = totalSupply;
        require(supply <= maxSupply);
        require(plots[_id - 1].owner == address(0x0));
        require(msg.value >= cost);

        // NOTE: tokenID always starts from 1, but our array starts from 0
        plots[_id - 1].owner = msg.sender;
        totalSupply = totalSupply + 1;

        _safeMint(msg.sender, _id);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        // Update Building ownership
        plots[tokenId - 1].owner = to;

        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        // Update Building ownership
        plots[tokenId - 1].owner = to;

        _safeTransfer(from, to, tokenId, _data);
    }

    // Public View Functions
    function getPlots() public view returns (Plot[] memory) {
        return plots;
    }

    function getPlot(uint256 _id) public view returns (Plot memory) {
        return plots[_id - 1];
    }
}
