const PlotTooltip= ({landId, landOwner, cost, hasOwner, mintPlot, landView, setLandView, account, sellPlot, cancelSell, web3, plot, buyPlot}) => {
    return (

      
        <div className="info">
        <h1 className="flex">Plot</h1>

        <div className='flex-left'>
            <div className='info--id'>
                <h2>ID</h2>
                <p>{landId}</p>
            </div>

    <div className='info--owner'>
        <h2>Owner</h2>
      {landOwner===account ? (<p>You</p>): (<p>{landOwner}</p>) }
    </div>

    {plot.forSale && (
        <div className='info--owner'>
            <h2>Cost</h2>
            <p>{`${web3.utils.fromWei(plot.price.toString(), 'ether')} ETH`}</p>
        </div>
    )}
</div>

{(plot.forSale && !hasOwner)&& (
    <button onClick={() => mintPlot(landId, plot.price)} className='button info--buy'>Mint Property</button>
    
    
)}
{landView ? (<button onClick={() => setLandView(false)} className='button info--buy'>Go Back</button>) : (<button onClick={() => setLandView(true)} className='button info--buy'>View Land</button>)}
{(landOwner===account && !plot.forSale) && (<button onClick={() => (sellPlot(landId, web3.utils.toWei('2.5', 'ether')))} className='button info--buy'>Sell Plot</button>)}
{(landOwner===account && plot.forSale) && (<button onClick={() => (cancelSell(landId))} className='button info--buy'>Cancel Sell</button>)}
{(plot.forSale && hasOwner && landOwner!==account) && ( <button onClick={() => buyPlot(landId, plot.price)} className='button info--buy'>Buy Property</button>)}
</div>



      
      
    )
}

export default PlotTooltip;
                
                
                