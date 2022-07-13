import type { NextApiRequest, NextApiResponse } from "next";
import { table } from "../../utils/Airtable";
import sdk from "../../scripts/initialize-sdk.js";

const generateMintSignature = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { address } = JSON.parse(req.body);

  const record = await table
    .select({
      fields: ["Addresses", "minted"],
      filterByFormula: `NOT({Addresses} != '${address}')`,
    })
    .all();

  if(record.length == 0){
    res.status(404).json({
      error: "User isn't in allowlist",
    });
  } else {
    try {
      const nftDrop = sdk.getNFTDrop("0x07Cf9b6DD8934DcdE747A8b9C0B017A6D7C2377f");
      nftDrop.claimTo(address, 1);
      record[0].updateFields({
        minted: "true",
      });
      res.status(200).json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
    }
};

export default generateMintSignature;
