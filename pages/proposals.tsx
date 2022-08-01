import { useAddress } from '@thirdweb-dev/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import useCheckMembership from '../hooks/useCheckMembership.hook'
import useProposals from "../hooks/useProposals.hook"
import { ProposalCard } from "../components/ProposalCard"
import styles from '../styles/proposalpage.module.scss'
import { CreateProposal } from "../components/CreateProposal"
import { useState } from 'react'
import { stringify } from 'querystring'
import { ConstructorFragment } from 'ethers/lib/utils'

const Proposals: NextPage = () => {


    const address = useAddress();
    const isMember = useCheckMembership();
    const proposals = useProposals();

    const [viewall, setViewall] = useState<boolean>(false);

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
                        <h2>PROPOSE HERE</h2>
                        <CreateProposal />
                    </div>
                    <div className={styles.right}>
                        <div className={styles.container}>
                            <div className={styles.left}>
                                <h2>swag</h2>
                            </div>
                            <div className={styles.right}>
                                <input className={styles.checkbox} type="checkbox" onChange={e => setViewall(e.target.checked)} name="filter"/>
                                <label htmlFor='filter'>All</label>
                            </div>
                        </div>
                        {proposals?.map((proposal) => {
                            if(!viewall){
                                if(proposal.state === 1)
                                    return <ProposalCard key={proposal.proposalId.toString()} description={proposal.description} id={proposal.proposalId} proposer={proposal.proposer} state={proposal.state} votes={proposal.votes} startblock={proposal.startBlock} endblock={proposal.endBlock}/> 
                                }
                            else {
                                return <ProposalCard key={proposal.proposalId.toString()} description={proposal.description} id={proposal.proposalId} proposer={proposal.proposer} state={proposal.state} votes={proposal.votes} startblock={proposal.startBlock} endblock={proposal.endBlock}/> 
                            }
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