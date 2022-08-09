import type { NextApiRequest, NextApiResponse } from "next";
import { Proposal, ThirdwebSDK } from "@thirdweb-dev/sdk";

type Data = {
    proposals: {proposal:Proposal, index:number}[]
}

const getProposals = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
    try {
        const sdk = new ThirdwebSDK("polygon")

        const vote = sdk.getVote("0xbFE2a6b4d2b67590068a9b0D6a6306c96C4934Fc")

        const proposals = await vote.getAll();

        let index:number = 0;
        const serializable = proposals.map((proposal, index) => {
            index++;
            return {
                description: proposal.description,
                endBlock: proposal.endBlock.toNumber(),
                proposalId: proposal.proposalId.toNumber(),
                proposer: proposal.proposer,
                startBlock: proposal.startBlock.toNumber(),
                state: proposal.state,
                votecount: proposal.votes[index].count.toNumber(),
                votelabel: proposal.votes[index].label,
                votetype: proposal.votes[index].type,
                index
            }
        });


    return { proposals: serializable }

    } catch (error) {
        console.log("failed to get proposals", error); 
        return { proposals: [] };
    }
};

export default getProposals