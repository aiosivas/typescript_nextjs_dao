//script to mint nft to an address
//usage: node scripts/mint-next-nft.js <address> [<address> ...]

import sdk from './initialize-thirdweb-sdk.js'
import readline from 'readline'

const drop = sdk.getSignatureDrop("0xcC106Ba1DA94cD49B0e40850cf96BDccb5906fc9")

(async () => {
    let addresses = [];
    try {
        process.argv.forEach((arg) => {
            if(arg.search(/^0x[a-fA-F0-9]{40}$/) !== 0){ //check for eth address
                addresses.push(arg);
            } else return;
        });

        if(addresses.length === 0){
            console.log("no addresses");
            process.exit(0);
        }

        //get user confirmation then mint  
        askQuestion("continue? y/n ").then(input => {
            if(input === 'n') process.exit(1);
        }).then(addresses.forEach(address => {
            drop.claimTo(address, 1);
        })).then(console.log("successfully minted!"))


    } catch (err) {
        console.log("failed to mint,", err)
    }
})();

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}