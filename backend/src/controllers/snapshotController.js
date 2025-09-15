
import { ethers } from "ethers";
import ItineraryStorageABI from "../blockchain/ItineraryStorage.json" assert { type: "json" }; 


const CONTRACT_ADDRESS = process.env.ITINERARY_STORAGE_ADDRESS;
const PROVIDER_URL = process.env.RPC_URL;

export const getSnapshots = async (req, res) => {
  try {
    const { userId } = req.params;

    // connect to blockchain
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ItineraryStorageABI.abi, provider);

    
    const itineraryId = 1;
    const itinerary = await contract.getItinerary(itineraryId);

    res.json({
      success: true,
      userId,
      data: {
        destinations: itinerary[1],
        budget: itinerary[2].toString(),
        createdAt: Number(itinerary[3]),
        updatedAt: Number(itinerary[4])
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
