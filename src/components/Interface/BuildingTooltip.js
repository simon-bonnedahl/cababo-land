
import Logo from "../logo/Logo"
const BuildingTooltip= ({buildMode, targetedCell, currentBuilding, setReload, reload, updateTokenBalance, owner}) => {
    return (
     
                currentBuilding ? (
                    <div className="info">
                    <div className="info--header">
                        <h1>{currentBuilding.name}</h1>
                        Level: 1
                    </div>
                    <div className="divider line glow"/>
                    
                    <div className="info--lower">
                        <div className="info--lower-left">
                            <div className="info--row">
                                <div className="info--column">
                                    Cost:  
                                </div>
                                <div className="info--column">
                                    <Logo size={15}></Logo> {currentBuilding.buildCost}  
                                </div>      
                            </div>
                        </div>
                        <div className="info--lower-right">
                            <div className="info--row">
                                <div className="info--column">
                                    Income:  
                                </div>
                                <div className="info--column">
                                    <Logo size={15}></Logo> {currentBuilding.baseIncome} <span>/h</span>
                                </div>
                            </div>
                        </div>
                       
                         
                         
                     </div>
                    
                   
                </div>)
                :
                (targetedCell.building && (
                    <div className="info">
                        <div className="info--header">
                            <h1>{targetedCell.building.name}</h1>
                            Level: {targetedCell.building.level}
                        </div>
                        <div className="divider line glow"/>
                        {owner && (
                             <div className="info--lower">
                                <div className="info--lower-left">
                                    <div className="info--row">
                                        <div className="info--column">
                                            Stored: 
                                        </div>
                                        <div className="info--column">
                                            <Logo size={15}></Logo> {targetedCell.building.stored} 
                                        </div>
                
                                    </div>
                                    {targetedCell.building.stored > 0.01 && (<button onClick={() => (targetedCell.collect())} className='button info--buy'>Collect</button>)}
                             
                           
                                </div>
                                <div className="info--lower-right">
                                    <div className="info--row">
                                        <div className="info--column">
                                            Income: 
                                        </div>
                                        <div className="info--column">
                                            <Logo size={15}></Logo> {targetedCell.building.income } <span>/h</span>
                                        </div>
                                   
                                    </div>
                                    {targetedCell.building.level < 5 && (<button onClick={() => (targetedCell.upgrade())} className='button info--buy'>Upgrade( 1 CBO )</button>)}
                                </div>
                         </div>
                        )}
                       
                    </div>
                    
                    ) )
            
        
             
    )
}

export default BuildingTooltip;
                
                
                