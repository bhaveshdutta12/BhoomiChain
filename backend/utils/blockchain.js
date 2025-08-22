const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = null;
    this.contractABI = null;
  }

  async init() {
    try {
      // Setup provider
      const rpcUrl = process.env.RPC_URL || 'http://localhost:8545';
      console.log(`🔗 Connecting to blockchain at ${rpcUrl}`);
      
      // Test connection first
      try {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        await this.provider.getNetwork();
        console.log('🌐 Blockchain connection established');
      } catch (connError) {
        console.log('⚠️  Blockchain network not available - running in mock mode');
        return;
      }
      
      // Setup signer (for transactions)
      if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== 'your_private_key_here') {
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        console.log('🔐 Wallet initialized');
      } else {
        console.log('⚠️  No valid private key provided - read-only mode');
      }

      // Load contract ABI and address
      await this.loadContract();
      
      if (this.contractAddress) {
        console.log('✅ Blockchain service initialized');
        console.log(`📍 Contract Address: ${this.contractAddress}`);
      } else {
        console.log('⚠️  Contract not deployed - running in mock mode');
      }
      
    } catch (error) {
      console.log('⚠️  Blockchain service running in mock mode:', error.message);
    }
  }

  async loadContract() {
    try {
      // Load contract addresses
      const addressPath = path.join(__dirname, '../../contracts/contractAddresses/contract-addresses.json');
      if (fs.existsSync(addressPath)) {
        const addresses = JSON.parse(fs.readFileSync(addressPath, 'utf8'));
        this.contractAddress = addresses.LandRegistry;
      }

      // Load contract ABI
      const artifactPath = path.join(__dirname, '../../contracts/artifacts/contracts/LandRegistry.sol/LandRegistry.json');
      if (fs.existsSync(artifactPath)) {
        const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
        this.contractABI = artifact.abi;
      }

      // Create contract instance
      if (this.contractAddress && this.contractABI) {
        this.contract = new ethers.Contract(
          this.contractAddress,
          this.contractABI,
          this.signer || this.provider
        );
      }
    } catch (error) {
      console.error('Error loading contract:', error);
    }
  }

  async registerLand(landData) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not initialized');
    }

    try {
      const tx = await this.contract.registerLand(
        landData.surveyNumber,
        landData.owner,
        landData.location,
        landData.area,
        landData.ipfsHash,
        landData.gpsCoordinates,
        ethers.utils.parseEther(landData.marketValue.toString())
      );

      const receipt = await tx.wait();
      
      // Extract land ID from events
      const event = receipt.events?.find(e => e.event === 'LandRegistered');
      const landId = event?.args?.landId?.toNumber();

      return {
        landId,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error registering land:', error);
      throw error;
    }
  }

  async getLand(landId) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const land = await this.contract.getLand(landId);
      return {
        landId: land.landId.toNumber(),
        surveyNumber: land.surveyNumber,
        currentOwner: land.currentOwner,
        previousOwner: land.previousOwner,
        location: land.location,
        area: land.area.toNumber(),
        ipfsHash: land.ipfsHash,
        registrationDate: new Date(land.registrationDate.toNumber() * 1000),
        lastTransferDate: land.lastTransferDate.toNumber() > 0 ? 
          new Date(land.lastTransferDate.toNumber() * 1000) : null,
        isVerified: land.isVerified,
        gpsCoordinates: land.gpsCoordinates,
        marketValue: ethers.utils.formatEther(land.marketValue),
        status: land.status
      };
    } catch (error) {
      console.error('Error getting land:', error);
      throw error;
    }
  }

  async getLandsByOwner(ownerAddress) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const landIds = await this.contract.getLandsByOwner(ownerAddress);
      return landIds.map(id => id.toNumber());
    } catch (error) {
      console.error('Error getting lands by owner:', error);
      throw error;
    }
  }

  async getLandIdBySurveyNumber(surveyNumber) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const landId = await this.contract.getLandIdBySurveyNumber(surveyNumber);
      return landId.toNumber();
    } catch (error) {
      console.error('Error getting land by survey number:', error);
      throw error;
    }
  }

  async requestTransfer(landId, newOwner, reason) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not initialized');
    }

    try {
      const tx = await this.contract.requestTransfer(landId, newOwner, reason);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error requesting transfer:', error);
      throw error;
    }
  }

  async approveTransfer(landId) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not initialized');
    }

    try {
      const tx = await this.contract.approveTransfer(landId);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error approving transfer:', error);
      throw error;
    }
  }

  async completeTransfer(landId) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not initialized');
    }

    try {
      const tx = await this.contract.completeTransfer(landId);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error completing transfer:', error);
      throw error;
    }
  }

  async verifyLand(landId) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not initialized');
    }

    try {
      const tx = await this.contract.verifyLand(landId);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error verifying land:', error);
      throw error;
    }
  }

  async updateDocument(landId, newIpfsHash) {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not initialized');
    }

    try {
      const tx = await this.contract.updateDocument(landId, newIpfsHash);
      const receipt = await tx.wait();

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  async getTotalLands() {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const total = await this.contract.getTotalLands();
      return total.toNumber();
    } catch (error) {
      console.error('Error getting total lands:', error);
      throw error;
    }
  }

  async getTransferRequest(landId) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const request = await this.contract.getTransferRequest(landId);
      return {
        landId: request.landId.toNumber(),
        from: request.from,
        to: request.to,
        requestDate: new Date(request.requestDate.toNumber() * 1000),
        reason: request.reason,
        isApproved: request.isApproved,
        isCompleted: request.isCompleted
      };
    } catch (error) {
      console.error('Error getting transfer request:', error);
      throw error;
    }
  }

  // Event listeners
  async listenToEvents() {
    if (!this.contract) {
      return;
    }

    this.contract.on('LandRegistered', (landId, surveyNumber, owner, location, area) => {
      console.log('🏡 Land Registered:', {
        landId: landId.toString(),
        surveyNumber,
        owner,
        location,
        area: area.toString()
      });
    });

    this.contract.on('TransferRequested', (landId, from, to, requestId) => {
      console.log('📝 Transfer Requested:', {
        landId: landId.toString(),
        from,
        to,
        requestId: requestId.toString()
      });
    });

    this.contract.on('TransferCompleted', (landId, from, to) => {
      console.log('✅ Transfer Completed:', {
        landId: landId.toString(),
        from,
        to
      });
    });

    this.contract.on('LandVerified', (landId, verifier) => {
      console.log('🔍 Land Verified:', {
        landId: landId.toString(),
        verifier
      });
    });
  }
}

const blockchainService = new BlockchainService();

module.exports = blockchainService;
