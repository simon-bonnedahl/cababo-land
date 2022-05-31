// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CBOToken is ERC20{
    constructor() ERC20("Cababo Token", "CBO"){
    }

    event Mint(address indexed reciever, uint256 amount);
    function mintToken(address receiver, uint256 amount) public{
        _mint(receiver, amount);
        emit Mint(receiver, amount);
    }

}   