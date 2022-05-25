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
        <li class="buildmenu-nav__items ">
          <img src={BackArrow} ></img>
            <a onClick={() => (setBuildMode(false), setCurrentBuilding(null))}>Back</a>
          </li>

          <li class="buildmenu-nav__items ">
          <img src={HouseIcon} ></img>
            <a onClick={() => {setCurrentBuilding(House)}}>House</a>
          </li>
          
          <li class="buildmenu-nav__items ">
          <img src={FarmIcon} ></img>
            <a onClick={() => {setCurrentBuilding(Farm)}}>Farm</a>
          </li>
          <li class="buildmenu-nav__items ">
          <img src={TowerIcon} ></img>
            <a onClick={() => {setCurrentBuilding(Tower)}}>Tower</a>
          </li>
            
              
        </ul>
      </nav>
      
      
    )
}

export default Buildmenu;