import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PresentationControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";

// Model of the car
function Model(props){
  const { scene } = useGLTF("/toyota_corolla_ps1.glb");
  const ref = useRef();

  useFrame(() => { // Rotating animation and its speed
    if (ref.current) {
      ref.current.rotation.y += -0.01;
    }
  });

  return <primitive ref={ref} object={scene} {...props} />
}

function App() {
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [filled, setFilled] = useState(0);

  // Minimum loading time and progress bar logic
  useEffect(() => {
    let timer;
    let progress;
    if (isLoading) {
      // Progress bar fills over 3 seconds (3000ms / 100 steps = 30ms per step)
      progress = setInterval(() => {
        setFilled(prev => {
          if (prev < 100) return prev + 2;
          return prev;
        });
      }, 60); // 60ms * 50 steps = 3000ms

      // Hide loading after 3 seconds
      timer = setTimeout(() => {
        setIsLoading(false);
        setFilled(100);
      }, 3200);
    }
    return () => {
      clearTimeout(timer);
      clearInterval(progress);
    };
  }, [isLoading]);

  // Audio logic
  const audioRef = useRef(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [muted, setMuted] = useState(true);

  const handleToggleAudio = () => {
    if (!audioStarted) {
      audioRef.current.play();
      audioRef.current.muted = false;
      setAudioStarted(true);
      setMuted(false);
    } else {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <>
    {isLoading && (
      <div class="container" style={{ position: "fixed", top: 0, left: 0, zIndex: 2000 }}>

        <div class="loading">
          <img src="/loading/car-loading.gif"></img>
        </div>

        <div className="progressBar">
            <div 
              style={{
                width: `${filled}%`,
                height: "100%",
                backgroundColor: "#26634fff",
                transition: "width 0.2s",
              }}>
            </div>

            <span className="progressBarPercentage">
            </span>

          </div>
      </div>
    )}

    <div className="absolute l-t-center flex align-center w-full">
      <h1 className="fontsize-3rem color-15171d33">Toyota Corolla</h1>
    </div>

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
          <h2 className="color-white"><span>50</span>L</h2>
        </div>

        <div className="flex flex-col items-center gap-10">
          <h1 className="color-00ffaa3d"><i class="fa-solid fa-bolt"></i>Power</h1>
          <h2 className="color-white"><span>63</span>kW</h2>
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