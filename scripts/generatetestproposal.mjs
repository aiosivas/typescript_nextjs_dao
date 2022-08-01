import sdk from "./initialize-thirdweb-sdk.js";
import { ethers } from "ethers";

// This is our governance contract.
const vote = sdk.getVote("0xbFE2a6b4d2b67590068a9b0D6a6306c96C4934Fc");

// This is our ERC-20 contract.
const token = sdk.getToken("0x6C223849bF662147d347cDD37C3585aCC52ae527");

(async () => {
  try {
    // Create proposal to mint 420,000 new token to the treasury.
    const amount = 100000;
    const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
    const executions = [
      {
        // Our token contract that actually executes the mint.
        toAddress: token.getAddress(),
        // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
        // to send in this proposal. In this case, we're sending 0 ETH.
        // We're just minting new tokens to the treasury. So, set to 0.
        nativeTokenValue: 0,
        // We're doing a mint! And, we're minting to the vote, which is
        // acting as our treasury.
        // in this case, we need to use ethers.js to convert the amount
        // to the correct format. This is because the amount it requires is in wei.
        transactionData: token.encoder.encode(
          "mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]
        ),
      }
    ];

    const test = "test proposal 2: this one with a longer description so that maybe i can see how the cards look after going over their 500px max width"

    vote.interceptor.overrideNextTransaction(() => ({
      gasLimit: 3000000,
    }));

    await vote.propose(test);

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }
})();