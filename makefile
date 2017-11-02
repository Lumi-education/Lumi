BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
VERSION = $(shell git describe)

build:
	npm run clean
	npm run build:client
	docker build -t lumieducation/user:${BRANCH} .

release:
	lumi-release prerelease ${BRANCH}
	make build
	docker push lumieducation/user:${BRANCH}

.PHONY: build release