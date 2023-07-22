import { useState, useEffect } from 'react'
import { formatBalance, formatChainAsNum } from '../utils'
import detectEthereumProvider from '@metamask/detect-provider'

const Connect_Metamask = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null)
  const initialState = { accounts: [], balance: "", chainId: "" }
  const [wallet, setWallet] = useState(initialState)

  const [isConnecting, setIsConnecting] = useState(false)  
  const [error, setError] = useState(false)                
  const [errorMessage, setErrorMessage] = useState("")     


  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts)
      } else {
        // if length 0, user is disconnected
        setWallet(initialState)
      }
    }

    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId }))
    }

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true })
      setHasProvider(Boolean(provider))

      if (provider) {
        const accounts = await window.ethereum.request(
          { method: 'eth_accounts' }
        )
        refreshAccounts(accounts)
        window.ethereum.on('accountsChanged', refreshAccounts)
        window.ethereum.on("chainChanged", refreshChain)
      }
    }

    getProvider()

    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts)
      window.ethereum?.removeListener("chainChanged", refreshChain)
    }
  }, [])

  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(await window.ethereum!.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    }))
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    })
    setWallet({ accounts, balance, chainId })
  }

  const handleConnect = async () => {                   
    setIsConnecting(true)                           
    await window.ethereum.request({                     
      method: "eth_requestAccounts",
    })
    .then((accounts:[]) => {                            
      setError(false)                               
      updateWallet(accounts)                        
    })
    .catch((err:any) => {                           
      setError(true)
      setErrorMessage(err.message)
    })                                              
    setIsConnecting(false)                          
  }

  const formatString = (inputString: string): string => {
    if (inputString.length <= 8) {
      return inputString;
    } else {
      const firstThree = inputString.slice(0, 4);
      const lastThree = inputString.slice(-4);
      return `${firstThree}...${lastThree}`;
    }
  };

  const disableConnect = Boolean(wallet) && isConnecting

  return (
    <div >

      {window.ethereum?.isMetaMask && wallet.accounts.length < 1 &&
        <button disabled={disableConnect} onClick={handleConnect}>Connect MetaMask</button>
      }

      {wallet.accounts.length > 0 &&
        <>
          <div>Wallet Account: {formatString(wallet.accounts[0])}</div>
        </>
      }
      { error && (                                        
          <div onClick={() => setError(false)}>
            <strong>Error:</strong> {errorMessage}
          </div>
        )
      }
    </div>
  )
}

export default Connect_Metamask