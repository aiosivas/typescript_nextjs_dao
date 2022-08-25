import { NextApiRequest, NextApiResponse } from "next";

export default function tosversion(req: NextApiRequest, res: NextApiResponse) {
    const tosversion:number = 0.1;
    res.status(500).json({
        tosversion
    })
}