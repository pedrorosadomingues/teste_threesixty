/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeSixtyViewer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); // Ajustar para a resolução da tela
    mountRef.current.appendChild(renderer.domElement);

    // Configuração de correção de gama
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    // renderer.outputEncoding = THREE.sRGBEncoding;

    // Configuração do mapeamento de tons e exposição
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = -0.25;

    // Adicionar OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.rotateSpeed = -0.3;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/OneToOne/Chale_Standard.jpg', (texture) => {
      // texture.encoding = THREE.sRGBEncoding; // Garantir a correção de cor da textura
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const mesh = new THREE.Mesh(geometry, material);


      // Ajustar a rotação inicial da imagem CAPA
      mesh.rotation.y = THREE.MathUtils.degToRad(-5);
      mesh.rotation.x = THREE.MathUtils.degToRad(10);

      scene.add(mesh);
    });

    camera.position.set(0, 0, 400);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Função para lidar com redimensionamento da janela
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeSixtyViewer;