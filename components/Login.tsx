import { useMetamask } from '@thirdweb-dev/react'

export const Login = () => {
    const connectWallet = useMetamask();
  return (
    <div>
        <button onClick={connectWallet}>Sign in with MetaMask</button>
    </div>
  )
}
