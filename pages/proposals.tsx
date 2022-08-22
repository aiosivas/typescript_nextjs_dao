import type { NextPage, NextPageContext } from 'next'
import Head from 'next/head'
import useCheckMembership from '../hooks/useCheckMembership.hook'
import { useEffect, useState } from 'react'
import { Checkbox, Col, Dropdown, Menu, Row, Space } from 'antd'
import { ProposalState, VoteType } from '@thirdweb-dev/sdk'
import { Content } from 'antd/lib/layout/layout'
import s from '../styles/proposalpage.module.scss'

interface ProposalProps {
    proposals: Proposal[]
}

interface Proposal {
    description: string,
    endBlock: string,
     proposalId: string,
     proposer: string,
    startBlock: string,
     state: ProposalState,
     votes: string[],
     index:number 
}

const Proposals:NextPage<ProposalProps> = (props) => {

    const isMember = useCheckMembership();

    const [viewall, setViewall] = useState<boolean>(false);

    const [active, setActive] = useState<Proposal[]>([]);
    const [passed, setPassed] = useState<Proposal[]>([]);
    const [rejected, setRejected] = useState<Proposal[]>([]);
    const [executed, setExecuted] = useState<Proposal[]>([]);

    const [filter, setFilter] = useState<number>(0);



    //on render, filter the different proposals
    useEffect(() => {
        props.proposals.forEach((proposal) => {
            switch(proposal.state){
                case 1: setActive(p => [...p, proposal])
                case 2: case 3: case 6: setRejected(p => [...p, proposal])
                case 4: setPassed(p => [...p, proposal])
                case 7: setExecuted(p => [...p, proposal])
            }
        })
    },[])

    const menu = (
        <Menu
          items={[
            {
              key: '1',
              label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => setFilter(0)}>
                  All
                </a>
              ),
            },
            {
              key: '2',
              label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => setFilter(1)}>
                  Active
                </a>
              ),
            },
            {
              key: '3',
              label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => setFilter(4)}>
                  Passed
                </a>
              ),
            },
            {
              key: '4',
              label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => setFilter(3)}>
                    Defeated
                </a>
              ),
            },
          ]}
        />
      );

        const renderSwitch = (param: ProposalState) => {
            switch(param) {
                case 1: return <ProposalList list={active} />
                case 3: return <ProposalList list={rejected} />
                case 4: return <ProposalList list={passed} />
                case 7: return <ProposalList list={executed} />
                default: return <ProposalList list={props.proposals} />
            }
        }

    if(isMember){
            return (
                <>
                    <Head>
                        <title>WeaveDAO Governance</title>
                        <meta name="description" content="List of WeaveDAO Proposals" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <Content>
                          <div className={[s.list, s.header].join(' ')} style={{display:'flex', justifyContent:'space-between', width: '60%'}}>
                            <h1>Governance</h1>
                            <Dropdown overlay={menu} arrow={true}>
                              <a onClick={e => e.preventDefault()}>
                                  {filter === 1 ? "Active" : filter === 3 ? "Defeated" : filter === 4 ? "Passed" : "All"}
                              </a>
                            </Dropdown>
                          </div>
                            {renderSwitch(filter)}
                          
                    </Content>
                </>
            )
    }

    return (
        <div>Must own WDAO NFT to view</div>
    )
  
}

import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ProposalCard } from '../components/ProposalCard'
import { ProposalList } from '../components/ProposalList'
import { render } from 'react-dom'

Proposals.getInitialProps = async ( {req, err}: NextPageContext) => {
    try {
        const sdk = new ThirdwebSDK("polygon")

        const vote = sdk.getVote("0xbFE2a6b4d2b67590068a9b0D6a6306c96C4934Fc")

        const proposals = await vote?.getAll();

        let ind:number = -1;
        const serializable = proposals?.map((proposal) => {
            ind++;
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
                index: ind
            }
        });


    return { proposals: serializable }

    } catch (error) {
        console.log("failed to get proposals", error); 
        return { proposals: [] };
    }
}

export default Proposals