
import { NextPage } from 'next';
import { MintNft } from '../components/MintNft';
import useCheckMembership from '../hooks/useCheckMembership.hook';
import { Index } from '../components/Index';

const Home: NextPage = () => {

  const isMember = useCheckMembership();

  return ( <>
    {!isMember && <MintNft />}
    {isMember && <Index />}
  </> )
}

export default Home
