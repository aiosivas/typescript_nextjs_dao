import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import { ChainId, ThirdwebProvider, useAddress, useNFTDrop } from '@thirdweb-dev/react'
import { useState, useEffect } from 'react';

const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThirdwebProvider>
  )
}

export default MyApp
