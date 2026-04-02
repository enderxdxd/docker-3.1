#!/bin/bash

# EC2 Setup Script for Docker Deployment
# Run this script on your Ubuntu EC2 instance after first login

echo "=========================================="
echo "EC2 Docker Setup Script"
echo "=========================================="
echo ""

# Update system packages
echo "Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo ""
echo "Step 2: Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Add ubuntu user to docker group
echo ""
echo "Step 3: Adding ubuntu user to docker group..."
sudo usermod -aG docker ubuntu

# Enable and start Docker service
echo ""
echo "Step 4: Enabling Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

# Install Docker Compose (optional but useful)
echo ""
echo "Step 5: Installing Docker Compose..."
sudo apt install docker-compose -y

# Verify installation
echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "Docker version:"
docker --version

echo ""
echo "⚠️  IMPORTANT: You must log out and log back in for group changes to take effect!"
echo ""
echo "After reconnecting, verify Docker works by running:"
echo "  docker run hello-world"
echo ""
echo "Next steps:"
echo "1. Exit this SSH session: exit"
echo "2. Reconnect to EC2"
echo "3. Configure GitHub Secrets in your repository"
echo "4. Push to main branch to trigger deployment"
echo ""
