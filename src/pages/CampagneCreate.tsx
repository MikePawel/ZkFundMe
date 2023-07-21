import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { getCampaignContract } from './ContractDetails';
import Picture_Upload from '../components/Picture_Upload';
import './CampagneCreate.css';

export default function CampagneCreate() {
  const [authenticated, setAuthenticated] = useState(false);
  const openIDKit = useRef<Function | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wallet, setWallet] = useState(""); 
  const [ipfs, setIPFS] = useState("");
  const [money, setMoney] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  // Define private key here for development or testing purposes ONLY
  const PRIVATE_KEY = "9aaf5e7e110837e3ecb7c07428ba91c5d5a485eaf625d8289a30110b051f3f51";

  const handleProof = (result: ISuccessResult) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
    });
  };

  const onSuccess = (result: ISuccessResult) => {
    console.log("Successful Authentication");
    console.log(result);
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

  return (
    <>
    {/* Hier der HTML Code fürs Design */}
     <div className="content">
      <div className="pageTitle">
        <h2>Start your own Campaign</h2>

      </div>
        
      <Picture_Upload onUpload={handleUpload} />
      <p className="smallNote">Upload an image in JPG or PNG for best. The recommended image dimensions are 400x400 pixels.</p>
        {/* <img src="src/assets/logo.png" alt="Logo" className="logo" /> */}

        <input type="text" placeholder="Enter Title" className="fieldCreate" value={title}
            onChange={(e) => setTitle(e.target.value)}/>
        {/* <img src="src/assets/logo.png" alt="Logo" className="logo" /> */}
        {/* <input type="text" placeholder="Enter Title" className="fieldCreate" /> */}

        {/* Description Field */}
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


        <div className="imageUpload">

        {ipfs!="" &&<button onClick={createCampaign}>Create Campaign</button>}
       </div>

        {/* Back and Next Buttons */}
        <div className="buttons">
          <button className="backButton">Back</button>
          <button className="nextButton">Next</button>
        </div>

    {/* Design ende */}


      {!authenticated && <>
      <button onClick={() => worldcoin_auth()} className="fieldCreate" > Authenticate with Worldcoin!</button>
      </>}
      <div>money payed: {money}</div>
    {uploadSuccess && <p className="fieldCreate">Picture uploaded successfully!</p>} {/* Display success message if upload is successful */}
      {/* {authenticated && (PASTE IN HERE THE CODE IF WORLDCOIN IS READY)} */}
        {/* <div>
          <Picture_Upload onUpload={handleUpload} />
          <input
          required
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
          required
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            required
            type="text"
            placeholder="Wallet"
            value={wallet} 
            onChange={(e) => setWallet(e.target.value)} 
          />

          {ipfs!="" &&<button onClick={createCampaign}>Create Campaign</button>}
        </div>
      */}
     
     <div>
     <IDKitWidget
        action={action}
        signal="my_signal"
        onSuccess={onSuccess}
        handleVerify={handleProof}
        app_id={app_id}
        credential_types={credential_types}
      >
        {({ open }) => {
          if (openIDKit.current === null) openIDKit.current = open;
          return null;
        }}
      </IDKitWidget> 

     </div>
      
    </div>

    {/* <div><IDKitWidget
      app_id="app_GBkZ1KlVUdFTjeMXKlVUdFT" // obtained from the Developer Portal
      action="vote_1" // this is your action name from the Developer Portal
      signal="user_value" // any arbitrary value the user is committing to, e.g. a vote
      onSuccess={onSuccess}
      credential_types={['orb', 'phone']} // the credentials you want to accept
      enableTelemetry
    >
      {({ open }) => <button onClick={open}>Verify with World ID</button>}
    </IDKitWidget></div> */}

    </>
  );
}