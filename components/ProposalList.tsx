import { useAddress } from "@thirdweb-dev/react"
import { ProposalState } from "@thirdweb-dev/sdk"
import { Space } from "antd"
import Link from "next/link"
import { InfiniteScrollDiv } from "./InfiniteScrollDiv"
import { ProposalCard } from "./ProposalCard"
import s from '../styles/proposalpage.module.scss'

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

type Props =  {
    list: Proposal[]
}


export const ProposalList = ({list}: Props) => {
    
    const address = useAddress()

  return (<div className={s.list}>
                {/*<Link href={{
                    pathname: `/proposals/${index}`,
                    query: {
                        id: proposal.proposalId,
                        state: proposal.state
                    }
                }}>
                    <a></Link> */}
        {list.map((proposal, index) => {
            return <ProposalCard key={index} description={proposal.description} id={proposal.proposalId} proposer={proposal.proposer} state={proposal.state} votes={proposal.votes} startBlock={proposal.startBlock} endBlock={proposal.endBlock} index={proposal.index}/>
        })}
    </div>
  )
}
