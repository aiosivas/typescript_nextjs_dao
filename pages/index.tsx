
import { Col, Row } from "antd"
import { useNFT, ThirdwebNftMedia, useSignatureDrop, useOwnedNFTs, useAddress} from '@thirdweb-dev/react'
import { useEffect, useState } from "react";
import useMembers from "../hooks/useMembers.hook";
import { NextPage } from "next";

const Home: NextPage = () => {

  const drop = useSignatureDrop("0xcC106Ba1DA94cD49B0e40850cf96BDccb5906fc9")

  const address = useAddress();
  const members = useMembers();

  const [id, setId] = useState<string>("0");

  useEffect(() => {
    const getnft = async () => {
      members?.forEach((member) => {
        if(address === member.address){
          setId(String(member.id)) 
          return false;
        }
        return true;
      })
    }
    getnft()
  },[members])

  const {data: nft, isLoading, error } = useNFT(drop, id)

  return (<>
    <Row style={{paddingTop: 50}}>
      <Col offset={11} span={8}>
        <h1>Welcome to WeaveDAO</h1>
      </Col>
    </Row>
    <Row style={{paddingTop: 50}}>
        <Col offset={10} span={8}>
          {nft && <ThirdwebNftMedia style={{height:300, width:300}}metadata={nft.metadata} />}
        </Col>
    </Row>
  </>)
}

export default Home
