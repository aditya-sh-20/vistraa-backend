import os

pose_component = ''''use client';

import { useEffect, useRef, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { Camera as CameraIcon, Activity } from "lucide-react";

export default function WebcamPose() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [landmarksDetected, setLandmarksDetected] = useState(false);

  useEffect(() => {
    if (!cameraActive) return;

    const pose = new Pose({
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

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, [cameraActive]);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <CameraIcon className="w-6 h-6 text-amber-400" />
          <h3 className="text-lg font-semibold">3D Body Pose Tracker (MediaPipe)</h3>
        </div>
        <button
          onClick={() => setCameraActive(!cameraActive)}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
            cameraActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-amber-500 hover:bg-amber-600 text-slate-950"
          }`}
        >
          {cameraActive ? "Stop Camera" : "Start Webcam"}
        </button>
      </div>

      <div className="relative w-full aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
        {!cameraActive && (
          <p className="text-slate-500 text-sm">Click 'Start Webcam' to enable MediaPipe pose landmarking.</p>
        )}
        <video ref={videoRef} className="hidden" />
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
'''

page_code = '''import FabricGenerator from "@/components/FabricGenerator";
import WebcamPose from "@/components/WebcamPose";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-3 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
          VISTRAA
        </h1>
        <p className="text-slate-400 text-lg">
          Affective Computing & 3D Digital Apparel Studio
        </p>
      </div>

      <FabricGenerator />
      <WebcamPose />
    </main>
  );
}
'''

with open("src/components/WebcamPose.jsx", "w", encoding="utf-8") as f: f.write(pose_component)
with open("src/app/page.js", "w", encoding="utf-8") as f: f.write(page_code)
print("=== DAY 19 MEDIAPIPE COMPONENT CREATED SUCCESSFULLY ===")
