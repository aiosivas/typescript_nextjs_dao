import { useAddress } from '@thirdweb-dev/react';
import { ProposalState, ThirdwebSDK, VoteType } from '@thirdweb-dev/sdk';
import { Button, Col, Form, Radio, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import React, { FormEvent, useEffect, useState } from 'react'
import useProposals from '../../hooks/useProposals.hook';
import s from '../../styles/proposals.module.scss'

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

const PROPOSAL_DURATION = 6750 //blocks

const Proposal:NextPage = () => {

    const router = useRouter();

    const id = parseInt(router.query.id as string, 10)
    const state = parseInt(router.query.id as string, 10)
    const blocksleft = parseInt(router.query.blocksleft as string, 10)
    const percenttilldone = blocksleft / PROPOSAL_DURATION 
    const type = router.query.type as string
    const index = parseInt(router.query.index as string, 10)

    const address = useAddress();
    const proposals = useProposals();

    const [description, setDescription] = useState<string>('')
    const [proposer, setProposer] = useState<string>('') 

    //fetch current proposal
    useEffect(() => {
        proposals.forEach(proposal => {
            if(proposal.index === index) {
                setDescription(proposal.proposal.description) 
                setProposer(proposal.proposal.proposer)
                return
            }
        })
    },[proposals])

    const [isVoting, setIsVoting] = useState<boolean>(false)
    const [hasVoted, setHasVoted] = useState<boolean>(false)

    const [form] = Form.useForm();

    const submitVote = async () => {
        setIsVoting(true)
        await fetch(`/api/vote-on-proposal`, {
            method: "POST",
            body: JSON.stringify({ address, type:myVote(), state, id }),
        }).then(() => setIsVoting(false))
    }

    const myVote = () => {
        for(let i=0; i < 2; i++){
            const elem = document.getElementById(id + "-" + i) as HTMLInputElement | null
            if (elem?.checked) return i
        }
    }

    const getPropStateEng = (state:number) => {
        return (state === 1 ? `ACTIVE - ${blocksleft} more blocks` : state === 2 ? "CANCELED" : state === 3 ? "DEFEATED" : state === 4 ? "SUCCEDED" : state === 5 ? "Queued" : state === 6 ? "Expired" : state === 7 ? "Executed" : "NOT ACTIVE")
      }

  return (
    <Content>
    <div className={s.article}>
            <div className={[s.header].join(' ')}>
                <h1>Proposal Details</h1>
            </div>
            <div className={s.info}>
                <div className={s.contentcard}>
                    <div className={s.head}>
                        <span># {index}</span>
                        <span>{type}</span>
                    </div>
                    <div className={s.main}>
                        <span>{getPropStateEng(state)}</span>
                        <span>Created by {proposer}</span>
                    </div>
                    <div className={s.main}>
                        <Form onFinish={submitVote} style={{marginTop:20}} layout='horizontal' form={form}>
                            <Form.Item>
                                <Radio.Group value='horizontal'>
                                    <Radio.Button value="yes">Yes</Radio.Button>
                                    <Radio.Button value="abstain">Abstain</Radio.Button>
                                    <Radio.Button value="no">No</Radio.Button>
                                </Radio.Group>
                                <Button style={{margin: "auto"}} onClick={() => submitVote()} key="2" disabled={isVoting || hasVoted}>{isVoting ? "Voting..." : hasVoted ? "Voted!" : "Submit"}</Button>
                            </Form.Item>
                        </Form>
                        
                    </div>
                </div>
                <div className={s.contentcard}>
                    <div className={s.main}>
                        <span>{description}</span>
                    </div>
                </div>
            </div>
            
        
    </div>
    </Content>
  )
}

export default Proposal
