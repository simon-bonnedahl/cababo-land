import Web3 from 'web3';
import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MapControls, Stars, Sky } from '@react-three/drei';
// Database
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDoc} from "firebase/firestore";


// Import CSS
import './App.css';

// Import Components
import Navbar from './components/Navbar';
import Plotview from './components/Plotview';
import Landview from './components/Landview';
import Sidemenu from './components/Sidemenu';
import Buildmenu from './components/Buildmenu';
import Dashboard from './components/Dashboard';
import PlotTooltip from './components/PlotTooltip';
import BuildingTooltip from './components/BuildingTooltip';

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

	const [cost, setCost] = useState(0)
	const [plots, setPlots] = useState(null)
	const [landId, setLandId] = useState(null)
	const [hoveringLandId, setHoveringLandId] = useState(null)
	const [landName, setLandName] = useState(null)
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
			CBOTokenContract.methods.issueToken(0x40CA26dd1141987a92ae88479d03dba2f145391F, 300*10**18)

			const cost = await land.methods.cost().call()
			setCost(web3.utils.fromWei(cost.toString(), 'ether'))

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
		console.log("loading db")
		const docRef = doc(db, "accounts", account);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			setCBOTokens(docSnap.data()['CBOTokens'])
		}
	}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			
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
		console.log(starsCount)
	
	  }, 10)

	useEffect(() => {
		loadBlockchainData()
		loadDatabaseData()
	
		
		if(CBOTokens != null){
		try {
			
			setDoc(doc(db, "accounts", account), {
				level: 1,
				CBOTokens: CBOTokens
			})		
			
			}catch (error){
				console.log(error)
			}
		}
	}, [account, reload, CBOTokens])

	
	const buyHandler = async (_id) => {
		try {
			await landContract.methods.mint(_id).send({ from: account, value: '1000000000000000000' })

			const plots = await landContract.methods.getPlots().call()
			setPlots(plots)

			setLandName(plots[_id - 1].id)
			setLandOwner(plots[_id - 1].owner)
			setHasOwner(true)



			//Skriv in kontot i databasen om det inte redan existerar

			
			if (!docExists('accounts', account)) {
				console.log("adding a new account to database")
				try {
					await setDoc(doc(db, "accounts", account), {
						level: 1,
						CBOTokens: 0
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
	}
	const mintTokens = async (amount) => {
		try {
			await CBOTokenContract.methods.issueToken(account, amount*(10**18))
			console.log("minting tokens")
		} catch (error) {
			window.alert('Error occurred when minting')
		}
	}
	const updateTokenBalance = async (amount) => {
		console.log("Account has: " + CBOTokens + " CBOTokens")
		
		console.log("Collecting " + amount + " CBOTokens to account: " + account)
		
		setCBOTokens(CBOTokens => (CBOTokens + amount));
		console.log("Account: " + account + " now has " + (CBOTokens) +  " CBOTokens")
		
		
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
			
			{dashboardView ? (<Dashboard
								db={db}
								account={account}
							/>) 
			: 
			(<div>
			<Navbar web3Handler={web3Handler} account={account} balance={balance} CBOTokens={CBOTokens} landId={landId}/>
			<Canvas camera={{ position: [0, 5, -10] }}>
				<Suspense fallback={null}>
				<Sky turbidity={20} rayleigh={4}  sunPosition={[sunPositionX, sunPositionY, sunPositionZ]}/>
				<Stars depth={100} fade={true} count={starsCount} ></Stars>

				

					<ambientLight intensity={0.4} />
					{landView ? (<Landview 	currentBuilding={currentBuilding} 
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
						setLandName={setLandName}
						setLandOwner={setLandOwner}
						setHasOwner={setHasOwner}
						setLandId={setLandId}
						setHoveringLandId={setHoveringLandId}
						/>)}
				
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
														   setDashboardView={setDashboardView}>
												</Sidemenu>))}
			
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
											landName={landName}
											landOwner={landOwner}
											landView={landView}
											cost={cost}
											setLandView={setLandView}
											buyHandler={buyHandler}
											hasOwner={hasOwner}
											account={account}

					/>))}</div>)}
			
		</div>
		
	);
}

export default App;
