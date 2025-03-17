'use client';

import { renderPredictions } from '@/utils/render-predictions';
import React, { useRef, useState, useCallback } from 'react';
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const ObjectDetectionPic = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);

    // console.log(imageRef)
    // console.log(canvasRef)

    // Load AI Model & Process Image
    const handleImageUpload = useCallback(async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        const imageUrl = URL.createObjectURL(file);
        setUploadedImage(imageUrl);
        setPredictions([]);

        const img = new Image();
        img.src = imageUrl;
        img.onload = async () => {
            try {
                const net = await cocoSsd.load();
                const predictions = await net.detect(img);
                setPredictions(predictions);
                setIsLoading(false);
                drawPredictions(img, predictions);
            } catch (error) {
                console.error('Object detection error:', error);
            }
        };
    }, []);

    // Draw Bounding Boxes on Canvas
    const drawPredictions = (image, predictions) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        renderPredictions(predictions, ctx);
    };

    const handleUploadAnotherImage = () => {
        setUploadedImage(null);
        setPredictions([]);
    };

    return (
        <div className="flex flex-col mt-16 w-4/5 m-auto">
            <hr />
            {!uploadedImage && (
                <div className="flex flex-col mt-10">
                    <h1 className="text-lg">
                        Upload an image to detect objects. The system will highlight detected objects for better visibility.
                    </h1>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-4 border rounded-md p-2 w-full max-w-xs cursor-pointer"
                    />
                </div>
            )}

            {isLoading && <p className="mt-10 text-gray-600 text-center">Processing image...</p>}


            {uploadedImage && (
                <div className="relative flex flex-col items-center mt-4">
                    {/* Display Uploaded Image */}
                    <img
                        src={uploadedImage}
                        ref={imageRef}
                        className={`rounded-md w-full z-10 mt-10 ${isLoading ? 'hidden' : 'block'}`}
                        alt="Uploaded preview"
                    />
                    {/* Canvas for Drawing Bounding Boxes */}
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full z-20 mt-10"
                    />


                </div>
            )}

            {!isLoading && uploadedImage && (
                <div>
                    {
                        predictions.length > 0 ? (
                            <div className="mt-4 p-4 rounded-md w-full max-w-lg">
                                <h3 className="text-lg font-bold mb-2">Detected Objects:</h3>
                                <ul className="list-disc pl-4">
                                    {predictions.map((p, index) => (
                                        <li key={index}>{p.class} ({(p.score * 100).toFixed(2)}%)</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="mt-4 text-gray-600 text-center">No objects detected in this image.</p>
                        )
                    }
                    <button onClick={handleUploadAnotherImage} className="bg-red-500 text-white px-4 py-2 rounded-md mt-6">
                        Upload Another Image
                    </button>
                </div>
            )}

        </div>
    );
};

export default ObjectDetectionPic;
