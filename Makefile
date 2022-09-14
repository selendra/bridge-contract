

fetch-contracts:
	@echo "solidity-contract contracts... \033[0m "

compile:
	cd solidity-contract && yarn && npx truffle compile

install: fetch-contracts compile
	@echo " > \033[32mInstalling bridge-cli... \033[0m "
