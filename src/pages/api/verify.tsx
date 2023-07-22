import React, { useEffect } from "react";

export type VerifyReply = {
  code: string;
  detail: string;
};

const verifyEndpoint =
  process.env.REACT_APP_WLD_API_BASE_URL +
  "/api/v1/verify/" +
  process.env.REACT_APP_WLD_APP_ID;

interface VerifyProps {
  req: {
    body: {
      nullifier_hash: string;
      merkle_root: string;
      proof: string;
      credential_type: string;
      action: string;
      signal: string;
    };
  };
}

const Verify: React.FC<VerifyProps> = ({ req }) => {
  const handleVerify = async (reqBody: any) => {
    try {
      console.log("Sending request to World ID /verify endpoint:\n", reqBody);
      const verifyRes = await fetch(verifyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      const wldResponse = await verifyRes.json();
      console.log(
        `Received ${verifyRes.status} response from World ID /verify endpoint:\n`,
        wldResponse
      );

      if (verifyRes.status === 200) {
        console.log(
          "Credential verified! This user's nullifier hash is: ",
          wldResponse.nullifier_hash
        );
      } else {
        throw new Error(
          `Error code ${verifyRes.status} (${wldResponse.code}): ${wldResponse.detail}`
        );
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  useEffect(() => {
    console.log("Received request to verify credential:\n", req.body);
    const reqBody = {
      nullifier_hash: req.body.nullifier_hash,
      merkle_root: req.body.merkle_root,
      proof: req.body.proof,
      credential_type: req.body.credential_type,
      action: req.body.action,
      signal: req.body.signal,
    };

    handleVerify(reqBody);
  }, [req]);

  return null;
};

export default Verify;
