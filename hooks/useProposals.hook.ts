import { useAddress, useVote } from "@thirdweb-dev/react";
import { Proposal } from "@thirdweb-dev/sdk";
import { useEffect, useState } from "react";
import useCheckMembership from "./useCheckMembership.hook";

const useProposals = () => {

    const vote = useVote("0xa9754dC4DBC31bB97AFEC7a24136819c10B3f304");
    const address = useAddress();
    const isMember = useCheckMembership();

    const [proposals, setProposals] = useState<Proposal[] | undefined>([]);

    useEffect(() => {
        // A simple call to vote.getAll() to grab the proposals.
        const getAllProposals = async () => {
          try {
            const proposalz = await vote?.getAll();
            setProposals(proposalz);
          } catch (error) {
            console.log("failed to get proposals", error);
          }
        };
        getAllProposals();
      }, [address, isMember, vote]);

      useEffect(() => {
        console.log(proposals);
    },[proposals])

    return proposals;
}

export default useProposals;