
import db from '../../../utils/db.cjs'

export default async function addSignerToDB(req, res) {
    
    try {
        const { username, tosversion } = JSON.parse(req.body);

        await db.insertDiscInfo(username, tosverison);

        res.status(200).send(`Inputted ${username} with version ${tosversion}`);
    } catch (err) {
        res.status(500).send(err.message);
    }



}
