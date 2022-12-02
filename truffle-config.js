
const HDWalletProvider = require('@truffle/hdwallet-provider');

const projectId = 'b6045162b73f4e31be69c32a52d24dfc'



const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim()

module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "*" ,// Match any network id

		},
		sepolia: {
			provider: () => new HDWalletProvider(privateKey, `https://sepolia.infura.io/v3/${projectId}`),
			network_id: 11155111
		  },
	},

	contracts_directory: './src/contracts/',
	contracts_build_directory: './src/abis/',

	compilers: {
		solc: {
			version: '0.8.9',
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	}
}