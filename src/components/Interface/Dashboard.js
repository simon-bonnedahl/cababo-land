import {useEffect, useState} from 'react';
import { doc, getDoc} from "firebase/firestore";



import './Dashboard.css'
import Logo from '../logo/Logo'

const Dashboard = ({db, account, LandContract, CBOTokenContract, CBOTokens, mintTokens, setDashboardView, setLandId, setLandView}) => { 


    const [totalCBO, setTotalCBO] = useState(0)
    const [mintedCBO, setMintedCBO] = useState(0)
    const [unmintedCBO, setUnmintedCBO] = useState(0)

    const [plots, setPlots] = useState()

    const [loadedBlockchain, setLoadedBlockchain] = useState(false)
    const [loadedDatabase, setLoadedDatabase] = useState(false)


    useEffect(() => {
        console.log("reloading")
		if(account){
            console.log("account yes")
            if(!loadedBlockchain || CBOTokens === 0){       //reloading purposes
                loadBlockchainData()
            }
            if(!loadedDatabase || CBOTokens === 0){         //reloading purposes
		        loadDatabaseData()
            }
            
            
        }
        if(loadedBlockchain && loadedDatabase){
            setTotalCBO(mintedCBO + unmintedCBO)  
        }
	}, [loadedBlockchain, loadedDatabase, CBOTokens])
        
    

    const loadDatabaseData = async () => {
		console.log("loading database")
		const docRef = doc(db, "accounts", account);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			console.log("account found")
            console.log(docSnap.data()['CBOTokens'])
			setUnmintedCBO(docSnap.data()['CBOTokens'])
            setLoadedDatabase(true)
		}else{
			console.log("account not found")
		}
	}
    const loadBlockchainData = async () => {
        console.log("loading blockhain")
        let CBOTokens = await CBOTokenContract.methods.balanceOf(account).call()/(10**18)
        setMintedCBO(CBOTokens)

        let allPlots = await LandContract.methods.getPlots().call()
        let ownedPlots = []
        for(let plot of allPlots){
            if(plot.owner === account){
                ownedPlots.push(plot)
            }
        }
        setPlots(ownedPlots)

        setLoadedBlockchain(true)
         
    }

    const mint = () => {
        mintTokens(unmintedCBO)
        setLoadedBlockchain(false)
        setLoadedDatabase(false)
    }
    return (
        <div className="body">
            
        <div className="main">
            <div className="upper">
                <div className="left">
                <div className="section-w32 round-border center-text opacity-10">
                <h1 className="center-text" style={{marginBottom:20}}>Plots</h1>
                {plots && plots.map((plot, index) => {
                    return(
                        <div className="section-h25">
                            <p>ID: {parseInt(plot.id) + 1}</p>
                            <button className="button" style={{height:50}}  onClick={() => (setLandId(parseInt(plot.id) + 1), setDashboardView(false), setLandView(true))}>View Land</button>
                        </div>
                        
                            )
                })}
                </div>
                <div className="section-w32 round-border center-text opacity-10">
                <h1 className="center-text">Sales</h1>
                ?
                </div>
                <div className="section-w32 round-border center-text opacity-10">
                <h1 className="center-text">Offers</h1>
                ?
                </div>
                </div>
                <div className="right">
                <div className="section-h40 round-border opacity-10 center-text">
                    <div className="header">
                    CBOToken value
                    <Logo size={30}/>
                    </div>
                    ?
                </div>
                <div className="section-h25 round-border opacity-10">
               
                </div>
                <div className="section-h25 round-border opacity-10">
        
                </div>
                </div>
                
                
            </div>
            <div className="lower">
            <div className="left round-border opacity-10">
                </div>
                <div className="right round-border opacity-10">
                <p>Total CBOTokens: {(Math.round((totalCBO) * 1000) / 1000)}</p>
                <p>Minted CBOTokens: {(Math.round((mintedCBO) * 1000) / 1000)}</p>
                <p>Unminted CBOTokens: {(Math.round((unmintedCBO) * 1000) / 1000)}</p>
                <button className="button w50 center" onClick={() => mint()}>Mint CBOTokens </button>
                
                
                </div>
            </div>
            
        </div>
        </div>
    )
}

export default Dashboard;