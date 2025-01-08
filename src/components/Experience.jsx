import { Grid, Environment, OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/three";
import { Litfass } from "./Litfass";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

const AnimatedPerspectiveCamera = animated(PerspectiveCamera);

export const Experience = () => {
  // Refs
  const orbitRef = useRef();
  const cameraRef = useRef();
  const objectRef = useRef(); // Ref for the cylinder
  const [isHovered, setIsHovered] = useState(false); // hover state war für auto rotate stop
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserRotating, setisUserRotating] = useState(false);

  // Spring animation
  const [{ cameraPosition, orbitTarget, objectRotation }, api] = useSpring(() => ({
    cameraPosition: [0, 0, 7],
    orbitTarget: [0, 0, 0],
    objectRotation: [0, 0, 0],
    config: { tension: 20, friction: 10, duration: 1000 },
  }));

  const handlePosterClick = (content) => {
    setIsModalOpen(true);

    const posterPosition = new Vector3(...content.position);
    const posterRotationY = content.rotation[1]; // Poster rotation around Y-axis
    const cameraDistance = 3; // Distance from the poster

    // Get the current cylinder Y rotation
    const currentRotationY = objectRotation.get()[1];

    // Calculate the target rotation for the cylinder
    let targetRotationY = -posterRotationY;

    // Normalize the rotation to the shortest path ([-π, π])
    const deltaRotation = targetRotationY - currentRotationY;
    if (deltaRotation > Math.PI) targetRotationY -= 2 * Math.PI;
    if (deltaRotation < -Math.PI) targetRotationY += 2 * Math.PI;

    // Calculate the new camera position
    const newCameraPosition = new Vector3(0, posterPosition.y, cameraDistance);


    // Update spring animations
    api.start({
      cameraPosition: newCameraPosition.toArray(),
      orbitTarget: [0, posterPosition.y, 0],
      objectRotation: [0, targetRotationY, 0],
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    api.start({
      cameraPosition: [0, 0, 7],
      orbitTarget: [0, 0, 0],
    });
  };

  // Synchronize camera and controls Hier wird kamera und orbit controls "synchronisiert" & animiert
  useFrame(() => {
    if (isUserRotating) return;

    if (orbitRef.current && cameraRef.current) {
      const target = orbitTarget.get(); // Get the current target position

      // Update the camera position
      const cameraPos = new Vector3(...cameraPosition.get());
      cameraRef.current.position.lerp(cameraPos, 0.1);

      // Update the orbit target
      orbitRef.current.target.set(target[0], target[1], target[2]);
      orbitRef.current.update();

      //AUTO ROTATE
      // if(!isHovered) {
      //   const currentRotationY = objectRotation.get()[1]; // Get the current Y rotation
      //   const newRotationY = currentRotationY + 0.2; // Increment the rotation

      //   // Smoothly update the spring rotation
      //   api.start({
      //     objectRotation: [0, newRotationY, 0],
      //   });
      // }

    }
  });

  return (
    <>
      {/* Camera */}
      <AnimatedPerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 7]} />

      {/* OrbitControls */}
      <OrbitControls
        ref={orbitRef}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        onStart={() => setisUserRotating(true)}
        onEnd={() => {
          // Update spring to match the user's current position
          api.set({
            cameraPosition: cameraRef.current.position.toArray(),
            orbitTarget: [orbitRef.current.target.x, orbitRef.current.target.y, orbitRef.current.target.z],
          });
        
          setisUserRotating(false); // Mark rotation as stopped
        }}
      />

      {/* Scene */}
      <animated.group
        ref={objectRef}
        rotation={objectRotation.to((x, y, z) => [x, y, z])}
        position={[0, 0, 0]}
      >
        <Litfass onPosterClick={handlePosterClick} onHoverChange={setIsHovered} />
      </animated.group>

      {/* Grid */}
      <Grid position={[0, -2, 0]} args={[10.5, 10.5]} cellSize={0.1} cellColor="#A4A4A4" sectionSize={1} sectionColor="#727272" />

      {isModalOpen && <Html as="div" center>
        <div>
          <h2>Project Details</h2>
          <p>Modal content</p>
          <button onClick={() => handleModalClose()}>Close</button>
        </div>
      </Html>}
      {/* Environment */}
      <Environment preset="city" />
    </>
  );
};
