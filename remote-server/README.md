# Screeps Server Ansible Deployment

This directory contains Ansible playbooks and roles for deploying a Screeps server to a remote host.

## Prerequisites

- Ansible installed on your local machine
- SSH access to the remote server
- Ubuntu/Debian-based server (tested with Ubuntu 20.04+)

## Configuration

1. **Update inventory.yml** with your server details:
   ```yaml
   screeps-server:
     ansible_host: YOUR_SERVER_IP
     ansible_user: root
     # ansible_ssh_private_key_file: ~/.ssh/id_rsa
     # ansible_password: YOUR_PASSWORD
   ```

2. **Configure variables** in `roles/screeps/defaults/main.yml`:
   - `steam_key`: Your Steam API key
   - `server_password`: Server password
   - `server_tick_rate`: Tick rate in milliseconds (default: 1000)

3. **Create .env file** (optional) with environment variables:
   ```
   STEAM_KEY=your_steam_key_here
   SERVER_PASSWORD=your_server_password
   ```

## Deployment

### Initial deployment:
```bash
cd remote-server
ansible-playbook deploy.yml
```

### Update configuration:
```bash
ansible-playbook deploy.yml --tags "deploy"
```

### Check server status:
```bash
ansible-playbook deploy.yml --tags "status"
```

## What gets deployed

- Docker and Docker Compose
- Screeps server with all required services (MongoDB, Redis)
- Firewall configuration
- System user and directory structure
- Environment configuration

## Access

After deployment, your Screeps server will be available at:
- `http://YOUR_SERVER_IP:21025`

## Troubleshooting

- Check logs: `ansible-playbook deploy.yml --tags "logs"`
- Restart services: `ansible-playbook deploy.yml --tags "restart"`
- Verify connectivity: `ansible-playbook deploy.yml --tags "verify"`
