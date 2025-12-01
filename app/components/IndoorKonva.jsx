'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Stage, Layer, Image as KonvaImage, Circle, Label, Tag, Text } from 'react-konva'
import useImage from 'use-image'
import { beacons } from '@/lib/beacons'
import { useRealtimePositions } from '@/hooks/useRealtimePositions'

const SHOW_BEACONS = false

const IndoorKonva = () => {
    const { devicesData } = useRealtimePositions()
    const REAL_WIDTH = 40
    const REAL_HEIGHT = 30

    const [containerSize, setContainerSize] = useState({ width: 1280, height: 720 })
    const containerRef = useRef(null)

    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isInitialized, setIsInitialized] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState(null)

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

    const devicesWithPosition = useMemo(() => {
        if (!devicesData) return [];
        return Object.values(devicesData).filter(
            device => device.pos_data && device.pos_data.x && device.pos_data.y
        );
    }, [devicesData])

    // Función para seleccionar un dispositivo desde la lista (sin mover el plano)
    const handleDeviceClick = (device) => {
        // Si ya está seleccionado, deseleccionarlo; si no, seleccionarlo
        setSelectedDevice(selectedDevice === device.device_id ? null : device.device_id);
    }

    const isDataOld = (date) => {
        const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
        return new Date(date) <= new Date(Date.now() - twoHoursInMs);
    }

    return (
        <div className='flex flex-col lg:flex-row gap-4'>
            <div className="w-full lg:w-64 bg-white rounded-lg shadow-lg p-4 h-full lg:sticky lg:top-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Dispositivos</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {devicesWithPosition.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                            No hay dispositivos con posición
                        </p>
                    ) : (
                        devicesWithPosition.sort((a, b) => a.device_id.localeCompare(b.device_id)).map((device, index) => {
                            const isSelected = selectedDevice === device.device_id;
                            return (
                                <div
                                    key={device.device_id + '-' + index}
                                    onClick={() => handleDeviceClick(device)}
                                    className={`
                                        p-3 rounded-lg cursor-pointer transition-all duration-200
                                        ${isSelected
                                            ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                                            : isDataOld(device.created_at) ? 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-300' : 'bg-blue-50 border-2 border-transparent hover:bg-blue-100 hover:border-blue-300'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-3 h-3 rounded-full flex-shrink-0
                                            ${isSelected ? 'bg-blue-500' : isDataOld(device.created_at) ? 'bg-gray-400' : ' bg-blue-400'}
                                        `} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`
                                                text-sm font-semibold truncate
                                                ${isSelected ? 'text-blue-700' : 'text-gray-700'}
                                            `}>
                                                {device.device_id}
                                            </p>
                                            <p className={`
                                                text-xs font-medium truncate
                                                ${isSelected ? 'text-blue-700' : 'text-gray-700'}
                                            `}>
                                                {device.device_euid}
                                            </p>
                                            {device.battery !== null && device.battery !== undefined && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Batería: {device.battery}%
                                                </p>
                                            )}
                                            <p className={`
                                                text-xs font-medium
                                            `}>
                                                Actualizado: {new Date(device.created_at).toLocaleString('es-CL')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
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
                        // Cerrar tooltip si se hace click fuera de un dispositivo
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

                        {devicesData && Object.values(devicesData).map((device, index) => {
                            if (!device.pos_data || !device.pos_data.x || !device.pos_data.y) return null;

                            const deviceX = device.pos_data.x * scaleX;
                            const deviceY = device.pos_data.y * scaleY;
                            const isSelected = selectedDevice === device.device_id;

                            return (
                                <React.Fragment key={`device-${device.device_id}-${index}`}>
                                    <Circle
                                        x={deviceX}
                                        y={deviceY}
                                        radius={5}
                                        className="animate-pulse"
                                        fill={isDataOld(device.created_at) ? 'gray' : 'rgba(37, 99, 235, 1)'}
                                        stroke={isSelected ? "yellow" : "white"}
                                        strokeWidth={isSelected ? 3 : 1}
                                        opacity={0.9}
                                        onClick={() => setSelectedDevice(isSelected ? null : device.device_id)}
                                        onTap={() => setSelectedDevice(isSelected ? null : device.device_id)}
                                    />
                                    {isSelected && (
                                        <Label x={deviceX} y={deviceY - 10}>
                                            <Tag
                                                fill="rgba(0, 0, 0, 0.8)"
                                                pointerDirection="down"
                                                pointerWidth={10}
                                                pointerHeight={10}
                                                lineJoin="round"
                                                shadowColor="black"
                                                shadowBlur={10}
                                                shadowOffsetX={0}
                                                shadowOffsetY={0}
                                                shadowOpacity={0.5}
                                            />
                                            <Text
                                                text={device.device_id}
                                                fontFamily="Arial"
                                                fontSize={14}
                                                fontStyle="bold"
                                                padding={8}
                                                fill="white"
                                            />
                                        </Label>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Layer>
                </Stage>

                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-4 py-2 rounded shadow-lg z-10">
                    <p className="text-sm font-semibold">Escala del plano</p>
                    <p className="text-xs text-gray-600">
                        Dimensiones reales: {REAL_WIDTH}m × {REAL_HEIGHT}m
                    </p>
                    <p className="text-xs text-gray-600">
                        Zoom: {(scale * 100).toFixed(0)}%
                    </p>
                    {SHOW_BEACONS && <p className="text-xs text-gray-600">
                        Beacons: {beacons.length}
                    </p>}
                </div>
            </div>
        </div>)
}

export default IndoorKonva