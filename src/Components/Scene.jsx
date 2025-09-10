import { useRef, useEffect, useState, useMemo, useCallback, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTexture, PerspectiveCamera, ContactShadows, Preload } from "@react-three/drei"
import * as THREE from "three"

import img from "../assets/Frame 1.png"
import pic from "../assets/model.webp"

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
  </div>
)

export default function Scene({onNavClick}) {
  const [isMobile, setIsMobile] = useState(false)

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

  const cameraSettings = useMemo(
    () => ({
      fov: isMobile ? 75 : 65,
      position: [0, 0, 12],
    }),
    [isMobile],
  )

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
          frameloop="demand"
        >
          <SceneContent isMobile={isMobile} onNavClick={onNavClick} />
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  )
}

function SceneContent({ isMobile, onNavClick }) {
  const cyl = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [lastPointerX, setLastPointerX] = useState(0)
  const [targetRotationY, setTargetRotationY] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const { gl, invalidate } = useThree()

  const tex = useTexture(img)
  const modelTex = useTexture(pic)

  useEffect(() => {
    if (tex) {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      tex.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy())
      tex.needsUpdate = true
    }
  }, [tex, gl])

  useEffect(() => {
    if (modelTex) {
      modelTex.colorSpace = THREE.SRGBColorSpace
      modelTex.generateMipmaps = false
      modelTex.minFilter = THREE.LinearFilter
      modelTex.magFilter = THREE.LinearFilter
      modelTex.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy())
      modelTex.needsUpdate = true
    }
  }, [modelTex, gl])

  const cylinderArgs = useMemo(
    () => (isMobile ? [1.78, 1.78, 1.6, 100, 100, true] : [1.8, 1.8, 1.55, 120, 120, true]),
    [isMobile],
  )

  const planeArgs = useMemo(() => (isMobile ? [3.15, 6.3] : [3.3, 6.6]), [isMobile])

  const meshPosition = useMemo(() => (isMobile ? [0, -1.4, -0.3] : [0, -0.4, -0.2]), [isMobile])

  const cylinderPosition = useMemo(() => (isMobile ? [0, -1.6, 0] : [0, -0.9, 0]), [isMobile])

  const cameraPosition = useMemo(() => [0, 0, 5.2], [])

  const getPointerX = useCallback((e) => {
    return e.clientX || (e.touches && e.touches[0]?.clientX) || 0
  }, [])

  useFrame((_, dt) => {
    if (!cyl.current) return

    let needsUpdate = false

    if (isDragging) {
      const rotationDiff = targetRotationY - cyl.current.rotation.y
      cyl.current.rotation.y += rotationDiff * 0.3
      needsUpdate = true
    } else {
      if (Math.abs(velocity) > 0.001) {
        setTargetRotationY(prev => prev + velocity * dt)
        cyl.current.rotation.y += velocity * dt
        setVelocity(prev => prev * 0.96)
        needsUpdate = true
      } else {
        const autoRotation = dt * 0.25
        setTargetRotationY(prev => prev + autoRotation)
        cyl.current.rotation.y += autoRotation
        needsUpdate = true
      }
    }

    const targetScale = isHovered ? 1.13 : isDragging ? THREE.MathUtils.lerp(1, 1.1, Math.min(1, dt * 100)) : THREE.MathUtils.lerp(1.1, 1, Math.min(1, dt * 50))

    const currentScale = cyl.current.scale.x

    if (Math.abs(currentScale - targetScale) > 0.001) {
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
      cyl.current.scale.setScalar(newScale)
      needsUpdate = true
    }

    if (needsUpdate) {
      invalidate()
    }
  })

  const handlePointerDown = useCallback(
    (e) => {
      e.stopPropagation()
      setIsDragging(true)
      setVelocity(0)
      const pointerX = getPointerX(e)
      setLastPointerX(pointerX)
      
      if (cyl.current) {
        setTargetRotationY(cyl.current.rotation.y)
      }
      
      invalidate()
    },
    [getPointerX, invalidate],
  )

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging || !cyl.current) return

      const currentPointerX = getPointerX(e)
      const deltaX = currentPointerX - lastPointerX
      const rotationSpeed = isMobile ? 0.006 : 0.01
      
      const newTargetRotation = targetRotationY + deltaX * rotationSpeed
      setTargetRotationY(newTargetRotation)
      
      setVelocity(deltaX * rotationSpeed * 0.3)
      
      setLastPointerX(currentPointerX)
      invalidate()
    },
    [isDragging, lastPointerX, targetRotationY, isMobile, getPointerX, invalidate],
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    invalidate()
  }, [invalidate])

  const handlePointerOver = useCallback(() => {
    setIsHovered(true)
    invalidate()
  }, [invalidate])

  const handlePointerOut = useCallback(() => {
    setIsHovered(false)
    invalidate()
  }, [invalidate])

  useEffect(() => {
    const options = { passive: false }
    
    const moveHandler = (e) => handlePointerMove(e)
    const upHandler = (e) => handlePointerUp(e)
    
    window.addEventListener("mousemove", moveHandler, options)
    window.addEventListener("mouseup", upHandler, options)
    window.addEventListener("touchmove", moveHandler, options)
    window.addEventListener("touchend", upHandler, options)

    return () => {
      window.removeEventListener("mousemove", moveHandler)
      window.removeEventListener("mouseup", upHandler)
      window.removeEventListener("touchmove", moveHandler)
      window.removeEventListener("touchend", upHandler)
    }
  }, [handlePointerMove, handlePointerUp])

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
          onClick={() => onNavClick("works")}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onPointerDown={handlePointerDown}
        >
          <cylinderGeometry args={cylinderArgs} />
          {cylinderMaterial}
        </mesh>
      </group>

      <ContactShadows position={[0, -1.5, 0]} opacity={0.5} width={10} height={10} blur={2} far={4} />
    </>
  )
}