import { useAddress, useNFTDrop, useVote } from '@thirdweb-dev/react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import { MemberLI } from '../components/MemberLI'
import useCheckMembership from '../hooks/useCheckMembership.hook';
import { useGetVotes } from '../hooks/useGetVotes';
import useMembers from '../hooks/useMembers.hook';
import useProposals from '../hooks/useProposals.hook';
import styles from '../styles/Memberlist.module.scss'


const Members: NextPage = () => {

    
    const isMember = useCheckMembership();
    const members = useMembers();
    let votenum = 3;
    //const votenum = useGetVotes();

    if(isMember) {
        return (
            <>
            <Head>
                <title>WDAO Members</title>
                <meta name="description" content="List of WDAO members and their WEV token" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1 className={styles.headingonpage}>WDAO LEADERBOARD</h1>
            <ul className={styles.responsivetable}>
                <>
                <li className={styles.tableheader}>
                    <div className={styles.col + " " + styles.col1}>ID</div>
                    <div className={styles.col + " " + styles.col2}>Address</div>
                    <div className={styles.col + " " + styles.col3}>Token Amount</div>
                    <div className={styles.col + " " + styles.col4}># of Votes</div>
                </li>
                {
                members?.map((member) => {
                    return <MemberLI key={member?.id} id={member?.id} address={member?.address} token={member?.token} votenum={votenum}/>
                })}</>
            </ul>
        </>
        )
    }

    return (
        <div>Must own WDAO NFT to view</div>
    )
}

export default Members