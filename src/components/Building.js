
import {  useState, useEffect } from 'react';

const Building = ({ position, size, landId, hoveringLandId, landInfo, setLandName, setLandOwner, setHasOwner, setLandId , setHoveringLandId}) => {
   var color = "#009000"
   
   const [metalness, setMetalness] = useState(0.5)
   useEffect(() => {
    if(hoveringLandId == landId){
        //setColor("pink")
        setMetalness(0)
    }else{
        //setColor("#00ff00")
        setMetalness(0.5)
    }
   
    
});
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
            <boxBufferGeometry args={size} />
            <meshStandardMaterial color={color} metalness={metalness} />
        </mesh>
    );
}

export default Building;