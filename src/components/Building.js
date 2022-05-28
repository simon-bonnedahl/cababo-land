
import {  useState, useEffect } from 'react';

const Building = ({ position, size, landId, hoveringLandId, landInfo, setLandName, setLandOwner, setHasOwner, setLandId , setHoveringLandId}) => {
   var color = "#ea68dd" //"#009000"
   
   const [metalness, setMetalness] = useState(0.8)
   const [outline, setOutline] = useState(0.005)
   
   useEffect(() => {
    if(hoveringLandId == landId){
        //setColor("pink")
        setMetalness(0.5)
        setOutline(0.04)
    }else{
        //setColor("#00ff00")
        setMetalness(0.8)
        setOutline(0.005)
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
            <boxBufferGeometry args={[0.98-outline, 0.98-outline, 0.2]} />
            <meshStandardMaterial color={color} metalness={metalness} />
        </mesh>
    );
}

export default Building;