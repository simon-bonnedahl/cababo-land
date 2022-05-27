
import './Dashboard.css'
const Dashboard = ({db, account, web3Handler}) => {
    /*<h1>Total CBOTokens</h1>
            <h1>Minted CBOTokens</h1>
            <h1>Unminted CBOTokens</h1>
            <button>Mint CBOTokens to wallet</button>
            <h1>Average hourly income</h1>
            */
    return (
        <div className="body">
            
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

        </nav>
        <div className="main">
            <div className="upper">
                <div className="left">
                <div className="section-w32 round-border center-text opacity-10">
                <h1 className="center-text">CBO balance</h1>
                <p>Unminted CBOTokens: 0</p>
                <button className="button-small">Mint CBOTokens</button>
                <p>Minted CBOTokens: 0</p>
                
                <p>Total CBOTokens: 0</p>
                </div>
                <div className="section-w32 round-border opacity-10">
                <h1 className="center-text">Sales</h1>
                </div>
                <div className="section-w32 round-border opacity-10">
                <h1 className="center-text">Plots</h1>
                </div>
                </div>
                <div className="right">
                <div className="section-h40 round-border opacity-10 center-text">
                    <h1>CBOToken value</h1>
                </div>
                <div className="section-h25 round-border opacity-10"></div>
                <div className="section-h25 round-border opacity-10"></div>
                </div>
                
                
            </div>
            <div className="lower">
            <div className="left round-border opacity-10">
                </div>
                <div className="right round-border opacity-10">
                </div>
            </div>
            
        </div>
        </div>
    )
}

export default Dashboard;