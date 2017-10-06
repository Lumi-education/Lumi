BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
VERSION = $(shell git describe)

build:
	npm run clean
	npm run build:prod
	docker build -t jpschellenberg/lumi_user:${BRANCH} .

release:
	make build
	git branch release/${VERSION}
	docker push jpschellenberg/lumi_user:${BRANCH}

.PHONY: build release