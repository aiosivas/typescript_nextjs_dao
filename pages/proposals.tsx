import { useAddress } from '@thirdweb-dev/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import useCheckMembership from '../hooks/useCheckMembership.hook'
import useProposals from "../hooks/useProposals.hook"
import { ProposalCard } from "../components/ProposalCard"
import styles from '../styles/proposalpage.module.scss'
import useCreateProposal from "../hooks/useCreateProposal.hook"

const Proposals: NextPage = () => {

    const address = useAddress();
    const isMember = useCheckMembership();
    const proposals = useProposals();

    if(isMember){
        return (
            <>
                <Head>
                    <title>WDAO Members</title>
                    <meta name="description" content="List of WDAO members and their WEV token" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className={styles.container}>
                    <div className={styles.left}>

                    </div>
                    <div className={styles.right}>
                        <h2>VOTE HERE</h2>
                        {proposals?.map((proposal) => {
                            return <ProposalCard key={proposal.proposalId.toString()} description={proposal.description} id={proposal.proposalId} proposer={proposal.proposer} state={proposal.state} votes={proposal.votes}/>
                        })}
                    </div>
                </div>

            </>
          )
    }

    return (
        <div>Must own WDAO NFT to view</div>
    )
  
}

export default Proposals