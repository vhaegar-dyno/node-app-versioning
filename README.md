# SOLAR-LOGIQ-BACKEND-V3

# Required Versions

Node.js >= 20.x
Docker >= 27.x

# 🚀 Project Setup

## 📥 Clone the Repository

- git clone https://github.com/Holmium-Technologies18/Solar-LogIQ-Backend-V3.git
- cd Solar-LogIQ-Backend-V3

## 📦 Install Dependencies

After cloning the repository, install all required dependencies:

- npm install

## 📑 Copy Environment Variables

Before starting the server, copy the example environment file:

- npm run copy-env:dev

## 🛠️ Update .env File

Open the .env.development file and update the necessary configurations like database credentials, API keys, and other environment variables.

## 🚀 Start with npm (Development Mode)

- npm run start:dev

## 🐳 Start with Docker

If you are using Docker, start the server with:

- docker-compose up -d

### for first time only or after adding new package

- docker-compose up -d --build

# Stop Docker Services

docker-compose down

# Restart Docker Services

docker-compose up -d --build

# Basic Project Structure

├── node_modules
├── .husky # Git hooks (Husky)
├── src/ # Application source code
├── .env.example # Environment config template
├── docker-compose.yml # Docker services
├── package.json # Dependencies & scripts
├── README.md # Project Documentation
