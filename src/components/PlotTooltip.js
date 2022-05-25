
const PlotTooltip= ({landName, landId, landOwner, cost, hasOwner, buyHandler, landView, setLandView}) => {
    return (

      
        <div className="info">
        <h1 className="flex">{landName}</h1>

        <div className='flex-left'>
            <div className='info--id'>
                <h2>ID</h2>
                <p>{landId}</p>
            </div>

    <div className='info--owner'>
        <h2>Owner</h2>
        <p>{landOwner}</p>
    </div>

    {!hasOwner && (
        <div className='info--owner'>
            <h2>Cost</h2>
            <p>{`${cost} ETH`}</p>
        </div>
    )}
</div>

{!hasOwner && (
    <button onClick={() => buyHandler(landId)} className='button info--buy'>Buy Property</button>
    
    
)}
{landView ? (<button onClick={() => setLandView(false)} className='button info--buy'>Go Back</button>) : (<button onClick={() => setLandView(true)} className='button info--buy'>View Land</button>)}


</div>



      
      
    )
}

export default PlotTooltip;
                
                
                