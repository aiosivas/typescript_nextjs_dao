import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import { ChainId, ThirdwebProvider} from '@thirdweb-dev/react'

const activeChainId = ChainId.Polygon;

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ThirdwebProvider  sdkOptions={{
      gasless: {
        openzeppelin: {
          relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_URL!,
        },
      },
    }} desiredChainId={activeChainId}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProvider>
  )
}

export default MyApp
