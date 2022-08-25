import { useAddress } from "@thirdweb-dev/react"
import { NextPage } from "next"
import { useEffect, useState } from "react";

interface DBRow {
    id: string,
    discord_name: string,
    signtime: string,
    tos_version: string
}

const Admin:NextPage = () => {

    const address = useAddress();

    const [dbdata, setDbdata] = useState<DBRow[]>([]);

    useEffect(() => {
        const getMembers = async () => {
            try {
                const data = await fetch(`/api/getdbmembers`);
                const members = await data.json();
                setDbdata(members.rows)
            } catch (err) {
                console.log(err);
            }
        }
        getMembers();
    },[]);

    useEffect(() => {
        console.log(dbdata);
    },[dbdata])
    
    if(address != '0x14e533ae58d26Db9354a7d2e71232DA50f351A9e')
        return <div>connect with admin wallet</div>

    return (
        <div>
            <div>
                <>{dbdata && dbdata.map(item => {
                    return (<>
                        {item.signtime}
                    </>)
                })}</>
            </div>
        </div>
    )

}

export default Admin