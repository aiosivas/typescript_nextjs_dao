import { useAddress } from "@thirdweb-dev/react";
import { AppProps } from "next/app";
import React from "react";
import useCheckMembership from "../hooks/useCheckMembership.hook";
import { MintNft } from "./MintNft";

interface Props {
    children: React.ReactNode
}

export const NFTGate = ( {children} : Props) => {

    const isMember = useCheckMembership();

  return (<>
    {isMember && <>{children}</>}
    {!isMember && <MintNft />}
    </>)
}
