import { useAddress, useToken, useVote } from "@thirdweb-dev/react"
import { ProposalState, ProposalVote, VoteType } from "@thirdweb-dev/sdk"
import { BigNumber } from "ethers"
import { FormEvent, useEffect, useState } from "react"
import styles from '../styles/Layout.module.css'
import {AddressZero} from "@ethersproject/constants"
import Web3 from 'web3'
import secToFormat from "sec-to-format"
import { Button, Col, Descriptions, Form, PageHeader, Progress, Radio, Row, Space, Statistic } from "antd"
import style from '../styles/header.module.css'

const time = require('unix-timestamp-converter')

interface Proposal {
    description: string,
   endBlock: string,
  id: string,
    proposer: string,
   startBlock: string,
    state: ProposalState,
    votes: string[],
    index:number 
}

const Content: React.FC<{ children: React.ReactNode; extra: React.ReactNode }> = ({
  children,
  extra,
}) => (
  <div className="content">
    <div className="main">{children}</div>
    <div className="extra">{extra}</div>
  </div>
);

export const ProposalCard = ({description, id, proposer, state, votes, startBlock, endBlock}: Proposal) => {

    const token = useToken("0x6C223849bF662147d347cDD37C3585aCC52ae527");
    const vote = useVote("0xbFE2a6b4d2b67590068a9b0D6a6306c96C4934Fc");
    const address = useAddress();
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const [form] = Form.useForm();
    
    const [isVoting, setIsVoting] = useState<boolean>(false);
    const [delegating, setDelegating] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);

    const [hasVoted, setHasVoted] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<string | number>(0);
    const [endTime, setEndTime] = useState<string | number>(0);
    const [percenttilldone, setPercent] = useState<number>(99);

    const shortenAddress = (str:String) => {
      return str.substring(0, 6) + "..." + str.substring(str.length - 4);
    };

    const setters = {
      '%H': (hour:number) => (hour < 10 ? `0${hour}` : hour),
      '%m': (min:number) => (min < 10 ? `0${min}` : min),
      '%s': (sec:number) => (sec < 10 ? `0${sec}` : sec),
    };

    const getPropStateEng = (state:ProposalState) => {
      return (state === 1 ? `ACTIVE - ${endTime} more blocks` : state === 2 ? "CANCELED" : state === 3 ? "DEFEATED" : state === 4 ? "SUCCEDED" : state === 5 ? "Queued" : state === 6 ? "Expired" : state === 7 ? "Executed" : "NOT ACTIVE")
    }

  useEffect(() => {
    console.log(description.length)
    if(state !== 1) setActive(false);
    else setActive(true);
    const checkifUserHasVoted = async () => {
      const starttime = await web3.eth.getBlock(parseInt(startBlock));
      setStartTime(time.UNIX_CODE(starttime?.timestamp));
      try {
        const hasVoted = await vote?.hasVoted(id.toString(), address);
        if(hasVoted) setHasVoted(hasVoted);
      } catch (err) {
        console.log("failed to grab vote", err)
      }
    }
    checkifUserHasVoted();
  },[address])

  useEffect(() => {
    const interval = setInterval(async () =>  {
      const now = await web3.eth.getBlockNumber();
      const blockstilldone = parseInt(endBlock) - now;
      setEndTime(blockstilldone)//secToFormat( Number(endtime?.timestamp) - Number(startTime) , '%D:%H:%m:%s', {setters}))
      setPercent((100 * blockstilldone) / parseInt(endBlock) - parseInt(startBlock))
    },3000)
    return () => clearInterval(interval);
  },[])

  useEffect(() => {
    console.log(percenttilldone + "%")
  },[percenttilldone])

  const submitVote = async (e:FormEvent) => {

      setIsVoting(true)

      //grab the user inputed vote from dom
      let myvote: VoteType = 2
      votes.forEach((v0te, index) => {
        const elem = document.getElementById(id + "-" + index) as HTMLInputElement | null

        if (elem?.checked) {
          myvote = index
          console.log(myvote)
          return
        }
      })

      try {
        if (!address)
          return
        setDelegating(true)
        const delegation = await token?.getDelegationOf(address)
        // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
        if (delegation === AddressZero) {
          //if they haven't delegated their tokens yet, we'll have them delegate them before voting
          //delegation means that the contract will vote for you
          await token?.delegateTo(address)
        }
        setDelegating(false)
        await vote?.interceptor.overrideNextTransaction(() => ({
          gasLimit: 3000000,
        }))
        //we check if the proposal is open for voting (state === 1 means it is open)
        // if it is open for voting, we'll vote on it
        if (state === 1)
          await vote?.vote(id.toString(), myvote)

        // if any of the propsals are ready to be executed we'll need to execute them
        // a proposal is ready to be executed if it is in state 4
        await Promise.all(
          votes.map(async () => {
            // we'll first get the latest state of the proposal again, since we may have just voted before
            const proposal = await vote?.get(id)
            console.log("hmm1")
            //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
            if (proposal?.state === 4) {
              const executetransaction = await vote?.execute(id.toString())
              console.log(executetransaction)
              return executetransaction
              //counter.functions.increment();
            }
          }))
        console.log("successfully voted")
      } catch (err) {
        console.error("failed", err)
      } finally {
        setIsVoting(false)
      }
    } 

  return (
    <>
      <PageHeader className="site-page-header-responsive" backIcon={false} title={getPropStateEng(state)} subTitle={"by " + proposer} extra={
        <Space direction="vertical" style={{display: 'flex', textAlign: 'center'}}>
          <Form onFinish={submitVote} layout='horizontal' form={form}>
          <Form.Item name="vote">
            <Radio.Group value='horizontal'>
              <Radio.Button value="yes">Yes</Radio.Button>
              <Radio.Button value="abstain">Abstain</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
            </Radio.Group>
          </Form.Item>
          </Form>
          <Button style={{margin: "auto"}} key="2" onClick={() => form.submit()} disabled={isVoting || hasVoted || !active}>{isVoting ? "Voting..." : hasVoted ? "Voted!" : "Submit"}</Button></Space>  
        } 
        footer={[
          <Progress percent={percenttilldone} showInfo={false}
            status={(percenttilldone < 30 ? "exception" : "active")} />,
          ]}>
        <Content extra>
          <Descriptions size="small" column={4}>
            <Descriptions.Item span={description.length < 145 ? 1 : 2} label="Description">{description}</Descriptions.Item>
            {description.length < 145 ? <Descriptions.Item> </Descriptions.Item> :null}
            <Descriptions.Item label="Created">{startTime}</Descriptions.Item>
            <Descriptions.Item label="Time Left">{endTime < 0 ? "0" : endTime} blocks</Descriptions.Item>
          </Descriptions>
        </Content>
      </PageHeader>
    </>
  )
}
