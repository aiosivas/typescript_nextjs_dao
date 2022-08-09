import { NextApiRequest, NextApiResponse } from "next";
import sdk from './../../scripts/initialize-thirdweb-sdk'

export default async function checkMembership(    
    req: NextApiRequest,
    res: NextApiResponse,
    ){

    const { address } = JSON.parse(req.body);

    const drop = sdk.getSignatureDrop("0xcC106Ba1DA94cD49B0e40850cf96BDccb5906fc9")

    const balance = await drop.balanceOf(address)

    if(balance.toNumber() > 0) res.status(200).json({
        isMember: true
    })
     else res.status(500).json({
        isMember: false
    })
} 