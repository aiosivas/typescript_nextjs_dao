import { Proposal, ProposalState, VoteType } from "@thirdweb-dev/sdk";
import { useInfiniteScroll } from "ahooks";
import { Data } from "ahooks/lib/useInfiniteScroll/types";
import { GetServerSideProps, GetStaticProps } from "next";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useProposals from "../hooks/useProposals.hook";
import { ProposalCard } from "./ProposalCard";

interface InfiniteScrollDivProps {
  list: ProposalProps,
  viewall: boolean,
  nextId?: string | undefined
}

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

export const InfiniteScrollDiv = ({list, viewall, nextId}: InfiniteScrollDivProps) => {

    const ref = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const proposals = useProposals();
    const [loaded, setLoaded] = useState<number>(0)
    const [loded, setLoded] = useState<boolean>(false)
    const [listlength, setListlength] = useState<number>(list.proposals.length)

    const ref2 = useRef<number>(0);

    const getLoadMoreList = (nextId:string | undefined, limit: number): Promise<Data> => {
      let start = 0;
      if (nextId) {
        start = list.proposals.findIndex((i) => {
          i.index.toString() === nextId
        });
      }
      const end = start + limit;
      const loadinglist = list.proposals.slice(start, end);
      const nId = list.proposals.length >= end ? list.proposals[end] : undefined;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            list: loadinglist,
            nextId: nId,
          });
        }, 1000);
      });
    }

    const { data, loading, loadingMore, noMore, reload } = useInfiniteScroll(
        (d) => getLoadMoreList(d?.nextId, 1),
        {
            target: ref,
            isNoMore: (d) => d?.nextId === undefined,
        },
    );


  if(loading) return <div>Loading Scroll</div>
  return (
    <div ref={ref} style={{height:500, overflow:'auto'}} key='refdiv'>
          {data?.list?.map((item, index, arr) => {
            if(!viewall){
              console.log("list data: ", arr)
                if (item.state === 1)
                    return <><ProposalCard key={item.proposalId.toString()} description={item.description} id={item.proposalId} proposer={item.proposer} state={item.state} votes={item.votes} startBlock={item.startBlock} endBlock={item.endBlock} index={index}/></> 
            } else {
                return <><ProposalCard key={item.proposalId.toString()} description={item.description} id={item.proposalId} proposer={item.proposer} state={item.state} votes={item.votes} startBlock={item.startBlock} endBlock={item.endBlock} index={index}/></> 
            }
        })}
      {noMore && <span>No more proposals</span>}
    </div>
  )
  //else return <div>sup idiot</div>
}