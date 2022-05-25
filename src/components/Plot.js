import { useState, useEffect } from 'react';
import grass from '../assets/grass2.jpg'
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';
const Plot = ({ position, landId, hoveringLandId, landInfo, setLandName, setLandOwner, setHasOwner, setLandId ,setHoveringLandId}) => {
    const [color, setColor] = useState("#00ff00")
    const [metalness, setMetalness] = useState(0.5)
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    const colorMap = useLoader(TextureLoader, grass)
    useEffect(() => {
        if(hoveringLandId === landId){
            //setColor("pink")
            setMetalness(0)
        }else{
            //setColor("#00ff00")
            setMetalness(0.5)
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
            <planeBufferGeometry attach="geometry" args={[0.98, 0.98]} />   !!-
            <meshStandardMaterial color={color} metalness={metalness} roughness={0} />
        </mesh>
        
    );
}

export default Plot;