ifeq (,$(wildcard .env))
$(shell cp .env.example .env)
endif

include .env
# include *.mk

devup:
	docker compose up -d --remove-orphans

devinstall:
	@test -f web/.env || cp web/.env.example web/.env
	@test -f api/.env || cp api/.env.example api/.env
	@docker exec -it $(COMPOSE_PROJECT_NAME)-web-1 yarn

devrun:
	@docker exec -d ${COMPOSE_PROJECT_NAME}-api-1 uv run fastapi dev
	@docker exec -it $(COMPOSE_PROJECT_NAME)-web-1 yarn dev

devdown:
	docker compose down --remove-orphans
