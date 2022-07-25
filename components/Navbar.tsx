import styles from '../styles/navbar.module.css'
import Link from 'next/link'
import Image from "next/image"

export const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href="/"><a><Image src="/weavechainlogo.png" height="55" width="62"/></a></Link>
        </li>
        <li>
          <Link href="/members"><a><i>Members</i></a></Link>
        </li>
        <li>
          <Link href="/proposals"><a><i>Proposals</i></a></Link>
        </li>      
      </ul>
    </nav>
  )
}
