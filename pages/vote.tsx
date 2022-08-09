import { useAddress } from '@thirdweb-dev/react'
import type { NextPage, NextPageContext } from 'next'
import Head from 'next/head'
import useCheckMembership from '../hooks/useCheckMembership.hook'
import { useEffect, useRef, useState } from 'react'
import { Checkbox } from 'antd'
import { ProposalState, VoteType } from '@thirdweb-dev/sdk'
import { InfiniteScrollDiv } from '../components/InfiniteScrollDiv'
import { Content } from 'antd/lib/layout/layout'

interface ProposalProps {
    proposals: {
        description: string,
       endBlock: string,
        proposalId: string,
        proposer: string,
       startBlock: string,
        state: ProposalState,
        votes: string[],
        index:number 
    }[]
}

const Proposals:NextPage<ProposalProps> = (props) => { //GetServerSidePropsResult<ProposalProps>


    const address = useAddress();
    const isMember = useCheckMembership();
    const ref = useRef<HTMLDivElement>(null);
    const proposals = props.proposals

    const [viewall, setViewall] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        console.log(proposals)
        if(proposals)
            if(proposals.length > 0) setLoaded(true)
    },[])

    if(isMember){
        if(loaded) {
            return (
                <>
                    <Head>
                        <title>WeaveDAO Governance</title>
                        <meta name="description" content="List of WeaveDAO Proposals" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <Content>
                        <Checkbox onChange={(e) => {setViewall(e.target.checked)}}>View All</Checkbox>
                        <InfiniteScrollDiv list={props} viewall={viewall} />
                    </Content>
                    
                </>
            )
        } else return <div>Loading proposals {props.proposals[0]?.description}</div>
    }

    return (
        <div>Must own WDAO NFT to view</div>
    )
  
}

import { ThirdwebSDK } from "@thirdweb-dev/sdk";

Proposals.getInitialProps = async ( {req, err}: NextPageContext) => {
    try {
        const sdk = new ThirdwebSDK("polygon")

        const vote = sdk.getVote("0xbFE2a6b4d2b67590068a9b0D6a6306c96C4934Fc")

        const proposals = await vote?.getAll();

        let index:number = 0;
        const serializable = proposals?.map((proposal, index) => {
            index++;
            return {
                description: proposal.description,
                endBlock: proposal.endBlock.toHexString(),
               proposalId: proposal.proposalId.toHexString(),
                proposer: proposal.proposer,
                startBlock: proposal.startBlock.toHexString(),
                state: proposal.state,
                votes: [ //0 is against, 1 is for, 2 is abstain
                    proposal.votes[0].count.toHexString(),
                    proposal.votes[1].count.toHexString(),
                    proposal.votes[2].count.toHexString()
                    ],
                index
            }
        });


    return { proposals: serializable }

    } catch (error) {
        console.log("failed to get proposals", error); 
        return { proposals: [] };
    }
}

export default Proposals