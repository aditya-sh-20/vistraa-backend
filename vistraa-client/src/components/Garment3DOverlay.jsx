'use client';

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Layers, Sliders, Activity, ShoppingBag, Camera } from "lucide-react";

export default function Garment3DOverlay({
    activePalette = ["#0077B6", "#00B4D8", "#90E0EF"],
    activeSentiment = "CALM",
    onAddToCart
}) {
    const videoRef = useRef(null);
    const threeContainerRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    // Interactive Finish Controls
    const [patternScale, setPatternScale] = useState(1.1);
    const [fabricOpacity, setFabricOpacity] = useState(0.85);
    const [silkGlossiness, setSilkGlossiness] = useState(95);

    const animFrameRef = useRef(null);
    const sceneRef = useRef(null);
    const meshRef = useRef(null);
    const materialRef = useRef(null);
    const rendererRef = useRef(null);

    // Procedural Fabric Pattern Canvas Generator
    const createProceduralFabricCanvas = (palette, sentiment, scale) => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        const c1 = palette[0] || "#0077B6";
        const c2 = palette[1] || "#00B4D8";
        const c3 = palette[2] || "#90E0EF";

        const grad = ctx.createLinearGradient(0, 0, 512, 512);
        grad.addColorStop(0, c1);
        grad.addColorStop(0.5, c2);
        grad.addColorStop(1, c3);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 4 * scale;
        const step = (sentiment === "CALM" ? 24 : 36) * scale;

        for (let y = 0; y < 512; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.bezierCurveTo(170, y + (30 * scale), 340, y - (30 * scale), 512, y);
            ctx.stroke();
        }

        return canvas;
    };

    // Load MediaPipe Pose Script safely
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.Pose) {
            setIsLoaded(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js";
        script.crossOrigin = "anonymous";
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);
    }, []);

    // Initialize Three.js Scene with 100% Transparency
    useEffect(() => {
        if (!threeContainerRef.current) return;

        const width = 640;
        const height = 480;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
        camera.position.z = 10;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight.position.set(0, 100, 200);
        scene.add(dirLight);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0); // Transparent 3D layer

        threeContainerRef.current.innerHTML = "";
        threeContainerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const fabricCanvas = createProceduralFabricCanvas(activePalette, activeSentiment, patternScale);
        const texture = new THREE.CanvasTexture(fabricCanvas);

        const geometry = new THREE.PlaneGeometry(1, 1, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: fabricOpacity,
            shininess: silkGlossiness,
        });
        materialRef.current = material;

        const mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;
        scene.add(mesh);
        meshRef.current = mesh;

        return () => {
            if (rendererRef.current && threeContainerRef.current) {
                threeContainerRef.current.innerHTML = "";
                rendererRef.current.dispose();
            }
        };
    }, []);

    // Texture Updates
    useEffect(() => {
        if (meshRef.current && materialRef.current) {
            const fabricCanvas = createProceduralFabricCanvas(activePalette, activeSentiment, patternScale);
            const newTexture = new THREE.CanvasTexture(fabricCanvas);
            materialRef.current.map = newTexture;
            materialRef.current.opacity = fabricOpacity;
            materialRef.current.shininess = silkGlossiness;
            materialRef.current.needsUpdate = true;
        }
    }, [activePalette, activeSentiment, patternScale, fabricOpacity, silkGlossiness]);

    // Webcam Feed + Pose Tracking (Guarded against AbortError)
    useEffect(() => {
        if (!cameraActive) return;

        let stream = null;
        let pose = null;
        let isCancelled = false;

        const startCameraAndPose = async () => {
            try {
                setCameraError(null);

                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
                });

                if (isCancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    // Safely handle play() promise to eliminate AbortError
                    videoRef.current.onloadedmetadata = async () => {
                        try {
                            if (!isCancelled && videoRef.current) {
                                await videoRef.current.play();
                            }
                        } catch (err) {
                            if (err.name !== "AbortError") {
                                console.error("Video play error:", err);
                            }
                        }
                    };
                }

                if (isLoaded && window.Pose) {
                    pose = new window.Pose({
                        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
                    });

                    pose.setOptions({
                        modelComplexity: 1,
                        smoothLandmarks: true,
                        minDetectionConfidence: 0.5,
                        minTrackingConfidence: 0.5,
                    });

                    pose.onResults((results) => {
                        if (isCancelled) return;

                        if (results.poseLandmarks && meshRef.current) {
                            const lShoulder = results.poseLandmarks[11];
                            const rShoulder = results.poseLandmarks[12];

                            if (lShoulder && rShoulder) {
                                const w = 640;
                                const h = 480;

                                const lx = lShoulder.x * w;
                                const ly = lShoulder.y * h;
                                const rx = rShoulder.x * w;
                                const ry = rShoulder.y * h;

                                const centerX = (lx + rx) / 2;
                                const centerY = (ly + ry) / 2;
                                const shoulderWidth = Math.hypot(rx - lx, ry - ly);

                                const mesh = meshRef.current;
                                mesh.visible = true;
                                mesh.position.x = centerX - w / 2;
                                mesh.position.y = -(centerY - h / 2);
                                mesh.scale.set(shoulderWidth * 1.6, shoulderWidth * 2.2, 1);

                                const angle = Math.atan2(ry - ly, rx - lx);
                                mesh.rotation.z = -angle;
                            }
                        }

                        if (rendererRef.current && sceneRef.current) {
                            rendererRef.current.render(
                                sceneRef.current,
                                sceneRef.current.children.find((c) => c.isCamera) || new THREE.OrthographicCamera(-320, 320, 240, -240, 1, 1000)
                            );
                        }
                    });

                    const processFrame = async () => {
                        if (isCancelled) return;
                        if (videoRef.current && videoRef.current.readyState >= 2 && pose) {
                            try {
                                await pose.send({ image: videoRef.current });
                            } catch (e) {
                                // Prevent abort noise on unmount
                            }
                        }
                        if (cameraActive && !isCancelled) {
                            animFrameRef.current = requestAnimationFrame(processFrame);
                        }
                    };
                    processFrame();
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error("Camera access error:", err);
                    setCameraError("Webcam permission denied or camera unavailable.");
                }
            }
        };

        startCameraAndPose();

        return () => {
            isCancelled = true;
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (stream) stream.getTracks().forEach((track) => track.stop());
            if (videoRef.current) {
                videoRef.current.onloadedmetadata = null;
                videoRef.current.srcObject = null;
            }
            if (pose) pose.close();
            if (meshRef.current) meshRef.current.visible = false;
        };
    }, [cameraActive, isLoaded]);

    const handleAddGarment = () => {
        if (onAddToCart) {
            onAddToCart({
                id: "vto-item-" + Date.now(),
                name: "Custom AI Garment",
                sentiment: activeSentiment,
                palette: activePalette,
                price: 129.00,
            });
        }
    };

    return (
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl text-white shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-slate-100">3D Procedural Fabric Draping</h3>
                </div>
                <button
                    onClick={() => setCameraActive(!cameraActive)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${cameraActive
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-amber-500 hover:bg-amber-600 text-slate-950"
                        }`}
                >
                    {cameraActive ? "Stop 3D Try-On" : "Start 3D Try-On"}
                </button>
            </div>

            {/* Live Camera Viewport */}
            <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                {/* HTML Video Layer */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`absolute inset-0 w-full h-full object-cover z-0 ${!cameraActive ? "hidden" : "block"}`}
                />

                {/* 3D Transparent Layer */}
                <div
                    ref={threeContainerRef}
                    className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${!cameraActive ? "hidden" : "block"}`}
                />

                {cameraError && (
                    <p className="text-red-400 text-xs z-20 p-4 text-center">{cameraError}</p>
                )}

                {!cameraActive && (
                    <div className="flex flex-col items-center gap-2 text-slate-500 z-20">
                        <Camera className="w-8 h-8" />
                        <p className="text-xs">Click 'Start 3D Try-On' to enable camera draping.</p>
                    </div>
                )}
            </div>

            {/* Material Finishes Controls */}
            <div className="p-4 bg-[#030712]/90 rounded-xl border border-slate-800/80 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    <Sliders className="w-3.5 h-3.5" /> Material & Pattern Finishes
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">
                            Pattern Scale: {patternScale.toFixed(1)}x
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2.5"
                            step="0.1"
                            value={patternScale}
                            onChange={(e) => setPatternScale(parseFloat(e.target.value))}
                            className="w-full accent-amber-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-1">
                            Fabric Opacity: {Math.round(fabricOpacity * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0.3"
                            max="1.0"
                            step="0.05"
                            value={fabricOpacity}
                            onChange={(e) => setFabricOpacity(parseFloat(e.target.value))}
                            className="w-full accent-amber-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-1">
                            Silk Glossiness: {silkGlossiness}
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="150"
                            step="5"
                            value={silkGlossiness}
                            onChange={(e) => setSilkGlossiness(parseInt(e.target.value))}
                            className="w-full accent-amber-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>Live Mesh Shading & Pose Sync</span>
                    </div>

                    <div className="text-xs font-semibold text-amber-400">
                        ✨ Sentiment: {activeSentiment}
                    </div>
                </div>

                <button
                    onClick={handleAddGarment}
                    className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                >
                    <ShoppingBag className="w-4 h-4" /> Add Custom Garment to Cart ($129.00 USD)
                </button>
            </div>
        </div>
    );
}