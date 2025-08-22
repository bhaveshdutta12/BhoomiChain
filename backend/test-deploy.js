#!/usr/bin/env node

// Test script to verify backend deployment
console.log('🧪 Testing BhoomiChain Backend Deployment...\n');

// Test 1: Check if server.js exists
const fs = require('fs');
const path = require('path');

console.log('1️⃣ Checking file structure...');
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  console.log('✅ server.js found at:', serverPath);
} else {
  console.log('❌ server.js not found at:', serverPath);
  process.exit(1);
}

// Test 2: Check if package.json exists
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json found at:', packagePath);
} else {
  console.log('❌ package.json not found at:', packagePath);
  process.exit(1);
}

// Test 3: Check if dependencies are installed
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules found at:', nodeModulesPath);
} else {
  console.log('❌ node_modules not found at:', nodeModulesPath);
  console.log('💡 Run: npm install');
}

// Test 4: Try to require the server
console.log('\n2️⃣ Testing module imports...');
try {
  const server = require('./server.js');
  console.log('✅ server.js can be required successfully');
} catch (error) {
  console.log('❌ Error requiring server.js:', error.message);
  process.exit(1);
}

// Test 5: Check environment
console.log('\n3️⃣ Environment check...');
console.log('📁 Current directory:', __dirname);
console.log('📁 Parent directory:', path.dirname(__dirname));
console.log('🔧 Node version:', process.version);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV || 'not set');

console.log('\n🎉 All tests passed! Backend is ready for deployment.');
console.log('\n📋 Next steps:');
console.log('1. Commit and push these changes to GitHub');
console.log('2. Redeploy on Render');
console.log('3. The rootDir: backend setting should fix the path issue');
