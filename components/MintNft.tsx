import { useAddress, useSignatureDrop } from "@thirdweb-dev/react";
import { useState } from "react";
import Image  from 'next/image'
import { Content } from "antd/lib/layout/layout";
import s from './../styles/landing.module.scss'
import { Button } from "antd";

export const MintNft = () => {

    const address = useAddress();
    const [isClaiming, setIsClaiming] = useState<boolean>(false);
    const drop = useSignatureDrop("0xcC106Ba1DA94cD49B0e40850cf96BDccb5906fc9")

    const [modalopen, setModalOpen] = useState<boolean>(false);

    const mintWithSignature = async () => {
        setIsClaiming(true);

        const signedPayloadReq = await fetch(`../api/generate-mint-sig`, {
          method: "POST",
          body: JSON.stringify({ address }),
        });
    
        const signedPayload = await signedPayloadReq.json();
    
        if (signedPayload.error) {
          setIsClaiming(false);
          alert(signedPayload.error);
          return;
        }
    
        try {
          const nft = await drop?.signature.mint(signedPayload.signedPayload);
          if (nft) {
            await fetch(`../api/set-minted`, {
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

      /*const addWallet = async () => {
        setAddWalletLoading(true);
        const payload = await fetch(`/api/add-to-allowlist`, {
          method: "POST",
          body: JSON.stringify({ address }),
        });
    
        const payloadJson = await payload.json();
        setAddWalletLoading(false);
    
        if (payloadJson.success) {
          alert(payloadJson.message);
        } else {
          alert(payloadJson.error);
        }
      };*/

  return (<>
     <Content>
      {address && <div className={s.article}>
        <div className={s.head}>
          <span>Welcome to WeaveDAO</span>
        </div>
        <div className={s.greeting}>
          <Image src="/Weavechain ID-No-Number.svg" alt="Blank WeaveDAO ID" width="300" height="300"/>
        </div>   
        <div className={s.content}>
          <div className={s.main}>
            <h2>Mint your unique membership NFT for DAO access</h2>
            <button onClick={mintWithSignature} disabled={isClaiming}>{isClaiming ? "Claiming" : "Mint"}</button>
          </div>
        </div>
        <div className={s.contact}>
          <h4>Want to be on the whitelist? Contact us:</h4>
        </div>
      </div>}
      {!address && <div className={s.article}>
        <div className={s.head} style={{marginTop: 150}}>
          <span>Connected Wallet to Get Started</span>
        </div>
      </div>}
    </Content></>
  )
}
