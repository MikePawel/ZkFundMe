import { ethers } from 'ethers';

// Replace the below values with your actual contract details
const campaignContract = "0xEcE455996D1AD98f78874270cAaAfAAE6EfD715b";
const campaignContractABI = [{"inputs":[],"name":"campaignCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"campaigns","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"wallet","type":"string"},{"internalType":"string","name":"ipfs","type":"string"},{"internalType":"uint256","name":"money","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"string","name":"_wallet","type":"string"},{"internalType":"string","name":"_ipfs","type":"string"},{"internalType":"uint256","name":"_money","type":"uint256"}],"name":"createCampaign","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_campaignId","type":"uint256"}],"name":"getCampaign","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

// Expose a function to get the contract instance
export function getCampaignContract() {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let contract = new ethers.Contract(campaignContract, campaignContractABI, provider);
  return contract;
}


// Replace the below values with your actual contract details
const directPaymentContract = "0x5Ce25C21eCEd0f75909B60275b61230EEC3096Aa";
const directPaymentContractABI = [{"cinputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"Received","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"bob","outputs":[{"internalType":"contract IERC677","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"string","name":"_zkAddress","type":"string"}],"name":"directDeposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fallbackReceiver","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"string","name":"_address","type":"string"}],"name":"tryPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"string","name":"_address","type":"string"}],"name":"tryPool2","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// Expose a function to get the contract instance
export function getDirectPaymentContract() {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let contract = new ethers.Contract(directPaymentContract, directPaymentContractABI, provider);
  return contract;
}