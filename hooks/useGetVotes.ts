import { useAddress, useVote } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import useMembers from "./useMembers.hook";
import useProposals from "./useProposals.hook";

export const useGetVotes = () => {

    const proposals = useProposals();
    const vote = useVote();
    const members = useMembers();

    const [votes, setVotes] = useState<number[]>([]);

    useEffect(() => {
        let isSubscribed = true;
        const getVotes = async () => {
        try{
            members?.forEach(async ({address}) => {
                console.log("memberaddy: " + address)
                let votenum:number = 0;
                proposals?.forEach(async (proposal) => {
                    console.log(isSubscribed +" a");
                    const votez = await vote?.hasVoted(proposal.proposal.proposalId.toString(),address);
                    if(votez) votenum = votenum + 1;
                })
                setVotes((prev) => {
                    return [...prev, votenum]
                });
            });
          } catch (err){
            console.log(err);
          }
        }
        getVotes();

        return () => {
            isSubscribed = false;
        }
    })

    return votes;
}