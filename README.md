# Screeps Controller

A controller for managing Screeps game automation and scripts.

## Description

This project provides tools and scripts for controlling and automating gameplay in Screeps, the JavaScript MMO game. It includes a local development server and automated deployment system.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js and npm
- Screeps account and API token

### Setup

1. Clone the repository
2. Run the setup command:
   ```bash
   make setup
   ```
3. Edit the `.env` file with your configuration:
   - `STEAM_KEY`: Your Steam API key (for local server)
   - `SCREEPS_TOKEN`: Your Screeps API token (get from https://screeps.com/a/#!/account/auth-tokens)
   - `SCREEPS_BRANCH`: Target branch (default: "default")
   - `SCREEPS_PTR`: Set to "true" for PTR server
   - `SCREEPS_DRY_RUN`: Set to "true" to test deployment without actually uploading

### Development

Start the local Screeps server:
```bash
make up
```

Open browser to http://localhost:21025/

### Building and Deploying

Build your code:
```bash
make build
```

Deploy to **official Screeps server** (screeps.com):
```bash
make deploy
```

Deploy to **local Screeps server** (localhost):
```bash
make deploy-local
```

Test deployment (dry run):
```bash
# Test official server deployment
SCREEPS_DRY_RUN=true make deploy

# Test local server deployment
SCREEPS_LOCAL_DRY_RUN=true make deploy-local
```

### Environment Configuration

The deployment script uses **server-agnostic variable names** that work for both local and remote servers:

**Required variables:**
- `SCREEPS_HOST` - Server hostname (e.g., localhost, screeps.com)
- `SCREEPS_PORT` - Server port (e.g., 21025, 443)
- `SCREEPS_USERNAME` - Your username/email
- `SCREEPS_PASSWORD` - Your password
- `SCREEPS_BRANCH` - Target branch

**Optional variables:**
- `SCREEPS_DRY_RUN` - Set to "true" for dry run

**Deployment target:**
- `SCREEPS_TARGET=local` - Deploy to local server
- No `SCREEPS_TARGET` - Deploy to remote server (screeps.com)

For development with auto-rebuild:
```bash
make watch
```

### Available Commands

- `make setup` - Initial setup and dependency installation
- `make up` - Start local Screeps server
- `make down` - Stop local Screeps server
- `make build` - Build production code
- `make build:dev` - Build development code
- `make watch` - Watch mode for development
- `make deploy` - Deploy to official Screeps server
- `make deploy:dev` - Deploy development build to official server
- `make deploy-local` - Deploy to local Screeps server
- `make deploy-local-dev` - Deploy development build to local server
- `make logs` - View server logs
- `make restart` - Restart server
- `make clean` - Clean build artifacts

## Project Structure

```
src/
├── engine/
│   └── main.js          # Main game loop
└── controller/
    └── creep.js         # Creep behavior controller
```

## License

MIT
