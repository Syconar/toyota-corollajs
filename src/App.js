import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PresentationControls } from "@react-three/drei";
import { useRef } from "react";

function Model(props){
  const { scene } = useGLTF("/toyota_corolla_ps1.glb");
  const ref = useRef();

  // Rotate the model on every frame
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += -0.01;
    }
  });

  return <primitive ref={ref} object={scene} {...props} />
}

function App() {
  return (
    <Canvas
      dpr={[1.2]}
      shadows 
      camera={{ fov: 45, position: [0, 1, 5] }} 
      style={{"position": "absolute", /* width: "500px", height: "500px" */}}>
      <color attach="background" args={["#101010"]} />

      <ambientLight intensity={2}/>

      <PresentationControls 
        speed={2} 
        global 
        zoom={1} 
        polar={[0, Math.PI / 4]}>
          <Model scale={0.2}/>
      </PresentationControls>
      
    </Canvas>
  );
}

export default App;