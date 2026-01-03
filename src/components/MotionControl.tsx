import { Camera } from "@mediapipe/camera_utils";
import { FaceMesh, Results as FaceResults } from "@mediapipe/face_mesh";
import { Results as HandResults, Hands } from "@mediapipe/hands";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MotionControlProps {
    isOpen: boolean;
    onClose: () => void;
    onTrackingChange: (enabled: boolean, mode: 'hand' | 'face') => void;
    onHandGesture: (isOpen: boolean) => void;
}

const MotionControl = ({ isOpen, onClose, onTrackingChange, onHandGesture }: MotionControlProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [trackingEnabled, setTrackingEnabled] = useState(false);
    const [trackingMode, setTrackingMode] = useState<'hand' | 'face'>('hand');
    const [cameraError, setCameraError] = useState(false);
    const handsRef = useRef<Hands | null>(null);
    const faceMeshRef = useRef<FaceMesh | null>(null);
    const cameraInstanceRef = useRef<Camera | null>(null);
    const mousePositionRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const setupTracking = async () => {
            if (!videoRef.current || !canvasRef.current || !trackingEnabled) return;

            try {
                // Setup Hand Tracking
                const hands = new Hands({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
                });

                hands.setOptions({
                    maxNumHands: 2,
                    modelComplexity: 1,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                hands.onResults((results: HandResults) => {
                    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                        const hand = results.multiHandLandmarks[0];

                        // Calculate hand openness (distance between thumb tip and pinky tip)
                        const thumbTip = hand[4];
                        const pinkyTip = hand[20];
                        const distance = Math.sqrt(
                            Math.pow(thumbTip.x - pinkyTip.x, 2) +
                            Math.pow(thumbTip.y - pinkyTip.y, 2)
                        );

                        // Hand is open if distance > 0.2, closed if < 0.15
                        const isHandOpen = distance > 0.2;
                        onHandGesture(isHandOpen);

                        // Dispatch global event for particle system
                        window.dispatchEvent(new CustomEvent('handGesture', { detail: { isOpen: isHandOpen } }));

                        // Calculate center of palm
                        let avgX = 0, avgY = 0;
                        for (const landmark of hand) {
                            avgX += landmark.x;
                            avgY += landmark.y;
                        }
                        avgX /= hand.length;
                        avgY /= hand.length;

                        mousePositionRef.current = {
                            x: (1 - avgX) * 2 - 1,
                            y: -(avgY * 2 - 1)
                        };
                    }

                    // Draw hand on canvas
                    if (canvasRef.current && trackingMode === 'hand') {
                        const ctx = canvasRef.current.getContext("2d");
                        if (ctx) {
                            ctx.save();
                            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                            if (results.multiHandLandmarks) {
                                for (const landmarks of results.multiHandLandmarks) {
                                    const connections = [
                                        [0, 1], [1, 2], [2, 3], [3, 4],
                                        [0, 5], [5, 6], [6, 7], [7, 8],
                                        [5, 9], [9, 10], [10, 11], [11, 12],
                                        [9, 13], [13, 14], [14, 15], [15, 16],
                                        [13, 17], [17, 18], [18, 19], [19, 20],
                                        [0, 17]
                                    ];

                                    ctx.strokeStyle = "#ff6b35";
                                    ctx.lineWidth = 3;
                                    for (const [start, end] of connections) {
                                        const startPoint = landmarks[start];
                                        const endPoint = landmarks[end];
                                        ctx.beginPath();
                                        ctx.moveTo(startPoint.x * canvasRef.current.width, startPoint.y * canvasRef.current.height);
                                        ctx.lineTo(endPoint.x * canvasRef.current.width, endPoint.y * canvasRef.current.height);
                                        ctx.stroke();
                                    }

                                    for (const landmark of landmarks) {
                                        ctx.fillStyle = "#f7931e";
                                        ctx.beginPath();
                                        ctx.arc(
                                            landmark.x * canvasRef.current.width,
                                            landmark.y * canvasRef.current.height,
                                            6, 0, 2 * Math.PI
                                        );
                                        ctx.fill();
                                    }
                                }
                            }
                            ctx.restore();
                        }
                    }
                });

                handsRef.current = hands;

                // Setup Face Mesh
                const faceMesh = new FaceMesh({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
                });

                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                faceMesh.onResults((results: FaceResults) => {
                    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                        const face = results.multiFaceLandmarks[0];
                        const noseTip = face[1];

                        mousePositionRef.current = {
                            x: (1 - noseTip.x) * 2 - 1,
                            y: -(noseTip.y * 2 - 1)
                        };
                    }

                    if (canvasRef.current && trackingMode === 'face') {
                        const ctx = canvasRef.current.getContext("2d");
                        if (ctx) {
                            ctx.save();
                            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                            if (results.multiFaceLandmarks) {
                                for (const landmarks of results.multiFaceLandmarks) {
                                    ctx.fillStyle = "#ff6b35";
                                    for (let i = 0; i < landmarks.length; i++) {
                                        const landmark = landmarks[i];
                                        ctx.beginPath();
                                        ctx.arc(
                                            landmark.x * canvasRef.current.width,
                                            landmark.y * canvasRef.current.height,
                                            1, 0, 2 * Math.PI
                                        );
                                        ctx.fill();
                                    }

                                    const noseTip = landmarks[1];
                                    ctx.fillStyle = "#f7931e";
                                    ctx.beginPath();
                                    ctx.arc(
                                        noseTip.x * canvasRef.current.width,
                                        noseTip.y * canvasRef.current.height,
                                        8, 0, 2 * Math.PI
                                    );
                                    ctx.fill();
                                }
                            }
                            ctx.restore();
                        }
                    }
                });

                faceMeshRef.current = faceMesh;

                const camera = new Camera(videoRef.current, {
                    onFrame: async () => {
                        if (videoRef.current) {
                            if (trackingMode === 'hand' && handsRef.current) {
                                await handsRef.current.send({ image: videoRef.current });
                            } else if (trackingMode === 'face' && faceMeshRef.current) {
                                await faceMeshRef.current.send({ image: videoRef.current });
                            }
                        }
                    },
                    width: 640,
                    height: 480,
                });

                cameraInstanceRef.current = camera;
                await camera.start();
                setCameraError(false);
            } catch (error) {
                console.error("Tracking setup failed:", error);
                setCameraError(true);
            }
        };

        if (trackingEnabled) {
            setupTracking();
        }

        return () => {
            if (cameraInstanceRef.current) {
                cameraInstanceRef.current.stop();
            }
            if (handsRef.current) {
                handsRef.current.close();
            }
            if (faceMeshRef.current) {
                faceMeshRef.current.close();
            }
        };
    }, [trackingEnabled, trackingMode]);

    useEffect(() => {
        onTrackingChange(trackingEnabled, trackingMode);
    }, [trackingEnabled, trackingMode, onTrackingChange]);

    const handleEnableCamera = () => {
        setTrackingEnabled(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-20 right-4 z-50 w-80 bg-card/95 backdrop-blur-lg border border-border rounded-lg shadow-2xl">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-cinzel text-lg font-semibold text-foreground flex items-center gap-2">
                        <span className="text-xl">🎯</span> Motion Control
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {!trackingEnabled ? (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground font-cinzel">
                            Enable your camera to control the particle animation with hand gestures or head movements.
                        </p>
                        <button
                            onClick={handleEnableCamera}
                            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-cinzel text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Enable Camera
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cameraError ? (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-sm text-red-500">⚠️ Camera access denied</p>
                            </div>
                        ) : (
                            <>
                                {/* Mode Selection */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setTrackingMode('hand')}
                                        className={`flex-1 px-3 py-2 rounded-lg font-cinzel text-sm flex items-center justify-center gap-2 transition-all ${trackingMode === 'hand'
                                                ? 'bg-primary text-primary-foreground shadow-md'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            }`}
                                    >
                                        <span className="text-base">🖐️</span> Hand
                                    </button>
                                    <button
                                        onClick={() => setTrackingMode('face')}
                                        className={`flex-1 px-3 py-2 rounded-lg font-cinzel text-sm flex items-center justify-center gap-2 transition-all ${trackingMode === 'face'
                                                ? 'bg-primary text-primary-foreground shadow-md'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            }`}
                                    >
                                        <span className="text-base">👤</span> Head
                                    </button>
                                </div>

                                {/* Video Preview */}
                                <div className="relative">
                                    <video ref={videoRef} className="hidden" playsInline />
                                    <canvas
                                        ref={canvasRef}
                                        width={640}
                                        height={480}
                                        className="w-full h-48 rounded-lg border-2 border-primary/50 bg-black/30"
                                        style={{ transform: 'scaleX(-1)' }}
                                    />
                                </div>

                                {/* Instructions */}
                                <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                                    <p className="text-xs text-primary font-cinzel">
                                        {trackingMode === 'hand'
                                            ? '✋ Close your hand to collapse the sphere, open to expand it!'
                                            : '👤 Move your head to control the particles'}
                                    </p>
                                </div>

                                {/* Disable Button */}
                                <button
                                    onClick={() => setTrackingEnabled(false)}
                                    className="w-full px-4 py-2 bg-muted text-muted-foreground rounded-lg font-cinzel text-sm hover:bg-muted/80 transition-all"
                                >
                                    Disable Camera
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MotionControl;
