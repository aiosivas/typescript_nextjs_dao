import styles from '../styles/Layout.module.css'
import style from '../styles/index.module.scss'
import useCheckMembership from "../hooks/useCheckMembership.hook"
import { MintNft } from './MintNft';
import { DisplayNFT } from './DisplayNFT';
import { useAddress } from '@thirdweb-dev/react';
import { Login } from './Login';

export const Index = () => {

    const isMember = useCheckMembership();
    const address = useAddress();

  return (
    <div className={style.container}>
    <div className={style.left}>
      <div className={styles.card}>
        {!address && 
        <>
            <h2>To enter the DAO and view the dashboard:</h2>
            <p>1. Connect your Metamask wallet on Polygon Mainnet</p>
            <p>2. Mint your membership NFT</p>
            <Login />
        </>
        }
        {!isMember && address && <MintNft />}
        {isMember && <DisplayNFT />}
      </div>
    </div>
    <div className={style.middle}>
      <div className={styles.card}>
          <p>If you want to be on whitelist, click here to</p>
          <button>Contact Us</button>
      </div>
    </div>
    <div className={style.right}>
          <div className={styles.card}>
          <p>View DAO Whitepaper</p>
          <button>View</button>
      </div>
    </div>

    </div>
  )
}
