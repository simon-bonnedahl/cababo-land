import { DoubleSide } from "three"
import dirtTexture1 from '../assets/dirtTexture.png'
import dirtTexture2 from '../assets/dirtTexture_2.png'
import dirtTexture3 from '../assets/dirtTexture_3.png'
import { TextureLoader, RepeatWrapping } from 'three';
import { useLoader } from '@react-three/fiber';

const Plane = ({width, height, depth, topColor}) => {
    const colorMap1 = useLoader(TextureLoader, dirtTexture1) 
    colorMap1.wrapS = colorMap1.wrapT = RepeatWrapping;
    colorMap1.repeat.set(10, 1);
    const colorMap2 = useLoader(TextureLoader, dirtTexture2) 
    colorMap2.wrapS = colorMap2.wrapT = RepeatWrapping;
    colorMap2.repeat.set(1, 10);

    const colorMap3 = useLoader(TextureLoader, dirtTexture3) 
    colorMap3.wrapS = colorMap3.wrapT = RepeatWrapping;
    colorMap3.repeat.set(10, 10);
    
    return (
        <mesh position={[-0.5, -0.5, 0] }>
            <boxBufferGeometry attach="geometry" args={[width, height, depth]} /> 
            <meshBasicMaterial attachArray="material" map={colorMap2}  side={DoubleSide}/>
            <meshBasicMaterial attachArray="material" map={colorMap2}  side={DoubleSide}/>
            <meshBasicMaterial attachArray="material" map={colorMap1}  side={DoubleSide}/>
            <meshBasicMaterial attachArray="material" map={colorMap1}  side={DoubleSide}/>

            <meshBasicMaterial attachArray="material"   map={colorMap3}side={DoubleSide}/>
            <meshBasicMaterial attachArray="material" color={topColor} side={DoubleSide}/>

            
        </mesh>
    );
}

export default Plane;