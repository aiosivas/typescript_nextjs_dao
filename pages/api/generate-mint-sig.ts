import type { NextApiRequest, NextApiResponse } from "next";
import { table } from './../../utils/Airtable'
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export default async function generateMintSignature(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    // De-construct body from request
    try {
      const { address } = JSON.parse(req.body);

      const record = await table
      .select({
        fields: ["Address", "Minted"],
        filterByFormula: `NOT({Address} != '${address}')`,
      })
      .all();

      if (record.length === 0) {
        res.status(404).json({
          error: "User isn't in allowlist",
      });
      } else {

        if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
          console.log("🛑 Private key not found.");
          res.status(500).json({
            error: "private key not given",
          })
        }

        const sdk = ThirdwebSDK.fromPrivateKey(
          process.env.PRIVATE_KEY!, "polygon"
        )
        const drop = sdk.getSignatureDrop("0xcC106Ba1DA94cD49B0e40850cf96BDccb5906fc9")
        const now = new Date();
            const signedPayload = await drop.signature.generate({
                quantity: 1,
                price: 0,
                mintStartTime: now,
            })

            res.status(200).json({
                signedPayload: signedPayload
            })
          }
    } catch (err){
      res.status(500).json({
        error: err,
      })
    }
    
  }