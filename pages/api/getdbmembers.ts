import { NextApiRequest, NextApiResponse } from 'next';

import { getAll } from "../../utils/db.cjs";

export default async function getdbmembers(req:NextApiRequest, res: NextApiResponse) {
        getAll.then(rows => {
            console.log("rows: ", rows)
            res.status(200).json({rows});
        }).catch(err => {
            res.status(500).json({ error: err })
        })
}