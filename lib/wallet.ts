import { Wallet, providers } from 'ethers'

if(!process?.env["PRIVATE_KEY"]) throw new Error("Private key undefined")
const privateKey = process?.env["PRIVATE_KEY"]

const provider = new providers.JsonRpcProvider('https://rpc.ftm.tools/')
export const wallet = new Wallet(privateKey).connect(provider)