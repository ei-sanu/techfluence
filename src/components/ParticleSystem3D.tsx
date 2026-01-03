import { Camera } from "@mediapipe/camera_utils";
import { FaceMesh, Results as FaceResults } from "@mediapipe/face_mesh";
import { Results as HandResults, Hands } from "@mediapipe/hands";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as THREE from "three";

interface ParticleSystem3DProps {
    handGesture?: boolean;
    scrollProgress?: number;
}

export interface ParticleSystem3DHandle {
    triggerScatter: () => void;
    triggerReturn: () => void;
}

const ParticleSystem3D = forwardRef<ParticleSystem3DHandle, ParticleSystem3DProps>(
    ({ handGesture, scrollProgress }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const videoRef = useRef<HTMLVideoElement>(null);
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const sceneRef = useRef<THREE.Scene | null>(null);
        const particlesRef = useRef<THREE.Points | null>(null);
        const mouseRef = useRef({ x: 0, y: 0 });
        const targetRef = useRef({ x: 0, y: 0 });
        const [trackingEnabled, setTrackingEnabled] = useState(false);
        const [cameraError, setCameraError] = useState(false);
        const handsRef = useRef<Hands | null>(null);
        const faceMeshRef = useRef<FaceMesh | null>(null);
        const cameraInstanceRef = useRef<Camera | null>(null);
        const [trackingMode, setTrackingMode] = useState<'hand' | 'face'>('hand');
        const originalPositionsRef = useRef<Float32Array | null>(null);
        const scatterVelocitiesRef = useRef<Float32Array | null>(null);
        const isScatteredRef = useRef(false);

        useImperativeHandle(ref, () => ({
            triggerScatter: () => {
                if (!isScatteredRef.current && particlesRef.current) {
                    isScatteredRef.current = true;
                    // Generate scatter velocities
                    const positions = particlesRef.current.geometry.attributes.position;
                    if (!scatterVelocitiesRef.current) {
                        scatterVelocitiesRef.current = new Float32Array(positions.count * 3);
                        for (let i = 0; i < positions.count; i++) {
                            scatterVelocitiesRef.current[i * 3] = (Math.random() - 0.5) * 2;
                            scatterVelocitiesRef.current[i * 3 + 1] = (Math.random() - 0.5) * 2;
                            scatterVelocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 2;
                        }
                    }
                }
            },
            triggerReturn: () => {
                isScatteredRef.current = false;
            },
        }));

        useEffect(() => {
            if (!containerRef.current) return;

            // Scene setup
            const scene = new THREE.Scene();
            sceneRef.current = scene;

            const camera = new THREE.PerspectiveCamera(
                75,
                containerRef.current.clientWidth / containerRef.current.clientHeight,
                0.1,
                1000
            );
            camera.position.z = 50;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            containerRef.current.appendChild(renderer.domElement);

            // Create sphere particles only
            const createParticles = () => {
                const particleCount = 2000;
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(particleCount * 3);
                const colors = new Float32Array(particleCount * 3);
                const sizes = new Float32Array(particleCount);

                // Orange theme colors
                const color1 = new THREE.Color("#ff6b35"); // Primary orange
                const color2 = new THREE.Color("#f7931e"); // Light orange
                const color3 = new THREE.Color("#ff4500"); // Deep orange

                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;

                    // Random sphere distribution
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(Math.random() * 2 - 1);
                    const radius = 15 + Math.random() * 15;
                    const x = radius * Math.sin(phi) * Math.cos(theta);
                    const y = radius * Math.sin(phi) * Math.sin(theta);
                    const z = radius * Math.cos(phi);
                    positions[i3] = x;
                    positions[i3 + 1] = y;
                    positions[i3 + 2] = z;

                    // Store original positions for scatter/return animation
                    if (originalPositionsRef.current) {
                        originalPositionsRef.current[i3] = x;
                        originalPositionsRef.current[i3 + 1] = y;
                        originalPositionsRef.current[i3 + 2] = z;
                    }

                    // Assign colors from orange palette
                    const colorChoice = Math.random();
                    const color = colorChoice < 0.33 ? color1 : colorChoice < 0.66 ? color2 : color3;
                    colors[i3] = color.r;
                    colors[i3 + 1] = color.g;
                    colors[i3 + 2] = color.b;

                    sizes[i] = Math.random() * 2 + 0.5;
                }

                geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
                geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
                geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

                const material = new THREE.PointsMaterial({
                    size: 1.5,
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.6,
                    blending: THREE.AdditiveBlending,
                    sizeAttenuation: true,
                });

                return new THREE.Points(geometry, material);
            };

            let particles = createParticles();
            scene.add(particles);
            particlesRef.current = particles;

            // Mouse movement handler
            const handleMouseMove = (event: MouseEvent) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                }
            };

            window.addEventListener("mousemove", handleMouseMove);

            // Hand and Face tracking setup
            const setupTracking = async () => {
                if (!videoRef.current || !canvasRef.current) return;

                try {
                    // Setup Hand Tracking
                    const hands = new Hands({
                        locateFile: (file) => {
                            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                        },
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

                            // Calculate center of palm (average of all landmarks)
                            let avgX = 0, avgY = 0;
                            for (const landmark of hand) {
                                avgX += landmark.x;
                                avgY += landmark.y;
                            }
                            avgX /= hand.length;
                            avgY /= hand.length;

                            // Convert to screen space with mirror effect
                            mouseRef.current.x = (1 - avgX) * 2 - 1;
                            mouseRef.current.y = -(avgY * 2 - 1);
                        }

                        // Draw hand on canvas
                        if (canvasRef.current && trackingMode === 'hand') {
                            const ctx = canvasRef.current.getContext("2d");
                            if (ctx) {
                                ctx.save();
                                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                                if (results.multiHandLandmarks) {
                                    for (const landmarks of results.multiHandLandmarks) {
                                        // Draw all connections
                                        const connections = [
                                            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
                                            [0, 5], [5, 6], [6, 7], [7, 8], // Index
                                            [5, 9], [9, 10], [10, 11], [11, 12], // Middle
                                            [9, 13], [13, 14], [14, 15], [15, 16], // Ring
                                            [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
                                            [0, 17] // Palm
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

                                        // Draw all landmarks
                                        for (const landmark of landmarks) {
                                            ctx.fillStyle = "#f7931e";
                                            ctx.beginPath();
                                            ctx.arc(
                                                landmark.x * canvasRef.current.width,
                                                landmark.y * canvasRef.current.height,
                                                6,
                                                0,
                                                2 * Math.PI
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

                    // Setup Face Mesh Tracking
                    const faceMesh = new FaceMesh({
                        locateFile: (file) => {
                            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                        },
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

                            // Use nose tip (landmark 1) for head tracking
                            const noseTip = face[1];

                            // Convert to screen space with mirror effect
                            mouseRef.current.x = (1 - noseTip.x) * 2 - 1;
                            mouseRef.current.y = -(noseTip.y * 2 - 1);
                        }

                        // Draw face mesh on canvas
                        if (canvasRef.current && trackingMode === 'face') {
                            const ctx = canvasRef.current.getContext("2d");
                            if (ctx) {
                                ctx.save();
                                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                                if (results.multiFaceLandmarks) {
                                    for (const landmarks of results.multiFaceLandmarks) {
                                        // Draw key facial landmarks
                                        ctx.fillStyle = "#ff6b35";
                                        for (let i = 0; i < landmarks.length; i++) {
                                            const landmark = landmarks[i];
                                            ctx.beginPath();
                                            ctx.arc(
                                                landmark.x * canvasRef.current.width,
                                                landmark.y * canvasRef.current.height,
                                                1,
                                                0,
                                                2 * Math.PI
                                            );
                                            ctx.fill();
                                        }

                                        // Highlight nose tip
                                        const noseTip = landmarks[1];
                                        ctx.fillStyle = "#f7931e";
                                        ctx.beginPath();
                                        ctx.arc(
                                            noseTip.x * canvasRef.current.width,
                                            noseTip.y * canvasRef.current.height,
                                            8,
                                            0,
                                            2 * Math.PI
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

            // Animation loop
            let animationId: number;
            const clock = new THREE.Clock();

            const animate = () => {
                animationId = requestAnimationFrame(animate);

                const elapsedTime = clock.getElapsedTime();

                // Smooth mouse follow
                targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.05;
                targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.05;

                if (particles) {
                    // Rotate based on mouse position
                    particles.rotation.y = targetRef.current.x * 0.5 + elapsedTime * 0.05;
                    particles.rotation.x = targetRef.current.y * 0.5 + Math.sin(elapsedTime * 0.3) * 0.1;

                    // Hand gesture scale effect - collapse when hand is closed
                    const gestureScale = handGesture === false ? 0.3 : 1.0;
                    const targetScale = gestureScale * (1 + Math.sin(elapsedTime * 0.5) * 0.1);
                    const currentScale = particles.scale.x;
                    const newScale = currentScale + (targetScale - currentScale) * 0.1;
                    particles.scale.set(newScale, newScale, newScale);

                    // Update particle positions for wave effect and scatter
                    const positions = particles.geometry.attributes.position.array as Float32Array;

                    if (isScatteredRef.current && scatterVelocitiesRef.current && originalPositionsRef.current) {
                        // Scatter animation - move particles outward
                        for (let i = 0; i < positions.length; i += 3) {
                            positions[i] += scatterVelocitiesRef.current[i] * 0.5;
                            positions[i + 1] += scatterVelocitiesRef.current[i + 1] * 0.5;
                            positions[i + 2] += scatterVelocitiesRef.current[i + 2] * 0.5;
                        }
                    } else if (!isScatteredRef.current && originalPositionsRef.current) {
                        // Return animation - move particles back to original positions
                        for (let i = 0; i < positions.length; i += 3) {
                            const dx = originalPositionsRef.current[i] - positions[i];
                            const dy = originalPositionsRef.current[i + 1] - positions[i + 1];
                            const dz = originalPositionsRef.current[i + 2] - positions[i + 2];
                            positions[i] += dx * 0.05;
                            positions[i + 1] += dy * 0.05 + Math.sin(elapsedTime + positions[i] * 0.1) * 0.05;
                            positions[i + 2] += dz * 0.05;
                        }
                    } else {
                        // Normal wave motion
                        for (let i = 0; i < positions.length; i += 3) {
                            const x = positions[i];
                            const y = positions[i + 1];
                            // Add subtle wave motion
                            positions[i + 1] = y + Math.sin(elapsedTime + x * 0.1) * 0.05;
                        }
                    }
                    particles.geometry.attributes.position.needsUpdate = true;
                }

                renderer.render(scene, camera);
            };

            animate();

            // Handle window resize
            const handleResize = () => {
                if (!containerRef.current) return;
                camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
            };

            window.addEventListener("resize", handleResize);

            // Cleanup
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("resize", handleResize);
                cancelAnimationFrame(animationId);

                // Stop tracking
                if (cameraInstanceRef.current) {
                    cameraInstanceRef.current.stop();
                }
                if (handsRef.current) {
                    handsRef.current.close();
                }
                if (faceMeshRef.current) {
                    faceMeshRef.current.close();
                }

                renderer.dispose();
                particles.geometry.dispose();
                (particles.material as THREE.PointsMaterial).dispose();
                if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                    containerRef.current.removeChild(renderer.domElement);
                }
            };
        }, [trackingEnabled, trackingMode]);

        return (
            <div className="absolute inset-0 w-full h-full">
                <div ref={containerRef} className="w-full h-full" />

                {/* Tracking video (hidden) */}
                <video
                    ref={videoRef}
                    className="hidden"
                    playsInline
                />

                {/* Tracking canvas overlay - Hidden */}
                {trackingEnabled && !cameraError && (
                    <canvas
                        ref={canvasRef}
                        width={640}
                        height={480}
                        className="hidden"
                    />
                )}

            </div>
        );
    });

ParticleSystem3D.displayName = 'ParticleSystem3D';

export default ParticleSystem3D;
