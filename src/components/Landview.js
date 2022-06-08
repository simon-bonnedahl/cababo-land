import Cell from './Cell.js'
import Plane from './Plane.js'
import Loader from './loader/Loader'
import { useState, useEffect, Fragment} from "react";
import { Html} from "@react-three/drei";
import { getDocs, collection } from "firebase/firestore";

const Landview = ({currentBuilding, setCurrentBuilding, buildMode, setBuildMode, targetedCell, setTargetedCell, db, landId, landOwner, CBOTokens, updateTokenBalance}) => {
    const [loading, setLoading] = useState(true)
    const [cells, setCells] = useState([])

    useEffect(() => { 
        let id = 0
        const fetchCellData = async () => {
            let querySnapshot = await getDocs(collection(db, landId.toString()))

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                let data = doc.data()
    
                cells[doc.id-1] = { id: parseInt(doc.id),
                                            pos: data['pos'],
                                            startBuilding: data['building'] + ":" + data['level'].toString(),
                                            t_lastCollected: data['t_lastCollected']
                                            }
                console.log(doc.id, " => ", data['building']);
                
              });
            setLoading(false)
        }
        for(let x=-5; x< 5; x++){
            for(let y=-5; y<5; y++){
                id++
                cells[id-1] = {id: id,
                            pos: [x, y, 0.51],
                            startBuilding: null,
                            t_lastCollected: null}
            }
        }
        fetchCellData()
        .catch(console.error)
    }, [])
 

    
  

    
        return (
            loading ? (
            
            <Html fullscreen={true}>
                    <h1>Loading Database ...</h1>
                    <h1> </h1>
                    <Loader/>
            </Html>) 
            : 
            (
                <group rotation={[-Math.PI/2, 0, 0]}>
                {cells.map((cell)=>{
                    return(
                          <Fragment key={cell['id']}>
                           <Cell    id={cell['id']}
                                    startBuilding={cell['startBuilding']}
                                    pos={cell['pos']}
                                    currentBuilding={currentBuilding}
                                    setCurrentBuilding={setCurrentBuilding}
                                    buildMode={buildMode}
                                    setBuildMode={setBuildMode}
                                    targetedCell={targetedCell}
                                    setTargetedCell={setTargetedCell}
                                    db={db}
                                    landId={landId}
                                    _t_lastCollected={cell['t_lastCollected']}
                                    CBOTokens = {CBOTokens}
                                    updateTokenBalance={updateTokenBalance}
        
                           />
                           </Fragment>
                        )
                })}
                <Plane height={10} width={10} depth={1} topColor={"#FFFFFF"}/>
                </group>
                )   
        )
   
}

export default Landview;