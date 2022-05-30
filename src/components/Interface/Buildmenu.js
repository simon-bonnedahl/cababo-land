import './Buildmenu.css'
import HouseIcon from '../../assets/icons/House_Icon.png'
import FarmIcon from '../../assets/icons/Farm_Icon.png'
import TowerIcon from '../../assets/icons/Tower_Icon.png'
import BackArrow from '../../assets/icons/back-arrow.svg'

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

      

      <nav className="buildmenu-nav__cont">
        <ul className="buildmenu-nav">
        <li className="buildmenu-nav__items" onClick={() => (setBuildMode(false), setCurrentBuilding(null))}>
          <img src={BackArrow} ></img>
            <a >Back</a>
          </li>

          <li className="buildmenu-nav__items " onClick={() => {setCurrentBuilding(House)}}>
          <img src={HouseIcon} ></img>
            <a >House</a>
          </li>
          
          <li className="buildmenu-nav__items " onClick={() => {setCurrentBuilding(Farm)}}>
          <img src={FarmIcon} ></img>
            <a >Farm</a>
          </li>
          <li className="buildmenu-nav__items " onClick={() => {setCurrentBuilding(Tower)}}>
          <img src={TowerIcon} ></img>
            <a >Tower</a>
          </li>
            
              
        </ul>
      </nav>
      
      
    )
}

export default Buildmenu;