import { useState, useEffect } from 'react';
import grass from '../assets/grass2.jpg'
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
const Plot = ({ position, landId, hoveringLandId, landInfo, setLandName, setLandOwner, setHasOwner, setLandId ,setHoveringLandId}) => {
    const [color, setColor] = useState("#6f6fC4") //"#00ff00"
    const [metalness, setMetalness] = useState(0.2)
    const [outline, setOutline] = useState(0.005)
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    const colorMap = useLoader(TextureLoader, grass)
    useEffect(() => {
        if(hoveringLandId === landId){
            //setColor("pink")
            setMetalness(0)
            setOutline(0.04)
        }else{
            //setColor("#00ff00")
            setMetalness(0.2)
            setOutline(0.005)
        }
       
        
    }, [hoveringLandId, landId]);

    const clickHandler = () => {
        setLandName(landInfo.name)
        setLandId(landId)
        setHoveringLandId(landId)
        

        if (landInfo.owner === '0x0000000000000000000000000000000000000000') {
            setLandOwner('No Owner')
            setHasOwner(false)
        } else {
            setLandOwner(landInfo.owner)
            setHasOwner(true)
        }
    }
    return (
        <mesh position={position} onClick={clickHandler}>
            <planeBufferGeometry attach="geometry" args={[1-outline, 1-outline]} />  
            <meshStandardMaterial color={color} emissive="#000000" metalness={metalness} roughness={1}/>
        </mesh>
        
    );
}

export default Plot;