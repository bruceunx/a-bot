.PHONY: dev web

.DEFAULT_GOAL := web

dev:
	@bun run dev

web:
	@bun run dev:web
