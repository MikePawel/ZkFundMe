import { useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Button } from "@mui/material";
import './Picture_Upload.css'

const projectId = import.meta.env.VITE_IPFS_PROJECT_ID;
const projectSecretKey = import.meta.env.VITE_IPFS_PROJECT_KEY;
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);

function Picture_Upload({ onUpload }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [upload, setUpload] = useState(false);

  const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = form[0].files;
  
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
  
    const file = files[0];
    const result = await ipfs.add(file);
    onUpload(result);
    console.log("Uploaded IPFS link: ", "https://skywalker.infura-ipfs.io/ipfs/" + result.path); // Log the IPFS link
  
    form.reset();
  };  

  return (
    <div>
      {ipfs ? (
        <div className="imageUpload">
          {/* <h1>Upload your file</h1> */}
          {selectedImage && (
            <div>
              <img
                alt="not found"
                width={"250px"}
                src={URL.createObjectURL(selectedImage)}
              />
              <br />
            </div>
          )}
          <form onSubmit={onSubmitHandler} className="formContainer">
            <input
              id="file-upload"
              type="file"
              name="file"
              className="fieldCreate"
              onChange={(event) => {
                console.log(event.target.files[0]);
                setSelectedImage(event.target.files[0]);
              }}
            />
            <button className="fieldCreate" type="submit" >
              Upload To IPFS
            </button>
          </form>

        </div>
      ) : null}
    </div>
  );
}

export default Picture_Upload;
