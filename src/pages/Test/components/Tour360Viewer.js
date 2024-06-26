/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
function Tour360Viewer() {
  const mountRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(
    "/OneToOne/Chale_Standard.jpg"
  );

  const images = [
    {
      url: "/OneToOne/Chale_Standard.jpg",
      hotspots: [
        {
          position: { x: -100, y: 0, z: 100 },
          target: "/OneToOne/Banheiro_Standard.jpg",
        },
        {
          position: { x: 100, y: 0, z: 100 },
          target: "/OneToOne/Fachada.jpg",
        },
      ],
    },
    {
      url: "/OneToOne/Banheiro_Standard.jpg",
      hotspots: [
        {
          position: { x: 100, y: 0, z: 100 },
          target: "/OneToOne/Chale_Standard.jpg",
        },
      ],
    },
    {
      url: "/OneToOne/Fachada.jpg",
      hotspots: [
        {
          position: { x: -170, y: 0, z: 100 },
          target: "/OneToOne/Chale_Standard.jpg",
        },
      ],
    },
  ];

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); // Ajustar para a resolução da tela
    mountRef.current.appendChild(renderer.domElement);

    // Configuração de correção de gama e mapeamento de tons
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = -0.35;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    let material;
    let mesh;
    let hotspotMeshes = [];

    const loadImage = (url) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(url, (texture) => {
        //texture.encoding = THREE.sRGBEncoding;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        if (mesh) {
          scene.remove(mesh);
        }
        material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Adiciona hotspots
        hotspotMeshes.forEach((hotspotMesh) => scene.remove(hotspotMesh));
        hotspotMeshes = [];
        const currentImageData = images.find((image) => image.url === url);
        if (currentImageData) {
          currentImageData.hotspots.forEach((hotspot) => {
            const iconTexture = new THREE.TextureLoader().load(
              "/icons/hotspots_icon.svg"
            );
          //  iconTexture.encoding = THREE.sRGBEncoding;
            const hotspotGeometry = new THREE.PlaneGeometry(20, 20); // Adjust size as needed
            const hotspotMaterial = new THREE.MeshBasicMaterial({
              map: iconTexture,
              transparent: true,
            });
            const hotspotMesh = new THREE.Mesh(
              hotspotGeometry,
              hotspotMaterial
            );
            hotspotMesh.position.set(
              hotspot.position.x,
              hotspot.position.y,
              hotspot.position.z
            );
            hotspotMesh.userData = { target: hotspot.target };

            // Ensure the icon is always facing the camera
            hotspotMesh.lookAt(camera.position);
            scene.add(hotspotMesh);
            hotspotMeshes.push(hotspotMesh);
          });
        }
      });
    };

    const onDocumentMouseDown = (event) => {
      event.preventDefault();
      const mouse = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotMeshes);

      if (intersects.length > 0) {
        const targetImage = intersects[0].object.userData.target;
        setCurrentImage(targetImage);
      }
    };

    document.addEventListener("mousedown", onDocumentMouseDown, false);

    camera.position.set(0, 0, 190);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    loadImage(currentImage);

    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown, false);
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, [currentImage]);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}

export default Tour360Viewer;
