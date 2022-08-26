
const tosversion = 0.1;
import { useEffect } from 'react';
import {insertSignerInfo} from '../utils/db.cjs'

const Discredirect = () => {

    const address = useAddress();
    const router = useRouter();

    const {code} = router.query;

    useEffect(() => {
        const getDiscAndPutInDB = async () => {
            const token = await exchangeCodeForToken(code);
            const username = await exchangeTokenForIdentity(token);
    
            await insertSignerInfo(username, address, tosversion);
        }
        getDiscAndPutInDB();

        router.push('/');
    },[address])

    return <>Redirecting...</>
}

/*export const getServerSideProps = async(context) => {
    const { code } = context.query;
    console.log("code: ", code)
    try {
        
        const token = await exchangeCodeForToken(code);
        const username = await exchangeTokenForIdentity(token);

        await db.insertSignerInfo(username, address, tosversion);

        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    } catch (err) {
        console.log(err)
        return {
            notFound: true
        }
    }

}*/

const exchangeCodeForToken = async (code) => {
    
    
    const tokenResponseData = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: process.env.clientId,
            client_secret: process.env.clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: `http://localhost:3000/discredirect`,
            scope: 'identify',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const tokenResponse = await tokenResponseData.json();
    return tokenResponse;
}


const exchangeTokenForIdentity = async (tokenResponseData) => {
    const userResult = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenResponseData.token_type} ${tokenResponseData.access_token}`,
        },
    });
    const user = await userResult.json();
    return user.username + '#' + user.discriminator;
}


export default Discredirect;