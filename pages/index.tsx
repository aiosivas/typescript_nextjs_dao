import type { NextPage } from 'next'
import Head from 'next/head'
import { useAddress, useMetamask, useNFTDrop, useToken, useVote, useNetwork} from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { ChainId } from '@thirdweb-dev/sdk';
import styles from '../styles/Layout.module.css'
import { Login } from '../components/Login';
import useCheckMembership from '../hooks/useCheckMembership.hook';
import Image from 'next/image'

const Home: NextPage = () => {

  const wallet = useMetamask();
  const address = useAddress();
  const isMember = useCheckMembership();

  if(isMember){
    return(
      <>
      <Head>
        <title>WDAO Home</title>
        <meta name="description" content="WDAO Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.card}>
        <Image src="/blue-lights-in-bokeh-as-background.jpg" width="450" height="325" />
        <h2>News Article Headline</h2>
        <p>Cool looking article description loren ipsum or some shit this looks pretty nicee honestly tho</p>
      </div>
    </>
    )
  }
  return (
    <>    
      <Head>
        <title>WDAO Home</title>
        <meta name="description" content="WDAO Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className={styles.card}>
          <h2>To enter the DAO and view the dashboard:</h2>
          <p>1. Connect your Metamask wallet on Polygon Mainnet</p>
          <p>2. Mint your membership NFT</p>
          <Login />
        </div>

    </>

    
  )
}

export default Home
