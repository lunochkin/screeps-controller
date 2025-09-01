#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Load environment variables
require('dotenv').config();

class ScreepsDeployer {
  constructor(config) {
    this.config = config;
    this.distPath = path.join(__dirname, '..', 'dist', 'main.js');
  }

  validateBuild() {
    if (!fs.existsSync(this.distPath)) {
      console.error('Error: dist/main.js not found. Run "make build" first.');
      process.exit(1);
    }
  }

  readCode() {
    return fs.readFileSync(this.distPath, 'utf8');
  }

  createPostData(code) {
    return JSON.stringify({
      branch: this.config.branch,
      modules: {
        main: code
      }
    });
  }

  logDeployment() {
    console.log('Deploying to Screeps server...');
    console.log('Server:', `${this.config.host}:${this.config.port}`);
    console.log('Branch:', this.config.branch);
  }

  logSuccess(response) {
    console.log('✅ Successfully deployed to Screeps server!');
    try {
      const data = JSON.parse(response);
      if (data.branch) {
        console.log('Branch:', data.branch);
      }
    } catch (e) {
      // Response might not be JSON
    }
  }

  logError(statusCode, response) {
    console.error('❌ Deployment failed:', statusCode);
    console.error('Response:', response);
  }

  logDryRun(code) {
    console.log('DRY RUN: Would deploy to Screeps server');
    console.log('Server:', `${this.config.host}:${this.config.port}`);
    console.log('Branch:', this.config.branch);
    console.log('Code length:', code.length, 'characters');
  }

  createRequestOptions(postData) {
    const options = {
      hostname: this.config.host,
      port: this.config.port,
      path: '/api/user/code',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': 'Basic ' + Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64')
      }
    };

    return options;
  }

  deploy() {
    // Validate build exists
    this.validateBuild();

    // Read the built code
    const code = this.readCode();

    if (this.config.dryRun) {
      this.logDryRun(code);
      return;
    }

    // Create the post data
    const postData = this.createPostData(code);

    // Create request options
    const options = this.createRequestOptions(postData);

    this.logDeployment();

    // Choose HTTP or HTTPS based on deployment type
    const requestModule = this.config.host === 'localhost' ? http : https;
    
    const req = requestModule.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          this.logSuccess(data);
        } else {
          this.logError(res.statusCode, data);
          if (res.statusCode === 401) {
            console.error('💡 Check your username and password in .env');
          }
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ Request error:', e.message);
      if (e.code === 'ECONNREFUSED') {
        console.error('💡 Make sure your Screeps server is running');
      }
    });

    req.write(postData);
    req.end();
  }
}

// Create unified config with server-agnostic variable names
function createConfig() {
  // Server-agnostic configuration
  const config = {
    host: process.env.SCREEPS_HOST,
    port: parseInt(process.env.SCREEPS_PORT),
    username: process.env.SCREEPS_USERNAME,
    password: process.env.SCREEPS_PASSWORD,
    branch: process.env.SCREEPS_BRANCH,
    dryRun: process.env.SCREEPS_DRY_RUN === 'true'
  };

  // Validate required fields
  if (!config.host) {
    console.error('Error: SCREEPS_HOST environment variable is required');
    process.exit(1);
  }
  if (!config.port) {
    console.error('Error: SCREEPS_PORT environment variable is required');
    process.exit(1);
  }
  if (!config.username) {
    console.error('Error: SCREEPS_USERNAME environment variable is required');
    process.exit(1);
  }
  if (!config.password) {
    console.error('Error: SCREEPS_PASSWORD environment variable is required');
    process.exit(1);
  }

  return config;
}

// Run deployment
const config = createConfig();
const deployer = new ScreepsDeployer(config);
deployer.deploy();
