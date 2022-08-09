//script to transfer addresses some WDT
//usage: node scripts/airdrop-token.js <address> <amount> [<address> <amount> ...]

import sdk from './initialize-thirdweb-sdk.js'
import readline from 'readline'

const token = sdk.getToken("0x6C223849bF662147d347cDD37C3585aCC52ae527");

(async () => {
    let addresses = [];
    let amounts = [];
    try {
        process.argv.forEach((arg) => {
            if(arg.search(/^0x[a-fA-F0-9]{40}$/) === 0){ //check for eth address
                addresses.push(arg);
            }
            //change the 3 to be able to transfer more than 999 token at a time
            else if(arg.search(/^[0-9]{0,3}$/) === 0){ //check for number 0-999
                amounts.push(arg);
            } else return;
        });

        if(addresses.length === 0 || amounts.length === 0 || !(addresses.length === amounts.length) ){
            console.log("no addresses, no amounts, or not the same number of each");
            process.exit(0);
        }

        let counter = 0;

        const airdropTargets = addresses.map((address) => {
            console.log(`${amounts[counter]} token to ${address}`)
            const airdropTarget = {
                toAddress: address,
                amount: amounts[counter],
            }
            counter++;
            return airdropTarget;
        });

        //get user confirmation then transfer; if the list doesn't match your intended list, there was some error in your input format
        const input = await askQuestion("n to exit, any other key to continue\n")
        
        if(input === 'n') process.exit(1);
        token.transferBatch(airdropTargets).then(console.log("successfully transffered"))


    } catch (err) {
        console.log("failed to airdrop,", err)
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