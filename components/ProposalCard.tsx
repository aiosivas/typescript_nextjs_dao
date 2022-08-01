import { useAddress, useToken, useVote } from "@thirdweb-dev/react"
import { ProposalState, ProposalVote, VoteType } from "@thirdweb-dev/sdk"
import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import styles from '../styles/Layout.module.css'
import {AddressZero} from "@ethersproject/constants"
import Web3 from 'web3'
import secToFormat from "sec-to-format"

const time = require('unix-timestamp-converter')

interface Proposal {
    description: string,
    id: BigNumber,
    proposer: string,
    state: ProposalState,
    votes: ProposalVote[],
    startblock: BigNumber,
    endblock: BigNumber
}

export const ProposalCard = ({description, id, proposer, state, votes, startblock, endblock}: Proposal) => {

    const token = useToken("0x6C223849bF662147d347cDD37C3585aCC52ae527");
    const vote = useVote("0xbFE2a6b4d2b67590068a9b0D6a6306c96C4934Fc");
    const address = useAddress();
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    
    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [delegating, setDelegating] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);

    const [hasVoted, setHasVoted] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<string | number>(0);
    const [endTime, setEndTime] = useState<string | number>(0);

    const shortenAddress = (str:String) => {
      return str.substring(0, 6) + "..." + str.substring(str.length - 4);
    };

    const setters = {
      '%H': (hour:number) => (hour < 10 ? `0${hour}` : hour),
      '%m': (min:number) => (min < 10 ? `0${min}` : min),
      '%s': (sec:number) => (sec < 10 ? `0${sec}` : sec),
    };

  useEffect(() => {
    if(state !== 1) setActive(false);
    else setActive(true);
    const checkifUserHasVoted = async () => {
      const starttime = await web3.eth.getBlock(startblock.toNumber());
      setStartTime(time.UNIX_CODE(starttime?.timestamp));
      try {
        const hasVoted = await vote?.hasVoted(id.toString(), address);
        if(hasVoted) setHasVoted(hasVoted);
      } catch (err) {
        console.log("failed to grab vote", err)
      }
    }
    checkifUserHasVoted();
    console.log(id.toString())
    console.log(hasVoted);
  },[address])

  useEffect(() => {
    const interval = setInterval(async () =>  {
      const now = await web3.eth.getBlockNumber();
      const blockstilldone = endblock.toNumber() - now;

      setEndTime(blockstilldone)//secToFormat( Number(endtime?.timestamp) - Number(startTime) , '%D:%H:%m:%s', {setters}))
    },3000)
    return () => clearInterval(interval);
  },[])

  return (

    <div className={styles.card}>
      <small>Proposal by {shortenAddress(proposer)} on {startTime}</small>
      <h4>{state === 1 ? `ACTIVE - ${endTime} more blocks` : state === 2 ? "CANCELED" : state === 3 ? "DEFEATED" : state === 4 ? "SUCCEDED" : state === 5 ? "Queued" : state === 6 ? "Expired" : state === 7 ? "Executed" : "NOT ACTIVE"} </h4>
      <p>{description}</p>
      <form onSubmit={async(e) => { //this is the code to execute proposals
      //may outsource to openzeppelin autotask in near future
        e.preventDefault();
        e.stopPropagation();

        setIsVoting(true);
  
        //grab the user inputed vote from dom

        let myvote:VoteType = 2;
        votes.forEach((v0te) => {
          const elem = document.getElementById(id + "-" + v0te.type) as HTMLInputElement | null;

          if (elem?.checked) {
            myvote = v0te.type;
            console.log(myvote)
            return;
          }
        });

        try {
          if(!address) return;
          setDelegating(true);
          const delegation = await token?.getDelegationOf(address);
                // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
          if (delegation === AddressZero) {
                  //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                  //delegation means that the contract will vote for you
              await token?.delegateTo(address);
          }
          setDelegating(false);
          await vote?.interceptor.overrideNextTransaction(() => ({
            gasLimit: 3000000,
          }));
                      //we check if the proposal is open for voting (state === 1 means it is open)
                        // if it is open for voting, we'll vote on it
          if(state === 1) await vote?.vote(id.toString(), myvote);

                    // if any of the propsals are ready to be executed we'll need to execute them
                    // a proposal is ready to be executed if it is in state 4
          await Promise.all(
            votes.map(async () => {
              // we'll first get the latest state of the proposal again, since we may have just voted before
              const proposal = await vote?.get(id);
              console.log("hmm1")
              //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
              if (proposal?.state === 4) {
                const executetransaction = await vote?.execute(id.toString());
                console.log(executetransaction);
                return executetransaction;
                //counter.functions.increment();
              }
            }));
            console.log("successfully voted");
        } catch (err) {
          console.error("failed", err);
        } finally {
          setIsVoting(false);
        }
      }}>
          <>
          {votes.map(({type, label, count}) => {
              return (
              <div key={type}>
                    <input type="radio" id={id + "-" + type} name={id.toString()} value={type} defaultChecked={type==2} />
                    <label htmlFor={id + "-" + type}>{label}</label>
                    <p>{`${count.div(Math.pow(10,15)).div(Math.pow(10,3)).toString()}`}</p>
                </div>
              )
          })}
          <button disabled={isVoting || hasVoted || !active || delegating}>{!active? "Not Active" : isVoting ? "Voting..." : delegating ? "Delegating" : "Submit Vote"}</button>
          </>
      </form>
    </div>
  )
}
