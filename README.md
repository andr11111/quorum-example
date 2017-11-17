# quorum-example
This is a simplistic application demonstrating how Quorum can be used to privately share trades data among Hedge Fund, Custodian and Hedge Fund's clients.

# Instructions
1. Launch [Quorum](https://github.com/jpmorganchase/quorum#quickstart) nodes. Enable RPC access and set `--rpccorsdomain` to either \"\*\" or your domain.
2. Edit `src/config.js`, paste node RPC URLs and corresponding public keys.
3. NPM install and start:
```
npm install
npm start
```
4. Press Deploy Contract to deploy the private smart contract on the blockchain.
5. Now you can report trades. Custodian sees all trades. Clients see only their trades. All data is encrypted.
