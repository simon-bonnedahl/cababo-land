import { useState, useEffect } from 'react';
const Plot = ({ position, size, color, landId, hoveringLandId, landInfo, setLandOwner, setHasOwner, setLandId ,setHoveringLandId, forSale}) => {
    const [metalness, setMetalness] = useState(0.8)
    const [outline, setOutline] = useState(0.01)
    if(forSale){
        color = "#ffff00"
    }
    useEffect(() => {
        if(hoveringLandId === landId){
            //setColor("pink")
            setMetalness(0.5)
            setOutline(0.04)
        }else{
            //setColor("#00ff00")
            setMetalness(0.8)
            setOutline(0.01)
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
            <boxBufferGeometry attach="geometry" args={[size[0]-outline, size[1]-outline, size[2]]} />
            <meshStandardMaterial color={color} metalness={metalness} roughness={0.4}/>
        </mesh>
        
    );
}

export default Plot;