import React, { useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import Modal from 'react-modal';
import { Leva } from 'leva';
import styles from './App.module.css';

Modal.setAppElement('#root');

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const openModal = (content) => {
    setModalContent(content.description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const moveA = () => {
    console.log("hello world");
  };

  return (
    <>
      <Leva />
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.introText}>
            <span className={`${styles.animateText}`}>Hi I'm Fabrice,</span>
            <span className={`${styles.animateText}`}>an Interaction designer from the HfG in Schwäbisch Gmünd</span>
          </div>
          
          <div className={styles.sectionContainer}>
            <div className={styles.section}>
              <div className={`${styles.sectionTitle} ${styles.animateText}`}>Projects</div>
              <div className={styles.sectionContent}>
                <div className={styles.sectionText}>
                  <span className={`${styles.animateText}`} onClick={moveA}>AccessAbility</span>
                  <span className={`${styles.animateText}`}>Tripadvisor Redesign</span>
                  <span className={`${styles.animateText}`}>CareSense</span>
                  <span className={`${styles.animateText}`}>Sonification</span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={`${styles.sectionTitle} ${styles.animateText}`}>About me</div>
            </div>

            <div className={styles.section}>
              <div className={`${styles.sectionTitle} ${styles.animateText}`}>Contact</div>
              <div className={styles.sectionContent}>
                <div className={styles.sectionText}>
                  <span className={`${styles.animateText}`}>E-Mail</span>
                  <span className={`${styles.animateText}`}>LinkedIn</span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={`${styles.sectionTitle} ${styles.animateText}`}>Legal notice</div>
            </div>
          </div>
        </div>

        <div className={styles.canvasContainer}>
          <Canvas 
            shadows 
            camera={{ 
              position: [5, 3, 10], 
              fov: 30,
              near: 0.1,
              far: 1000
            }}
          >
            <color attach="background" args={["#FAF9F6"]} />
            <Experience onPosterClick={openModal} />
          </Canvas>
        </div>

        <Modal 
          isOpen={isModalOpen} 
          onRequestClose={closeModal}
          className={styles.modalContent}
        >
          <div>
            <h2 className={styles.modalTitle}>Project Details</h2>
            <p>{modalContent}</p>
            <button className={styles.closeButton} onClick={closeModal}>Close</button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default App;