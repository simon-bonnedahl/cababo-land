
const BuildingTooltip= ({buildMode, targetedCell, currentBuilding, setReload, reload, updateTokenBalance, owner}) => {
    return (
            targetedCell.building && (
                <div className="info">
                    <div className="info--header">
                        <h1>{targetedCell.building.name}</h1>
                        Level: {targetedCell.building.level}
                    </div>
                    <div className="divider line glow"/>
                    {owner && (
                         <div className="info--lower">
                         <div className="info--lower-left">
                         <p>Stored: {targetedCell.building.stored} CBO</p>
                         
                         <p>Income: {targetedCell.building.income} CBO/h</p>
                         </div>
                         <div className="info--lower-right">
                             {targetedCell.building.stored > 0.01 && (<button onClick={() => (targetedCell.collect())} className='button info--buy'>Collect</button>)}
                             {targetedCell.building.level < 5 && (<button onClick={() => (targetedCell.upgrade())} className='button info--buy'>Upgrade( 1 CBO )</button>)}
                         </div>
                     </div>
                    )}
                   
                </div>
                
                )
            
        
             
    )
}

export default BuildingTooltip;
                
                
                