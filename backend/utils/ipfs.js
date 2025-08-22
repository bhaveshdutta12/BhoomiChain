const fs = require('fs');

class IPFSService {
  constructor() {
    this.client = null;
  }

  init() {
    try {
      // For hackathon demo, use mock IPFS service
      console.log('🔧 Using Mock IPFS service for demo');
      this.client = new MockIPFS();
      console.log('✅ IPFS service initialized (Mock mode)');
    } catch (error) {
      console.error('❌ IPFS service initialization failed:', error);
      this.client = new MockIPFS();
    }
  }

  async uploadFile(filePath, filename) {
    if (!this.client) {
      throw new Error('IPFS client not initialized');
    }

    try {
      const file = fs.readFileSync(filePath);
      
      const result = await this.client.add({
        path: filename,
        content: file
      });

      console.log(`📁 File uploaded to IPFS: ${result.cid.toString()}`);
      
      return {
        hash: result.cid.toString(),
        size: result.size,
        path: result.path
      };
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error;
    }
  }

  async uploadBuffer(buffer, filename) {
    if (!this.client) {
      throw new Error('IPFS client not initialized');
    }

    try {
      const result = await this.client.add({
        path: filename,
        content: buffer
      });

      console.log(`📁 Buffer uploaded to IPFS: ${result.cid.toString()}`);
      
      return {
        hash: result.cid.toString(),
        size: result.size,
        path: result.path
      };
    } catch (error) {
      console.error('Error uploading buffer to IPFS:', error);
      throw error;
    }
  }

  async uploadJSON(data, filename) {
    if (!this.client) {
      throw new Error('IPFS client not initialized');
    }

    try {
      const jsonString = JSON.stringify(data, null, 2);
      const buffer = Buffer.from(jsonString);
      
      const result = await this.client.add({
        path: filename,
        content: buffer
      });

      console.log(`📄 JSON uploaded to IPFS: ${result.cid.toString()}`);
      
      return {
        hash: result.cid.toString(),
        size: result.size,
        path: result.path
      };
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw error;
    }
  }

  async getFile(hash) {
    if (!this.client) {
      throw new Error('IPFS client not initialized');
    }

    try {
      const stream = this.client.cat(hash);
      const chunks = [];
      
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Error getting file from IPFS:', error);
      throw error;
    }
  }

  async getJSON(hash) {
    if (!this.client) {
      throw new Error('IPFS client not initialized');
    }

    try {
      const buffer = await this.getFile(hash);
      const jsonString = buffer.toString();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error getting JSON from IPFS:', error);
      throw error;
    }
  }

  async pinFile(hash) {
    if (!this.client) {
      throw new Error('IPFS client not initialized');
    }

    try {
      await this.client.pin.add(hash);
      console.log(`📌 File pinned: ${hash}`);
      return true;
    } catch (error) {
      console.error('Error pinning file:', error);
      return false;
    }
  }

  async unpinFile(hash) {
    if (!this.client) {
      throw new Error('IPFS client not initialized');
    }

    try {
      await this.client.pin.rm(hash);
      console.log(`📌 File unpinned: ${hash}`);
      return true;
    } catch (error) {
      console.error('Error unpinning file:', error);
      return false;
    }
  }

  getPublicURL(hash) {
    const gateway = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs';
    return `${gateway}/${hash}`;
  }
}

// Mock IPFS service for development when IPFS node is not available
class MockIPFS {
  constructor() {
    this.storage = new Map();
    this.counter = 0;
  }

  async add(file) {
    this.counter++;
    const mockHash = `Qm${this.counter.toString().padStart(44, '0')}`;
    
    this.storage.set(mockHash, {
      content: file.content,
      path: file.path
    });

    console.log(`🔧 Mock IPFS: File stored with hash ${mockHash}`);
    
    return {
      cid: { toString: () => mockHash },
      size: file.content ? file.content.length : 0,
      path: file.path
    };
  }

  async *cat(hash) {
    const data = this.storage.get(hash);
    if (data) {
      yield data.content;
    } else {
      throw new Error(`File not found: ${hash}`);
    }
  }

  pin = {
    add: async (hash) => {
      console.log(`🔧 Mock IPFS: Pinned ${hash}`);
      return true;
    },
    rm: async (hash) => {
      console.log(`🔧 Mock IPFS: Unpinned ${hash}`);
      return true;
    }
  };
}

const ipfsService = new IPFSService();

module.exports = ipfsService;
