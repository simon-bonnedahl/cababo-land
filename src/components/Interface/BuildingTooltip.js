
import Logo from "../logo/Logo"
const BuildingTooltip= ({buildMode, targetedCell, currentBuilding, setReload, reload, updateTokenBalance, owner}) => {
    return (
            
            targetedCell.building ? (
                <div className="info">
                    <div className="info--header">
                        <h1>{targetedCell.building.name}</h1>
                        Level: {targetedCell.building.level}
                    </div>
                    <div className="divider line glow"/>
                    {owner && (
                         <div className="info--lower">
                         <div className="info--lower-left">
                        <div className="section-h25 w60">
                        Stored: <Logo size={15}></Logo> {targetedCell.building.stored} 
                        </div>
                         
                        <div className="section-h25">
                        Income: <Logo size={15}></Logo> {targetedCell.building.income } /h
                        </div>
                         </div>
                         <div className="info--lower-right">
                             {targetedCell.building.stored > 0.01 && (<button onClick={() => (targetedCell.collect())} className='button info--buy'>Collect</button>)}
                             {targetedCell.building.level < 5 && (<button onClick={() => (targetedCell.upgrade())} className='button info--buy'>Upgrade( 1 CBO )</button>)}
                         </div>
                     </div>
                    )}
                   
                </div>
                
                ) 
                : 
                (currentBuilding && (
                    <div className="info">
                    <div className="info--header">
                        <h1>{currentBuilding.name}</h1>
                        Level: 1
                    </div>
                    <div className="divider line glow"/>
                    
                    <div className="info--lower">
                        <div className="info--lower-left">
                        <div className="section-h25 w60">
                        Cost: <Logo size={15}></Logo> {currentBuilding.buildCost} 
                        </div>
                         
                        <div className="section-h25">
                        Income: <Logo size={15}></Logo> {currentBuilding.baseIncome} /h
                        </div>
                         </div>
                         
                     </div>
                    
                   
                </div>))
            
        
             
    )
}

export default BuildingTooltip;
                
                
                