import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PresentationControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { AudioIconOff } from "./audioIcons/audioIconOff.jsx";
import { AudioIconOn } from "./audioIcons/audioIconOn.jsx";
import { CarSpeed } from "./carIcons/carSpeed.jsx";
import { CarOil } from "./carIcons/carOil.jsx";
import { CarPower } from "./carIcons/carPower.jsx";


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
  const [carScale, setCarScale] = useState(0.2);

  useEffect(() => { // Responsive scale for the rotating car model
        function handleResize() {
      if (window.innerWidth < 600) {
        setCarScale(0.12); // Mobile scale
      } else if (window.innerWidth < 900) {
        setCarScale(0.18); // Tablets scale
      } else {
        setCarScale(0.2); // Default scale
      }
    }
    handleResize(); // setting initial scale
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
     }, []);


  useEffect(() => { // Minimum loading time and progress bar logic
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

    <div className="fixed flex flex-col l-t-center align-center w-full gap-responsive">
      <h1 className="header-size-12vw color-15171d33 m-0auto">Toyota</h1>
      <h1 className="header-size-12vw color-15171d33 m-0auto">Corolla</h1>
    </div>

      <audio ref={audioRef} src="/funkytown.mp3" loop muted/>

      <div style={{ positio: "relative" }}>
        <div className="audioPlayer">
          <button
            className="audioButton flex"
            onClick={handleToggleAudio}
            aria-label={muted ? "Unmute music" : "Mute music"}>
            {muted ? <span className="audioSpan"><AudioIconOff/></span> : <span className="audioSpan"><AudioIconOn/></span>}
          </button>
        </div>
      </div>

      <section>
        <div className="flex flex-responsive flex-nowrap w-full h-screen justify-evenly items-end relative p-bottom-responsive fade-in-out" >

          <div className="car-info-box">

            <div className="flex flex-col items-center gap-5">
              <h1 className="color-00ffaa3d details-size-responsive flex gap-10 text-items-center"><span className="carInfo"><CarPower /></span>Speed</h1>
              <h2 className="color-white details-size-responsive"><span>175</span>Kph</h2>
            </div>

            <div className="flex flex-col items-center gap-5">
              <h1 className="color-00ffaa3d details-size-responsive flex gap-10 text-items-center"><span className="carInfo"><CarOil /></span>Oil</h1>
              <h2 className="color-white details-size-responsive"><span>50</span>L</h2>
            </div>

            <div className="flex flex-col items-center gap-5">
              <h1 className="color-00ffaa3d details-size-responsive flex gap-10 text-items-center"><span className="carInfo"><CarSpeed /></span>Power</h1>
              <h2 className="color-white details-size-responsive"><span>63</span>kW</h2>
            </div>

          </div>

        </div>
      </section>

      <section>
        <div className="flex flex-responsive flex-nowrap w-full h-screen justify-evenly items-end relative p-bottom-responsive" >

          <div className="car-info-box">

          <div className="flex flex-col items-center gap-10">
            <h1 className="color-00ffaa3d details-size-responsive"><i class="fa-solid fa-gauge-high"></i>Speed</h1>
            <h2 className="color-white details-size-responsive"><span>175</span>Kph</h2>
          </div>

          <div className="flex flex-col items-center gap-10">
            <h1 className="color-00ffaa3d details-size-responsive"><i class="fa-solid fa-oil-can"></i>Oil</h1>
            <h2 className="color-white details-size-responsive"><span>50</span>L</h2>
          </div>

          <div className="flex flex-col items-center gap-10">
            <h1 className="color-00ffaa3d details-size-responsive"><i class="fa-solid fa-bolt"></i>Power</h1>
            <h2 className="color-white details-size-responsive"><span>63</span>kW</h2>
          </div>

          </div>

        </div>
      </section>


      <Canvas
        dpr={[1.2]}
        camera={{ fov: 45, position: [0, 1, 5] }} 
        style={{ 
          position: "fixed",
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
            <Model scale={carScale}/>
        </PresentationControls>
      </Canvas>
    </>
  );
}

export default App;