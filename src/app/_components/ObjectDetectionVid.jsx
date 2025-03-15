'use client';

import { renderPredictions } from '@/utils/render-predictions';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const ObjectDetectionVid = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let detectInterval;

  // Load AI Model
  const runCoco = useCallback(async () => {
    try {
      setIsLoading(true);
      const net = await cocoSsd.load();
      setIsLoading(false);

      detectInterval = setInterval(() => {
        runObjectDetection(net);
      }, 100); // Adjusted from 10ms to 100ms for performance
    } catch (error) {
      console.error('Error loading model:', error);
      setIsLoading(false);
    }
  }, []);

  // Object Detection
  const runObjectDetection = async (net) => {
    if (!webcamRef.current || !webcamRef.current.video) return;

    const video = webcamRef.current.video;

    if (video.readyState === 4) {
      const width = video.videoWidth;
      const height = video.videoHeight;

      // Adjust canvas size
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, width, height);

      try {
        const detectedObjects = await net.detect(video);
        renderPredictions(detectedObjects, context);
      } catch (error) {
        console.error('Object detection error:', error);
      }
    }
  };

  const showmyVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };

  useEffect(() => {
    if (webcamEnabled) {
      runCoco();
      showmyVideo();
    }

    return () => {
      clearInterval(detectInterval);
    };
  }, [webcamEnabled, runCoco]);

  return (
    <div className="flex flex-col mt-20 w-4/5 m-auto">
      {!webcamEnabled && (
        <div>
          <h1 className='text-lg'>Turn on your camera to start detecting objects in real-time, and wait while the AI model loads. Once ready, point your camera at any object, and the system will identify and highlight it on the screen. Detected objects will be outlined for better visibility. When you're done, simply click 'Turn Off Camera' to stop the detection.</h1>
          <button
            onClick={() => setWebcamEnabled(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-10"
          >
            Turn On Camera
          </button>
        </div>

      )}

      {webcamEnabled && isLoading && <div className="gradient-text">Loading AI Model...</div>}

      {webcamEnabled && !isLoading && (
        <div className='flex flex-col justify-center items-center'>
          <div className="relative flex justify-center items-center gradient w-full p-1.5 bg-red-50 rounded-md">
            <Webcam
              ref={webcamRef}
              className="rounded-md w-full h-full"
              muted
              mirrored
              videoConstraints={{ facingMode: 'user' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 z-50 w-full h-full"
            />
          </div>
          <button
            onClick={() => setWebcamEnabled(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-10"
          >
            Turn Off Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default ObjectDetectionVid;
