import { useState, useEffect } from 'react';
import GrassTexture from '../assets/grass.jpeg'
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
import { RepeatWrapping } from 'three';
import House from './Buildings/House'
import Farm from './Buildings/Farm'
import Tower from './Buildings/Tower'

import { doc, setDoc, getDoc} from "firebase/firestore"; 


const Cell = ({pos, id, currentBuilding, setCurrentBuilding, buildMode, setBuildMode, targetedCell, setTargetedCell, startBuilding, db, landId, _t_lastCollected, CBOTokens, updateTokenBalance}) => {
    const [metalness, setMetalness] = useState(0.8)
    const [outline, setOutline] = useState(0.005)
   
    
    
    var _building = null
    if(startBuilding){
        var currentdate = new Date();

        let _name = startBuilding.split(":")[0]
        let _level = parseInt(startBuilding.split(":")[1])
        let _income = Math.round((0.1*_level) * 100) / 100
        let difference = currentdate.getTime() - _t_lastCollected;
        let minutesDifference = Math.floor(difference/1000/60);
        let _stored = (minutesDifference*_income)/60
        let _model = null;
        if (_name === "Tower"){
            _model = <Tower level={_level}/> 
        }
        if (_name === "Farm"){
            _model = <Farm level={_level}/>  
        }
        if (_name === "House"){
            _model = <House level={_level}/>  
        }

        _building = {
            name: _name,
            level: _level,
            income: _income,
            stored: (Math.floor(_stored * 1000) / 1000),
            t_lastCollected: _t_lastCollected,
            model: _model
                }
                
    }
    const [building, setBuilding] = useState(_building)
    useEffect(() => {
        if(targetedCell.id === id){
            setMetalness(0.5)
            setOutline(0.04)
        }else{
            setMetalness(0.8)
            setOutline(0.005)
            
        }
        if(building){
            let currentdate = new Date();
            let difference = currentdate.getTime() - building['t_lastCollected'];
            let minutesDifference = Math.floor(difference/1000/60);
            let income = Math.round((0.1*building['level']) * 100) / 100
            let stored = (minutesDifference*income)/60
            building['stored'] = (Math.floor(stored * 1000) / 1000)
            setBuilding(building)
        }
        
    }, [targetedCell, id]);

    const collect = () => {
        var currentdate = new Date();
        updateTokenBalance(building['stored'])
        building['stored'] = 0
        building['t_lastCollected'] = currentdate.getTime()
        setBuilding(building)
        writeToDb(building)
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
            building.model = <Tower level={building.level}/>
            
        }
        if (building.name === "Farm"){
            building.model = <Farm level={building.level}/>
            
        }
        if (building.name === "House"){
            building.model = <House level={building.level}/>
            
        }
        
        setBuilding(building)
        writeToDb(building)
    }
    
    async function writeToDb(_building){
        try {
            setDoc(doc(db, landId.toString(), id.toString()), {
                building: _building['name'],
                level: _building['level'],
                income: _building['income'],
                pos: pos,
                stored: _building['stored'],
                t_lastCollected: _building.t_lastCollected
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
        

        if(buildMode){     
           build()
        }
   
    }
    async function build(){
            var currentdate = new Date();   
			if (await docExists(landId.toString(), id.toString()) === false) {
                console.log("Cell not occupied")
                if(CBOTokens >= currentBuilding.buildCost){      
                updateTokenBalance(-currentBuilding.buildCost)
                _building = {
                    name: currentBuilding['name'],
                    level: 1,
                    income: 0.1,
                    stored: 0,
                    t_lastCollected: currentdate.getTime(),
                    model: null
                        }
                 

                if (_building['name'] === "Tower"){
                   _building['model'] = <Tower level={1}/>
                    
                }
                if (_building['name'] === "Farm"){
                    _building['model'] = <Farm level={1}/>
                }
                if (_building['name'] === "House"){
                    _building['model']  = <House level={1}/>
                    
                }
                setBuilding(_building)
                writeToDb(_building)
                }else{
                    window.alert("Not enough CBOTokens")
                }
            }else{
                console.log("Cell already occupied")
                setBuildMode(false)
                setCurrentBuilding(null)
            }
        
    }
    const colorMap = useLoader(TextureLoader, GrassTexture) 
    colorMap.wrapS = colorMap.wrapT = RepeatWrapping;
    colorMap.repeat.set(1, 1);
    return (
        <mesh position={pos} onClick={clickHandler}>
        <planeBufferGeometry attach="geometry" args={[1-outline, 1-outline]} />
    
        <meshStandardMaterial metalness = {metalness} map={colorMap} emissive="#000000" roughness={0} />   
        {building && (building.model)} 
    </mesh>
    
    );
}

export default Cell;