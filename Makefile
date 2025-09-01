.PHONY: up down build build-dev deploy deploy-dev deploy-local deploy-local-dev install clean setup watch logs restart

# Server management
up:
	docker compose -f launcher/docker-compose.yaml --env-file .env up -d

down:
	docker compose -f launcher/docker-compose.yaml --env-file .env down

logs:
	docker compose -f launcher/docker-compose.yaml --env-file .env logs -f screeps

restart:
	docker compose -f launcher/docker-compose.yaml --env-file .env restart screeps

# Development and deployment
install:
	npm install

build:
	npm run build

build-dev:
	npm run build:dev

watch:
	npm run watch

deploy:
	npm run deploy

deploy-dev:
	npm run deploy:dev

deploy-local:
	npm run deploy:local

deploy-local-dev:
	npm run deploy:local:dev

clean:
	rm -rf dist/
	rm -rf node_modules/

# Setup commands
setup: install
	@echo "Setting up Screeps Controller..."
	@if [ ! -f .env ]; then \
		echo "Creating .env file from template..."; \
		cp .env.example .env; \
		echo "Please edit .env file with your configuration"; \
	fi
