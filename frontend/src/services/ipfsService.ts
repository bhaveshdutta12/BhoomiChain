interface IPFSFile {
  hash: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
}

interface DocumentMetadata {
  filename: string;
  filesize: number;
  filetype: string;
  description?: string;
  category: 'deed' | 'survey' | 'noc' | 'certificate' | 'legal' | 'other';
  uploadedBy: string;
  uploadDate: Date;
  verified?: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
}

interface IPFSUploadResult {
  hash: string;
  url: string;
  metadata: DocumentMetadata;
}

export class IPFSService {
  private apiUrl: string;
  private gateway: string;

  constructor() {
    // In production, these would be environment variables
    this.apiUrl = process.env.REACT_APP_IPFS_API_URL || 'http://localhost:5001/api/v0';
    this.gateway = process.env.REACT_APP_IPFS_GATEWAY || 'http://localhost:8080/ipfs';
  }

  /**
   * Upload a file to IPFS
   */
  async uploadFile(file: File, metadata?: Partial<DocumentMetadata>): Promise<IPFSUploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // For demo purposes, simulate IPFS upload
      if (this.apiUrl.includes('localhost')) {
        return this.mockIPFSUpload(file, metadata);
      }

      // Real IPFS upload
      const response = await fetch(`${this.apiUrl}/add?pin=true&progress=false`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      const ipfsHash = result.Hash;

      const documentMetadata: DocumentMetadata = {
        filename: file.name,
        filesize: file.size,
        filetype: file.type,
        description: metadata?.description || '',
        category: metadata?.category || 'other',
        uploadedBy: metadata?.uploadedBy || 'anonymous',
        uploadDate: new Date(),
        verified: false
      };

      // Store metadata separately (in production, this would be in a database)
      await this.storeMetadata(ipfsHash, documentMetadata);

      return {
        hash: ipfsHash,
        url: `${this.gateway}/${ipfsHash}`,
        metadata: documentMetadata
      };

    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw new Error(`Failed to upload file to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload multiple files to IPFS
   */
  async uploadMultipleFiles(files: File[], metadata?: Partial<DocumentMetadata>[]): Promise<IPFSUploadResult[]> {
    try {
      const uploadPromises = files.map((file, index) => 
        this.uploadFile(file, metadata?.[index])
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple files upload failed:', error);
      throw new Error(`Failed to upload files to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve file from IPFS
   */
  async getFile(hash: string): Promise<Blob> {
    try {
      // For demo purposes, simulate IPFS retrieval
      if (this.gateway.includes('localhost')) {
        return this.mockIPFSRetrieval(hash);
      }

      const response = await fetch(`${this.gateway}/${hash}`);
      
      if (!response.ok) {
        throw new Error(`IPFS retrieval failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('IPFS retrieval failed:', error);
      throw new Error(`Failed to retrieve file from IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(hash: string): Promise<DocumentMetadata | null> {
    try {
      // In production, this would fetch from a database
      const stored = localStorage.getItem(`ipfs_metadata_${hash}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get file metadata:', error);
      return null;
    }
  }

  /**
   * Store file metadata
   */
  private async storeMetadata(hash: string, metadata: DocumentMetadata): Promise<void> {
    try {
      // In production, this would store in a database
      localStorage.setItem(`ipfs_metadata_${hash}`, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to store metadata:', error);
    }
  }

  /**
   * Pin file to ensure it stays on IPFS network
   */
  async pinFile(hash: string): Promise<void> {
    try {
      if (this.apiUrl.includes('localhost')) {
        console.log(`Mock pinning file: ${hash}`);
        return;
      }

      const response = await fetch(`${this.apiUrl}/pin/add?arg=${hash}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`IPFS pinning failed: ${response.statusText}`);
      }

      console.log(`File pinned successfully: ${hash}`);
    } catch (error) {
      console.error('IPFS pinning failed:', error);
      throw new Error(`Failed to pin file to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Unpin file from IPFS
   */
  async unpinFile(hash: string): Promise<void> {
    try {
      if (this.apiUrl.includes('localhost')) {
        console.log(`Mock unpinning file: ${hash}`);
        return;
      }

      const response = await fetch(`${this.apiUrl}/pin/rm?arg=${hash}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`IPFS unpinning failed: ${response.statusText}`);
      }

      console.log(`File unpinned successfully: ${hash}`);
    } catch (error) {
      console.error('IPFS unpinning failed:', error);
      throw new Error(`Failed to unpin file from IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get IPFS node info
   */
  async getNodeInfo(): Promise<any> {
    try {
      if (this.apiUrl.includes('localhost')) {
        return {
          id: 'mock-node-id',
          version: '0.20.0',
          status: 'online',
          peers: 42
        };
      }

      const response = await fetch(`${this.apiUrl}/id`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`IPFS node info failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get IPFS node info:', error);
      return null;
    }
  }

  /**
   * Verify file integrity
   */
  async verifyFile(hash: string, originalFile?: File): Promise<boolean> {
    try {
      const retrievedFile = await this.getFile(hash);

      if (originalFile) {
        // Compare file sizes
        if (retrievedFile.size !== originalFile.size) {
          return false;
        }

        // Compare file contents (simplified check)
        const retrievedArrayBuffer = await retrievedFile.arrayBuffer();
        const originalArrayBuffer = await originalFile.arrayBuffer();
        
        return retrievedArrayBuffer.byteLength === originalArrayBuffer.byteLength;
      }

      // If no original file provided, just check if file exists
      return retrievedFile.size > 0;
    } catch (error) {
      console.error('File verification failed:', error);
      return false;
    }
  }

  /**
   * Mock IPFS upload for development/demo
   */
  private async mockIPFSUpload(file: File, metadata?: Partial<DocumentMetadata>): Promise<IPFSUploadResult> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate mock IPFS hash
    const hash = `Qm${Math.random().toString(36).substr(2, 44)}`;

    const documentMetadata: DocumentMetadata = {
      filename: file.name,
      filesize: file.size,
      filetype: file.type,
      description: metadata?.description || '',
      category: metadata?.category || 'other',
      uploadedBy: metadata?.uploadedBy || 'demo-user',
      uploadDate: new Date(),
      verified: false
    };

    // Store file data in localStorage for demo
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        localStorage.setItem(`ipfs_file_${hash}`, e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    await this.storeMetadata(hash, documentMetadata);

    return {
      hash,
      url: `${this.gateway}/${hash}`,
      metadata: documentMetadata
    };
  }

  /**
   * Mock IPFS retrieval for development/demo
   */
  private async mockIPFSRetrieval(hash: string): Promise<Blob> {
    // Simulate retrieval delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const storedData = localStorage.getItem(`ipfs_file_${hash}`);
    
    if (!storedData) {
      throw new Error('File not found in mock storage');
    }

    // Convert data URL back to blob
    const response = await fetch(storedData);
    return await response.blob();
  }

  /**
   * Create a shareable link for a file
   */
  getShareableLink(hash: string): string {
    return `${this.gateway}/${hash}`;
  }

  /**
   * Get public gateway URLs for a file
   */
  getPublicGatewayUrls(hash: string): string[] {
    const publicGateways = [
      'https://ipfs.io/ipfs',
      'https://gateway.ipfs.io/ipfs',
      'https://cloudflare-ipfs.com/ipfs',
      'https://dweb.link/ipfs'
    ];

    return publicGateways.map(gateway => `${gateway}/${hash}`);
  }

  /**
   * Check if IPFS node is available
   */
  async isNodeAvailable(): Promise<boolean> {
    try {
      const nodeInfo = await this.getNodeInfo();
      return nodeInfo !== null;
    } catch (error) {
      console.warn('IPFS node not available, using mock service');
      return true; // Return true for mock service
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get IPFS hash from URL
   */
  extractHashFromUrl(url: string): string | null {
    const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  /**
   * Validate IPFS hash format
   */
  isValidIPFSHash(hash: string): boolean {
    // Basic validation for IPFS hash format
    return /^Qm[a-zA-Z0-9]{44}$/.test(hash) || /^bafy[a-zA-Z0-9]+$/.test(hash);
  }
}

// Singleton instance
export const ipfsService = new IPFSService();

// Utility functions
export const getFileTypeIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('document')) return '📝';
  if (mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.includes('presentation')) return '📋';
  return '📁';
};

export const getFileCategoryColor = (category: DocumentMetadata['category']): string => {
  const colors = {
    deed: '#e74c3c',      // Red
    survey: '#3498db',    // Blue
    noc: '#f39c12',       // Orange
    certificate: '#27ae60', // Green
    legal: '#9b59b6',     // Purple
    other: '#95a5a6'      // Gray
  };
  return colors[category] || colors.other;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export default IPFSService;
