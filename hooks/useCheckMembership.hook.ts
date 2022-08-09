import { useAddress, useNFTDrop, useSignatureDrop } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";


const useCheckMembership = () => {

    //const nftDrop = useNFTDrop("0x097BE943F336cfFf3807C44b741de8dAC1c28a5e");
    const drop = useSignatureDrop("0xcC106Ba1DA94cD49B0e40850cf96BDccb5906fc9")
    const address = useAddress();

    const [membership, setMembership] = useState<boolean>(false);

    useEffect(() => {

      if(address === undefined)
        return;

        const checkBalance = async () => {
          try {
            const balance = await drop?.balanceOf(address);
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
    }, [address, drop]);

    return membership;

}

export default useCheckMembership;