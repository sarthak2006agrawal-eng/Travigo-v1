// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TravelRecords {
    struct PaymentReceipt {
        string category;      // hotel / transport / activity
        uint amount;          // cost
        string currency;      // e.g. INR, USD
        string ipfsHash;      // reference to receipt file (PDF, invoice)
        bytes32 receiptHash;  // keccak256 hash for integrity check
        uint timestamp;
    }

    struct KYCRecord {
        string docType;       // e.g. "Aadhaar", "Passport"
        string ipfsHash;      // link to encrypted doc
        bytes32 docHash;      // keccak256(doc)
        uint timestamp;
    }

    mapping(address => PaymentReceipt[]) public userReceipts;
    mapping(address => KYCRecord[]) public userKYC;

    // Store a new payment receipt
    function storeReceipt(
        string memory _category,
        uint _amount,
        string memory _currency,
        string memory _ipfsHash,
        bytes32 _receiptHash
    ) public {
        userReceipts[msg.sender].push(
            PaymentReceipt(_category, _amount, _currency, _ipfsHash, _receiptHash, block.timestamp)
        );
    }

    // Store KYC doc reference
    function storeKYC(
        string memory _docType,
        string memory _ipfsHash,
        bytes32 _docHash
    ) public {
        userKYC[msg.sender].push(
            KYCRecord(_docType, _ipfsHash, _docHash, block.timestamp)
        );
    }

    // Get all receipts for a user
    function getReceipts(address user) public view returns (PaymentReceipt[] memory) {
        return userReceipts[user];
    }

    // Get all KYC records for a user
    function getKYC(address user) public view returns (KYCRecord[] memory) {
        return userKYC[user];
    }
}
