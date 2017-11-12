BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
VERSION = $(shell git describe)

build:
	docker build -t lumieducation/lumi:${BRANCH} .

release:
	lumi-release prerelease ${BRANCH}
	make build
	docker push lumieducation/lumi:${BRANCH}

.PHONY: build release