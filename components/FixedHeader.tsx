import { useAddress, useMetamask } from '@thirdweb-dev/react';
import { Button, Col, Layout, Row } from 'antd'

const { Header, Content, Footer, Sider } = Layout;


export const FixedHeader = () => {

    const address = useAddress();
    const connectWallet = useMetamask();

  return (
    <Header style={{color:"#fff", textAlign:'center', backgroundColor:'#1A1C21'}}>
            {address && `Connected with ${address}`}
            {!address && <Button shape="circle" onClick={(e) => connectWallet()}> </Button>}
    </Header>
  )
}
