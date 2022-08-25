import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Discredirect = () => {

    const router = useRouter();

    useEffect(() => {
        const getUsername = async () => {
            const code = router.query.code;
            
            const token = await exchangeCodeForToken(code);
            const username = await exchangeTokenForIdentity(token);
            const tosversion = await fetch(`/api/tosversion`);
            await fetch(`/api/discord/add-signer-to-db`, {
                method: "POST",
                body: {
                    username,
                    tosversion
                }
            })
            router.push('/index');
        }
        getUsername();

    }, [router.query.code, router.isReady])

    return <>Redirecting...</>
}

const exchangeCodeForToken = async (code) => {
    const tokenResponseData = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
        client_id: process.env.clientId,
        client_secret: process.env.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `http://localhost:${port}`,
        scope: 'identify',
    }),
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    });

return tokenResponseData.json();
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