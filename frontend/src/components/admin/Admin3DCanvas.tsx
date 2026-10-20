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

    const width = window.innerWidth || 1440;
    const height = window.innerHeight || 900;

    // Scene setup with light Caribbean sand fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf9f8f6, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      1,
      1000
    );
    camera.position.set(0, 30, 105);
    camera.lookAt(0, -4, 0);

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

    // 1. Subtle, Minimalist Caribbean Wave Surface (Organic topographical flow)
    const segmentsX = 52;
    const segmentsY = 52;
    const meshWidth = 280;
    const meshHeight = 280;

    const waveGeo = new THREE.PlaneGeometry(
      meshWidth,
      meshHeight,
      segmentsX,
      segmentsY
    );
    waveGeo.rotateX(-Math.PI / 2.3);

    // Minimalist, elegant architectural wireframe in Caribbean Dark (#376F87) with soft transparency
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x376f87,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });

    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.set(0, -15, -10);
    scene.add(waveMesh);

    // 2. Soft, floating sunlight motes (Minimalist warm golden and celeste sea mist)
    const particleCount = 80;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 180;
      particlePositions[p * 3 + 1] = (Math.random() - 0.2) * 80;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 140;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.025,
        y: 0.03 + Math.random() * 0.05,
        z: (Math.random() - 0.5) * 0.025,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    // Soft round brush texture
    const getCircleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, "rgba(55, 111, 135, 0.8)");
        gradient.addColorStop(0.3, "rgba(104, 167, 194, 0.4)");
        gradient.addColorStop(0.7, "rgba(212, 175, 55, 0.2)");
        gradient.addColorStop(1, "rgba(249, 248, 246, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    };

    const particleTexture = getCircleTexture();

    const particleMat = new THREE.PointsMaterial({
      size: 3.5,
      map: particleTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Parallax mouse tracker with gentle damping
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetX = (event.clientX - window.innerWidth / 2) * 0.02;
      targetY = (event.clientY - window.innerHeight / 2) * 0.015;
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
      clock += 0.018;

      // Soft camera interpolation
      mouseX += (targetX - mouseX) * 0.03;
      mouseY += (targetY - mouseY) * 0.03;

      camera.position.x = mouseX * 0.6;
      camera.position.y = 30 - mouseY * 0.4;
      camera.lookAt(0, -4, 0);

      // Organic gentle wave undulation
      const posAttr = waveGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      let vIdx = 0;
      for (let ix = 0; ix <= segmentsX; ix++) {
        for (let iy = 0; iy <= segmentsY; iy++) {
          const elevation =
            Math.sin((ix + clock) * 0.22) * 2.8 +
            Math.cos((iy + clock * 0.8) * 0.25) * 2.8;

          posArray[vIdx + 2] = elevation;
          vIdx += 3;
        }
      }
      posAttr.needsUpdate = true;

      // Drift particles gently upwards
      const partPosAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const partArray = partPosAttr.array as Float32Array;

      for (let p = 0; p < particleCount; p++) {
        const vel = particleVelocities[p];
        partArray[p * 3] += vel.x;
        partArray[p * 3 + 1] += vel.y;
        partArray[p * 3 + 2] += vel.z;

        if (partArray[p * 3 + 1] > 55) {
          partArray[p * 3 + 1] = -20;
          partArray[p * 3] = (Math.random() - 0.5) * 180;
          partArray[p * 3 + 2] = (Math.random() - 0.5) * 140;
        }
      }
      partPosAttr.needsUpdate = true;

      renderer?.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      waveGeo.dispose();
      waveMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();

      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#F9F8F6]">
      {/* Soft ambient Mediterranean & Caribbean air gradients matching main page */}
      <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[85vw] h-[65vh] rounded-full bg-gradient-to-b from-[#EBF3F6] via-[#F0F6F8]/60 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[10%] right-[10%] w-[50vw] h-[50vh] rounded-full bg-[#D4AF37]/5 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-[5%] w-[40vw] h-[45vh] rounded-full bg-[#4E8EA9]/6 blur-[130px] pointer-events-none" />

      {webGlSupported && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none opacity-80 transition-opacity duration-1000"
        />
      )}

      {/* Subtle organic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(249,248,246,0.75)_100%)] pointer-events-none" />
    </div>
  );
}
