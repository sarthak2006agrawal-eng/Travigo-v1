// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ItineraryRegistry {
    event ItineraryStored(address indexed user, bytes32 indexed hash, uint256 timestamp);

    mapping(bytes32 => uint256) public storedAt;

    function storeItinerary(bytes32 hash) external {
        storedAt[hash] = block.timestamp;
        emit ItineraryStored(msg.sender, hash, block.timestamp);
    }

    function exists(bytes32 hash) external view returns (bool) {
        return storedAt[hash] != 0;
    }
}
