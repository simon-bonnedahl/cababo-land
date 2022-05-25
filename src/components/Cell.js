import { useState, useEffect } from 'react';
import GrassColor from '../assets/grass.jpeg'
import GrassNormal from '../assets/Stylized_Grass_003_normal.jpg'
import GrassRoughness from '../assets/Stylized_Grass_003_roughness.jpg'
import GrassHeight from '../assets/Stylized_Grass_003_height.png'
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { RepeatWrapping } from 'three';
import House from './House'
import Farm from './Farm'
import Tower from './Tower'

import { doc, setDoc, getDoc} from "firebase/firestore"; 


const Cell = ({pos, id, currentBuilding, setCurrentBuilding, buildMode, setBuildMode, targetedCell, setTargetedCell, startBuilding, db, landId, _t_lastCollected, CBOTokens, updateTokenBalance}) => {
    const [metalness, setMetalness] = useState(0.3)
    const [outline, setOutline] = useState(0.005)
    const [reload, setReload] = useState()
    var currentdate = new Date();
    var b = {
        name: null,
        level: 1,
        income: 0.1,
        stored: 0,
        t_lastCollected: _t_lastCollected,
        component: null
            }

    if(startBuilding != null){
        //updatera stored genom att räkna ut skillnaden i timestamps
        let name = startBuilding.split(":")[0]
        let level = parseInt(startBuilding.split(":")[1])
        let income = Math.round((0.1*level) * 100) / 100
        let difference = currentdate.getTime() - _t_lastCollected;
        let minutesDifference = Math.floor(difference/1000/60);
        let stored = (minutesDifference*income)/60
        
        b = {
            name: name,
            level: level,
            income: income,
            stored: (Math.floor(stored * 1000) / 1000),
            t_lastCollected: _t_lastCollected,
            component: null
                }
        
        if (b.name === "Tower"){
            b.component = <Tower level={b.level}/>
            
        }
        if (b.name === "Farm"){
            b.component = <Farm level={b.level}/>
            
        }
        if (b.name === "House"){
            b.component = <House level={b.level}/>
            
        }
           
    }
    const [building, setBuilding] = useState(b)
    const [colorMap, normalMap, roughnessMap, heightMap] = useLoader(TextureLoader, [ 
        GrassColor,
        GrassNormal,
        GrassRoughness,
        GrassHeight
      ]) 
    colorMap.wrapS = colorMap.wrapT = RepeatWrapping;
    colorMap.repeat.set(1, 1);

    useEffect(() => {
        if(targetedCell.id === id){
            setMetalness(0)
            setOutline(0.04)
        }else{
            setMetalness(0.4)
            setOutline(0.005)
            
        }
        if(startBuilding != null){
        let currentdate = new Date();
        let difference = currentdate.getTime() - building['t_lastCollected'];
        let minutesDifference = Math.floor(difference/1000/60);
        let income = Math.round((0.1*building['level']) * 100) / 100
        let stored = (minutesDifference*income)/60
        building['stored'] = (Math.floor(stored * 1000) / 1000)
        setBuilding(building)
        }
        
    }, [setMetalness, setOutline, targetedCell, id]);

    const collect = () => {
        var currentdate = new Date();
        updateTokenBalance(building['stored'])
        building['stored'] = 0
        building['t_lastCollected'] = currentdate.getTime()
        setBuilding(building)
        writeToDb()
        setReload(!reload)
    }

    const upgrade = () => {
        var currentdate = new Date();
        if(building.level < 5){
            if(CBOTokens > 1){  
                collect()
                updateTokenBalance(-1)
            building.level += 1
            
            
            building['stored'] = 0
            building['t_lastCollected'] = currentdate.getTime()
            building.income = Math.round((0.1*building.level) * 100) / 100
        }else{
            window.alert("Not enough CBOTokens")
        }
    }else{
        console.log("Building is already max level")
    }
        
        if (building.name === "Tower"){
            building.component = <Tower level={building.level}/>
            
        }
        if (building.name === "Farm"){
            building.component = <Farm level={building.level}/>
            
        }
        if (building.name === "House"){
            building.component = <House level={building.level}/>
            
        }
        
        setBuilding(building)
        writeToDb()
        setReload(!reload)
    }
    async function writeToDb(){
        try {
            setDoc(doc(db, landId.toString(), id.toString()), {
                building: building['name'],
                level: building['level'],
                income: building['income'],
                pos: pos,
                stored: building['stored'],
                t_lastCollected: building.t_lastCollected
            })
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
    const clickHandler = () => {
        setTargetedCell({
                         id: id,
                         building: building,
                         upgrade: upgrade,
                         collect: collect

        })
        console.log("clicked on")

        if(buildMode){     
           build()
        }
   
    }
    async function build(){
			if (await docExists(landId.toString(), id.toString()) === false) {
                console.log("Cell not occupied")
                if(CBOTokens > currentBuilding.buildCost){      

                updateTokenBalance(-currentBuilding.buildCost)
                building['name'] = currentBuilding['name']
                building['t_lastCollected'] = currentdate.getTime()

                if (building['name'] === "Tower"){
                    building['component'] = <Tower level={building['level']}/>
                    
                }
                if (building['name'] === "Farm"){
                    building['component'] = <Farm level={building['level']}/>
                }
                if (building['name'] === "House"){
                    building['component']  = <House level={building['level']}/>
                    
                }
                setBuilding(building)
                writeToDb()
                setReload(!reload)
                }else{
                    window.alert("Not enough CBOTokens")
                }
            }else{
                console.log("Cell already occupied")
                setBuildMode(false)
                setCurrentBuilding(null)
            }
        
    }
    return (
        <mesh position={pos} onClick={clickHandler}>
        <planeBufferGeometry attach="geometry" args={[1-outline, 1-outline]} />
    
        <meshStandardMaterial metalness ={metalness} map={colorMap} normalMap={normalMap} roughnessMap={roughnessMap} heightMap={heightMap} />   
        {building && (building.component)} 
    </mesh>
    
    );
}

export default Cell;