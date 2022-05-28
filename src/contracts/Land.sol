// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Land is ERC721 {
    uint256 public cost = 2 ether;
    uint256 public maxSupply = 100;
    uint256 public totalSupply = 0;

    struct Plot {
        address owner;
        bool forSale;
        uint price;
        uint256 id;
    }

    Plot[] public plots;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
         for(uint256 id = 0; id<100; id++){
            plots.push(Plot(address(0x0), true, 2 ether, id));
            
        }
    
    }


    function mint(uint256 _id) public payable {
        uint256 supply = totalSupply;
        require(supply <= maxSupply);
        require(plots[_id - 1].owner == address(0x0));
        require(msg.value >= plots[_id - 1].price);

        // NOTE: tokenID always starts from 1, but our array starts from 0
        plots[_id - 1].owner = msg.sender;
        plots[_id - 1].forSale = false;
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

    function putPlotUpForSale(uint256 _id, uint price) public {

        
        require(msg.sender == plots[_id - 1].owner && price > 0);
        
        plots[_id - 1].forSale = true;
        plots[_id - 1].price = price;
        emit PlotAvailabilityChanged(_id, price, true);
    }
    
    function takeOffMarket(uint256 _id) public {
    
        
        require(msg.sender == plots[_id - 1].owner);
        
        plots[_id - 1].forSale = false;
        emit PlotAvailabilityChanged(_id, plots[_id - 1].price, false);
    }

    function buyPlot(uint256 _id) public payable {

 
        // Fetch the owner
        address payable _seller = payable(plots[_id - 1].owner);
        // Make sure the product has a valid id
        require(plots[_id - 1].id > 0 && plots[_id - 1].id <= maxSupply);
        // Require that there is enough Ether in the transaction
        require(msg.value >= plots[_id - 1].price);
        // Require that the product has not been purchased already
        require(plots[_id - 1].forSale);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the buyer
        plots[_id - 1].owner = msg.sender;
        // Mark as purchased
        plots[_id - 1].forSale = false;
        // Update the product
        // Pay the seller by sending them Ether
        _seller.transfer(msg.value);
        // Trigger an event
        emit PlotOwnerChanged(_id);

    }
    event PlotOwnerChanged(
        uint index
    );
    
    event PlotPriceChanged(
        uint index,
        uint price
    );
    
    event PlotAvailabilityChanged(
        uint index,
        uint price,
        bool forSale
    );
}
