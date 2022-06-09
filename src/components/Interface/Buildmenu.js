import './Buildmenu.css'
import HouseIcon from '../../assets/icons/House_Icon.png'
import FarmIcon from '../../assets/icons/Farm_Icon.png'
import TowerIcon from '../../assets/icons/Tower_Icon.png'
import BackArrow from '../../assets/icons/back-arrow.svg'
import { useState } from 'react'

const Buildmenu = ({setBuildMode, setCurrentBuilding, setTargetedCell}) => {

    const [clicked, setClicked] = useState(null)

    const House = {
      name: "House",
      buildCost: 1,
      baseIncome: 0.1

    }
    const Farm  = {
      name: "Farm",
      buildCost: 2,
      baseIncome: 0.2

    }
    const Tower = {
      name: "Tower",
      buildCost: 3,
      baseIncome: 0.3

    }

    return (

      

      <nav className="buildmenu-nav__cont">
        <ul className="buildmenu-nav">
        <li className="buildmenu-nav__items" onClick={() => (setBuildMode(false), setCurrentBuilding(null))}>
          <img src={BackArrow} ></img>
            <a >Back</a>
          </li>

          <li className="buildmenu-nav__items " onClick={() => setClicked("House")} onMouseEnter={() => (setCurrentBuilding(House), setClicked(null))} onMouseLeave={() => (clicked != "House" && setCurrentBuilding(null))}>
          <img src={HouseIcon} ></img>
            <a >House</a>
          </li>
          
          <li className="buildmenu-nav__items " onClick={() => setClicked("Farm")} onMouseEnter={() => (setCurrentBuilding(Farm), setClicked(null))} onMouseLeave={() => (clicked != "Farm" && setCurrentBuilding(null))}>
          <img src={FarmIcon} ></img>
            <a >Farm</a>
          </li>
          <li className="buildmenu-nav__items " onClick={() => setClicked("Tower")} onMouseEnter={() => (setCurrentBuilding(Tower), setClicked(null))} onMouseLeave={() => (clicked != "Tower" && setCurrentBuilding(null))}>
          <img src={TowerIcon} ></img>
            <a >Tower</a>
          </li>
            
              
        </ul>
      </nav>
      
      
    )
}

export default Buildmenu;