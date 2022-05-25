
const BuildingTooltip= ({buildMode, targetedCell, currentBuilding, setReload, reload, updateTokenBalance}) => {
    return (
        (buildMode ) ? 
                    (
                    currentBuilding ? (<div className="info">
                    <h1 className="flex">{currentBuilding['name']}</h1>
                    <div className='info--owner'>
                                <h2>Cost</h2>
                                <p>{currentBuilding['buildCost']} CBO</p>
                            </div>
                    </div>) : (<div></div>)
                    
                    ) 
				    : 
				    ((targetedCell && targetedCell.building && targetedCell.building.component) ? (
                    <div className="info">
                    <h1 className="flex">{targetedCell.building.name}</h1>
                    <div className='flex-left'>
                            <div className='info--id'>
                                <h2>LVL</h2>
                                <p>{targetedCell.building.level}</p>
                            </div>
                            <div className='info--owner'>
                                <h2>Income</h2>
                                <p>{targetedCell.building.income}/h</p>
                            </div>
                            <div className='info--owner'>
                                 <h2>Stored</h2>
                                <p>{targetedCell.building.stored}</p>
                            </div>
                    </div>
                    {targetedCell.building.level < 5 && (<button onClick={() => (targetedCell.upgrade() , setReload(!reload))} className='button info--buy'>Upgrade( 1 CBO )</button>)}
                    {targetedCell.building.stored > 0.01 && (<button onClick={() => (targetedCell.collect(), setReload(!reload))} className='button info--buy'>Collect</button>)}
				    </div>
                    ): (<div></div>)
        
             ) 
    )
}

export default BuildingTooltip;
                
                
                