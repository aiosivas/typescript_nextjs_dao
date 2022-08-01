import { useVote } from '@thirdweb-dev/react';
import { useState } from 'react';
import styles from '../styles/Layout.module.css'

export const CreateProposal = () => {

    //parse a json file with typical proposals
    const [description, setDescription] = useState<string>("");
    const [proposing, setProposing] = useState<boolean>(false);
    const vote = useVote("0xbFE2a6b4d2b67590068a9b0D6a6306c96C4934Fc");

    const propose = async () => {
        try {
            setProposing(true);
            console.log(typeof description)
            console.log(description)
            const proposal = await vote?.propose(description)
        } catch (err) {
            console.log("failed to propose", err)
        } finally {
            setProposing(false);
        }
    }

  return (
    <>
        <div className={styles.card}>
            <h4>Proposal Text Description</h4>
            <textarea onChange={(event) => {
                setDescription(event.target.value)
            }}></textarea>
            <button disabled={proposing} onClick={propose}>{proposing ? "Proposing..." : "Propose"}</button>
        </div>
    </>
  )
}
