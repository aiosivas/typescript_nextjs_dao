import sdk from './initialize-thirdweb-sdk.js'
import {readFileSync, writeFileSync} from 'fs'
import { MaxUint256 } from "@ethersproject/constants";

const drop = sdk.getSignatureDrop("0xcC106Ba1DA94cD49B0e40850cf96BDccb5906fc9");

(async () => {
    let addresses = [];

    try {

        const text = readFileSync('./scripts/snapshot.txt', {encoding:'utf-8', flag:'r'});

        addresses = text.split('\n');

        process.argv.forEach((arg) => {
            if(arg.search(/^0x[a-fA-F0-9]{40}$/) === 0){ //check for eth address
                addresses.push(arg);
            }
        });

        console.log(addresses)
        
        const now = new Date();

        const claimCondition = {
            startTime: now,
            maxQuantity: 1,
            price: 0,
            snapshot: addresses,
            quantityLimitPerTransaction: 1,
            waitInSeconds: MaxUint256
        }
        const oldclaim = await drop.claimConditions.getActive();
        console.log(oldclaim);

        await drop.interceptor.overrideNextTransaction(() => ({
            gasLimit: 3000000,
          }))

        const newclaim = await drop.claimConditions.update(0, {snapshot: addresses});
        console.log(newclaim);

        addresses.forEach((ad) => {
            writeFileSync('./scripts/snapshot.txt', '\n' + ad, {flag: 'w+'})
        })

        console.log("successfully updated NFT Drop whitelist");

    } catch (err) {
        console.log("failed to update signaturedrop contract", err)
    }

})();