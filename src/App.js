import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PresentationControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";

function Model(props){
  const { scene } = useGLTF("/toyota_corolla_ps1.glb");
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += -0.01;
    }
  });

  return <primitive ref={ref} object={scene} {...props} />
}

function App() {
  const audioRef = useRef(null);
  const [audioStarted, setAudioStarted] = useState(false);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setAudioStarted(true);
    }
  };

  useEffect(() => {
    // Pause audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/funkytown.mp3" loop />
      {!audioStarted && (
        <button
          onClick={handlePlayAudio}
          style={{
            position: "absolute",
            zIndex: 10,
            top: 20,
            left: 20,
            padding: "12px 24px",
            fontSize: "1.2rem",
            borderRadius: "8px",
            border: "none",
            background: "#222",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Play Music
        </button>
      )}
      <Canvas
        dpr={[1.2]}
        shadows 
        camera={{ fov: 45, position: [0, 1, 5] }} 
        style={{ position: "absolute" }}>
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
    </>
  );
}

export default App;