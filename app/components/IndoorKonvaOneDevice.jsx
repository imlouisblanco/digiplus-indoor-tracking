'use client'

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Stage, Layer, Image as KonvaImage, Circle, Label, Tag, Text, Line } from 'react-konva'
import useImage from 'use-image'
import { beacons } from '@/lib/beacons'
import { PlayIcon, PauseIcon, StopIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/24/solid'

const SHOW_BEACONS = false

const IndoorKonvaOneDevice = ({ data, historyData = [] }) => {
    const REAL_WIDTH = 40
    const REAL_HEIGHT = 30

    const [containerSize, setContainerSize] = useState({ width: 1280, height: 720 })
    const containerRef = useRef(null)

    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isInitialized, setIsInitialized] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(historyData.length > 0 ? historyData.length - 1 : 0)
    const [animationSpeed, setAnimationSpeed] = useState(1000)
    const animationRef = useRef(null)

    const [image] = useImage('/amsa.png')

    const imageDimensions = useMemo(() => {
        if (!image) return { width: 0, height: 0 }

        const realAspectRatio = REAL_WIDTH / REAL_HEIGHT

        const containerAspectRatio = containerSize.width / containerSize.height

        let canvasWidth, canvasHeight

        if (containerAspectRatio > realAspectRatio) {
            canvasHeight = containerSize.height * 0.9
            canvasWidth = canvasHeight * realAspectRatio
        } else {
            canvasWidth = containerSize.width * 0.9
            canvasHeight = canvasWidth / realAspectRatio
        }

        return { width: canvasWidth, height: canvasHeight }
    }, [image, containerSize.width, containerSize.height])

    const scaleX = imageDimensions.width / REAL_WIDTH;
    const scaleY = imageDimensions.height / REAL_HEIGHT;

    const beaconPositions = useMemo(() => {
        return beacons.map(beacon => ({
            ...beacon,
            pixelX: beacon.x * scaleX,
            pixelY: beacon.y * scaleY
        }))
    }, [scaleX, scaleY])

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                })
            }
        }

        updateSize()
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    const handleWheel = (e) => {
        e.evt.preventDefault()

        const stage = e.target.getStage()
        const oldScale = stage.scaleX()
        const pointer = stage.getPointerPosition()

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        }

        const newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1
        const clampedScale = Math.max(1, Math.min(5, newScale))

        setScale(clampedScale)
        setPosition({
            x: pointer.x - mousePointTo.x * clampedScale,
            y: pointer.y - mousePointTo.y * clampedScale,
        })
    }

    const handleDragEnd = (e) => {
        setPosition({
            x: e.target.x(),
            y: e.target.y(),
        })
    }

    useEffect(() => {
        if (image && imageDimensions.width > 0 && !isInitialized) {
            const centerX = (containerSize.width - imageDimensions.width) / 2
            const centerY = (containerSize.height - imageDimensions.height) / 2
            setPosition({ x: centerX, y: centerY })
            setIsInitialized(true)
        }
    }, [image, imageDimensions.width, imageDimensions.height, containerSize.width, containerSize.height, isInitialized])


    const currentPosition = useMemo(() => {
        if (historyData.length === 0) {
            if (data && data[0] && data[0].pos_data) {
                return data[0].pos_data;
            }
            return null;
        }
        return historyData[currentIndex]?.pos_data || null;
    }, [historyData, currentIndex, data]);

    const currentAnimationData = useMemo(() => {
        if (historyData.length === 0) return data?.[0] || null;
        return historyData[currentIndex] || null;
    }, [historyData, currentIndex, data]);

    const pathPoints = useMemo(() => {
        if (historyData.length === 0) return [];
        const points = [];
        for (let i = 0; i <= currentIndex; i++) {
            const item = historyData[i];
            if (item?.pos_data?.x && item?.pos_data?.y) {
                points.push(item.pos_data.x * scaleX);
                points.push(item.pos_data.y * scaleY);
            }
        }
        return points;
    }, [historyData, currentIndex, scaleX, scaleY]);

    const playAnimation = useCallback(() => {
        if (historyData.length === 0) return;
        setIsPlaying(true);
        if (currentIndex >= historyData.length - 1) {
            setCurrentIndex(0);
        }
    }, [historyData.length, currentIndex]);

    const pauseAnimation = useCallback(() => {
        setIsPlaying(false);
        if (animationRef.current) {
            clearInterval(animationRef.current);
        }
    }, []);

    const stopAnimation = useCallback(() => {
        setIsPlaying(false);
        if (animationRef.current) {
            clearInterval(animationRef.current);
        }
        setCurrentIndex(historyData.length > 0 ? historyData.length - 1 : 0);
    }, [historyData.length]);

    const stepForward = useCallback(() => {
        if (currentIndex < historyData.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    }, [currentIndex, historyData.length]);

    const stepBackward = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    useEffect(() => {
        if (isPlaying && historyData.length > 0) {
            animationRef.current = setInterval(() => {
                setCurrentIndex(prev => {
                    if (prev >= historyData.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, animationSpeed);
        }

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [isPlaying, animationSpeed, historyData.length]);

    useEffect(() => {
        if (historyData.length > 0 && !isPlaying) {
            setCurrentIndex(historyData.length - 1);
        }
    }, [historyData.length]);

    return (
        <div className='w-full min-h-[600px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
            {historyData.length > 1 && (
                <div className="bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Recorrido del Dispositivo</h3>
                            <p className="text-sm text-white/80">
                                {historyData.length} puntos registrados
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={stepBackward}
                                disabled={currentIndex === 0 || isPlaying}
                                className="p-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                            >
                                <BackwardIcon className="w-5 h-5 text-white" />
                            </button>

                            {isPlaying ? (
                                <button
                                    onClick={pauseAnimation}
                                    className="p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-lg"
                                >
                                    <PauseIcon className="w-6 h-6 text-indigo-600" />
                                </button>
                            ) : (
                                <button
                                    onClick={playAnimation}
                                    className="p-3 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-lg"
                                >
                                    <PlayIcon className="w-6 h-6 text-indigo-600" />
                                </button>
                            )}

                            <button
                                onClick={stopAnimation}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            >
                                <StopIcon className="w-5 h-5 text-white" />
                            </button>

                            <button
                                onClick={stepForward}
                                disabled={currentIndex >= historyData.length - 1 || isPlaying}
                                className="p-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                            >
                                <ForwardIcon className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/80">Velocidad:</span>
                            <select
                                value={animationSpeed}
                                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                                className="bg-white/20 text-white border border-white/30 rounded-lg px-2 py-1 text-sm"
                            >
                                <option value={2000} className="text-gray-800">0.5x</option>
                                <option value={1000} className="text-gray-800">1x</option>
                                <option value={500} className="text-gray-800">2x</option>
                                <option value={250} className="text-gray-800">4x</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <input
                            type="range"
                            min={0}
                            max={historyData.length - 1}
                            value={currentIndex}
                            onChange={(e) => {
                                if (!isPlaying) {
                                    setCurrentIndex(Number(e.target.value));
                                }
                            }}
                            disabled={isPlaying}
                            className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white disabled:cursor-not-allowed"
                        />
                        <div className="flex justify-between text-xs text-white/70 mt-1">
                            <span>
                                {historyData[0] && new Date(historyData[0].created_at).toLocaleString('es-CL')}
                            </span>
                            <span className="font-semibold text-white">
                                {currentAnimationData && new Date(currentAnimationData.created_at).toLocaleString('es-CL')}
                            </span>
                            <span>
                                {historyData[historyData.length - 1] && new Date(historyData[historyData.length - 1].created_at).toLocaleString('es-CL')}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={containerRef}
                className="w-full h-full min-h-[600px] bg-gray-100 overflow-hidden relative"
            >
                <Stage
                    width={containerSize.width}
                    height={containerSize.height}
                    onWheel={handleWheel}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => {
                        if (e.target === e.target.getStage()) {
                            setSelectedDevice(null);
                        }
                    }}
                    x={position.x}
                    y={position.y}
                    scaleX={scale}
                    scaleY={scale}
                >
                    <Layer>
                        {image && (
                            <KonvaImage
                                image={image}
                                width={imageDimensions.width}
                                height={imageDimensions.height}
                                x={0}
                                y={0}
                            />
                        )}
                        {SHOW_BEACONS && beaconPositions.map((beacon, index) => (
                            <React.Fragment key={`beacon-${index}`}>
                                <Circle
                                    key={`beacon-${index}`}
                                    x={beacon.pixelX}
                                    y={beacon.pixelY}
                                    radius={5}
                                    fill="red"
                                    stroke="darkred"
                                    strokeWidth={2}
                                    opacity={0.75}
                                />
                                <Label x={beacon.pixelX} y={beacon.pixelY}>
                                    <Tag
                                        fill="rgba(0, 0, 0, 0)"
                                        pointerDirection="down"
                                        pointerWidth={10}
                                        pointerHeight={10}
                                        lineJoin="round"
                                        shadowColor="black"
                                        shadowBlur={10}
                                        shadowOffsetX={0}
                                        shadowOffsetY={0}
                                    />
                                    <Text
                                        text={beacon.name}
                                        fontFamily="Arial"
                                        fontSize={10}
                                        fontStyle="bold"
                                        padding={2}
                                        fill="white"
                                    />
                                </Label>
                            </React.Fragment>
                        ))}

                        {pathPoints.length >= 4 && (
                            <Line
                                points={pathPoints}
                                stroke="rgba(99, 102, 241, 0.6)"
                                strokeWidth={3}
                                lineCap="round"
                                lineJoin="round"
                                tension={0.3}
                            />
                        )}

                        {historyData.slice(0, currentIndex).map((item, index) => {
                            if (!item.pos_data?.x || !item.pos_data?.y) return null;
                            return (
                                <Circle
                                    key={`history-point-${index}`}
                                    x={item.pos_data.x * scaleX}
                                    y={item.pos_data.y * scaleY}
                                    radius={3}
                                    fill="rgba(99, 102, 241, 0.4)"
                                    stroke="rgba(99, 102, 241, 0.6)"
                                    strokeWidth={1}
                                />
                            );
                        })}

                        {currentPosition && currentPosition.x && currentPosition.y && (
                            <React.Fragment>
                                <Circle
                                    x={currentPosition.x * scaleX}
                                    y={currentPosition.y * scaleY}
                                    radius={8}
                                    fill="rgba(37, 99, 235, 1)"
                                    stroke="white"
                                    strokeWidth={3}
                                    shadowColor="rgba(37, 99, 235, 0.5)"
                                    shadowBlur={10}
                                    shadowOffsetX={0}
                                    shadowOffsetY={0}
                                />
                                <Label x={currentPosition.x * scaleX} y={currentPosition.y * scaleY - 20}>
                                    <Tag
                                        fill="rgba(0, 0, 0, 0.85)"
                                        pointerDirection="down"
                                        pointerWidth={10}
                                        pointerHeight={8}
                                        lineJoin="round"
                                        cornerRadius={4}
                                    />
                                    <Text
                                        text={currentAnimationData?.device_id || data?.[0]?.device_id || 'Dispositivo'}
                                        fontFamily="Arial"
                                        fontSize={12}
                                        fontStyle="bold"
                                        padding={6}
                                        fill="white"
                                    />
                                </Label>
                            </React.Fragment>
                        )}
                    </Layer>
                </Stage>

                {/* Información de escala y posición */}
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 px-4 py-3 rounded-lg shadow-lg z-10">
                    <p className="text-sm font-semibold text-gray-800">Información del Plano</p>
                    <p className="text-xs text-gray-600 mt-1">
                        Dimensiones: {REAL_WIDTH}m × {REAL_HEIGHT}m
                    </p>
                    <p className="text-xs text-gray-600">
                        Zoom: {(scale * 100).toFixed(0)}%
                    </p>
                    {currentPosition && (
                        <p className="text-xs text-blue-600 font-medium mt-1">
                            Posición: ({currentPosition.x?.toFixed(1)}m, {currentPosition.y?.toFixed(1)}m)
                        </p>
                    )}
                </div>

                {historyData.length > 1 && (
                    <div className="absolute top-4 right-4 bg-white bg-opacity-95 px-4 py-2 rounded-lg shadow-lg z-10">
                        <p className="text-xs text-gray-500">
                            Punto {currentIndex + 1} de {historyData.length}
                        </p>
                        {isPlaying && (
                            <p className="text-xs text-indigo-600 font-medium animate-pulse">
                                ▶ Reproduciendo...
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>)
}

export default IndoorKonvaOneDevice