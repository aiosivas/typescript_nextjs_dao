const db = require('../../../utils/db')

export default async function addSignerToDB(req, res) {
    const { code } = JSON.parse(req.body);

    if(code) try {
        const tokenResponseData = await exchangeCodeForToken(code);
            const username = await exchangeTokenForIdentity(tokenResponseData);
            await db.insertSingerInfo(username, tosversion);
            console.log(await db.getAll());
    } catch (err) {
        console.error(err);
        res.status(500)
    }
}

const exchangeCodeForToken = async (code) => {
    const tokenResponseData = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
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