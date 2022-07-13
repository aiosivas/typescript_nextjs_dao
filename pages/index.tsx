import { useAddress, useMetamask, useNFTDrop, useToken, useVote, useNetwork} from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { ChainId, Proposal, TokenHolderBalance } from '@thirdweb-dev/sdk';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const network = useNetwork();

  const nftDrop = useNFTDrop("0x07Cf9b6DD8934DcdE747A8b9C0B017A6D7C2377f");
  const token = useToken("0x14acA962Aed91E82D9549b04c951155CfD13DB28");
  const vote = useVote("0xa9754dC4DBC31bB97AFEC7a24136819c10B3f304");

  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState<boolean | undefined>(false);
  
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState<boolean | undefined>(false);

  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<TokenHolderBalance[] | undefined>([]);

  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState<{ id: number; address: string; }[] | undefined>([]);

  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str:string) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const [proposals, setProposals] = useState<Proposal[] | undefined>([]);
  const [isVoting, setIsVoting] = useState<boolean | undefined>(false);
  const [hasVoted, setHasVoted] = useState<boolean | undefined>(false);
  const [noProposals, setNoProposals] = useState<boolean | undefined>(false);

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // A simple call to vote.getAll() to grab the proposals.
    const getAllProposals = async () => {
      try {
        const proposals = await vote?.getAll();
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals);
      } catch (error) {
        console.log("failed to get proposals", error);
      }
      if(proposals?.length === 0){
        setNoProposals(true);
      } else setNoProposals(false);
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

// We also need to check if the user already voted.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // If we haven't finished retrieving the proposals from the useEffect above
  // then we can't check if the user voted yet!
  if (!proposals?.length) {
    return;
  }

  const checkIfUserHasVoted = async () => {
    try {
      const hasVoted = await vote?.hasVoted(proposals[0].proposalId.toString(), address);
      setHasVoted(hasVoted);
      if (hasVoted) {
        console.log("🥵 User has already voted");
      } else {
        console.log("🙂 User has not voted yet");
      }
    } catch (error) {
      console.error("Failed to check if wallet has voted", error);
    }
  };
  checkIfUserHasVoted();

}, [hasClaimedNFT, proposals, address, vote]);

//get member addresses and id numbers
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }
  const getAllAddresses = async () => {
    try {
      const nfts = await nftDrop?.getAllClaimed();
      let id = -1;
      const addresses = nfts?.map( (nft) => {
        id = id + 1;
        return {id:id, address:nft.owner};
      });
      setMemberAddresses(addresses);
      console.log("Members", addresses);
    } catch (error) {
      console.error("failed to get member list", error);
    }
  };
  getAllAddresses();
}, [hasClaimedNFT, nftDrop?.sales]);

//get member WDGT Token Amounts
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  const getAllBalances = async () => {
    try {
      const amounts = await token?.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log("👜 Amounts", amounts);
    } catch (error) {
      console.error("failed to get member balances", error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token?.history]);

// Now, we combine the memberAddresses and memberTokenAmounts into a single array
const memberList = useMemo(() => {
  return memberAddresses?.map((member) => {
    // We're checking if we are finding the address in the memberTokenAmounts array.
    // If we are, we'll return the amount of token the user has.
    // Otherwise, return 0.
    const m0mber = memberTokenAmounts?.find(({ holder }) => holder === member.address);

    return {
      id: member.id,
      address: member.address,
      tokenAmount: m0mber?.balance.displayValue || "0",
    }
  });
}, [memberAddresses, memberTokenAmounts]);

//this determines whether the connected address has an NFT
useEffect(() => {

    // If they don't have a connected wallet, exit!
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await nftDrop?.balanceOf(address);
        if (balance != undefined && balance.toNumber() > 0) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };
    checkBalance();
}, [address, nftDrop]);

const mintNft = async () => {
  setIsClaiming(true);
  const mintReq = await fetch(`/api/check-and-mint`, {
    method: "POST",
    body: JSON.stringify({address}),
  });

  const mint = await mintReq.json();

  if(mint.error){
    console.log("minting error");
    return;
  }
  try {
    await fetch(`/api/set-minted`, {
      method: "POST",
      body: JSON.stringify({address}),
    });
  } catch (err) {
    console.error(err);
    return;
  } finally {
      setIsClaiming(false);
  }
}

if (address && (network?.[0]?.data?.chain?.id !== ChainId.Mumbai)) {
  return (
    <div className="unsupported-network">
      <h2>Please connect to polygon</h2>
      <p>
        This dapp only works on the Polygon network, please switch networks
        in your connected wallet.
      </p>
    </div>
  );
}

  if (!address) {
    return (
      <div className="landing">
        <div className="topbar">
          <h2>Welcome to Weavechain DAO</h2>
        </div>
        <div className="centered card">
          <h3>To enter the DAO and view the dashboard:</h3>
          <p>1. Connect your Metamask wallet on Polygon Mainnet</p>
          <p>2. Mint your membership NFT</p>
        <button onClick={connectWithMetamask} className="standard">
          Connect your (Metamask) wallet
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mint-nft">
      <div className="topbar">
        <h2>Mint your DAO membership ID</h2>
      </div>
      <div className="centered card">
          <h3>Wallet connected!</h3>
          <p>Press the button to mint, accept the Metamask prompts,</p>
          <p>wait a bit, and you are in!</p>
                <button className="standard"
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? "Minting..." : "Mint your nft"}
      </button>
    </div>
    </div>
  );
};

export default Home;
