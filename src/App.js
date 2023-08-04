import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'
import { contract_address,Contract_ABI } from './constant/constant'


function App() {
  const [account,setaccount] = useState(null)
  const [provider,setprovider] = useState(null)
  const [contract,setcontract] = useState(null)
  const [electronic,setelectronic] = useState(null)
  const [clothing,setclothing] = useState(null)
  const [toys,settoys] = useState(null)

  const [item,setitem] = useState({})
  const [toggle,settoggle] = useState(false)
  const togglePop = (item) => {
      setitem(item)
      toggle ? settoggle(false) : settoggle(true)
    }
    const LoadDataContract = async ()=> {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setprovider(provider)
    const contract  = new ethers.Contract(contract_address,Contract_ABI,provider)
    setcontract(contract)
    const items = []
    for (var i = 0 ; i<9;i++)
    {
      const item = await contract.items(i+1)
      items.push(item)
    }
    const electro = items.filter((item)=>item.category === 'electronics')
    setelectronic(electro)
    const clothing = items.filter((item)=>item.category === 'clothing')
    setclothing(clothing)
    const toys = items.filter((item)=>item.category==='toys')
    settoys(toys)
  } 
  function handleAccountsChanged(accounts) {
    if(accounts.length >0 && account != accounts[0])
    {
      setaccount(accounts[0])

    }
    else {
      setaccount(null)
    }
    
  }
  const Withdraw = async() => {
    
    let adres  = await contract.owner()
    if (adres == account) {
      const signer  = await provider.getSigner()
      let transaction = await contract.connect(signer).withdraw();
      await transaction.wait()
    }
    else {
      alert("You can't withdraw, man")
    }
    // console.log(adres)
    // console.log(account)
  }
  useEffect(() => {
    LoadDataContract();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return() => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  }, [])
  return (
    <div>
      <Navigation account = {account}
      
      setaccount = {setaccount}
      withdraw = {Withdraw}
      />
      <h2>Welcome to Dappazon</h2>
      {electronic && clothing && toys &&(
        <>
        <Section title={"Clothing and Jewelry"} items={clothing} togglePop={togglePop}/>
        <Section title={"Electronics and Gadgets"} items={electronic} togglePop={togglePop}/>
        <Section title={"Toys and Gaming"} items={toys} togglePop={togglePop}/>
        </>
      )}
      {toggle &&
      (
        <Product item={item} provider={provider} account={account} dappazon={contract} togglePop={togglePop}/>
      )
      }

    </div>
  );
}

export default App;
