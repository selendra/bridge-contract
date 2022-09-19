

fetch-bridge:
	git clone https://github.com/selendra/selendra-bridge.git && cd selendra-bridge && make install

compile:
	cd solidity-contract && yarn && npx truffle compile

install: fetch-bridge compile
	@echo " > \033[32mInstalling bridge-cli... \033[0m "
