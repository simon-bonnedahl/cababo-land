import { DoubleSide } from "three"
import texture_1 from '../assets/stone3Texture_1.jpeg'
import texture_2 from '../assets/stone3Texture_2.jpeg'
import texture_3 from '../assets/stone3Texture_3.jpeg'
import { TextureLoader, RepeatWrapping } from 'three';
import { useLoader } from '@react-three/fiber';

const Plane = ({width, height, depth, topColor}) => {
    const colorMap1 = useLoader(TextureLoader, texture_1) 
    colorMap1.wrapS = colorMap1.wrapT = RepeatWrapping;
    colorMap1.repeat.set(10, 1);
    const colorMap2 = useLoader(TextureLoader, texture_2) 
    colorMap2.wrapS = colorMap2.wrapT = RepeatWrapping;
    colorMap2.repeat.set(1, 10);

    const colorMap3 = useLoader(TextureLoader, texture_3) 
    colorMap3.wrapS = colorMap3.wrapT = RepeatWrapping;
    colorMap3.repeat.set(10, 10);
    
    return (
        <mesh position={[-0.5, -0.5, 0] }>
            <boxBufferGeometry attach="geometry" args={[width, height, depth]} /> 
            <meshStandardMaterial attachArray="material" map={colorMap2}  side={DoubleSide}/>
            <meshStandardMaterial attachArray="material" map={colorMap2}  side={DoubleSide}/>
            <meshStandardMaterial attachArray="material" map={colorMap1}  side={DoubleSide}/>
            <meshStandardMaterial attachArray="material" map={colorMap1}  side={DoubleSide}/>

            <meshStandardMaterial attachArray="material" map={colorMap3} side={DoubleSide}/>
            <meshStandardMaterial attachArray="material" color={topColor} side={DoubleSide}/>

            
        </mesh>
    );
}

export default Plane;