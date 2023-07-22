import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import { getDirectPaymentContract, getCampaignContract } from './contractDetails'
import { formatBalance, formatChainAsNum } from '../utils/index'
import './CampagneList.css'
import { Link, useParams, useSearchParams } from 'react-router-dom';
import './CampagneDetails.css'
import Connect_Metamask from '../components/Connect_Metamask';

export default function CampagneDetails() {

  const { id } = useParams<{ id: string }>();
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [wallet, setWallet] = useState({ accounts: [], balance: "", chainId: "" });
  const [error, setError] = useState(null);
  const [contract, setContract] = useState<any>(null);
  const [campaignContract, setCampaignContract] = useState<any>(null);
  const [campaign, setCampaign] = useState<any>(null);
  const [payAmount, setPayAmount] = useState("0")
  const [campaignBalance, setCampaignBalance] = useState("0");

  const [walletConnected, setWalletConnected]= useState(false)
  const YOUR_PRIVATE_KEY = "0x9aaf5e7e110837e3ecb7c07428ba91c5d5a485eaf625d8289a30110b051f3f51";

  useEffect(() => {
    const getProvider = async () => {
      try {
        const provider = await detectEthereumProvider();
        if (!provider) {
          throw new Error("Please install MetaMask to use this application.");
        }
        setHasProvider(Boolean(provider));
        setContract(getDirectPaymentContract(provider));
      } catch (error) {
        console.error(error);
        setHasProvider(false);
        setError(error.message);
      }
    }
    getProvider();
  }, []);

  useEffect(() => {
    const contract = getCampaignContract();
    setCampaignContract(contract);
  }, []);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignData = await campaignContract.getCampaign(Number(id));
        const balance = await campaignContract.balance(Number(id));
        const campaign = {
          id: id,
          title: campaignData[2],
          description: campaignData[3],
          wallet: campaignData[4],
          ipfs: campaignData[5],
        }
        setCampaign(campaign);
        setCampaignBalance(ethers.utils.formatEther(balance.toString()));
      } catch (err) {
        console.error(err);
      }
    };

    if (campaignContract) {
      fetchCampaign();
    }
  }, [campaignContract, id]);

  const pay = async () => {
    let amount = ethers.utils.parseEther(payAmount);
    let signer = contract.provider.getSigner();
    let contractWithSigner = contract.connect(signer);
  
    contractWithSigner.tryPool(amount, campaign.wallet)
      .then(async (transaction: any) => {
        console.log(transaction);
  
        // Wait for the transaction to be mined
        let receipt = await transaction.wait();
        console.log('receipt: ', receipt);
  
        // Now we're gonna call updateAmount with your private key
        const yourWallet = new ethers.Wallet(YOUR_PRIVATE_KEY, contract.provider);
        const campaignContractWithYourWallet = campaignContract.connect(yourWallet);
        transaction = await campaignContractWithYourWallet.updateAmount(Number(id), amount);
        receipt = await transaction.wait();
        console.log('transaction hash for updateAmount: ', transaction.hash);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  if (hasProvider === false) {
    return <div>{error}</div>;
  }

  if (hasProvider === null) {
    return <div>Checking for MetaMask...</div>;
  }

  if (!campaign) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="backgroundContainer">
        <div className="squareContainer">
        <ul className="navbar">
          <li className="connect-wallet">
            <div onClick={() =>setWalletConnected(true)}>
              <Connect_Metamask />
            </div>
          </li>
        </ul>

        {campaign.ipfs && <img className="img-container" width={"250px"} src={`https://skywalker.infura-ipfs.io/ipfs/${campaign.ipfs}`} alt={campaign.title} />}
        <h1 className="title">{campaign.title}</h1>

        <h2>Total Donated: {campaignBalance} BOB</h2>

        <input type='text' placeholder='Enter Amount in BOB' value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />

        {Number(payAmount) > 0 && <h3 className="donationNote"> Join the Giving Movement: Click DONATE to Contribute {payAmount} BOB. </h3>}
        {error && (
          <div onClick={() => setError(false)}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div>
          <p className="descriptionText">
            {campaign.description}
          </p>
        </div>
          <div className="buttons">
          <Link to="/Home">
            <button className='backButton'>
              Back
            </button>
          </Link>
          <button onClick={pay} className="donateButton">DONATE</button>
        </div>
        {!walletConnected && 
        <p>Please connect your wallet to start donation!</p>}
      </div>
      </div>
    </>
  );
}
