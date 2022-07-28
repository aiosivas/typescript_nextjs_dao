import { useAddress, useNFTDrop } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";


const useCheckMembership = () => {

    const nftDrop = useNFTDrop("0x097BE943F336cfFf3807C44b741de8dAC1c28a5e");
    const address = useAddress();

    const [membership, setMembership] = useState<boolean>(false);

    useEffect(() => {

      if(address === undefined)
        return;

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