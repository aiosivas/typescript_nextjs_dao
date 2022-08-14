import { ProposalState, VoteType } from "@thirdweb-dev/sdk";
import { useInfiniteScroll } from "ahooks";
import { Data } from "ahooks/lib/useInfiniteScroll/types";
import { GetServerSideProps, GetStaticProps } from "next";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useProposals from "../hooks/useProposals.hook";
import { ProposalCard } from "./ProposalCard";

interface InfiniteScrollDivProps {
  list: Proposal[],
  nextId?: string | undefined
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

export const InfiniteScrollDiv = ({list, nextId}: InfiniteScrollDivProps) => {

    const ref = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const proposals = useProposals();
    const [loaded, setLoaded] = useState<number>(0)
    const [loded, setLoded] = useState<boolean>(false)

    const ref2 = useRef<number>(0);

    const getLoadMoreList = (nextId:number | undefined, limit: number): Promise<Data> => {
      let start = 0;
      if (nextId) {
        start = list.findIndex((i) => {
          i.index === nextId
        });
      }
      const end = start + limit;
      const loadinglist = list.slice(start, end);
      const nId = list.length >= end ? list[end] : undefined;
      return new Promise((resolve) => {
          resolve({
            list: loadinglist,
            nextId: nId,
          });
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
      <>
          {data?.list?.map((item, index, arr) => {
              console.log("list data: ", arr)
              return {item}
        })}
      </>
      {noMore && <span>No more proposals</span>}
    </div>
  )
  //else return <div>sup idiot</div>
}