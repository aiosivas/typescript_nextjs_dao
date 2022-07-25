import { useAddress, useNFTDrop } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const useCheckMembership = () => {

    const nftDrop = useNFTDrop("0x07Cf9b6DD8934DcdE747A8b9C0B017A6D7C2377f");
    const router = useRouter();
    const address = useAddress();

    const [membership, setMembership] = useState<boolean>(false);

    useEffect(() => {

      console.log(`swag ${address}`);
      if(address === undefined)
        return;

        // If they don't have a connected wallet, exit!

        const checkBalance = async () => {
          try {
            const balance = await nftDrop?.balanceOf(address);
            if (balance != undefined && balance.toNumber() > 0) {
              console.log("🌟 this user has a membership NFT!");
              setMembership(true);
            } else {
              console.log("😭 this user doesn't have a membership NFT.");
              setMembership(false);
            }
          } catch (error) {
            console.error("Failed to get balance", error);
            setMembership(false);
          }
        };
        checkBalance();
    }, [address, nftDrop]);

    return membership;

}

export default useCheckMembership;