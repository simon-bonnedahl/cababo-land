import Web3 from 'web3';
import { Suspense, useState, useEffect} from 'react';
import { Canvas, useFrame} from '@react-three/fiber';
import { MapControls, Stars, Sky} from '@react-three/drei';
// Database
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc} from "firebase/firestore";


// Import CSS
import './App.css';

// Import Components
import Navbar from './components/interface/Navbar';
import Plotview from './components/Plotview';
import Landview from './components/Landview';
import Sidemenu from './components/interface/Sidemenu';
import Buildmenu from './components/interface/Buildmenu';
import Dashboard from './components/interface/Dashboard';
import PlotTooltip from './components/interface/PlotTooltip';
import BuildingTooltip from './components/interface/BuildingTooltip';
import Loader from './components/loader/Loader'

// Import ABI
import Land from './abis/Land.json';
import CBOToken from './abis/CBOToken.json';





function App() {
	const [web3, setWeb3] = useState(null)
	const [account, setAccount] = useState(null)
	const [balance, setBalance] = useState(null)
	const [CBOTokens, setCBOTokens] = useState(null)

	// Contract & Contract States
	const [LandContract, setLandContract] = useState(null)
	const [CBOTokenContract, setCBOTokenContract] = useState(null)


	const [plots, setPlots] = useState(null)
	const [landId, setLandId] = useState(null)
	const [hoveringLandId, setHoveringLandId] = useState(null)
	const [landOwner, setLandOwner] = useState(null)
	const [hasOwner, setHasOwner] = useState(false)

	const [landView, setLandView] = useState(false)
	const [buildMode, setBuildMode] = useState(false)
	const [currentBuilding, setCurrentBuilding] = useState(null)
	const [targetedCell, setTargetedCell] = useState({id:-1, building: null})

	const [dashboardView, setDashboardView] = useState(false)

	const [reload, setReload] = useState()
	const [loading, setLoading] = useState(true)

	const [sunPositionX, setSunPositionX] = useState(0)
	const [sunPositionZ, setSunPositionZ] = useState(0)
	const [sunPositionY, setSunPositionY] = useState(0)
	const [sunAngle, setSunAngle] = useState(0)
	const [sunRotation, setSunRotation] = useState(1.6)
	const [starsCount, setStarsCount] = useState(600)

	const firebaseConfig = {
		apiKey: "AIzaSyAVKrMSQ0I5pyuSzk_x7wrOAIbZwjWA4Fg",
		authDomain: "web3land-55163.firebaseapp.com",
		projectId: "web3land-55163",
		storageBucket: "web3land-55163.appspot.com",
		messagingSenderId: "877123411419",
		appId: "1:877123411419:web:130ab962afb7c8f24f5bfe",
		measurementId: "G-KCCXJFZ6CK"
	  };
	  
	  // Initialize Firebase
	  const app = initializeApp(firebaseConfig);
	  const db = getFirestore(app)

	  document.title = "Cababo Land";

	const loadBlockchainData = async () => {
		console.log("Loading Blockchain data...")
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum)
			
			setWeb3(web3)
			console.log(web3)

			const accounts = await web3.eth.getAccounts()
			

			if (accounts.length > 0) {
				
				let _account = web3.utils.toChecksumAddress(accounts[0])
				setAccount(_account)
				let _balance = await web3.eth.getBalance(_account)
				setBalance(web3.utils.fromWei(_balance))
			}
			const networkId = await web3.eth.net.getId()
			try{
			const land = new web3.eth.Contract(Land.abi, '0x1e6160BbD640367f8717e37a032F36a544fe5c65')

			setLandContract(land)
			const CBOTokenContract = new web3.eth.Contract(CBOToken.abi, CBOToken.networks[networkId].address)
			setCBOTokenContract(CBOTokenContract)
			


			const plots = await land.methods.getPlots().call()
			setPlots(plots)
			console.log("Loading done")
			setLoading(false)
			}catch(error){
				console.log(error)
				
			}
			// Event listeners...
			window.ethereum.on('accountsChanged', function (accounts) {
				let _account = web3.utils.toChecksumAddress(accounts[0])
				console.log("Switching account from ", account, " to ", _account)
				setCBOTokens(null)
				setAccount(_account)
			})

			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			})
		}
	}
	const loadDatabaseData = async () => {
		console.log("Loading Blockchain data...")
		console.log("Loading account from databse...")
		const docRef = doc(db, "accounts", account);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			console.log("account found with ", docSnap.data()['CBOTokens'], " CBOTokens")
			setCBOTokens(docSnap.data()['CBOTokens'])
		}else{
			console.log("account not found")
			console.log("creating an account")
			createNewAccount(account)
			
		}
	}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {	
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			let _account = web3.utils.toChecksumAddress(accounts[0])
			setAccount(_account)		
		}
	}
	const createNewAccount = async (address) =>{
		try {
			await setDoc(doc(db, "accounts", account), {
				level: 1,
				CBOTokens: 1	
			});
			
		}catch (error){
			console.log(error)
		}

	}

	setTimeout(() => {
		setSunAngle(sunAngle + 0.0005)
		setSunRotation(sunRotation - 0.001)
		setSunPositionX(Math.cos(sunRotation))
		setSunPositionZ(Math.sin(sunRotation))
		setSunPositionY((Math.sin(sunAngle)/40 ) - 0.017)
		setStarsCount(Math.round(6 + (Math.sin(sunAngle) * -6))*100)
	  }, 10)

	useEffect(() => {
		if(CBOTokens != null){
			//Updatera mängden tokens i databasen på reload efter transaktioner
		setDoc(doc(db, "accounts", account), {
			level: 1,
			CBOTokens: CBOTokens
		})	
	}else{
		loadDatabaseData()
	}
		loadBlockchainData()
		
	
	
	}, [account, reload, CBOTokens])

	const sellPlot = async (_id, price) => {
		if(price > 0){
		await LandContract.methods.putPlotUpForSale(_id, price).send({from: account})
		const plots = await LandContract.methods.getPlots().call()
		setPlots(plots)

		setReload(!reload)
		}else{
			console.log("Cant sell for 0")
		}


	}
	const cancelSell = async (_id) => {
		await LandContract.methods.takeOffMarket(_id).send({from: account})
		const plots = await LandContract.methods.getPlots().call()
		setPlots(plots)

		setReload(!reload)


	}

	const buyPlot = async (_id, price) =>{
		await LandContract.methods.buyPlot(_id).send({value: price, from: account})
		const plots = await LandContract.methods.getPlots().call()
		setPlots(plots)

		setReload(!reload)
	}


	const mintPlot = async (_id, price) => {
		try {
			
			await LandContract.methods.mint(_id).send({ from: account, value: price.toString() })

			const plots = await LandContract.methods.getPlots().call()
			setPlots(plots)

			setLandOwner(plots[_id - 1].owner)
			setHasOwner(true)

			

			//Skriv in kontot i databasen om det inte redan existerar

			if (await docExists('accounts', account) === false) {
				console.log("adding a new account to database")
				try {
					await setDoc(doc(db, "accounts", account), {
						level: 1,
						CBOTokens: 1	
					});
					
				}catch (error){
					console.log(error)
				}
			}else{
				console.log("account already exists in databse")
			}

		} catch (error) {
			console.log(error)
			window.alert('Error occurred when buying')
		}
		setReload(!reload)
	}
	const mintTokens = async (amount) => {
		try {
			await CBOTokenContract.methods.mintToken(account, (amount*(10**18)).toString()).send({from: account, amount: 10000000})
			console.log("minting tokens")
			updateTokenBalance(-amount)
		} catch (error) {
			console.log(error)
			window.alert('Error occurred when minting')
		}
	}
	const updateTokenBalance = (amount) => {
		console.log("Updating token balance from ", CBOTokens, " to ", (CBOTokens + amount))
		setCBOTokens(CBOTokens => (CBOTokens + amount));

	}

	async function docExists(docName, docId) {
		const docRef = doc(db, docName, docId);
		const docSnap = await getDoc(docRef);
		console.log("Checking if document: ", docName, docId, " exists")
		
		if (docSnap.exists()) {
		  console.log("The document exists")
		  return true;
		} else {
		  console.log("The document does not exist")
		  return false;
		}
	  }
	  
	function MoveCamera({pos}){
		useFrame(({ camera }) => {
			camera.position.set(pos[0], pos[1], pos[2])	
		  })
		  return null

		  
	}
	


	
	return (
		loading ? (
		<div>
		<h1 style={{textAlign: "center"}}>Metamask required</h1>
		<h1 style={{textAlign: "center"}}>Switch to Ropsten testnetwork</h1>
		<Loader/>
		</div>) : 
		(
			<div>	
			
			{dashboardView && (<Dashboard
								db={db}
								account={account}
								LandContract={LandContract}
								CBOTokenContract={CBOTokenContract}
								CBOTokens={CBOTokens}
								mintTokens={mintTokens}
								setDashboardView={setDashboardView}
								setLandId={setLandId}
								setLandView={setLandView}
								
							/>) }
			
			<div>
			<Navbar web3Handler={web3Handler} account={account} balance={balance} CBOTokens={CBOTokens} landId={landId}/>
			<Canvas camera={{ position: [0, 5, -10] }}>
				<Suspense fallback={null}>
				<Sky turbidity={10} rayleigh={4}  sunPosition={[sunPositionX, sunPositionY, sunPositionZ]}/>
				<Stars depth={100} fade={true} count={starsCount} ></Stars>

				
					<pointLight color="#ffffff" intensity={1 + sunPositionY*10} position={[sunPositionX*100, sunPositionY*1000, sunPositionZ*100]} />
					<pointLight color="#ffffff" intensity={0.4 + sunPositionY*2} position={[0, 1000, 0]} />
					<ambientLight intensity={0.3}/>

					{!dashboardView && (landView ? (
								<Landview 	currentBuilding={currentBuilding} 
											setCurrentBuilding={setCurrentBuilding}
											buildMode={buildMode} 
											setBuildMode={setBuildMode}
											targetedCell={targetedCell}
											setTargetedCell={setTargetedCell}
											db={db}
											landId = {landId}
											landOwner = {landOwner}
											CBOTokens={CBOTokens}
											updateTokenBalance={updateTokenBalance}/>
					
					
					) : (<Plotview plots={plots} 
						hoveringLandId={hoveringLandId}
						setLandOwner={setLandOwner}
						setHasOwner={setHasOwner}
						setLandId={setLandId}
						setHoveringLandId={setHoveringLandId}
						
						/>)
						)}
					
				
				</Suspense>
				<MapControls autoRotate={true} />
			</Canvas>
			{account && (buildMode ? (<Buildmenu setBuildMode={setBuildMode} 
									MoveCamera={MoveCamera} 
									setCurrentBuilding={setCurrentBuilding}
									setTargetedCell={setTargetedCell}/>) 
												: 
												(<Sidemenu setBuildMode={setBuildMode} 
														   landView={landView}
														   setLandView={setLandView}
														   dashboardView={dashboardView}
														   setDashboardView={setDashboardView}
														   landOwner={landOwner}
														   account={account}
														   setLandId={setLandId}
														   setTargetedCell={setTargetedCell}
												/>))}
			
			{landView ? 
					(<BuildingTooltip 	reload={reload}
										setReload={setReload}
										currentBuilding={currentBuilding}
										buildMode={buildMode}
										targetedCell={targetedCell}
										updateTokenBalance={updateTokenBalance}
										setCBOTokens={setCBOTokens}
										owner={landOwner===account}/>)
					:
					(landId && (<PlotTooltip landId={landId}
											landOwner={landOwner}
											landView={landView}
											cost={plots[landId-1].price}
											setLandView={setLandView}
											mintPlot={mintPlot}
											hasOwner={hasOwner}
											account={account}
											sellPlot={sellPlot}
											cancelSell={cancelSell}
											buyPlot={buyPlot}
											web3={web3}
											plot={plots[landId-1]}

					/>))}</div>
			
		</div>
		)
		
		
	);
}

export default App;
