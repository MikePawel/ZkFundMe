# ZkFundMe - ETHGlobal Paris Hackathon 2023 

### Winning project of:
- 1st price: 🥇 zkBob — Best Use
- 2nd price: 🥈 Polygon — Best Public Good with Account Abstraction 
- Worldcoin — Pool Prize

[Linkt to submission.](https://ethglobal.com/showcase/zkfundme-amwst)


##  Short introduction

ZkFundMe is a zero-knowledge based donation Platform for every use case. Everyone can upload their crisis and unfortunate events to ask for help from the decentralized community.

## Description

This project allows every person to create a donation campaign. After verifying that you are a real person, upload a picture showing your crisis or problem. Add a title and description to it. After campaign creation, all data will be stored in a decentralized manner on the blockchain. Do not worry about paying gas fees, since a paymaster will take care of that. The campaign creator is done at this point. On the homepage, anyone can view the posted campaigns, view them in detail, and donate any amount via zero-knowledge proof. In this manner, the donator stays private, and the issuer gets funded. 

## How its made

Deployed on Polygon Mainnet

Creating a campaign: 
1. Verifying that you are a real human: Worldcoin On-Chain Verification (after connecting to MetaMask). The On-Chain implementation only allows people who scanned their irises through the orb. All data is verified via zero-knowledge on the blockchain. Further, this implementation prevents bots to create random campaigns.
2. Upload picture to IPFS: upload the campaign picture to a distributed system. This procedure secures the picture data so that its authenticity can be verified. Especially, when it comes to real problems and crises, the fabrication protection allows for data to stay authentic.
3. Storing all data in smart contract: The link to IPFS as well as the title, description and zkAddress is stored on a smart contract on the Polygon main net. It's low gas fees and second layer security from Ethereum provide optimal conditions for this prototype.
3.1. zkBOB account for zero-knowledge transactions: a zkAccount has to be added to the contract so that people who are willing to donate can do so by funding the zkAccount address (paying through zkBOB direct deposit will be explained later)
4. Paymaster for gasless transaction: If the user wants to create a transaction, everything one has to do is to click the "Create Campaign" button. A paymaster will send the transaction by paying the gas fees. This integration allows for easier human machine interaction and will not create costs for the user.

Donating:
5: Donating through zero-knowledge proofs (zkBOB direct deposit): the user who created a campaign can be funded through zkBOBs direct deposit. A campaign contains a zkAccount address. Through a different smart contract, the donation transfer will be assured through the direct deposit functionality from zkBOB (transactions are signed through MetaMask).
The supported coin is USDC. The money from the zkAccount can be drained through zero-knowledge proofs by the campaign creator.

## How to deploy and run locally

- Clone the repo
- Add a .env file with the content (these parameters are mandatory):

```
VITE_IPFS_PROJECT_ID=""
VITE_IPFS_PROJECT_KEY=""

# blockchain wld app id:
VITE_PUBLIC_WLD_APP_ID=""
VITE_PUBLIC_WLD_ACTION_NAME=""
VITE_PUBLIC_WLD_API_BASE_URL="https://developer.worldcoin.org"

# private key
VITE_PRIVATE_KEY = ""
```

- Create an Infura API key and add it to VITE_IPFS_PROJECT_ID and VITE_IPFS_PROJECT_KEY for the IPFS picture upload
- Follow the [Worldcoin docs](https://docs.worldcoin.org/) and add the credentials
- Add the private key of the paymaster that handles the gas less fees

After everythin is done run this command:

```
  npm i
  npm run dev
  ```

The demo video can be found [here](https://youtu.be/4d3CB1FAK2M).
