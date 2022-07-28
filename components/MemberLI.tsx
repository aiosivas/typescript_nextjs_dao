import styles from "../styles/Memberlist.module.scss"

interface Member {
    id: number,
    address: string,
    token: string
}

export const MemberLI = ({id, address, token}: Member) => {
  return (
    <li className={styles.tablerow}>
      <div className={styles.col + " " + styles.col1}>{id}</div>
      <div className={styles.col + " " + styles.col2}>{address}</div>
      <div className={styles.col + " " + styles.col3}>{token}</div>
    </li>
  )
}
