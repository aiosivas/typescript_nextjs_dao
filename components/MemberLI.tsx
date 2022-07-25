import { useAddress, useVote } from "@thirdweb-dev/react";
import { ProposalState, ProposalVote } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import useCheckMembership from "../hooks/useCheckMembership.hook";
import useProposals from "../hooks/useProposals.hook";
import styles from "../styles/Memberlist.module.scss"

interface Member {
    id: number,
    address: string,
    token: string,
    votenum: number
}

export const MemberLI = ({id, address, token, votenum}: Member) => {
  return (
    <li className={styles.tablerow}>
      <div className={styles.col + " " + styles.col1}>{id}</div>
      <div className={styles.col + " " + styles.col2}>{address}</div>
      <div className={styles.col + " " + styles.col3}>{token}</div>
      <div className={styles.col + " " + styles.col4}>{votenum}</div>
    </li>
  )
}
