import { useState, useEffect } from 'react';
import grass from '../assets/grass2.jpg'
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
const Plot = ({ position, landId, hoveringLandId, landInfo, setLandOwner, setHasOwner, setLandId ,setHoveringLandId}) => {
    const [color, setColor] = useState("#6f6fC4") //"#00ff00"
    const [metalness, setMetalness] = useState(0.8)
    const [outline, setOutline] = useState(0.005)
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    const colorMap = useLoader(TextureLoader, grass)
    useEffect(() => {
        if(hoveringLandId === landId){
            //setColor("pink")
            setMetalness(0.5)
            setOutline(0.04)
        }else{
            //setColor("#00ff00")
            setMetalness(0.8)
            setOutline(0.005)
        }
       
        
    }, [hoveringLandId, landId]);

    const clickHandler = () => {
        setLandId(landId)
        setHoveringLandId(landId)
        

        if (landInfo.owner === '0x0000000000000000000000000000000000000000') {
            setLandOwner('None')
            setHasOwner(false)
        } else {
            setLandOwner(landInfo.owner)
            setHasOwner(true)
        }
    }
    return (
        <mesh position={position} onClick={clickHandler}>
            <planeBufferGeometry attach="geometry" args={[1-outline, 1-outline]} />  
            <meshStandardMaterial color={color} emissive="#000000" metalness={metalness} roughness={0}/>
        </mesh>
        
    );
}

export default Plot;