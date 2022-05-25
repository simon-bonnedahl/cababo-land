// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CBOToken is ERC20{
    uint constant _initial_supply = 1000 * (10**18);
    constructor() ERC20("Cababo Token", "CBO"){
         issueToken(0x40CA26dd1141987a92ae88479d03dba2f145391F, _initial_supply);
    }
    event Mint(address indexed reciever, uint256 amount);
    function issueToken(address receiver, uint256 amount) public{
        _mint(receiver, amount);
        emit Mint(receiver, amount);
}
    

}   