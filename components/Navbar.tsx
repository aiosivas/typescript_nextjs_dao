import styles from '../styles/navbar.module.css'
import Link from 'next/link'
import Image from "next/image"
import { useAddress, useMetamask, useNFTDrop } from '@thirdweb-dev/react';
import { useState } from 'react';
import useCheckMembership from '../hooks/useCheckMembership.hook';

export const Navbar = () => {

  const address = useAddress();
  const isMember = useCheckMembership();

  const connectWallet = useMetamask();

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href="/"><a><Image src="/weavechainlogo.png" height="55" width="62"/></a></Link>
        </li>
        <li>
          <Link href="/members"><a><i>Members</i></a></Link>
        </li>
        <li>
          <Link href="/proposals"><a><i>Proposals</i></a></Link>
        </li>
        <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li>
        <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> 
        <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> <li></li> 
        <li></li><li></li>
        {address ? <></> : <><li></li><li></li><li></li><li></li><li></li></>}
        <li onClick={connectWallet}>{address ? `Your Wallet: ${address}` : "Connect Wallet"}</li>
      </ul>
    </nav>
  )
}
