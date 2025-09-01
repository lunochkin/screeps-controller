.PHONY: up down

up:
	docker compose -f launcher/docker-compose.yaml --env-file .env up -d

down:
	docker compose -f launcher/docker-compose.yaml --env-file .env down

logs:
	docker compose -f launcher/docker-compose.yaml --env-file .env logs -f screeps

restart:
	docker compose -f launcher/docker-compose.yaml --env-file .env restart screeps
