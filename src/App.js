import Web3 from 'web3';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MapControls, Stars, Sky, SpotLight} from '@react-three/drei';
import { Vector3 } from 'three'
// Database
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDoc} from "firebase/firestore";


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

// Import ABI
import Land from './abis/Land.json';
import CBOToken from './abis/CBOToken.json';





function App() {
	const [web3, setWeb3] = useState(null)
	const [account, setAccount] = useState(null)
	const [balance, setBalance] = useState(null)
	const [CBOTokens, setCBOTokens] = useState(null)

	// Contract & Contract States
	const [landContract, setLandContract] = useState(null)
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
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum)
			
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()
			

			if (accounts.length > 0) {
				setAccount(accounts[0])
				const balance = await web3.eth.getBalance(web3.utils.toChecksumAddress(accounts[0]))
				setBalance(web3.utils.fromWei(balance))
			}
			const networkId = await web3.eth.net.getId()
			try{
			const land = new web3.eth.Contract(Land.abi, Land.networks[networkId].address)

			setLandContract(land)
			const CBOTokenContract = new web3.eth.Contract(CBOToken.abi, CBOToken.networks[networkId].address)
			setCBOTokenContract(CBOTokenContract)
			


			const plots = await land.methods.getPlots().call()
			setPlots(plots)
			}catch(error){
				setLandId("Switch network")
				
			}
			// Event listeners...
			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
			})

			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			})
		}
	}
	const loadDatabaseData = async () => {
		console.log("loading account from databse")
		const docRef = doc(db, "accounts", account);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			console.log("account found")
			setCBOTokens(docSnap.data()['CBOTokens'])
		}else{
			console.log("account not found")
		}
	}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setCBOTokens(0)
			setAccount(accounts[0])
			
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
		
		loadBlockchainData()
		loadDatabaseData()
	
	
	}, [account, reload, CBOTokens])

	const sellPlot = async (_id, price) => {
		if(price > 0){
		await landContract.methods.putPlotUpForSale(_id, price).send({from: account})
		const plots = await landContract.methods.getPlots().call()
		setPlots(plots)

		setReload(!reload)
		}else{
			console.log("Cant sell for 0")
		}


	}
	const cancelSell = async (_id) => {
		await landContract.methods.takeOffMarket(_id).send({from: account})
		const plots = await landContract.methods.getPlots().call()
		setPlots(plots)

		setReload(!reload)


	}

	const buyPlot = async (_id, price) =>{
		await landContract.methods.buyPlot(_id).send({value: price, from: account})
		const plots = await landContract.methods.getPlots().call()
		setPlots(plots)

		setReload(!reload)
	}


	const mintPlot = async (_id, price) => {
		try {
			
			await landContract.methods.mint(_id).send({ from: account, value: price.toString() })

			const plots = await landContract.methods.getPlots().call()
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
	const updateTokenBalance = async (amount) => {
			
		try {
			
			setDoc(doc(db, "accounts", account), {
				level: 1,
				CBOTokens: CBOTokens + amount
			})		
			setCBOTokens(CBOTokens => (CBOTokens + amount));
			
			}catch (error){
				console.log(error)
			}
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
		<div>	
			
			{dashboardView && (<Dashboard
								db={db}
								account={account}
								CBOTokenContract={CBOTokenContract}
								CBOTokens={CBOTokens}
								mintTokens={mintTokens}
								
							/>) }
			
			<div>
			<Navbar web3Handler={web3Handler} account={account} balance={balance} CBOTokens={CBOTokens} landId={landId}/>
			<Canvas camera={{ position: [0, 5, -10] }}>
				<Suspense fallback={null}>
				<Sky turbidity={10} rayleigh={4}  sunPosition={[sunPositionX, sunPositionY, sunPositionZ]}/>
				<Stars depth={100} fade={true} count={starsCount} ></Stars>

				
					<pointLight color="#ffffff" intensity={0.3 + sunPositionY*10} lookAt={[5, 5, 0]} position={[-sunPositionX*100, sunPositionY*1000, -sunPositionZ*100]} />
					<ambientLight intensity={1 + sunPositionY*10}/>

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
												/>))}
			
			{landView ? 
					(<BuildingTooltip 	reload={reload}
										setReload={setReload}
										currentBuilding={currentBuilding}
										buildMode={buildMode}
										targetedCell={targetedCell}
										updateTokenBalance={updateTokenBalance}
										setCBOTokens={setCBOTokens}/>)
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
		
	);
}

export default App;
