// Land related types
export interface Land {
  landId: number;
  surveyNumber: string;
  currentOwner: string;
  previousOwner: string;
  location: string;
  area: number;
  ipfsHash: string;
  registrationDate: string;
  lastTransferDate?: string;
  isVerified: boolean;
  gpsCoordinates: string;
  marketValue: string;
  status: LandStatus;
}

export enum LandStatus {
  REGISTERED = 0,
  TRANSFER_PENDING = 1,
  DISPUTED = 2,
  VERIFIED = 3
}

export const LandStatusLabels = {
  [LandStatus.REGISTERED]: 'Registered',
  [LandStatus.TRANSFER_PENDING]: 'Transfer Pending',
  [LandStatus.DISPUTED]: 'Disputed',
  [LandStatus.VERIFIED]: 'Verified'
};

// Transfer related types
export interface TransferRequest {
  landId: number;
  from: string;
  to: string;
  requestDate: string;
  reason: string;
  isApproved: boolean;
  isCompleted: boolean;
}

export interface TransferWithLand {
  landId: number;
  land: {
    surveyNumber: string;
    location: string;
    area: number;
    currentOwner?: string;
  };
  transferRequest: TransferRequest;
}

// Document related types
export interface Document {
  filename: string;
  hash: string;
  size: number;
  type: string;
  uploadedAt: string;
  url?: string;
}

export interface LandMetadata {
  surveyNumber: string;
  location: string;
  area: number;
  gpsCoordinates: string;
  marketValue: number;
  documents: Document[];
  registrationDate: string;
  lastUpdated?: string;
}

// API response types
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total?: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LandSearchResponse {
  lands: Land[];
  total: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: {
    location?: string;
    verified?: string;
    status?: string;
  };
  message?: string;
}

// Statistics types
export interface LandStatistics {
  total: {
    lands: number;
    verifiedLands: number;
    unverifiedLands: number;
    uniqueOwners: number;
    totalArea: number;
    averageArea: number;
  };
  status: {
    registered: number;
    transferPending: number;
    disputed: number;
    verified: number;
  };
  recent: {
    registrations: number;
  };
  lastUpdated: string;
}

// Web3 related types
export interface Web3ContextType {
  account: string | null;
  provider: any;
  signer: any;
  contract: any;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

// User and authentication types
export interface User {
  address: string;
  role: 'citizen' | 'official' | 'admin';
  loginTime?: string;
  joinDate?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (address: string, role: string) => Promise<void>;
  logout: () => void;
}

// App context types
export interface AppContextType {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  clearMessages: () => void;
}

// Map related types
export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface LandMarker {
  landId: number;
  surveyNumber: string;
  location: string;
  coordinates: [number, number]; // [lng, lat]
  currentOwner: string;
  isVerified: boolean;
  status: LandStatus;
  area: number;
}

// Form related types
export interface LandRegistrationForm {
  surveyNumber: string;
  owner: string;
  location: string;
  area: number | '';
  gpsCoordinates: string;
  marketValue: number | '';
  documents: File[];
}

export interface TransferRequestForm {
  newOwner: string;
  reason: string;
}

export interface SearchForm {
  surveyNumber: string;
  owner: string;
  location: string;
  verified: string;
  status: string;
}

// Blockchain transaction types
export interface TransactionResult {
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  landId?: number;
  ipfsHash?: string;
  ipfsUrl?: string;
}

// Error types
export interface AppError {
  message: string;
  code?: string | number;
  details?: any;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Route types
export interface RouteParams {
  id?: string;
  address?: string;
}

// Filter and sort types
export interface LandFilters {
  location?: string;
  verified?: boolean;
  status?: LandStatus;
  owner?: string;
  surveyNumber?: string;
}

export interface SortOptions {
  field: 'landId' | 'registrationDate' | 'area' | 'marketValue' | 'location';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}
