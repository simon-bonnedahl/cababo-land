<<<<<<< HEAD
=======
const HDWalletProvider = require('@truffle/hdwallet-provider');

const projectId = 'b6045162b73f4e31be69c32a52d24dfc'

const fs = require('fs');




>>>>>>> efeeae0 (interface updates)
module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "*" ,// Match any network id
<<<<<<< HEAD
		}
=======
		},
		ropsten: {
			provider: () => new HDWalletProvider(fs.readFileSync(".secret").toString().trim(), `https://ropsten.infura.io/v3/${projectId}`),
			network_id: 3,       // Ropsten's id
			gas: 30000000,        // Ropsten has a lower block limit than mainnet
			confirmations: 2,    // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
		  },
>>>>>>> 1ba8dba (Ropsten deployment)
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