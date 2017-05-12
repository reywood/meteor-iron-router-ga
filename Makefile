ESLINT := node_modules/.bin/eslint

.PHONY: lint

lint: $(ESLINT)
	node_modules/.bin/eslint package.js lib/

$(ESLINT):
	npm install
