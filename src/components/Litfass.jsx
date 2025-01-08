import React, { useState } from "react";
import { Decal, useGLTF, useTexture, Edges } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useControls, folder } from "leva";

const AnimatedDecal = animated(Decal);

export function Litfass({ onPosterClick, onHoverChange, ...props }) {
  const textures = [
    useTexture("/flyers/AccessAbility.png"),
    useTexture("/flyers/project02.png"),
    useTexture("/flyers/project03.png"),
    useTexture("/flyers/project04.png"),
    useTexture("/flyers/project05.png"),
    useTexture("/flyers/project06.png"),
    useTexture("/flyers/project07.png"),
    useTexture("/flyers/project08.png"),
  ];
  const { nodes, materials } = useGLTF("/models/litfass-brick.glb");

  const x = 1;
  const y = 1.2;
  const z = 1;
  const fac = 1.1;

  // Position and rotation controls for posters
  const controls = useControls({
    "Poster 1": folder({
      position1: { value: [0.0, 1, 1.0], step: 0.1 },
      rotation1: { value: [0.0, 0.0, 0.0], step: 0.1 },
    }),
    "Poster 2": folder({
      position2: { value: [0.9, -0.6, -0.5], step: 0.1 },
      rotation2: { value: [0.0, 2.0, 0.0], step: 0.1 },
    }),
    "Poster 3": folder({
      position3: { value: [-0.9, -0.6, -0.5], step: 0.1 },
      rotation3: { value: [0.0, -2.1, 0.0], step: 0.1 },
    }),
    "Poster 4": folder({
      position4: { value: [-0.5, -0.6, 0.8], step: 0.1 },
      rotation4: { value: [0.0, -0.7, 0.0], step: 0.1 },
    }),
    "Poster 5": folder({
      position5: { value: [0.7, -0.4, 0.8], step: 0.1 },
      rotation5: { value: [0.0, 0.7, 0.0], step: 0.1 },
    }),
    "Poster 6": folder({
      position6: { value: [0.8, 1, 0.0], step: 0.1 },
      rotation6: { value: [0.0, 1.5, 0.0], step: 0.1 },
    }),
    "Poster 7": folder({
      position7: { value: [0.0, 0.8, -1.0], step: 0.1 },
      rotation7: { value: [0.0, 3.1, 0.0], step: 0.1 },
    }),
    "Poster 8": folder({
      position8: { value: [-0.8, 0.8, 0.0], step: 0.1 },
      rotation8: { value: [0.0, -1.5, 0.0], step: 0.1 },
    }),
  });

  const [springs] = useState(
    textures.map(() =>
      useSpring(() => ({
        scale: [x, y, z],
        config: {
          mass: 0.1,
          friction: 10,
        },
      }))
    )
  );

  // Handle click events to notify parent
  const handleClickEvent = (index) => () => {
    const { position, rotation } = getPosterProperties(index);
    onPosterClick({
      description: `This is the detailed information for Project ${index + 1}.`,
      position, // Pass poster position
      rotation, // Pass poster rotation
    });
  };

  // Handle hover events for visual feedback
  const handlePointerEnter = (index) => () => {
    springs[index][1].start({
      scale: [x * fac, y * fac, z * fac],
    });
    onHoverChange(true);
  };

  const handlePointerLeave = (index) => () => {
    springs[index][1].start({
      scale: [x, y, z],
    });
    onHoverChange(false);
  };

  // Get poster properties for position and rotation
  const getPosterProperties = (index) => {
    switch (index) {
      case 0:
        return {
          position: controls.position1,
          rotation: controls.rotation1,
        };
      case 1:
        return {
          position: controls.position2,
          rotation: controls.rotation2,
        };
      case 2:
        return {
          position: controls.position3,
          rotation: controls.rotation3,
        };
      case 3:
        return {
          position: controls.position4,
          rotation: controls.rotation4,
        };
      case 4:
        return {
          position: controls.position5,
          rotation: controls.rotation5,
        };
      case 5:
        return {
          position: controls.position6,
          rotation: controls.rotation6,
        };
      case 6:
        return {
          position: controls.position7,
          rotation: controls.rotation7,
        };
      case 7:
        return {
          position: controls.position8,
          rotation: controls.rotation8,
        };
      default:
        return {
          position: [0, 0, 1],
          rotation: [0, 0, 0],
        };
    }
  };

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cylinder006.geometry}
        material={materials["Litfass_Material.001"]}
      />
      <mesh geometry={nodes.Cylinder006_1.geometry}>
        <meshBasicMaterial transparent opacity={0} />
        {textures.map((texture, index) => {
          const { position, rotation } = getPosterProperties(index);
          const [spring] = springs[index];
          return (
            <AnimatedDecal
              key={index}
              position={position}
              rotation={rotation}
              scale={spring.scale}
              onPointerEnter={handlePointerEnter(index)}
              onPointerLeave={handlePointerLeave(index)}
              onClick={handleClickEvent(index)}
            >
              <meshStandardMaterial
                map={texture}
                polygonOffset
                polygonOffsetFactor={-1}
              />
            </AnimatedDecal>
          );
        })}
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/litfass-brick.glb");
