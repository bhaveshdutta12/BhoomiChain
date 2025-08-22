// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LandRegistry
 * @dev Smart contract for managing land ownership records on blockchain
 * @author BhoomiChain Team
 */
contract LandRegistry is Ownable, ReentrancyGuard {
    uint256 private _landIdCounter;
    
    // Struct to represent a land property
    struct Land {
        uint256 landId;
        string surveyNumber;
        address currentOwner;
        address previousOwner;
        string location;
        uint256 area; // in square meters
        string ipfsHash; // Hash of documents stored on IPFS
        uint256 registrationDate;
        uint256 lastTransferDate;
        bool isVerified;
        string gpsCoordinates; // Format: "latitude,longitude"
        uint256 marketValue; // in wei
        LandStatus status;
    }
    
    // Enum for land status
    enum LandStatus {
        REGISTERED,
        TRANSFER_PENDING,
        DISPUTED,
        VERIFIED
    }
    
    // Struct for transfer requests
    struct TransferRequest {
        uint256 landId;
        address from;
        address to;
        uint256 requestDate;
        string reason;
        bool isApproved;
        bool isCompleted;
    }
    
    // Mappings
    mapping(uint256 => Land) public lands;
    mapping(string => uint256) public surveyNumberToLandId;
    mapping(address => uint256[]) public ownerToLands;
    mapping(uint256 => TransferRequest) public transferRequests;
    mapping(address => bool) public authorizedOfficials;
    
    // Events
    event LandRegistered(
        uint256 indexed landId,
        string surveyNumber,
        address indexed owner,
        string location,
        uint256 area
    );
    
    event TransferRequested(
        uint256 indexed landId,
        address indexed from,
        address indexed to,
        uint256 requestId
    );
    
    event TransferApproved(
        uint256 indexed landId,
        address indexed from,
        address indexed to
    );
    
    event TransferCompleted(
        uint256 indexed landId,
        address indexed from,
        address indexed to
    );
    
    event LandVerified(uint256 indexed landId, address indexed verifier);
    
    event DocumentUpdated(uint256 indexed landId, string newIpfsHash);
    
    // Modifiers
    modifier onlyAuthorized() {
        require(
            authorizedOfficials[msg.sender] || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }
    
    modifier landExists(uint256 landId) {
        require(landId <= _landIdCounter, "Land does not exist");
        _;
    }
    
    modifier onlyLandOwner(uint256 landId) {
        require(
            lands[landId].currentOwner == msg.sender,
            "Not the land owner"
        );
        _;
    }
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new land property
     * @param surveyNumber Unique survey number for the land
     * @param owner Address of the land owner
     * @param location Location description of the land
     * @param area Area of the land in square meters
     * @param ipfsHash IPFS hash of property documents
     * @param gpsCoordinates GPS coordinates of the land
     * @param marketValue Market value of the land
     */
    function registerLand(
        string memory surveyNumber,
        address owner,
        string memory location,
        uint256 area,
        string memory ipfsHash,
        string memory gpsCoordinates,
        uint256 marketValue
    ) external onlyAuthorized {
        require(bytes(surveyNumber).length > 0, "Survey number required");
        require(owner != address(0), "Invalid owner address");
        require(surveyNumberToLandId[surveyNumber] == 0, "Land already registered");
        
        _landIdCounter++;
        uint256 newLandId = _landIdCounter;
        
        lands[newLandId] = Land({
            landId: newLandId,
            surveyNumber: surveyNumber,
            currentOwner: owner,
            previousOwner: address(0),
            location: location,
            area: area,
            ipfsHash: ipfsHash,
            registrationDate: block.timestamp,
            lastTransferDate: 0,
            isVerified: false,
            gpsCoordinates: gpsCoordinates,
            marketValue: marketValue,
            status: LandStatus.REGISTERED
        });
        
        surveyNumberToLandId[surveyNumber] = newLandId;
        ownerToLands[owner].push(newLandId);
        
        emit LandRegistered(newLandId, surveyNumber, owner, location, area);
    }
    
    /**
     * @dev Request transfer of land ownership
     * @param landId ID of the land to transfer
     * @param newOwner Address of the new owner
     * @param reason Reason for transfer
     */
    function requestTransfer(
        uint256 landId,
        address newOwner,
        string memory reason
    ) external landExists(landId) onlyLandOwner(landId) {
        require(newOwner != address(0), "Invalid new owner address");
        require(newOwner != lands[landId].currentOwner, "Cannot transfer to self");
        require(
            lands[landId].status == LandStatus.REGISTERED || 
            lands[landId].status == LandStatus.VERIFIED,
            "Land not available for transfer"
        );
        
        transferRequests[landId] = TransferRequest({
            landId: landId,
            from: msg.sender,
            to: newOwner,
            requestDate: block.timestamp,
            reason: reason,
            isApproved: false,
            isCompleted: false
        });
        
        lands[landId].status = LandStatus.TRANSFER_PENDING;
        
        emit TransferRequested(landId, msg.sender, newOwner, landId);
    }
    
    /**
     * @dev Approve a transfer request
     * @param landId ID of the land for which transfer is being approved
     */
    function approveTransfer(uint256 landId) 
        external 
        landExists(landId) 
        onlyAuthorized 
    {
        require(
            transferRequests[landId].from != address(0),
            "No transfer request found"
        );
        require(!transferRequests[landId].isApproved, "Already approved");
        require(!transferRequests[landId].isCompleted, "Already completed");
        
        transferRequests[landId].isApproved = true;
        
        emit TransferApproved(
            landId,
            transferRequests[landId].from,
            transferRequests[landId].to
        );
    }
    
    /**
     * @dev Complete the transfer of land ownership
     * @param landId ID of the land to transfer
     */
    function completeTransfer(uint256 landId) 
        external 
        landExists(landId) 
        onlyAuthorized 
    {
        TransferRequest storage request = transferRequests[landId];
        require(request.from != address(0), "No transfer request found");
        require(request.isApproved, "Transfer not approved");
        require(!request.isCompleted, "Transfer already completed");
        
        Land storage land = lands[landId];
        
        // Remove land from previous owner's list
        _removeLandFromOwner(land.currentOwner, landId);
        
        // Update land ownership
        land.previousOwner = land.currentOwner;
        land.currentOwner = request.to;
        land.lastTransferDate = block.timestamp;
        land.status = LandStatus.REGISTERED;
        
        // Add land to new owner's list
        ownerToLands[request.to].push(landId);
        
        // Mark request as completed
        request.isCompleted = true;
        
        emit TransferCompleted(landId, request.from, request.to);
    }
    
    /**
     * @dev Verify a land property
     * @param landId ID of the land to verify
     */
    function verifyLand(uint256 landId) 
        external 
        landExists(landId) 
        onlyAuthorized 
    {
        require(!lands[landId].isVerified, "Land already verified");
        
        lands[landId].isVerified = true;
        lands[landId].status = LandStatus.VERIFIED;
        
        emit LandVerified(landId, msg.sender);
    }
    
    /**
     * @dev Update IPFS document hash for a land
     * @param landId ID of the land
     * @param newIpfsHash New IPFS hash
     */
    function updateDocument(uint256 landId, string memory newIpfsHash) 
        external 
        landExists(landId) 
        onlyAuthorized 
    {
        lands[landId].ipfsHash = newIpfsHash;
        emit DocumentUpdated(landId, newIpfsHash);
    }
    
    /**
     * @dev Add an authorized official
     * @param official Address to authorize
     */
    function addAuthorizedOfficial(address official) external onlyOwner {
        authorizedOfficials[official] = true;
    }
    
    /**
     * @dev Remove an authorized official
     * @param official Address to remove authorization
     */
    function removeAuthorizedOfficial(address official) external onlyOwner {
        authorizedOfficials[official] = false;
    }
    
    /**
     * @dev Get land details by ID
     * @param landId ID of the land
     * @return Land struct
     */
    function getLand(uint256 landId) 
        external 
        view 
        landExists(landId) 
        returns (Land memory) 
    {
        return lands[landId];
    }
    
    /**
     * @dev Get land ID by survey number
     * @param surveyNumber Survey number of the land
     * @return Land ID
     */
    function getLandIdBySurveyNumber(string memory surveyNumber) 
        external 
        view 
        returns (uint256) 
    {
        return surveyNumberToLandId[surveyNumber];
    }
    
    /**
     * @dev Get all lands owned by an address
     * @param owner Owner address
     * @return Array of land IDs
     */
    function getLandsByOwner(address owner) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return ownerToLands[owner];
    }
    
    /**
     * @dev Get transfer request details
     * @param landId Land ID
     * @return Transfer request struct
     */
    function getTransferRequest(uint256 landId) 
        external 
        view 
        returns (TransferRequest memory) 
    {
        return transferRequests[landId];
    }
    
    /**
     * @dev Get total number of registered lands
     * @return Total count
     */
    function getTotalLands() external view returns (uint256) {
        return _landIdCounter;
    }
    
    /**
     * @dev Internal function to remove land from owner's list
     * @param owner Owner address
     * @param landId Land ID to remove
     */
    function _removeLandFromOwner(address owner, uint256 landId) internal {
        uint256[] storage ownerLands = ownerToLands[owner];
        for (uint256 i = 0; i < ownerLands.length; i++) {
            if (ownerLands[i] == landId) {
                ownerLands[i] = ownerLands[ownerLands.length - 1];
                ownerLands.pop();
                break;
            }
        }
    }
}
