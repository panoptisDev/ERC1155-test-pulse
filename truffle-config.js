/**
 * 
 * yarn add truffle-plugin-verify
 * yarn add dotenv
 * yarn add @truffle/hdwallet-provider
* 
 * https://trufflesuite.com/docs/truffle/getting-started/using-the-truffle-dashboard/
 */

require("dotenv").config();
const { MNEMONIC, PROJECT_ID, INFURA_WS } = process.env;

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {

  plugins: ["truffle-plugin-verify"],
  
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a managed Ganache instance for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache, geth, or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },

    // An additional network, but with some advanced options…
    // advanced: {
    //   port: 8777,             // Custom port
    //   network_id: 1342,       // Custom network
    //   gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    //   gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    //   from: <address>,        // Account to send transactions from (default: accounts[0])
    //   websocket: true         // Enable EventEmitter interface for web3 (default: false)
    // },
    //
    // Useful for deploying to a public network.
    // Note: It's important to wrap the provider as a function to ensure truffle uses a new provider every time.
    goerli: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_WS),
      network_id: 5, // Goerli's id
      confirmations: 2, // # of confirmations to wait between deployments. (default: 0)
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    ire: {
      provider: () => new HDWalletProvider(MNEMONIC, "https://rpc-testnet.5ire.network"),
      network_id: 997, // Goerli's id
      confirmations: 1, // # of confirmations to wait between deployments. (default: 0)
      networkCheckTimeout: 1000000,
      timeoutBlocks: 20000, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    pulse: {
      provider: () => new HDWalletProvider(MNEMONIC, "wss://rpc.v4.testnet.pulsechain.com"),
      network_id: 943,
      gas: 30000000,           // Gas sent with each transaction (default: ~6700000)
      gasPrice: 20000000000,
      confirmations: 2, // # of confirmations to wait between deployments. (default: 0)
      networkCheckTimeout: 10000,
      timeoutBlocks: 900, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    shimmer: {
      provider: () => new HDWalletProvider(MNEMONIC, "https://json-rpc.evm.testnet.shimmer.network/"),
      network_id: 1071, // Goerli's id
      confirmations: 10, // # of confirmations to wait between deployments. (default: 0)
      networkCheckTimeout: 1000000,
      timeoutBlocks: 2000000, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    linea: {
      provider: () => new HDWalletProvider(MNEMONIC, "https://rpc.goerli.linea.build/"),
      network_id: 59140, // Goerli's id https://goerli.gateway.metisdevops.link
      confirmations: 10, // # of confirmations to wait between deployments. (default: 0)
      networkCheckTimeout: 1000000,
      timeoutBlocks: 20000, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    metis: {
      provider: () => new HDWalletProvider(MNEMONIC, "https://goerli.gateway.metisdevops.link"),
      network_id: 599, // Goerli's id https://goerli.gateway.metisdevops.link
      confirmations: 1, // # of confirmations to wait between deployments. (default: 0)
      networkCheckTimeout: 1000000,
      timeoutBlocks: 20000, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    mantle: {
      provider: () => new HDWalletProvider(MNEMONIC, "https://rpc.testnet.mantle.xyz"),
      network_id: 5001, // Goerli's id https://goerli.gateway.metisdevops.link
      confirmations: 3, // # of confirmations to wait between deployments. (default: 0)
      networkCheckTimeout: 1000000,
      timeoutBlocks: 20000, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    // truffle migrate --reset --network ire
    // truffle migrate --reset --network metis
    // truffle migrate --reset --network pulse
    // truffle migrate --reset --network shimmer
    // truffle migrate --reset --network linea
    // truffle migrate --reset --network mantle

  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },
  verify: {
    apiUrl: "https://explorer.goerli.linea.build/api",
    apiKey: process.env.ETHERSCAN_API_KEY,
    explorerUrl: "https://explorer.goerli.linea.build/",
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17", // Fetch exact version from solc-bin (default: truffle's version)
       docker: false,        // Use "0.5.1" you've installed locally with docker (default: false)
       settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      //  evmVersion: "byzantium"
       }
    },
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows:
  // $ truffle migrate --reset --compile-all
  //
  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "sqlite",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // }
};
