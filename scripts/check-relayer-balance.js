import maticeth from '@maticnetwork/maticjs-ethers'
import matic from '@maticnetwork/maticjs';

const { POSClient,use } = matic
const { Web3ClientPlugin } = maticeth;

use(Web3ClientPlugin)

const posClient = new POSClient();

await posClient.init({
    network: 'mainnet',
    version: 'v1',
    child: {
        provider: process.env.ALCHEMY_API_URL,
        defaultConfig: {
            from: "0x14e533ae58d26Db9354a7d2e71232DA50f351A9e"
        }
    }
});

export const relayerAddress = "0xff48b21592878a32a5b4f4de80c8da734cc065f4";

let balance;

(async () => {
    const erc20Token = posClient.erc20("0x0000000000000000000000000000000000001010"); //matic contract address
    console.log("relayer matic: " + balance);
    balance = await erc20Token.getBalance(relayerAddress).
    console.log("relayer matic: " + balance);

})

export {balance};



