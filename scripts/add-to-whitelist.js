import sdk from './initialize-thirdweb-sdk.js'
import { table } from './airtable.js'

//const nftDrop = sdk.getNFTDrop("0x097BE943F336cfFf3807C44b741de8dAC1c28a5e");

(async () => {
    const now = new Date();

    let addresses = [];
        process.argv.forEach((arg) => {
            if(arg.search(/^0x[a-fA-F0-9]{40}$/) === 0){ //check for eth address
                addresses.push(arg);
            }
            else return;
        });

        if(addresses.length === 0){
            console.log("no addresses");
            process.exit(0);
        }
        try {
            const filteredaddys = addresses.filter(async (addy, index, arr) => {
                const getRepeatAddress = await table
                .select({
                    fields: ["Address"],
                    filterByFormula: `NOT({Address} != '${addy}')`,
                })
                .all();

                if(getRepeatAddress.length > 0){
                    console.log(addy + " already in whitelist, removed from list and continuing")
                    arr.splice(index);
                    return false;
                }
                else return true;
            })

            console.log(addresses)
            addresses.forEach(async (addy) => {
                await table.create([
                    {
                    fields: {
                        Address: addy
                    },
                    },
                ]);
            })
            
    } catch (err) {
        console.log("failed to add to whitelist", err)
    }
})();