import '../styles/globals.css'
import 'antd/dist/antd.css'
import type { AppProps } from 'next/app'
import { Layout } from 'antd'
import { ChainId, ThirdwebProvider} from '@thirdweb-dev/react'
import { FixedSidebar } from '../components/FixedSidebar';
import { FixedHeader } from '../components/FixedHeader';
import { FixedFooter } from '../components/FixedFooter';
import useCheckMembership from '../hooks/useCheckMembership.hook';
import { MintNft } from '../components/MintNft';
import { useEffect } from 'react';
import { NFTGate } from '../components/NFTGate'

const activeChainId = ChainId.Polygon;

const { Header, Content, Footer, Sider } = Layout;

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>

      <ThirdwebProvider  sdkOptions={{
        gasless: {
          openzeppelin: {
            relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_URL!,
          },
        },
      }} desiredChainId={activeChainId}>
          <Layout>
            <FixedSidebar />
            <Layout style={{
                backgroundColor: '#2D2D2E'
            }}>
              <FixedHeader />
                <NFTGate>
                  <Component {...pageProps} />
                </NFTGate>
            </Layout>
          </Layout>
        </ThirdwebProvider> 
    </>
  )
}

export default MyApp
