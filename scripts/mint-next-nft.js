//script to transfer addresses some WDT
//usage: node scripts/airdrop-token.js <address> <amount> [<address> <amount> ...]

import sdk from './initialize-thirdweb-sdk.js'
import readline from 'readline'

const nftDrop = sdk.getNFTDrop("0x097BE943F336cfFf3807C44b741de8dAC1c28a5e");

(async () => {
    let addresses = [];
    try {
        process.argv.forEach((arg) => {
            if(arg.search(/^0x[a-fA-F0-9]{40}$/) === 0){ //check for eth address
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
            nftDrop.claimTo(address, 1);
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