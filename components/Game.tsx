import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface GameState {
  score: number
  lives: number
  level: number
  gameOver: boolean
  paused: boolean
}

const Game: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const playerRef = useRef<THREE.Mesh | null>(null)
  const keysPressed = useRef<Record<string, boolean>>({})
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    paused: false,
  })

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7)
    scene.add(directionalLight)

    // Player cube
    const playerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    const player = new THREE.Mesh(playerGeometry, playerMaterial)
    player.position.set(0, 0, 0)
    scene.add(player)
    playerRef.current = player

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20)
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a4e })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -3
    scene.add(floor)

    // Enemy cubes array
    const enemies: THREE.Mesh[] = []

    const createEnemy = () => {
      const enemyGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
      const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
      const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial)
      enemy.position.set(
        (Math.random() - 0.5) * 10,
        2,
        (Math.random() - 0.5) * 10
      )
      scene.add(enemy)
      enemies.push(enemy)
      return enemy
    }

    // Spawn initial enemies
    for (let i = 0; i < 3; i++) {
      createEnemy()
    }

    // Input handling
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true
      if (e.key === 'Escape') {
        setGameState((prev) => ({ ...prev, paused: !prev.paused }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Game loop
    const playerVelocity = new THREE.Vector3()
    const speed = 0.1
    const frameId = setInterval(() => {
      if (!gameState.paused && !gameState.gameOver && player) {
        // Player movement
        playerVelocity.set(0, playerVelocity.y - 0.01, 0)

        if (keysPressed.current['w'] || keysPressed.current['arrowup'])
          playerVelocity.z -= speed
        if (keysPressed.current['s'] || keysPressed.current['arrowdown'])
          playerVelocity.z += speed
        if (keysPressed.current['a'] || keysPressed.current['arrowleft'])
          playerVelocity.x -= speed
        if (keysPressed.current['d'] || keysPressed.current['arrowright'])
          playerVelocity.x += speed

        player.position.add(playerVelocity)

        // Boundary checking
        player.position.x = Math.max(-9, Math.min(9, player.position.x))
        player.position.z = Math.max(-9, Math.min(9, player.position.z))
        player.position.y = Math.max(-2.75, player.position.y)

        // Enemy movement and collision detection
        enemies.forEach((enemy) => {
          const direction = player.position.clone().sub(enemy.position).normalize()
          enemy.position.add(direction.multiplyScalar(0.02))

          const distance = player.position.distanceTo(enemy.position)
          if (distance < 0.5) {
            setGameState((prev) => ({
              ...prev,
              lives: prev.lives - 1,
              gameOver: prev.lives <= 1,
              score: prev.score + 10,
            }))
            enemy.position.set(
              (Math.random() - 0.5) * 10,
              2,
              (Math.random() - 0.5) * 10
            )
          }
        })

        // Player rotation for visual effect
        player.rotation.x += 0.01
        player.rotation.y += 0.01
      }

      renderer.render(scene, camera)
    }, 1000 / 60)

    return () => {
      clearInterval(frameId)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [gameState.paused, gameState.gameOver])

  const resetGame = () => {
    setGameState({
      score: 0,
      lives: 3,
      level: 1,
      gameOver: false,
      paused: false,
    })
  }

  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div className="game-ui">
        <div className="score">Score: {gameState.score}</div>
        <div className="lives">Lives: {gameState.lives}</div>
        <div className="level">Level: {gameState.level}</div>

        {gameState.paused && (
          <div className="overlay">
            <div className="modal">
              <h1>PAUSED</h1>
              <p>Press ESC to resume</p>
            </div>
          </div>
        )}

        {gameState.gameOver && (
          <div className="overlay">
            <div className="modal">
              <h1>GAME OVER</h1>
              <p>Final Score: {gameState.score}</p>
              <button onClick={resetGame}>Play Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game
