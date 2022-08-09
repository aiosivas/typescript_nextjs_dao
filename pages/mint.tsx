import { NextPage } from "next";
import { useAddress, useNFTDrop, useSignatureDrop } from "@thirdweb-dev/react";
import { useState } from "react";
import Image  from 'next/image'

const mint: NextPage = () => {

    const address = useAddress();
    const [isClaiming, setIsClaiming] = useState<boolean>(false);
    const drop = useSignatureDrop("0xcC106Ba1DA94cD49B0e40850cf96BDccb5906fc9")

    const mintWithSignature = async () => {
        setIsClaiming(true);

        console.log(JSON.stringify({ address }))
        const signedPayloadReq = await fetch(`/api/generate-mint-sig`, {
          method: "POST",
          body: JSON.stringify({ address: address }),
        });
    
        const signedPayload = await signedPayloadReq.json();
    
        if (signedPayload.error) {
          alert(signedPayload.error);
          setIsClaiming(false);
          return;
        }
    
        try {
          const nft = await drop?.signature.mint(signedPayload.signedPayload);
          if (nft) {
            await fetch(`/api/set-minted`, {
              method: "POST",
              body: JSON.stringify({ address }),
            });
          }
          return nft;
        } catch (err) {
          console.error(err);
          return null;
        } finally {
            setIsClaiming(false);
        }
      };

    
    return (    <>
        <Image src="/Weavechain ID-No-Number.svg" alt="Blank WeaveDAO ID" width="425" height="250"/>
        <h2>Mint your WeaveDAO ID to the Connected Wallet</h2>
        <button onClick={mintWithSignature} disabled={isClaiming}>{isClaiming ? "Claiming" : "Mint"}</button>
    </>)
}

export default mint