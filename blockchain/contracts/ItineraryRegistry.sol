// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ItineraryRegistry {
    struct Itinerary {
        string mongoId;   // store the MongoDB _id as string (or hash)
        address creator;
        uint256 date;
    }

    mapping(uint256 => Itinerary) public itineraries;
    uint256 public itineraryCount;

    event ItineraryCreated(uint256 indexed blockchainId, string mongoId, address creator, uint256 date);

    function createItinerary(string memory _mongoId, uint256 _date) public {
        itineraries[itineraryCount] = Itinerary(_mongoId, msg.sender, _date);

        emit ItineraryCreated(itineraryCount, _mongoId, msg.sender, _date);

        itineraryCount++;
    }
}

