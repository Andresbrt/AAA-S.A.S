"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Admin3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL support
    try {
      const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = window.innerWidth || 1440;
    const height = window.innerHeight || 900;

    // Three.js scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040b10, 0.0022);

    const camera = new THREE.PerspectiveCamera(
      50,
      width / height,
      1,
      1000
    );
    camera.position.set(0, 35, 115);
    camera.lookAt(0, -6, 0);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 1. Architectural 3D Ocean Topography Mesh (Wireframe Waves)
    const gridSegmentsX = 64;
    const gridSegmentsY = 64;
    const gridWidth = 320;
    const gridHeight = 320;

    const terrainGeo = new THREE.PlaneGeometry(
      gridWidth,
      gridHeight,
      gridSegmentsX,
      gridSegmentsY
    );
    terrainGeo.rotateX(-Math.PI / 2.3);

    const terrainMat = new THREE.MeshBasicMaterial({
      color: 0x306a82,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, -16, -10);
    scene.add(terrainMesh);

    // 2. Glowing Nodes on Topography Vertices (Points)
    const pointsCount = (gridSegmentsX + 1) * (gridSegmentsY + 1);
    const pointColors = new Float32Array(pointsCount * 3);

    const colorTeal = new THREE.Color(0x376f87);
    const colorCyan = new THREE.Color(0x38bdf8);
    const colorGold = new THREE.Color(0xd4af37);
    const colorDeep = new THREE.Color(0x0a2636);

    let colorIdx = 0;
    for (let ix = 0; ix <= gridSegmentsX; ix++) {
      for (let iy = 0; iy <= gridSegmentsY; iy++) {
        const ratio = (ix + iy) / (gridSegmentsX + gridSegmentsY);
        let vertexColor = colorDeep.clone().lerp(colorTeal, ratio);

        if ((ix + iy) % 8 === 0) {
          vertexColor = vertexColor.lerp(colorCyan, 0.9);
        } else if ((ix * iy) % 15 === 0) {
          vertexColor = vertexColor.lerp(colorGold, 0.75);
        }

        pointColors[colorIdx] = vertexColor.r;
        pointColors[colorIdx + 1] = vertexColor.g;
        pointColors[colorIdx + 2] = vertexColor.b;
        colorIdx += 3;
      }
    }

    const pointsGeo = new THREE.BufferGeometry();
    const terrainPositions = terrainGeo.attributes.position.clone();
    pointsGeo.setAttribute("position", terrainPositions);
    pointsGeo.setAttribute("color", new THREE.BufferAttribute(pointColors, 3));

    // Particle texture generation
    const getCircleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.25, "rgba(56, 189, 248, 0.9)");
        gradient.addColorStop(0.7, "rgba(55, 111, 135, 0.35)");
        gradient.addColorStop(1, "rgba(4, 11, 16, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    };

    const particleTexture = getCircleTexture();

    const pointsMat = new THREE.PointsMaterial({
      size: 3.8,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    pointsMesh.position.set(0, -16, -10);
    scene.add(pointsMesh);

    // 3. Golden Luxury Embers / Architectural Starlight
    const goldCount = 140;
    const goldPositions = new Float32Array(goldCount * 3);
    const goldVelocities: { x: number; y: number; z: number }[] = [];

    for (let g = 0; g < goldCount; g++) {
      goldPositions[g * 3] = (Math.random() - 0.5) * 220;
      goldPositions[g * 3 + 1] = (Math.random() - 0.2) * 100;
      goldPositions[g * 3 + 2] = (Math.random() - 0.5) * 160;

      goldVelocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: 0.05 + Math.random() * 0.09,
        z: (Math.random() - 0.5) * 0.04,
      });
    }

    const goldGeometry = new THREE.BufferGeometry();
    goldGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(goldPositions, 3)
    );

    const getGoldTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, "rgba(255, 255, 240, 1)");
        gradient.addColorStop(0.3, "rgba(245, 215, 110, 0.9)");
        gradient.addColorStop(0.7, "rgba(212, 175, 55, 0.4)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    };

    const goldMaterial = new THREE.PointsMaterial({
      size: 4.2,
      color: 0xffffff,
      map: getGoldTexture(),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const goldParticles = new THREE.Points(goldGeometry, goldMaterial);
    scene.add(goldParticles);

    // 4. Master Plan Compass Rings
    const ringGeo = new THREE.RingGeometry(52, 52.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x376f87,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    ringMesh.position.set(0, -12, -25);
    scene.add(ringMesh);

    const innerRingGeo = new THREE.RingGeometry(30, 30.4, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.rotation.x = Math.PI / 2.3;
    innerRingMesh.position.set(0, -12, -25);
    scene.add(innerRingMesh);

    // Parallax mouse tracker
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetX = (event.clientX - window.innerWidth / 2) * 0.035;
      targetY = (event.clientY - window.innerHeight / 2) * 0.025;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!renderer || !canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.025;

      // Smooth camera parallax
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      camera.position.x = mouseX * 0.7;
      camera.position.y = 35 - mouseY * 0.5;
      camera.lookAt(0, -6, 0);

      // Rotate architectural rings
      ringMesh.rotation.z += 0.0012;
      innerRingMesh.rotation.z -= 0.0018;

      // Deform topography terrain & points together
      const terrainPos = terrainGeo.attributes.position as THREE.BufferAttribute;
      const pointsPos = pointsGeo.attributes.position as THREE.BufferAttribute;
      const tArray = terrainPos.array as Float32Array;
      const pArray = pointsPos.array as Float32Array;

      let vIdx = 0;
      for (let ix = 0; ix <= gridSegmentsX; ix++) {
        for (let iy = 0; iy <= gridSegmentsY; iy++) {
          const zElevation =
            Math.sin((ix + clock * 1.2) * 0.28) * 3.8 +
            Math.sin((iy + clock * 0.9) * 0.32) * 3.8 +
            Math.cos((ix + iy + clock) * 0.18) * 2.2;

          tArray[vIdx + 2] = zElevation;
          pArray[vIdx + 2] = zElevation;
          vIdx += 3;
        }
      }
      terrainPos.needsUpdate = true;
      pointsPos.needsUpdate = true;

      // Update golden embers
      const goldPosAttr = goldGeometry.attributes.position as THREE.BufferAttribute;
      const goldArray = goldPosAttr.array as Float32Array;
      for (let g = 0; g < goldCount; g++) {
        const vel = goldVelocities[g];
        goldArray[g * 3] += vel.x;
        goldArray[g * 3 + 1] += vel.y;
        goldArray[g * 3 + 2] += vel.z;

        if (goldArray[g * 3 + 1] > 65) {
          goldArray[g * 3 + 1] = -25;
          goldArray[g * 3] = (Math.random() - 0.5) * 220;
          goldArray[g * 3 + 2] = (Math.random() - 0.5) * 160;
        }
      }
      goldPosAttr.needsUpdate = true;

      renderer?.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      terrainGeo.dispose();
      terrainMat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
      goldGeometry.dispose();
      goldMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      particleTexture.dispose();

      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#040B10]">
      {/* Dynamic ambient color glows */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[75vw] h-[55vh] rounded-full bg-gradient-to-b from-[#376F87]/30 via-[#234d5e]/15 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-[5%] w-[45vw] h-[45vh] rounded-full bg-[#D4AF37]/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-[2%] w-[35vw] h-[45vh] rounded-full bg-[#0E3547]/35 blur-[130px] pointer-events-none" />

      {webGlSupported ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none opacity-95 transition-opacity duration-1000"
        />
      ) : (
        /* Graceful 2D luxury gradient fallback */
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#040B10] via-[#091F2B] to-[#040C12] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(55,111,135,0.35),transparent_70%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(212,175,55,0.15),transparent_50%)]" />
        </div>
      )}

      {/* Atmospheric Vignette & Ocean depth gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#040b10] via-transparent to-[#040b10]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(4,11,16,0.85)_100%)] pointer-events-none" />
    </div>
  );
}
