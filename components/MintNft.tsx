import { useNFTDrop } from "@thirdweb-dev/react";
import { useState } from "react";
import Image  from 'next/image'

export const MintNft = () => {

    const nftDrop = useNFTDrop("0x097BE943F336cfFf3807C44b741de8dAC1c28a5e");
    const [isClaiming, setIsClaiming] = useState<boolean>(false);

    const mint = async () => {
        try{
            setIsClaiming(true);
            const nft = await nftDrop?.claim(1);
        } catch(err) {
            console.log("Failed to mint nft", err);
        } finally {
            setIsClaiming(false);
        }
    }

  return (
    <>
        <Image src="/Weavechain ID-No-Number.svg" alt="Blank WeaveDAO ID" width="425" height="250"/>
        <h2>Mint your WeaveDAO ID to the Connected Wallet</h2>
        <button onClick={mint} disabled={isClaiming}>{isClaiming ? "Claiming" : "Mint"}</button>
    </>
  )
}
