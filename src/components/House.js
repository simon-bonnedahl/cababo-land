import { OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

import { useLoader } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, SpotLight, useDepthBuffer } from '@react-three/drei'
import { TextureLoader, MeshStandardMaterial } from 'three';
import { Physics } from '@react-three/cannon';
function House({level}) {
    var obj = useLoader(OBJLoader, 'https://simonbonnedahl.dev/models/land/House_lvl' + level + '/model.obj').clone()
    const texture = useLoader(TextureLoader, 'https://simonbonnedahl.dev/models/land/House_lvl' + level + '/houses.jpg')

    var pos = [0, 0, -0.05]

        obj.traverse( function ( child ) {       
            if ( child.isMesh ) {
                child.material = new MeshStandardMaterial()
                child.material.map = texture
                child.material.metalness = 0.8
                
            }
        } );
 
    function MovingSpot({ vec = new Vector3(), ...props }) {
        const light = useRef()
        const viewport = useThree((state) => state.viewport)
        useFrame((state) => {
            light.current.target.position.lerp(vec.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0), 0.1)
            light.current.target.updateMatrixWorld()
        })
        return <SpotLight castShadow ref={light} penumbra={1} distance={6} angle={0.35} attenuation={5} anglePower={4} intensity={2} {...props} />
        }

    
    return (
        <Physics>
        <primitive object={obj} 
                    rotation={[Math.PI/2, 0, 0]}
                    position = {pos}
                    scale={[0.2, 0.2, 0.2]}/>
                
         
      </Physics>         
      )
      
  }

export default House;