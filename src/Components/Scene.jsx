import { useRef, useEffect, useState, useMemo, useCallback, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTexture, PerspectiveCamera, ContactShadows, Preload } from "@react-three/drei"
import * as THREE from "three"

import img from "../assets/Frame 1.png"
import pic from "../assets/model.webp"

// Memoized loading component
const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center ">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
)

export default function Scene() {
  
  const [isMobile, setIsMobile] = useState(false)

  // Optimized resize handler with debouncing
  useEffect(() => {
    let timeoutId
    const onResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768)
      }, 100)
    }

    onResize()
    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  // Memoized camera settings
  const cameraSettings = useMemo(
    () => ({
      fov: isMobile ? 75 : 65,
      position: [0, 0, 12],
    }),
    [isMobile],
  )

  // Memoized GL settings
  const glSettings = useMemo(
    () => ({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
      powerPreference: "high-performance",
    }),
    [],
  )

  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          style={{ width: "100%", height: "100%" }}
          camera={cameraSettings}
          gl={glSettings}
          dpr={[1, 2]}
          frameloop="demand" // Only render when needed
        >
          <SceneContent isMobile={isMobile} />
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  )
}

function SceneContent({ isMobile }) {
  const cyl = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [rotationY, setRotationY] = useState(0)
  const { gl, invalidate } = useThree()

  // Preload and configure textures
  const tex = useTexture(img)
  const modelTex = useTexture(pic)

  // Memoized texture configuration
  useMemo(() => {
    if (tex) {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      tex.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy())
      tex.needsUpdate = true
    }
  }, [tex, gl])

  useMemo(() => {
    if (modelTex) {
      modelTex.colorSpace = THREE.SRGBColorSpace
      modelTex.generateMipmaps = false
      modelTex.minFilter = THREE.LinearFilter
      modelTex.magFilter = THREE.LinearFilter
      modelTex.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy())
      modelTex.needsUpdate = true
    }
  }, [modelTex, gl])

  // Memoized geometry arguments
  const cylinderArgs = useMemo(
    () => (isMobile ? [1.78, 1.78, 1.6, 100, 100, true] : [1.8, 1.8, 1.55, 120, 120, true]),
    [isMobile],
  )

  const planeArgs = useMemo(() => (isMobile ? [3.15, 6.3] : [3.3, 6.6]), [isMobile])

  // Memoized positions
  const meshPosition = useMemo(() => (isMobile ? [0, -1.4, -0.3] : [0, -0.4, -0.2]), [isMobile])

  const cylinderPosition = useMemo(() => (isMobile ? [0, -1.6, 0] : [0, -0.9, 0]), [isMobile])

  const cameraPosition = useMemo(() => [0, 0, 5.2], [])

  // Optimized animation loop
  useFrame((_, dt) => {
    if (!cyl.current) return

    let needsUpdate = false

    // Auto-rotation when not dragging
    if (!isDragging) {
      cyl.current.rotation.y += dt * 0.2
      needsUpdate = true
    }

    // Scale animation
    const targetScale = isHovered || isDragging ? 1.1 : 1
    const currentScale = cyl.current.scale.x

    if (Math.abs(currentScale - targetScale) > 0.001) {
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.006)
      cyl.current.scale.setScalar(newScale)
      needsUpdate = true
    }

    if (needsUpdate) {
      invalidate()
    }
  })

  // Optimized event handlers with useCallback
  const handlePointerDown = useCallback(
    (e) => {
      if (isMobile) return
      setIsDragging(true)
      setDragStartX(e.clientX || e.touches?.[0]?.clientX || 0)
      invalidate()
    },
    [isMobile, invalidate],
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging || isMobile || !cyl.current) return

      const deltaX = (e.clientX || e.touches?.[0]?.clientX || 0) - dragStartX
      cyl.current.rotation.y = THREE.MathUtils.lerp(cyl.current.rotation.y, rotationY + deltaX * 0.01, 0.3)
      invalidate()
    },
    [isDragging, isMobile, dragStartX, rotationY, invalidate],
  )

  const handlePointerUp = useCallback(() => {
    if (isMobile) return

    if (cyl.current) {
      setRotationY(cyl.current.rotation.y)
    }
    setIsDragging(false)
    invalidate()
  }, [isMobile, invalidate])

  const handlePointerOver = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true)
      invalidate()
    }
  }, [isMobile, invalidate])

  const handlePointerOut = useCallback(() => {
    setIsHovered(false)
    invalidate()
  }, [invalidate])

  // Optimized event listeners
  useEffect(() => {
    if (isMobile) return

    const options = { passive: true }
    window.addEventListener("pointermove", handlePointerMove, options)
    window.addEventListener("pointerup", handlePointerUp, options)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp, isMobile])

  // Memoized materials
  const planeMaterial = useMemo(() => <meshBasicMaterial visible={true} map={modelTex} alphaTest={0.01} />, [modelTex])

  const cylinderMaterial = useMemo(
    () => (
      <meshBasicMaterial map={tex} wireframe={false} side={THREE.DoubleSide} transparent={true} premultipliedAlpha />
    ),
    [tex],
  )

  return (
    <>
      <PerspectiveCamera makeDefault fov={isMobile ? 75 : 65} position={cameraPosition} />

      <mesh position={meshPosition} renderOrder={999} raycast={() => null}>
        <planeGeometry args={planeArgs} />
        {planeMaterial}
      </mesh>

      <group>
        <mesh
          ref={cyl}
          rotation={[0, 0, 0.3]}
          position={cylinderPosition}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onPointerDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          <cylinderGeometry args={cylinderArgs} />
          {cylinderMaterial}
        </mesh>
      </group>

      <ContactShadows position={[0, -1.5, 0]} opacity={0.5} width={10} height={10} blur={2} far={4} />
    </>
  )
}
