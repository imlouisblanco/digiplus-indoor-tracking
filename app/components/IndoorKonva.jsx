'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { Stage, Layer, Image as KonvaImage, Circle } from 'react-konva'
import useImage from 'use-image'
import { beacons } from '@/lib/beacons'
// Definir beacons con coordenadas en metros (x, y) relativas al plano
// x: 0 a REAL_WIDTH (largo), y: 0 a REAL_HEIGHT (ancho)
// Puedes agregar más beacons aquí con sus coordenadas en metros

const IndoorKonva = ({ currentData }) => {
    // Dimensiones reales del plano en metros
    const REAL_WIDTH = 40 // metros (largo)
    const REAL_HEIGHT = 20 // metros (ancho)

    // Dimensiones del contenedor
    const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
    const containerRef = useRef(null)

    // Estado para zoom y pan
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isInitialized, setIsInitialized] = useState(false)

    // Cargar la imagen
    const [image] = useImage('/amsa.png')

    // Calcular dimensiones de la imagen manteniendo la proporción real (80m x 20m)
    // Usar useMemo para evitar recalcular en cada render
    const imageDimensions = useMemo(() => {
        if (!image) return { width: 0, height: 0 }

        // Relación de aspecto real del plano: 60m / 20m = 3:1
        const realAspectRatio = REAL_WIDTH / REAL_HEIGHT // 4:1

        // Calcular dimensiones del canvas basadas en el contenedor
        const containerAspectRatio = containerSize.width / containerSize.height

        let canvasWidth, canvasHeight

        // Ajustar para que quepa en el contenedor manteniendo la proporción real
        if (containerAspectRatio > realAspectRatio) {
            // El contenedor es más ancho, ajustar por altura
            canvasHeight = containerSize.height * 0.9
            canvasWidth = canvasHeight * realAspectRatio
        } else {
            // El contenedor es más alto, ajustar por ancho
            canvasWidth = containerSize.width * 0.9
            canvasHeight = canvasWidth / realAspectRatio
        }

        return { width: canvasWidth, height: canvasHeight }
    }, [image, containerSize.width, containerSize.height])

    // Convertir coordenadas de metros a píxeles del canvas
    const metersToPixels = useMemo(() => {
        if (imageDimensions.width === 0 || imageDimensions.height === 0) {
            return { x: 0, y: 0 }
        }
        return {
            x: imageDimensions.width / REAL_WIDTH, // píxeles por metro en x
            y: imageDimensions.height / REAL_HEIGHT // píxeles por metro en y
        }
    }, [imageDimensions.width, imageDimensions.height])

    // Calcular posiciones de los beacons en píxeles
    const beaconPositions = useMemo(() => {
        return beacons.map(beacon => ({
            ...beacon,
            pixelX: beacon.x * metersToPixels.x,
            pixelY: beacon.y * metersToPixels.y
        }))
    }, [metersToPixels.x, metersToPixels.y])

    // Actualizar tamaño del contenedor cuando cambia el tamaño de la ventana
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

    // Manejar zoom con la rueda del mouse
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

    // Manejar drag para pan
    const handleDragEnd = (e) => {
        setPosition({
            x: e.target.x(),
            y: e.target.y(),
        })
    }

    // Centrar la imagen al cargar (solo una vez)
    useEffect(() => {
        if (image && imageDimensions.width > 0 && !isInitialized) {
            const centerX = (containerSize.width - imageDimensions.width) / 2
            const centerY = (containerSize.height - imageDimensions.height) / 2
            setPosition({ x: centerX, y: centerY })
            setIsInitialized(true)
        }
    }, [image, imageDimensions.width, imageDimensions.height, containerSize.width, containerSize.height, isInitialized])

    return (
        <div
            ref={containerRef}
            className="w-full h-full min-h-[600px] bg-gray-100 overflow-hidden relative"
        >
            <Stage
                width={containerSize.width}
                height={containerSize.height}
                onWheel={handleWheel}
                onDragEnd={handleDragEnd}
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
                    {/* Renderizar beacons como círculos rojos */}
                    {beaconPositions.map((beacon, index) => (
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
                    ))}

                    {currentData.map((device, index) => device.pos_data && device.pos_data.x && device.pos_data.y && (
                        <Circle
                            key={`device-${index}`}
                            x={device.pos_data.x * metersToPixels.x}
                            y={device.pos_data.y * metersToPixels.y}
                            radius={5}
                            fill="blue"
                            stroke="darkblue"
                            strokeWidth={2}
                            opacity={0.9}
                        />
                    ))}
                </Layer>
            </Stage>

            {/* Información de escala */}
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-4 py-2 rounded shadow-lg z-10">
                <p className="text-sm font-semibold">Escala del plano</p>
                <p className="text-xs text-gray-600">
                    Dimensiones reales: {REAL_WIDTH}m × {REAL_HEIGHT}m
                </p>
                <p className="text-xs text-gray-600">
                    Zoom: {(scale * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-600">
                    Beacons: {beacons.length}
                </p>
            </div>
        </div>
    )
}

export default IndoorKonva