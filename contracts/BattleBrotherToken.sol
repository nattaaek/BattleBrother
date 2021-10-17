// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol";

contract BattleBrotherToken is ERC721, Ownable {
    uint256 COUNTER;
    
    uint256 fee = 0.001 ether;
    
    struct Demon {
        uint256 id;
        string name;
        uint256 dna; // random generated id
        uint256 level;
        uint8 rariry;
    }
    
    Demon[] public demons;
    
    event NewDemon(address indexed owner, uint256 id, uint256 dna);
    
    //helper 
    function _createRandomNum(uint256 _mod) internal view returns(uint256) {
        uint256 randomNum = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return randomNum % _mod;
    }
    
    function updateFee(uint256 _fee) external onlyOwner() {
        fee = _fee;
    }
    
    function withdraw() external payable onlyOwner() {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }
    
    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}
    
    function _createDemon(string memory _name) internal {
        uint8 randRarity = uint8(_createRandomNum(100));
        uint256 ranDNA = _createRandomNum(10**16);
        Demon memory newDemon = Demon(COUNTER, _name, ranDNA, 1, randRarity);
        demons.push(newDemon);
        _safeMint(msg.sender, COUNTER);
        emit NewDemon(msg.sender, COUNTER, ranDNA);
        COUNTER++;
    }
    
    function createRandomDemon(string memory _name) public payable {
        require(msg.value == fee, "User doesn't have enough money");
        _createDemon(_name);
    }
    
    function getDemons() public view returns(Demon[] memory) {
        return demons;
    }

    function getOwnerDemons(address _owner) public view returns (Demon[] memory) {
        Demon[] memory result = new Demon[](balanceOf(_owner));
        uint256 counter = 0;
        for(uint256 i = 0; i < demons.length; i++) {
            if(ownerOf(i) == _owner) {
                result[counter] = demons[i];
                counter++;
            }
        }
        return result;
    }
}