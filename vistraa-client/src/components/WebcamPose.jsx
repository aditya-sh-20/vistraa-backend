'use client';

import { useEffect, useRef, useState } from "react";
import { Camera as CameraIcon, Activity } from "lucide-react";

export default function WebcamPose() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [landmarksDetected, setLandmarksDetected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const animFrameRef = useRef(null);

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

  useEffect(() => {
    if (!cameraActive || !isLoaded || !window.Pose) return;

    let stream = null;
    let pose = null;

    const initPoseAndCamera = async () => {
      pose = new window.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults((results) => {
        if (!canvasRef.current || !results.poseLandmarks) return;
        setLandmarksDetected(true);

        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw key torso points (11: L Shoulder, 12: R Shoulder, 23: L Hip, 24: R Hip)
        const keyPoints = [11, 12, 23, 24];
        canvasCtx.fillStyle = "#f59e0b";

        keyPoints.forEach((idx) => {
          const lm = results.poseLandmarks[idx];
          if (lm) {
            const x = lm.x * canvasRef.current.width;
            const y = lm.y * canvasRef.current.height;
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 6, 0, 2 * Math.PI);
            canvasCtx.fill();
          }
        });

        canvasCtx.restore();
      });

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          const processFrame = async () => {
            if (videoRef.current && videoRef.current.readyState === 4 && pose) {
              await pose.send({ image: videoRef.current });
            }
            if (cameraActive) {
              animFrameRef.current = requestAnimationFrame(processFrame);
            }
          };
          processFrame();
        }
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };

    initPoseAndCamera();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (pose) pose.close();
    };
  }, [cameraActive, isLoaded]);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <CameraIcon className="w-6 h-6 text-amber-400" />
          <h3 className="text-lg font-semibold">3D Body Pose Tracker (MediaPipe)</h3>
        </div>
        <button
          onClick={() => setCameraActive(!cameraActive)}
          disabled={!isLoaded}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
            !isLoaded
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : cameraActive
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-slate-950"
          }`}
        >
          {!isLoaded ? "Loading AI Engine..." : cameraActive ? "Stop Camera" : "Start Webcam"}
        </button>
      </div>

      <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {!cameraActive && (
          <p className="text-slate-500 text-sm">
            {!isLoaded ? "Loading MediaPipe Pose Library..." : "Click 'Start Webcam' to enable MediaPipe pose landmarking."}
          </p>
        )}
        <video ref={videoRef} className="hidden" playsInline />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className={`w-full h-full object-cover ${!cameraActive ? "hidden" : "block"}`}
        />
      </div>

      {cameraActive && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Tracking Active
          </span>
          <span>{landmarksDetected ? "Upper Body Landmarks Locked" : "Detecting Pose..."}</span>
        </div>
      )}
    </div>
  );
}
