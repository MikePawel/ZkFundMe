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

  const [walletConnected, setWalletConnected]= useState(false)

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
        const campaign = {
          id: id,
          title: campaignData[2],
          description: campaignData[3],
          wallet: campaignData[4],
          ipfs: campaignData[5],
        }
        setCampaign(campaign);
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
      .then((transaction: any) => {
        console.log(transaction);
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
      {/* <div>
        <h1>{campaign.title}</h1>
        <p>{campaign.description}</p>
        {campaign.ipfs && <img width={"250px"} src={`https://skywalker.infura-ipfs.io/ipfs/${campaign.ipfs}`} alt={campaign.title} />}
        <input type='text' placeholder='Enter Amount in BOB' value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
        <button onClick={pay}> Pay {payAmount} BOB with zero knowledge! </button>
        {error && (
          <div onClick={() => setError(false)}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div> */}

      <div className="backgroundContainer ">
        {/* Connect Wallet button */}
        <ul className="navbar">
          <li className="connect-wallet">
            <div onClick={() =>setWalletConnected(true)}>
            <Connect_Metamask />
            </div>
          </li>
        </ul>

        {campaign.ipfs && <img className="img-container" width={"250px"} src={`https://skywalker.infura-ipfs.io/ipfs/${campaign.ipfs}`} alt={campaign.title} />}
        {/* {campaign.ipfs && <img width={"400px"} src={`https://skywalker.infura-ipfs.io/ipfs/${campaign.ipfs}`} alt={campaign.title} />} */}

        <h1 className="title">{campaign.title}</h1>


        {/* <hr className="total-sum-bar" />
        TOTAL SUM */}

        <input type='text' placeholder='Enter Amount in BOB' value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />

        {Number(payAmount) > 0 && <h3> If you want to donate {payAmount} BOB with zero knowledge click on DONATE </h3>}
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
        <div>
          <Link to="/Home">
            <button className='bottomButton leftButton'>
              Back
            </button>
          </Link>
          <button onClick={pay} className="bottomButton rightButton">DONATE</button>
        </div>
        {!walletConnected && 
        <p>Please connect your wallet to start donation!</p>}
      </div>
    </>
  );
}
