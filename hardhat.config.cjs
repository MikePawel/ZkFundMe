require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");

INFURA_API_KEY_MUMBAI = "https://polygon-mumbai.infura.io/v3/a146daf63d93490995823f0910f50118"
INFURA_API_KEY_SEPOLIA = "https://sepolia.infura.io/v3/a146daf63d93490995823f0910f50118"
INFURA_API_KEY_CELO = "https://celo-alfajores.infura.io/v3/a146daf63d93490995823f0910f50118"

PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;

ETHERSCAN_API_KEY_MUMBAI = "3EPPM9AX5SW9JXPXRC5X11KRQTJTH8MQIH"
ETHERSCAN_API_KEY_SEPOLIA = "2VJIK89PPWWYH129PG45A7BU7KXN9M8E6Q" 
ETHERSCAN_API_KEY_CELO = "ARDSHIRMM8ITFB2CPNGS3ASEDHHPWF4B71"

module.exports = {
  solidity: "0.8.6",
  networks: {
    mumbai: {
      url: `${INFURA_API_KEY_MUMBAI}`,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: `${INFURA_API_KEY_SEPOLIA}`,
      accounts: [PRIVATE_KEY],
    },
    celo: {
      url: `${INFURA_API_KEY_CELO}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
      apiKey: ETHERSCAN_API_KEY_MUMBAI,
  },
};
