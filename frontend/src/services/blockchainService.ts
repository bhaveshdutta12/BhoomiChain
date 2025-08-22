import { ethers } from 'ethers';

// Contract ABI (simplified for demonstration)
const LAND_REGISTRY_ABI = [
  {
    "inputs": [
      {"name": "_surveyNumber", "type": "string"},
      {"name": "_ownerName", "type": "string"},
      {"name": "_location", "type": "string"},
      {"name": "_area", "type": "uint256"},
      {"name": "_landType", "type": "string"},
      {"name": "_marketValue", "type": "uint256"},
      {"name": "_ipfsHash", "type": "string"}
    ],
    "name": "registerLand",
    "outputs": [{"name": "landId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_landId", "type": "uint256"},
      {"name": "_newOwner", "type": "address"},
      {"name": "_newOwnerName", "type": "string"},
      {"name": "_transferPrice", "type": "uint256"}
    ],
    "name": "transferOwnership",
    "outputs": [{"name": "success", "type": "bool"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_landId", "type": "uint256"}],
    "name": "getLandDetails",
    "outputs": [
      {"name": "surveyNumber", "type": "string"},
      {"name": "owner", "type": "address"},
      {"name": "ownerName", "type": "string"},
      {"name": "location", "type": "string"},
      {"name": "area", "type": "uint256"},
      {"name": "landType", "type": "string"},
      {"name": "marketValue", "type": "uint256"},
      {"name": "registrationDate", "type": "uint256"},
      {"name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "getLandsByOwner",
    "outputs": [{"name": "landIds", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_surveyNumber", "type": "string"}],
    "name": "getLandBySurveyNumber",
    "outputs": [{"name": "landId", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "landId", "type": "uint256"},
      {"indexed": true, "name": "owner", "type": "address"},
      {"indexed": false, "name": "surveyNumber", "type": "string"},
      {"indexed": false, "name": "registrationDate", "type": "uint256"}
    ],
    "name": "LandRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "landId", "type": "uint256"},
      {"indexed": true, "name": "previousOwner", "type": "address"},
      {"indexed": true, "name": "newOwner", "type": "address"},
      {"indexed": false, "name": "transferPrice", "type": "uint256"},
      {"indexed": false, "name": "transferDate", "type": "uint256"}
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  }
];

// Contract address (this would be deployed contract address)
const CONTRACT_ADDRESS = "0x1234567890abcdef1234567890abcdef12345678";

interface LandRegistrationData {
  surveyNumber: string;
  ownerName: string;
  location: string;
  area: number;
  landType: string;
  marketValue: number;
  ipfsHash: string;
}

interface TransferData {
  landId: number;
  newOwnerAddress: string;
  newOwnerName: string;
  transferPrice: number;
}

interface LandDetails {
  surveyNumber: string;
  owner: string;
  ownerName: string;
  location: string;
  area: number;
  landType: string;
  marketValue: number;
  registrationDate: number;
  isActive: boolean;
}

export class BlockchainService {
  private provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    this.initializeWeb3();
  }

  private async initializeWeb3(): Promise<void> {
    try {
      // Check if Web3 is available
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        this.provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await this.provider.send("eth_requestAccounts", []);
        this.signer = this.provider.getSigner();
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, LAND_REGISTRY_ABI, this.signer);
      } else {
        console.warn('Web3 not detected. Using fallback provider.');
        // Fallback to read-only provider for viewing data
        const fallbackProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
        this.provider = fallbackProvider;
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, LAND_REGISTRY_ABI, fallbackProvider);
      }
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
    }
  }

  async connectWallet(): Promise<{ address: string; balance: string }> {
    try {
      if (!this.provider) {
        throw new Error('Web3 provider not available');
      }

      // Only Web3Provider supports getSigner(), not JsonRpcProvider
      if (!(this.provider instanceof ethers.providers.Web3Provider)) {
        throw new Error('Wallet connection requires MetaMask or similar Web3 provider');
      }

      // Request account access
      await this.provider.send("eth_requestAccounts", []);
      this.signer = this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, LAND_REGISTRY_ABI, this.signer);

      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      
      return {
        address,
        balance: ethers.utils.formatEther(balance)
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect wallet. Please make sure MetaMask is installed and unlocked.');
    }
  }

  async registerLand(data: LandRegistrationData): Promise<{ transactionHash: string; landId: number }> {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Contract not initialized or wallet not connected');
      }

      // Estimate gas
      const gasEstimate = await this.contract.estimateGas.registerLand(
        data.surveyNumber,
        data.ownerName,
        data.location,
        data.area,
        data.landType,
        ethers.utils.parseUnits(data.marketValue.toString(), 'wei'),
        data.ipfsHash
      );

      // Send transaction with extra gas buffer
      const transaction = await this.contract.registerLand(
        data.surveyNumber,
        data.ownerName,
        data.location,
        data.area,
        data.landType,
        ethers.utils.parseUnits(data.marketValue.toString(), 'wei'),
        data.ipfsHash,
        {
          gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
        }
      );

      console.log('Land registration transaction sent:', transaction.hash);

      // Wait for confirmation
      const receipt = await transaction.wait();
      console.log('Land registration confirmed:', receipt);

      // Extract land ID from events
      const event = receipt.events?.find((e: any) => e.event === 'LandRegistered');
      const landId = event ? event.args.landId.toNumber() : 0;

      return {
        transactionHash: transaction.hash,
        landId
      };
    } catch (error) {
      console.error('Land registration failed:', error);
      throw new Error(`Land registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async transferOwnership(data: TransferData): Promise<{ transactionHash: string; success: boolean }> {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Contract not initialized or wallet not connected');
      }

      const transferValue = ethers.utils.parseEther(data.transferPrice.toString());

      // Estimate gas
      const gasEstimate = await this.contract.estimateGas.transferOwnership(
        data.landId,
        data.newOwnerAddress,
        data.newOwnerName,
        transferValue,
        { value: transferValue }
      );

      // Send transaction
      const transaction = await this.contract.transferOwnership(
        data.landId,
        data.newOwnerAddress,
        data.newOwnerName,
        transferValue,
        {
          value: transferValue,
          gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
        }
      );

      console.log('Ownership transfer transaction sent:', transaction.hash);

      // Wait for confirmation
      const receipt = await transaction.wait();
      console.log('Ownership transfer confirmed:', receipt);

      return {
        transactionHash: transaction.hash,
        success: true
      };
    } catch (error) {
      console.error('Ownership transfer failed:', error);
      throw new Error(`Ownership transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLandDetails(landId: number): Promise<LandDetails> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const result = await this.contract.getLandDetails(landId);
      
      return {
        surveyNumber: result.surveyNumber,
        owner: result.owner,
        ownerName: result.ownerName,
        location: result.location,
        area: result.area.toNumber(),
        landType: result.landType,
        marketValue: result.marketValue.toNumber(),
        registrationDate: result.registrationDate.toNumber(),
        isActive: result.isActive
      };
    } catch (error) {
      console.error('Failed to get land details:', error);
      throw new Error(`Failed to get land details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLandsByOwner(ownerAddress: string): Promise<number[]> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const landIds = await this.contract.getLandsByOwner(ownerAddress);
      return landIds.map((id: ethers.BigNumber) => id.toNumber());
    } catch (error) {
      console.error('Failed to get lands by owner:', error);
      throw new Error(`Failed to get lands by owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLandBySurveyNumber(surveyNumber: string): Promise<number> {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const landId = await this.contract.getLandBySurveyNumber(surveyNumber);
      return landId.toNumber();
    } catch (error) {
      console.error('Failed to get land by survey number:', error);
      throw new Error(`Failed to get land by survey number: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTransactionReceipt(txHash: string): Promise<ethers.providers.TransactionReceipt | null> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Failed to get transaction receipt:', error);
      return null;
    }
  }

  async getCurrentAccount(): Promise<string | null> {
    try {
      if (!this.signer) {
        return null;
      }
      
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Failed to get current account:', error);
      return null;
    }
  }

  async getNetwork(): Promise<{ name: string; chainId: number } | null> {
    try {
      if (!this.provider) {
        return null;
      }

      const network = await this.provider.getNetwork();
      return {
        name: network.name,
        chainId: network.chainId
      };
    } catch (error) {
      console.error('Failed to get network:', error);
      return null;
    }
  }

  // Event listeners
  onLandRegistered(callback: (landId: number, owner: string, surveyNumber: string, date: number) => void): void {
    if (!this.contract) return;

    this.contract.on('LandRegistered', (landId, owner, surveyNumber, registrationDate) => {
      callback(landId.toNumber(), owner, surveyNumber, registrationDate.toNumber());
    });
  }

  onOwnershipTransferred(callback: (landId: number, previousOwner: string, newOwner: string, price: number, date: number) => void): void {
    if (!this.contract) return;

    this.contract.on('OwnershipTransferred', (landId, previousOwner, newOwner, transferPrice, transferDate) => {
      callback(
        landId.toNumber(), 
        previousOwner, 
        newOwner, 
        transferPrice.toNumber(), 
        transferDate.toNumber()
      );
    });
  }

  removeAllListeners(): void {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }
}

// Singleton instance
export const blockchainService = new BlockchainService();

// Utility functions
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTokenAmount = (amount: string | number, decimals: number = 18): string => {
  try {
    const value = typeof amount === 'string' ? amount : amount.toString();
    return ethers.utils.formatUnits(value, decimals);
  } catch (error) {
    console.error('Failed to format token amount:', error);
    return '0';
  }
};

export const parseTokenAmount = (amount: string, decimals: number = 18): string => {
  try {
    return ethers.utils.parseUnits(amount, decimals).toString();
  } catch (error) {
    console.error('Failed to parse token amount:', error);
    return '0';
  }
};

export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.utils.isAddress(address);
  } catch (error) {
    return false;
  }
};

export const getExplorerUrl = (txHash: string, network: string = 'localhost'): string => {
  const baseUrls: Record<string, string> = {
    mainnet: 'https://etherscan.io',
    goerli: 'https://goerli.etherscan.io',
    sepolia: 'https://sepolia.etherscan.io',
    polygon: 'https://polygonscan.com',
    mumbai: 'https://mumbai.polygonscan.com',
    localhost: 'http://localhost:8545'
  };

  const baseUrl = baseUrls[network] || baseUrls.localhost;
  
  if (network === 'localhost') {
    return `${baseUrl}/tx/${txHash}`;
  }
  
  return `${baseUrl}/tx/${txHash}`;
};
