import { useAddress, useVote } from "@thirdweb-dev/react";
import { Proposal } from "@thirdweb-dev/sdk";
import { useEffect, useState } from "react";
import useCheckMembership from "./useCheckMembership.hook";

const useProposals = () => {

    const vote = useVote("0xbFE2a6b4d2b67590068a9b0D6a6306c96C4934Fc");
    const address = useAddress();
    const isMember = useCheckMembership();

    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [indexed, setIndexed] = useState<{proposal:Proposal, index:number}[]>([])

    useEffect(() => {
        const getAllProposals = async () => {
          try {
            const proposalz = await vote?.getAll()!;
            setProposals(proposalz);
          } catch (error) {
            console.log("failed to get proposals", error);
          }
        };
        getAllProposals();
      }, [address, isMember, vote]);

      useEffect(() => {
        let index:number = -1;
        const indecksed = proposals?.map((proposal) => {
          index++;
          return {
            proposal, index
          }
        })
        setIndexed(indecksed)
    }, [proposals])

    useEffect(() => {
      console.log(indexed)
    },[indexed])


    return indexed;
}

export default useProposals;