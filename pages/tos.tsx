import { Button, Checkbox } from "antd"
import { NextPage } from "next"
import { useRouter } from "next/router";
import { useState } from "react";
const db = require('./../utils/db.cjs')
const discordapi = require('./../utils/discord-api');
const tosversion = 0.5;
const oauthurl = "https://discord.com/api/oauth2/authorize?client_id=1009974221407014962&redirect_uri=http%3A%2F%2Flocalhost%3A53134&response_type=code&scope=identify"

const TOS:NextPage = () => {

    const router = useRouter();

    const [read, setRead] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(true);

    const updatestate = () => {
        setRead(current => !current);
    }

    const verify = async () => {
        if(!read) return;
        const code = router.query.code;
        if(code) try {
            const tokenResponseData = await discordapi.exchangeCodeForToken(code);
                const username = await discordapi.exchangeTokenForIdentity(tokenResponseData);
                await db.insertSingerInfo(username, tosversion);
                console.log(await db.getAll());
                setVerified(true);
        } catch (err) {
            console.error(err);
        }
        
    }

    return ( 
        <div style={{width:'40vw',margin:'auto'}}>
            <h1>Version 1.0</h1>
            <div >
                Official TOS of WeaveDAO
            </div>
            <Checkbox onClick={updatestate}/><Button onClick={verify}>s</Button>
            {verified && <h1>VERIFIED!</h1>}
        </div>)
}



export default TOS