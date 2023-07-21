import { Link } from 'react-router-dom';
import './Home.css'
import { Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import { getDirectPaymentContract, getCampaignContract } from './contractDetails'
import { formatBalance, formatChainAsNum } from '../utils/index'


export default function Home() {

    const [hasProvider, setHasProvider] = useState<boolean | null>(null);
    const initialState = { accounts: [], balance: "", chainId: "" };
    const [wallet, setWallet] = useState(initialState);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [contract, setContract] = useState<any>(null);  // initialize contract state
    const [campaignContract, setCampaignContract] = useState<any>(null); // initialize campaign contract state
    const [campaigns, setCampaigns] = useState<any[]>([]); // initialize campaigns state
    const [payAmount, setPayAmount] = useState("")


    useEffect(() => {
        const getProvider = async () => {
            try {
                const provider = await detectEthereumProvider({ silent: true });
                setHasProvider(Boolean(provider));
                if (!provider) {
                    throw new Error("Please install MetaMask and open this page in a compatible browser.");
                }
                // Only initialize the contract if the provider is available
                setContract(getDirectPaymentContract());
            } catch (err) {
                console.error(err);
                setHasProvider(false);
                setError(err.message);
            }
        }
        getProvider();
    }, []);

    useEffect(() => {
        const contract = getCampaignContract();
        setCampaignContract(contract);
    }, []);

    const fetchCampaigns = async () => {
        try {
            const campaignsCount = await campaignContract.campaignCount();
            const campaignPromises = Array(campaignsCount.toNumber()).fill(null).map((_, idx) => {
                return campaignContract.getCampaign(idx + 1);
            });

            const campaignData = await Promise.all(campaignPromises);
            const campaigns = campaignData.map((campaign, idx) => ({
                id: (idx + 1).toString(),
                title: campaign[2],
                description: campaign[3],
                wallet: campaign[4], // get wallet from the campaign data
                ipfs: campaign[5]    // get IPFS link from the campaign data
            }));

            setCampaigns(campaigns);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (campaignContract) {
            fetchCampaigns();
        }
    }, [campaignContract]);

    if (hasProvider === false) {
        return <div>{error}</div>;
    }

    // If provider is still being detected, show a loading message
    if (hasProvider === null) {
        return <div>Checking for MetaMask...</div>;
    }

    const updateWallet = async (accounts: any) => {
        if (accounts.length > 0) {
            const balance = formatBalance(await window.ethereum!.request({
                method: "eth_getBalance",
                params: [accounts[0], "latest"],
            }))
            const chainId = await window.ethereum!.request({ method: "eth_chainId" })
            setWallet({ accounts, balance, chainId })
        } else {
            setWallet(initialState)
        }
    }

    const handleConnect = async () => {
        setIsConnecting(true)
        await window.ethereum.request({
            method: "eth_requestAccounts",
        })
            .then((accounts: []) => {
                setError(false)
                updateWallet(accounts)
            })
            .catch((err: any) => {
                setError(true)
                console.error(err);
            })
        setIsConnecting(false)
    }

    const disableConnect = Boolean(wallet.accounts?.length > 0) && isConnecting

    const pay = (campaignId: number, zkAddress: string) => {
        let amount = ethers.utils.parseEther(payAmount);
        let signer = contract.provider.getSigner();
        let contractWithSigner = contract.connect(signer);

        // Add a call to the contract to pay for a specific campaign
        contractWithSigner.tryPool(amount, zkAddress)
            .then((transaction: any) => {
                console.log(transaction);
            })
            .catch((error: any) => {
                console.log(error);
            });

        console.log(`Payment sent for campaign ${campaignId}!`)
    }


    const handleButtonClick = () => {
        console.log('Button clicked!');
    };
    return (
        <>
            <nav className="navigation">
                {/* Add your navigation links here */}
            </nav>
            <main className="content">
                {/* <img src="src/assets/logo.png" alt="Logo" className="logo" /> */}

                <Link to="/Create">
                    <button className="button" onClick={handleButtonClick}>
                        Start Your Own Campaign
                    </button>
                </Link>

                {/* <div >
      <h1>CampaignList</h1>

      <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div>

      {window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&
        <button disabled={disableConnect} onClick={handleConnect}>Connect MetaMask</button>
      }

      {wallet.accounts.length > 0 &&
        <>
          <div>Wallet Accounts: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div>
          <div>Hex ChainId: {wallet.chainId}</div>

          <button onClick={pay}> Pay with zero knowledge! </button>
        </>
      } */}
                <section className="slider">
                    {campaigns.slice().reverse().map(campaign => (
                        <div key={campaign.id}>

                            <Link to={`/Details/${campaign.id}`}>
                                <div className="container">
                                    <h2>{campaign.title}</h2>
                                    {/* <p>{campaign.description}</p> */}
                                    {campaign.ipfs &&
                                        <div className="image-container">
                                            <img
                                                src={`https://skywalker.infura-ipfs.io/ipfs/${campaign.ipfs}`}
                                                alt={campaign.title}
                                            />
                                        </div>
                                    }
                                </div>

                            </Link>
                        </div>
                    ))}
                </section>
                {error && (
                    <div onClick={() => setError(false)}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

            </main >
        </>
    );
}
