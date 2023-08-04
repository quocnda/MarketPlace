import { ethers } from 'ethers';

const Navigation = ({ account,setaccount,withdraw }) => {
    
    const connectHandle = async () => {
        if(window.ethereum) {

        

        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const account = ethers.utils.getAddress(accounts[0])
        setaccount(account)
        }
        else {
            aler()
        }
    }
    const aler = () => {
        alert("Please install metamask")
    }
    return (
        
        <nav>
            <div className='nav__brand'>
                <h1>Decentralized Market</h1>
            </div>
            <input type='text'
             className='nav__search'
            />
            <button type='button'
            className='nav__connect'
            onClick={withdraw}
            >
                withdraw
            </button>
            {
                
                account ? 
            (
            <button
            type='button'
            className='nav__connect'
            >
                {account.slice(0,6)+ '...' + account.slice(38,42)}
            </button>
            ) : (
                <button type='button'
                className='nav__connect'
                onClick={connectHandle}
                >
                    Connect

                </button>
            )
                
                
}
            <ul className='nav__links'>
                <li> <a href='#Clothing and Jewelry'> Clothing and Jewelry</a> </li>
                <li> <a href='#Electrionic and Gadgets'> Electronic and Gadgets</a></li>
                <li> <a href='#Toys and Gaming'> Toys and Gaming</a></li>
            </ul>
        </nav>
    );
}

export default Navigation;