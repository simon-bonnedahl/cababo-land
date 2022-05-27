import './Buildmenu.css'
import HouseIcon from '../assets/House_Icon.png'
import FarmIcon from '../assets/Farm_Icon.png'
import TowerIcon from '../assets/Tower_Icon.png'
import BackArrow from '../assets/back-arrow.svg'

const Buildmenu = ({setBuildMode, MoveCamera, setCurrentBuilding, setTargetedCell}) => {
    const House = {
      name: "House",
      buildCost: 1,
      baseIncome: 0.1

    }
    const Farm  = {
      name: "Farm",
      buildCost: 2,
      baseIncome: 0.1

    }
    const Tower = {
      name: "Tower",
      buildCost: 3,
      baseIncome: 0.1

    }
    return (

      

      <nav class="buildmenu-nav__cont">
        <ul class="buildmenu-nav">
        <li class="buildmenu-nav__items " onClick={() => (setBuildMode(false), setCurrentBuilding(null))}>
          <img src={BackArrow} ></img>
            <a >Back</a>
          </li>

          <li class="buildmenu-nav__items " onClick={() => {setCurrentBuilding(House)}}>
          <img src={HouseIcon} ></img>
            <a >House</a>
          </li>
          
          <li class="buildmenu-nav__items " onClick={() => {setCurrentBuilding(Farm)}}>
          <img src={FarmIcon} ></img>
            <a >Farm</a>
          </li>
          <li class="buildmenu-nav__items " onClick={() => {setCurrentBuilding(Tower)}}>
          <img src={TowerIcon} ></img>
            <a >Tower</a>
          </li>
            
              
        </ul>
      </nav>
      
      
    )
}

export default Buildmenu;