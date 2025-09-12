//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ItineraryStorage {
    address public owner;
    mapping(address => bytes32[]) private userItineraries;

    event ItineraryStored(address indexed user , bytes32 indexed itineraryHash, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // Owner stores itinerary hash for a user
    function storeItineraryFor(address user, bytes32 itineraryHash) external onlyOwner {
        userItineraries[user].push(itineraryHash);
        emit ItineraryStored(user, itineraryHash, block.timestamp);
    }

    // Get itineraries for a user
    function getItineraries(address user) external view returns (bytes32[] memory) {
        return userItineraries[user];
    }

    function verifyItinerary(address user, bytes32 itineraryHash) external view returns (bool) {
        bytes32[] storage arr = userItineraries[user];
        for(uint i = 0; i < arr.length; i++) {
            if(arr[i] == itineraryHash) {
                return true;
            }
        }
        return false;
    }
}