import { useAddress } from "@thirdweb-dev/react"
import { NextPage } from "next"

const Admin:NextPage = () => {

    const address = useAddress()

    if(address != '0x14e533ae58d26Db9354a7d2e71232DA50f351A9e')
        return <div>connect with admin wallet</div>

    return (
        <div>
            <div>
                Connected with admin wallet
            </div>
        </div>
    )

}

export default Admin