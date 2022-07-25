import { useAddress, useNFTDrop, useToken } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { TokenHolderBalance } from "@thirdweb-dev/sdk";
import useCheckMembership from "./useCheckMembership.hook";

interface Member {
    id: number,
    address: string,
    token: string
}

const useMembers = () => {

    const nftDrop = useNFTDrop("0x07Cf9b6DD8934DcdE747A8b9C0B017A6D7C2377f");
    const token = useToken("0x14acA962Aed91E82D9549b04c951155CfD13DB28");
    const address = useAddress();
    const isMember = useCheckMembership();
    
    const [members, setMembers] = useState<Member[] | undefined>([]);

    useEffect(() => {
        const getAllMembers = async () => {
            try {
                const nfts = await nftDrop?.getAllClaimed();
                const amounts = await token?.history.getAllHolderBalances();
                let id = -1;
                const memberz = nfts?.map( (nft) => {
                    const member = amounts?.find(({holder}) => holder === nft.owner);
                    id = id + 1;
                    return {id:id, address:nft.owner, token:member?.balance.displayValue || "0"};
                });
                setMembers(memberz);
              } catch (error) {
                console.error("failed to get member list", error);
              }
            }
        getAllMembers();
      }, [address, nftDrop?.sales, isMember]);

    useEffect(() => {
        console.log(members);
    },[members])
    
    return members;

}

export default useMembers;