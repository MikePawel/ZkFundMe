import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';
import { CredentialType, IDKitWidget, ISuccessResult, solidityEncode } from "@worldcoin/idkit";
import { getCampaignContract } from './ContractDetails';
import Picture_Upload from '../components/Picture_Upload';
import './CampagneCreate.css';
import axios from 'axios';
import { Link, useParams, useSearchParams } from 'react-router-dom';
// import { IDKitWidget, solidityEncode } from '@worldcoin/idkit' 
// import Connect_Metamask from '../components/Connect_Metamask';
import { useEffect } from 'react'
import { formatBalance, formatChainAsNum } from './../utils'
import detectEthereumProvider from '@metamask/detect-provider'
import { decodeAbiParameters } from 'viem'

export default function CampagneCreate() {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const initialState = { accounts: [], balance: "", chainId: "" }
  const [wallet, setWallet] = useState(initialState)

  const [isConnecting, setIsConnecting] = useState(false)  /* New */
  const [error, setError] = useState(false)                /* New */
  const [errorMessage, setErrorMessage] = useState("")     /* New */




  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts)
      } else {
        // if length 0, user is disconnected
        setWallet(initialState)
      }
    }

    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId }))
    }

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      setHasProvider(Boolean(provider))

      if (provider) {
        const accounts = await window.ethereum.request(
          { method: 'eth_accounts' }
        )
        refreshAccounts(accounts)
        window.ethereum.on('accountsChanged', refreshAccounts)
        window.ethereum.on("chainChanged", refreshChain)
      }
    }

    getProvider()

    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
      window.ethereum?.removeListener("chainChanged", refreshChain)
    }
  }, [])

  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(await window.ethereum!.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    }))
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    })
    setWallet({ accounts, balance, chainId })
  }

  const handleConnect = async () => {                   /* Updated */
    setIsConnecting(true)                               /* New */
    await window.ethereum.request({                     /* Updated */
      method: "eth_requestAccounts",
    })
      .then((accounts: []) => {                            /* New */
        setError(false)                                   /* New */
        updateWallet(accounts)                            /* New */
      })                                                  /* New */
      .catch((err: any) => {                               /* New */
        setError(true)                                    /* New */
        setErrorMessage(err.message)                      /* New */
      })                                                  /* New */
    setIsConnecting(false)                              /* New */
  }

  const formatString = (inputString: string): string => {
    if (inputString.length <= 8) {
      return inputString;
    } else {
      const firstThree = inputString.slice(0, 4);
      const lastThree = inputString.slice(-4);
      return `${firstThree}...${lastThree}`;
    }
  };

  const disableConnect = Boolean(wallet) && isConnecting




  // const { address } = useAddress() 
  const [authenticated, setAuthenticated] = useState(false);
  const openIDKit = useRef<Function | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ipfs, setIPFS] = useState("");
  const [money, setMoney] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  // Define private key here for development or testing purposes ONLY
  const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;

  const worldAppID = import.meta.env.VITE_PUBLIC_WLD_APP_ID
  const worldActionName = import.meta.env.VITE_PUBLIC_WLD_ACTION_NAME

  const handleProof = (result: ISuccessResult) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
    });
  };

  const onSuccess = (result: ISuccessResult) => {
    console.log("Successful Authentication");
    console.log(result);
    console.log(result.proof)

    const unpackedProof = decodeAbiParameters([{ type: 'uint256[8]' }], result.proof as `0x${string}`)[0]
    const uint256Array = unpackedProof.map(num => num.toString());
    console.log(uint256Array)

    // changed for on chain integration:
    // handleVerify(result.nullifier_hash, result.merkle_root, result.proof, result.credential_type)
    // newVerify(result.nullifier_hash, result.merkle_root, result.proof, result.credential_type)
    setAuthenticated(true);
  };

  const urlParams = new URLSearchParams(window.location.search);
  const credential_types = (urlParams.get("credential_types")?.split(",") as CredentialType[]) ?? [
    CredentialType.Orb,
    CredentialType.Phone,
  ];

  const action = urlParams.get("action") ?? "";
  const app_id = urlParams.get("app_id") ?? "wid_staging_1234";

  function worldcoin_auth() {
    openIDKit.current && openIDKit.current();
  }

  const createCampaign = async () => {
    try {
      // Create a new provider
      const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/a146daf63d93490995823f0910f50118");
      // Create a wallet instance
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

      const contract = getCampaignContract();
      const signer = contract.connect(wallet);

      const result = await signer.createCampaign(title, description, wallet, ipfs, money);
      console.log("Campaign created: ", result);

      setTitle("");
      setDescription("");
      setWallet("");
      setIPFS("");
      setMoney(0);
    } catch (error) {
      console.error("An error occurred while creating the campaign: ", error);
    }
  };

  const handleUpload = (result: { path: any; }) => {
    const ipfsLink = result.path;
    setIPFS(ipfsLink);
    setUploadSuccess(true); // Set upload success to true after successful upload
  };


  const handleVerify = (getNullifier_hash: any, getMerkle_root: any, getProof: any, getCredentialType: any) => {
    const appId = worldAppID; // Replace 'YOUR_APP_ID' with the actual app ID

    const requestData = {
      nullifier_hash: getNullifier_hash,
      merkle_root: getMerkle_root,
      proof: getProof,
      credential_type: getCredentialType,
      action: "my_action",
      signal: "my_signal"
    };

    axios.post(`https://developer.worldcoin.org/api/v1/verify/${appId}`, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        // Handle the response here
        console.log('Response:', response.data);
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  }

  // function newVerify(getNullifier_hash: any, getMerkle_root: any, getProof: any, getCredentialType: any){

  //   const appId = worldAppID; 

  //   const requestData = {
  //     nullifier_hash: getNullifier_hash,
  //     merkle_root: getMerkle_root,
  //     proof: getProof,
  //     credential_type: getCredentialType,
  //     action: "my_action",
  //     signal: "my_signal"
  //   };

  //   fetch(`https://developer.worldcoin.org/api/v1/verify/${appId}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(requestData), 
  //   }).then((verifyRes) => {
  //     verifyRes.json().then((wldResponse) => {
  //       if (verifyRes.status == 200) {
  //         // this is where you should perform backend actions based on the verified credential
  //         // i.e. setting a user as "verified" in a database
  //         res.status(verifyRes.status).send({ code: "success" });
  //       } else {
  //         // return the error code and detail from the World ID /verify endpoint to our frontend
  //         res.status(verifyRes.status).send({ 
  //           code: wldResponse.code, 
  //           detail: wldResponse.detail 
  //         });
  //       }
  //     });
  //   });
  // }

  return (
    <>
      {/* Hier der HTML Code fürs Design */}
      <div className="containerCreate">
        <div className="pageTitle">
          <h2>Start your own Campaign</h2>

        </div>

        <Picture_Upload onUpload={handleUpload} />

        {/* <img src="src/assets/logo.png" alt="Logo" className="logo" /> */}
        <input type="text" placeholder="Enter Title" className="fieldCreate" value={title}
          onChange={(e) => setTitle(e.target.value)} />
        {/* <img src="src/assets/logo.png" alt="Logo" className="logo" /> */}
        {/* <input type="text" placeholder="Enter Title" className="fieldCreate" /> */}

        {/* Description Field */}
        <div className="containerCreate">
          <textarea
            placeholder="Enter Description"
            className="fieldCreate descriptionField"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <input
            required
            type="text"
            placeholder="Enter Your zkBOB Address"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="fieldCreate"
          />

          <div className="imageUpload" >

            {ipfs != "" && <button onClick={createCampaign}>Create Campaign</button>}
          </div>

          {/* Back and Next Buttons */}
          <div className="buttons">
            <Link to="/Home">
              <button className="backButton">Back</button>
            </Link>
            <button className="nextButton">Next</button>
          </div>
        </div>

        {/* Design ende */}


        {!authenticated && <>
          <button onClick={() => worldcoin_auth()} className="fieldCreate" > Authenticate with Worldcoin!</button>
        </>}
        <div>money payed: {money}</div>
        {uploadSuccess && <p className="fieldCreate">Picture uploaded successfully!</p>} {/* Display success message if upload is successful */}

      </div>

      {/* <div><IDKitWidget
      app_id={worldAppID} // obtained from the Developer Portal
      action={worldActionName} // this is your action name from the Developer Portal
      // action={solidityEncode(['uint256'], ["verify"])}
      signal="user_value" // any arbitrary value the user is committing to, e.g. a vote
      onSuccess={onSuccess}
      credential_types={['orb', 'phone']} // the credentials you want to accept
      enableTelemetry
    >
      {({ open }) => <button onClick={open}>Verify with World ID</button>}
    </IDKitWidget></div> */}

      <div>
        <IDKitWidget
          app_id={worldAppID} // must be an app set to on-chain
          action={worldActionName} // solidityEncode the action
          signal={wallet.accounts[0]} // only for on-chain use cases, this is used to prevent tampering with a message
          onSuccess={onSuccess}
          // no use for handleVerify, so it is removed
          credential_types={['orb']} // we recommend only allowing orb verification on-chain
          enableTelemetry
        >
          {({ open }) => <button onClick={open}>Verify with World ID</button>}
        </IDKitWidget>
      </div>
      <div >
        {/* <div>Injected Provider {hasProvider ? 'DOES' : 'DOES NOT'} Exist</div> */}

        {window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&
          /* Updated */
          <button disabled={disableConnect} onClick={handleConnect}>Connect MetaMask</button>
        }

        {wallet.accounts.length > 0 &&
          <>
            <div>Wallet Account: {formatString(wallet.accounts[0])}</div>
            {/* <div>Wallet Balance: {wallet.balance}</div>
          <div>Hex ChainId: {wallet.chainId}</div>
          <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div> */}
          </>
        }
        {error && (
          <div onClick={() => setError(false)}>
            <strong>Error:</strong> {errorMessage}
          </div>
        )
        }
      </div>

      <button onClick={() => console.log(wallet.accounts[0])}>account test</button>


      <div style={{ paddingBottom: '50px' }}></div>

    </>
  );
}