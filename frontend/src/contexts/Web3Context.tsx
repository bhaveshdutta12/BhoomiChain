import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3ContextType } from '../types';

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }

      const web3Provider = new ethers.providers.Web3Provider(ethereum, 'any');
      await web3Provider.send('eth_requestAccounts', []);
      const nextSigner = web3Provider.getSigner();
      const address = await nextSigner.getAddress();

      setProvider(web3Provider);
      setSigner(nextSigner);
      setAccount(address);
      setIsConnected(true);

      // Optional: set your contract instance here if needed by UI
      // const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI, nextSigner);
      // setContract(contractInstance);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect wallet');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setIsConnected(false);
    setError(null);
  };

  // Initialize read-only provider (optional) and subscribe to wallet events
  useEffect(() => {
    const { ethereum } = window as any;

    // Event handlers
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        disconnectWallet();
      }
    };

    const handleChainChanged = async () => {
      // Recreate provider/signer on network change
      if (!ethereum) return;
      const web3Provider = new ethers.providers.Web3Provider(ethereum, 'any');
      setProvider(web3Provider);
      try {
        const nextSigner = web3Provider.getSigner();
        const address = await nextSigner.getAddress();
        setSigner(nextSigner);
        setAccount(address);
        setIsConnected(true);
      } catch {
        // If signer not available, treat as disconnected
        disconnectWallet();
      }
    };

    if (ethereum && ethereum.on) {
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (ethereum && ethereum.removeListener) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const value: Web3ContextType = {
    account,
    provider,
    signer,
    contract,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
