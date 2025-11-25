import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const FALLBACK_W = 640;
const FALLBACK_H = 480;

const expressionTranslations = {
  neutral: 'Neutral',
  happy: 'Feliç 😊',
  sad: 'Trist 😢',
  angry: 'Enfadat 😠',
  fearful: 'Espantat 😨',
  disgusted: 'Disgustat 🤢',
  surprised: 'Sorprès 😮',
};

const bgForExpression = (expr) => {
  switch (expr) {
    case 'happy': return '#16a34a';
    case 'angry': return '#dc2626';
    case 'sad': return '#2563eb';
    case 'surprised': return '#eab308';
    case 'disgusted': return '#7e22ce';
    case 'fearful': return '#9333ea';
    case 'neutral':
    default: return '#111827';
  }
};

const ExpressionDetector = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedExpression, setDetectedExpression] = useState('Detectant...');
  const [dominantExpressionKey, setDominantExpressionKey] = useState('neutral');

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const MODEL_URL = '/models';
    (async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log('Models carregats correctament.');
      } catch (e) {
        console.error('Error carregant els models:', e);
      }
    })();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      try {
        const stream = webcamRef.current?.video?.srcObject;
        stream && stream.getTracks().forEach(t => t.stop());
      } catch {}
    };
  }, []);

  const isVideoReady = (video) => {
    return video && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0;
  };

  // Detección periódica
  const startDetection = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;

      if (!modelsLoaded || !video || !canvas || !isVideoReady(video)) return;

      const vw = video.videoWidth || FALLBACK_W;
      const vh = video.videoHeight || FALLBACK_H;

      if (canvas.width !== vw) canvas.width = vw;
      if (canvas.height !== vh) canvas.height = vh;

      const displaySize = { width: vw, height: vh };
      faceapi.matchDimensions(canvas, displaySize);

      try {
        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 })
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
          const resized = faceapi.resizeResults(detections, displaySize);

          faceapi.draw.drawDetections(canvas, resized);
          faceapi.draw.drawFaceExpressions(canvas, resized);
          faceapi.draw.drawFaceLandmarks(canvas, resized);

          const exprs = detections[0].expressions;
          const dominant = Object.keys(exprs).reduce((a, b) => (exprs[a] > exprs[b] ? a : b));
          setDominantExpressionKey(dominant);
          setDetectedExpression(expressionTranslations[dominant] || dominant);
        } else {
          setDominantExpressionKey('neutral');
          setDetectedExpression('Sense rostre detectat');
        }
      } catch (err) {
        console.error('Error en la detecció:', err);
      }
    }, 300);
  };

  const handleVideoOnPlay = () => {
    // Espera un pelín por si aún no hay metadata
    setTimeout(startDetection, 100);
  };

  const bgColor = bgForExpression(dominantExpressionKey);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: bgColor,
        color: 'white',
        transition: 'background-color 180ms linear',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <h2>Detector d'Estat d'Ànim (RA2)</h2>
      {!modelsLoaded ? <p>Carregant models d'IA, si us plau, espereu...</p> : <p>Models Carregats!</p>}

      <div style={{ position: 'relative', width: FALLBACK_W, height: FALLBACK_H }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          width={FALLBACK_W}
          height={FALLBACK_H}
          videoConstraints={{ width: FALLBACK_W, height: FALLBACK_H, facingMode: 'user' }}
          onUserMedia={handleVideoOnPlay}
          onUserMediaError={(e) => console.error('Error webcam:', e)}
          style={{ position: 'absolute', top: 0, left: 0, borderRadius: 12 }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        />
      </div>

      {modelsLoaded && (
        <h3 style={{ marginTop: 20, fontSize: '1.5em' }}>
          Estat d'ànim detectat: {detectedExpression}
        </h3>
      )}
    </div>
  );
};

export default ExpressionDetector;
