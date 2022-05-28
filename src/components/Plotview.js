import Plot from "./Plot";
import Building from "./Building";
import Plane from "./Plane";
const Plotview = ({plots, hoveringLandId, setLandName, setLandOwner, setHasOwner, setLandId, setHoveringLandId}) => {
    return (
        <group  rotation={[-Math.PI/2, 0, 0]}>
            {plots && plots.map((plot, index) => {
            if (plot.owner === '0x0000000000000000000000000000000000000000') {
                return (
                    <Plot
                        key={index}
                        position={[(plot.id % 10)-5, (Math.floor(plot.id / 10))-5, 0.51]}
                        size={[1, 1]}
                        landId={index + 1}
                        hoveringLandId={hoveringLandId}
                        landInfo={plot}
                        setLandName={setLandName}
                        setLandOwner={setLandOwner}
                        setHasOwner={setHasOwner}
                        setLandId={setLandId}
                        setHoveringLandId={setHoveringLandId}
                        
                    />
                )
            } else {
                return (
                 
                    <Building
                        key={index}
                        position={[(plot.id % 10)-5, (Math.floor(plot.id / 10))-5, 0.5]}
                        landId={index + 1}
                        hoveringLandId={hoveringLandId}
                        landInfo={plot}
                        setLandName={setLandName}
                        setLandOwner={setLandOwner}
                        setHasOwner={setHasOwner}
                        setLandId={setLandId}
                        setHoveringLandId={setHoveringLandId}
                        forSale={plot.forSale}
                    />
                )
            }
        })}
           <Plane height={10} width={10} depth={-1} color={"#FFFF00"}/>
            </group>
        
        
            
    );
}
export default Plotview;