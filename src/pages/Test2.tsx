import { useState } from "react";
import { Web3Storage, getFilesFromPath } from 'web3.storage';

const Test = () => {

  function getAccessToken () {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkwNGE1NmM2ZEYyRTNhRTE4ODlmYUVjQzA2MDE3NzFkZmVmYmU5QjEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODk2MDE5NTU5OTMsIm5hbWUiOiJQYXJpcyBIYWNrYXRob24gMjAyMyJ9.jHfw65L1ym8TCBX57J9Gz_moD_2B9PkzH11VckxHmu4"
  }
  
  function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
  }
  async function storeWithProgress (files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid: any) => {
      console.log('uploading files with cid:', cid)
    }
  
    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map((f: { size: any; }) => f.size).reduce((a: any, b: any) => a + b, 0)
    let uploaded = 0
  
    const onStoredChunk = (size: number) => {
      uploaded += size
      const pct = 100 * (uploaded / totalSize)
      console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    }
  
    // makeStorageClient returns an authorized web3.storage client instance
    const client = makeStorageClient()
  
    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk })
  }
  
  function test(img: null){
    console.log(img)
    console.log(URL.createObjectURL(selectedImage))
  }

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
      <h1>Upload and Display Image usign React Hook's</h1>

      {selectedImage && (
        <div>
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <button onClick={() => setSelectedImage(null)}>Remove</button>
        </div>
      )}

      <br />
      <br />
      
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
      />
      <button onClick={() => test(selectedImage)}> store files</button>
    </div>
  );
};

export default Test;