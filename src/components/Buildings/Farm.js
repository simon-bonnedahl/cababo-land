import { OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

import { useLoader } from '@react-three/fiber'
import { TextureLoader, MeshStandardMaterial } from 'three';
function Farm({level}) {
    var obj = useLoader(OBJLoader, 'https://simonbonnedahl.dev/models/land/Farm_lvl' + level + '/model.obj').clone()
    const texture = useLoader(TextureLoader, 'https://simonbonnedahl.dev/models/land/Farm_lvl' + level + '/farms.jpg')
    var pos = [0, 0, 0]

    obj.traverse( function ( child ) {       
            if ( child.isMesh ) {
                child.material = new MeshStandardMaterial()
                child.material.map = texture
                child.material.metalness = 0.8
            }
        } );

    
    return (
        <primitive object={obj} 
                    rotation={[Math.PI/2, 0, 0]}
                    position = {pos}
                    scale={[0.15, 0.15, 0.15]}/>
                    
      )
  }

export default Farm;