import { useAddress, useToken, useVote } from "@thirdweb-dev/react"
import { ProposalState, ProposalVote, VoteType } from "@thirdweb-dev/sdk"
import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import styles from '../styles/Layout.module.css'
import {AddressZero} from "@ethersproject/constants"

interface Proposal {
    description: string,
    id: BigNumber,
    proposer: string,
    state: ProposalState,
    votes: ProposalVote[],
}

export const ProposalCard = ({description, id, proposer, state, votes}: Proposal) => {

    const token = useToken("0x14acA962Aed91E82D9549b04c951155CfD13DB28");
    const vote = useVote("0xa9754dC4DBC31bB97AFEC7a24136819c10B3f304");
    const address = useAddress();

    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [delegating, setDelegating] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);
    
    const [hasVoted, setHasVoted] = useState<boolean>(false);

    const shortenAddress = (str:String) => {
      return str.substring(0, 6) + "..." + str.substring(str.length - 4);
    };

  useEffect(() => {
    if(state !== 1) setActive(false);
    else setActive(true);
    const checkifUserHasVoted = async () => {
      const hasVoted = await vote?.hasVoted(id.toString(), address);
      if(hasVoted) setHasVoted(hasVoted);
    }
    checkifUserHasVoted();
    console.log(hasVoted);
  },[address])

  return (
    <div className={styles.card}>
      <small>Proposal by {shortenAddress(proposer)}</small>
      <h2>{state === 1 ? "ACTIVE" : state === 2 ? "CANCELED" : state === 3 ? "DEFEATED" : state === 4 ? "PASSED" : "NOT ACTIVE"}</h2>
      <p>{description}</p>
      <form onSubmit={async(e) => { //this is the code to execute proposals
      //may outsource to openzeppelin autotask in near future
        e.preventDefault();
        e.stopPropagation();

        setIsVoting(true);
        //grab the user inputed vote from dom

        let myvote:VoteType;
        votes.forEach((vote) => {
          const elem = document.getElementById(id + "-" + vote.type) as HTMLInputElement | null;

          if (elem?.checked) {
            myvote = vote.type;
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
          try {
            vote?.interceptor.overrideNextTransaction(() => ({
              gasLimit: 3000000,
            }));
            setIsVoting(true);
            await Promise.all([async () => {
                        //we check if the proposal is open for voting (state === 1 means it is open)
              if (state === 1) {
                          // if it is open for voting, we'll vote on it
                return vote?.vote(id.toString(), myvote);
              }
                        // if the proposal is not open for voting we just return nothing, letting us continue
              return;
            }]);
            setIsVoting(false);
            try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
              await Promise.all(
                votes.map(async () => {
                  // we'll first get the latest state of the proposal again, since we may have just voted before
                  const proposal = await vote?.get(id);

                  //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                  if (proposal?.state === 4) {
                    const executetransaction =  vote?.execute(id.toString());
                    console.log(executetransaction);
                    return executetransaction;
                    //counter.functions.increment();
                  }
                }));
                console.log("successfully voted");
            } catch (err) {
              console.error("failed to execute votes", err);
            }
          } catch (err) {
            console.error("failed to vote", err);
          }
        } catch (err) {
          console.error("failed to delegate tokens");
        } finally {
          setIsVoting(false);
        }
      }}>
          <>
          {votes.map(({type, label}) => {
              return <div key={type}>
                  <input type="radio" id={id + "-" + type} name={id.toString()} value={type} defaultChecked={type==2} />
                  <label htmlFor={id + "-" + type}>{label}</label>
              </div>

          })}
          <button disabled={isVoting || hasVoted || !active}>{isVoting ? "Voting..." : delegating ? "Delegating" : "Submit Vote"}</button>
          </>
      </form>
    </div>
  )
}
