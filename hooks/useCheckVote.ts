import { useAddress, useVote } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import useProposals from "./useProposals.hook";


export const useHasVoted = (id:string) => {

  const address = useAddress();
  const vote = useVote("0xbFE2a6b4d2b67590068a9b0D6a6306c96C4934Fc");
  const proposals = useProposals();

  const [hasVoted, setHasVoted] = useState<boolean | undefined>(false);
     
  useEffect(() => {
      if (!proposals?.length) {
        return;
      }
    
      const checkIfUserHasVoted = async () => {
        try {
          const hazVoted = await vote?.hasVoted(id.toString(), address);
          setHasVoted(hazVoted);
        } catch (error) {
          console.error("Failed to check if wallet has voted", error);
        }
      };
      checkIfUserHasVoted();
  }, [proposals, address, vote]);

  useEffect(() => {
      console.log(hasVoted);
  }, [hasVoted])

    return hasVoted;

}