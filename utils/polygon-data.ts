import { BigNumber, BigNumberish } from 'ethers'
import Web3 from 'web3'

export const getTimeRemaining:number (endblock: BigNumber) => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")

    const setters = {
        '%H': (hour:number) => (hour < 10 ? `0${hour}` : hour),
        '%m': (min:number) => (min < 10 ? `0${min}` : min),
        '%s': (sec:number) => (sec < 10 ? `0${sec}` : sec),
      };

    const now = await web3.eth.getBlockNumber();
    const blockstilldone = endblock.toNumber() - now;
}
