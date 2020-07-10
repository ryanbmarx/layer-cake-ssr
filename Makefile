# this runs in jenkins

install:
	npm ci

build:
	npm run build

publish:
	gulp data
	npm run build
	find public/* -type f | xargs -P 8 -I {} ../scripts/publish.js {} | xargs -P 8 -I {} ../scripts/purge.js {}

