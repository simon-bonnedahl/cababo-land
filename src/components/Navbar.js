
const Navbar = ({ web3Handler, account , balance, CBOTokens, landId}) => {
    return (
        <nav className="flex-between">


            {account ? (
                <a
                    href={`${""}/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button">
                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                </a>
            ) : (
                <button onClick={web3Handler} className="button">Connect Wallet</button>
            )}
            {landId && (<h1 className="landId">Land number: {landId}</h1>)}
            <div className="balances flex">
            <h1 className="cbo-balance">{(Math.round((CBOTokens) * 10000) / 10000) + " CBO"}</h1>
            <h1 className="eth-balance">{(Math.round((balance) * 10000) / 10000) + " ETH"}</h1>
            </div>
            
            
            
            
        </nav>
    )
}

export default Navbar;