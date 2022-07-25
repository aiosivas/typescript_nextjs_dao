import { useAddress, useVote } from "@thirdweb-dev/react";
import { Proposal, Vote } from "@thirdweb-dev/sdk";
import { useEffect, useState } from "react";
import useProposals from "./useProposals.hook";


export const useHasVoted = (id:string) => {

  const address = useAddress();
  const vote = useVote("0xa9754dC4DBC31bB97AFEC7a24136819c10B3f304");
  const proposals = useProposals();


    const [hasVoted, setHasVoted] = useState<boolean | undefined>(false);
     
    useEffect(() => {
      
        // If we haven't finished retrieving the proposals from the useEffect above
        // then we can't check if the user voted yet!
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
  },[hasVoted])

    return hasVoted;

}