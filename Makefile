.PHONY: up down build build-dev deploy deploy-dev deploy-local deploy-local-dev install clean setup watch logs restart type-check type-check-watch

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

type-check:
	npm run type-check

type-check-watch:
	npm run type-check:watch

deploy:
	npm run deploy

deploy-dev:
	npm run deploy:dev

deploy-local:
	npm run deploy:local

deploy-local-dev:
	npm run deploy:local:dev

# Remote server management
deploy-remote:
	cd remote-server && ansible-playbook deploy.yml

update-remote:
	cd remote-server && ansible-playbook update.yml

restart-remote:
	cd remote-server && ansible-playbook update.yml --tags "restart"

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
