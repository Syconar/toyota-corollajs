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
  const [muted, setMuted] = useState(true);

  const handleToggleAudio = () => {
    if (!audioStarted) {
      // Start playing the audio and unmute
      audioRef.current.play();
      audioRef.current.muted = false;
      setAudioStarted(true);
      setMuted(false);
    } else {
      // Toggle mute
      audioRef.current.muted = !muted;
      setMuted(!muted);
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
    <div className="absolute l-t-center flex align-center w-full">
      <h1 className="fontsize-3rem color-15171d33">Toyota Corolla</h1>
    </div>

    <img src="toyotalogo.gif"
    style={{
      position: "absolute",
      top: 20,
      left: 20,
      maxWidth: "150px",
      width: "100%",
      zIndex: 10,
    }}></img>

      <audio ref={audioRef} src="/funkytown.mp3" loop muted/>

      <div style={{ positio: "relative" }}>
        <div className="audioPlayer">
          <button
            className="audioButton"
            onClick={handleToggleAudio}
            aria-label={muted ? "Unmute music" : "Mute music"}>
            {muted ? <i class="fa-solid fa-volume-xmark"></i>: <i class="fa-solid fa-volume-high"></i>}
          </button>
        </div>
      </div>

      <div className="flex flex-row flex-nowrap w-full h-screen justify-evenly items-end relative bottom-[7%]" >

        <div className="flex flex-col items-center gap-10">
          <h1 className="color-00ffaa3d"><i class="fa-solid fa-gauge-high"></i>Speed</h1>
          <h2 className="color-white"><span>175</span>Kph</h2>
        </div>

        <div className="flex flex-col items-center gap-10">
          <h1 className="color-00ffaa3d"><i class="fa-solid fa-oil-can"></i>Oil</h1>
          <h2 className="color-white"><span>175</span>Kph</h2>
        </div>

        <div className="flex flex-col items-center gap-10">
          <h1 className="color-00ffaa3d"><i class="fa-solid fa-bolt"></i>Power</h1>
          <h2 className="color-white"><span>175</span>Kph</h2>
        </div>

      </div>

      <Canvas
        dpr={[1.2]}
        camera={{ fov: 45, position: [0, 1, 5] }} 
        style={{ 
          position: "absolute",
          zIndex: 100, 
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh"
        }}>
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