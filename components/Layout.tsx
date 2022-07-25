import styles from '../styles/Layout.module.css'
import { Navbar } from "./Navbar";

export const Layout = ({children}: any) => {
  return (
    <>
        <Navbar />
        <div className={styles.container}>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    </>
  )
}
