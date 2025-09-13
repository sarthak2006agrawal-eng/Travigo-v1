// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ItineraryStorage {
    struct Itinerary {
        string userId;           // off-chain ID or wallet address link
        string[] destinations;   // list of places
        uint256 totalBudget;     // planned budget
        uint256 createdAt;       // timestamp
        uint256 updatedAt;       // last modified timestamp
    }

    mapping(uint256 => Itinerary) private itineraries;
    uint256 private itineraryCount;

    event ItineraryCreated(uint256 itineraryId, string userId);
    event ItineraryUpdated(uint256 itineraryId);

    // Create new itinerary
    function createItinerary(
        string memory _userId,
        string[] memory _destinations,
        uint256 _totalBudget
    ) public returns (uint256) {
        itineraryCount++;
        Itinerary storage itin = itineraries[itineraryCount];
        itin.userId = _userId;
        itin.destinations = _destinations;
        itin.totalBudget = _totalBudget;
        itin.createdAt = block.timestamp;
        itin.updatedAt = block.timestamp;

        emit ItineraryCreated(itineraryCount, _userId);
        return itineraryCount;
    }

    // Update itinerary destinations or budget
    function updateItinerary(
        uint256 _id,
        string[] memory _destinations,
        uint256 _totalBudget
    ) public {
        require(_id > 0 && _id <= itineraryCount, "Invalid itinerary ID");
        Itinerary storage itin = itineraries[_id];
        itin.destinations = _destinations;
        itin.totalBudget = _totalBudget;
        itin.updatedAt = block.timestamp;

        emit ItineraryUpdated(_id);
    }

    // Get itinerary by ID
    function getItinerary(uint256 _id) public view returns (
        string memory userId,
        string[] memory destinations,
        uint256 totalBudget,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        require(_id > 0 && _id <= itineraryCount, "Invalid itinerary ID");
        Itinerary storage itin = itineraries[_id];
        return (
            itin.userId,
            itin.destinations,
            itin.totalBudget,
            itin.createdAt,
            itin.updatedAt
        );
    }
}
