import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";
import {balance, relayerAddress} from './check-relayer-balance.js'

// Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from "dotenv";
dotenv.config();

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
  console.log("🛑 Private key not found.");
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
  console.log("🛑 Alchemy API URL not found.");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

// RPC URL, we'll use our Alchemy API URL from our .env file.
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
// Your wallet private key. ALWAYS KEEP THIS PRIVATE, DO NOT SHARE IT WITH ANYONE, add it to your .env file and do not commit that file to github!
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider, {
  gassless: {
    openzeppelin: {
      relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_URL,
    },
  },
});

const sdk = new ThirdwebSDK(wallet);

(async () => {
  try {
    const address = await sdk.getSigner().getAddress();
    console.log("SDK initialized by address:" + address)
    //console.log("gassless transaction funds: " + balance + "\nif balance low, transfer some matic to " + relayerAddress)
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})();

// We are exporting the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;