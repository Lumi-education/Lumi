BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
VERSION = $(shell git describe)

build:
	npm run clean
	npm run build:client
	docker build -t jpschellenberg/lumi_user:${BRANCH} .

release:
	lumi-release prerelease ${BRANCH}
	git branch release/$(shell git describe)
	make build
	docker push jpschellenberg/lumi_user:${BRANCH}

.PHONY: build release