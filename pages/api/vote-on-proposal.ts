import { ThirdwebSDK, VoteType } from "@thirdweb-dev/sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { FormEvent } from "react";
import { AddressZero } from "@ethersproject/constants"

export default async function submitVote(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {

    const {id, type, address, state } = JSON.parse(req.body)

    const sdk = ThirdwebSDK.fromPrivateKey(
        process.env.PRIVATE_KEY!, "polygon"
      )
    const token = sdk.getToken("0x6C223849bF662147d347cDD37C3585aCC52ae527")
    const vote = sdk.getVote("0xbFE2a6b4d2b67590068a9b0D6a6306c96C4934Fc")

    try {
          const delegation = await token?.getDelegationOf(address)
          // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
          if (delegation === AddressZero) {
            //if they haven't delegated their tokens yet, we'll have them delegate them before voting
            //delegation means that the contract will vote for you
            await token?.delegateTo(address)
          }
          await vote?.interceptor.overrideNextTransaction(() => ({
            gasLimit: 3000000,
          }))
          //we check if the proposal is open for voting (state === 1 means it is open)
          // if it is open for voting, we'll vote on it
          if (state === 1) await vote?.vote(id?.toString(), type as VoteType)
          
          console.log("successfully voted")
        } catch (err) {
          console.error("failed", err)
        }
}
  