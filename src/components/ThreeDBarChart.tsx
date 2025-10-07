import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface ThreeDBarChartProps {
  data: number[];
  labels: string[];
  width?: number;
  height?: number;
}

export function ThreeDBarChart({ data, labels, width = 600, height = 400 }: ThreeDBarChartProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(10, 15, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Add light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Create bars
    const maxData = Math.max(...data);
    const barWidth = 1;
    const gap = 0.5;

    data.forEach((value, index) => {
      const height = (value / maxData) * 10;
      const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);
      const colorHue = (index / data.length) * 0.4; // varied hues
      const material = new THREE.MeshPhongMaterial({ color: new THREE.Color().setHSL(colorHue, 0.7, 0.5) });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(index * (barWidth + gap), height / 2, 0);
      scene.add(bar);
    });

    // Add grid helper
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [data, width, height]);

  return <div ref={mountRef} style={{ width, height }} />;
}
