import { IdcardTwoTone } from '@ant-design/icons';
import { useAddress, useCoinbaseWallet, useMetamask, useWalletConnect } from '@thirdweb-dev/react';
import { Button, Col, Dropdown, Layout, Menu, Row } from 'antd'
import Image from 'next/image';
import { useState } from 'react';

const { Header, Content, Footer, Sider } = Layout;


export const FixedHeader = () => {

    const address = useAddress();
    const metamask = useMetamask();
    const walletConnect = useWalletConnect();
    const coinbase = useCoinbaseWallet();

    const [modalopen, setModalOpen] = useState<boolean>(false)

    const shortenAddress = (str:String) => {
      return str.substring(0, 6) + "..." + str.substring(str.length - 4);
    };

    const menu = (
      <Menu
        items={[
          {
            key: '1',
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={metamask}>
                Metamask
              </a>
            ),
          },
          {
            key: '2',
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={walletConnect}>
                Mobile
              </a>
            ),
          },
          {
            key: '3',
            label: (
              <a target="_blank" rel="noopener noreferrer" onClick={coinbase}>
                Coinbase Wallet
              </a>
            ),
          },
        ]}
      />
    );

  return (<>
    <Header style={{
      color:"#fff", 
      textAlign:'center', 
      backgroundColor:'#1A1C21'}}>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
        }}>
            {address && `Your Address: ${shortenAddress(address)}`}
            {!address && `Connect Wallet`}
            <Dropdown overlay={menu}>
              <a onClick={e => e.preventDefault()}>
                <IdcardTwoTone style={{fontSize:50, marginTop:5, marginLeft:10}} twoToneColor='#3DCFAF' onClick={(e) => setModalOpen(true)} />
              </a>
            </Dropdown>
        </div>

    </Header>
    {/*modalopen && <ConnectWalletModal setIsOpen={setModalOpen}/>*/}</>
  )
}
