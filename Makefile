.PHONY: dev web

.DEFAULT_GOAL := dev

dev:
	@bun run dev

web:
	@bun run dev:web
