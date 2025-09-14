"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LucideSettings, Play, Pause, RotateCcw } from "lucide-react"
import { HeadingDisplay } from "@/components/heading-display"
import { DirectionDisplay } from "@/components/direction-display"
import { SettingsPanel } from "@/components/settings-panel"
import { SessionStats } from "@/components/session-stats"

export type GameState = "idle" | "ready" | "showing-direction" | "showing-angle" | "showing-result"

export interface TrainerSettings {
  frequency45: number
  frequency90: number
  frequency180: number
  delayMs: number
  shiftAfterTurns: number
  shiftAmount: number
  initialHeading: number
  roundToNearest: number
}

export interface SessionData {
  startTime: number
  turnCount: number
  totalTime: number
  averageTime: number
}

const defaultSettings: TrainerSettings = {
  frequency45: 40,
  frequency90: 40,
  frequency180: 20,
  delayMs: 1000,
  shiftAfterTurns: 5,
  shiftAmount: 15,
  initialHeading: 360,
  roundToNearest: 5,
}

export default function PilotTrainer() {
  const [gameState, setGameState] = useState<GameState>("idle")
  const [settings, setSettings] = useState<TrainerSettings>(defaultSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [currentHeading, setCurrentHeading] = useState(360)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const [angle, setAngle] = useState(45)
  const [sessionData, setSessionData] = useState<SessionData>({
    startTime: 0,
    turnCount: 0,
    totalTime: 0,
    averageTime: 0,
  })
  const [turnStartTime, setTurnStartTime] = useState(0)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [isHeadingFlashing, setIsHeadingFlashing] = useState(false)

  // Calculate new heading based on current heading, direction, and angle
  const calculateNewHeading = useCallback((heading: number, dir: "left" | "right", ang: number) => {
    let newHeading = heading
    if (dir === "left") {
      newHeading = heading - ang
    } else {
      newHeading = heading + ang
    }

    // Handle 360-degree wrap around
    if (newHeading <= 0) {
      newHeading += 360
    } else if (newHeading > 360) {
      newHeading -= 360
    }

    return newHeading
  }, [])

  // Generate random turn parameters
  const generateTurn = useCallback(() => {
    const total = settings.frequency45 + settings.frequency90 + settings.frequency180
    const random = Math.random() * total

    let selectedAngle = 45
    if (random < settings.frequency45) {
      selectedAngle = 45
    } else if (random < settings.frequency45 + settings.frequency90) {
      selectedAngle = 90
    } else {
      selectedAngle = 180
    }

    const selectedDirection = Math.random() < 0.5 ? "left" : "right"

    setDirection(selectedDirection)
    setAngle(selectedAngle)
  }, [settings])

  // Round heading to nearest specified value
  const roundHeading = useCallback(
    (heading: number) => {
      const rounded = Math.round(heading / settings.roundToNearest) * settings.roundToNearest
      if (rounded <= 0) {
        return rounded + 360
      } else if (rounded > 360) {
        return rounded - 360
      }
      return rounded
    },
    [settings.roundToNearest],
  )

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault()
        handleUserInput()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSessionActive && sessionData.startTime > 0) {
      interval = setInterval(() => {
        setSessionData((prev) => ({
          ...prev,
          totalTime: Date.now() - prev.startTime,
        }))
      }, 100) // Update every 100ms for smooth timer
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSessionActive, sessionData.startTime])

  // Handle user input (tap or spacebar)
  const handleUserInput = useCallback(() => {
    if (gameState === "showing-angle") {
      const newHeading = calculateNewHeading(currentHeading, direction, angle)
      const roundedHeading = roundHeading(newHeading)
      setCurrentHeading(roundedHeading)
      setGameState("showing-result")

      // Update session stats
      const turnTime = Date.now() - turnStartTime
      setSessionData((prev) => {
        const newTurnCount = prev.turnCount + 1
        const newTotalTime = prev.totalTime + turnTime
        return {
          ...prev,
          turnCount: newTurnCount,
          averageTime: newTotalTime / newTurnCount,
        }
      })

      // Check if we need to shift heading
      if ((sessionData.turnCount + 1) % settings.shiftAfterTurns === 0) {
        const shiftDirection = Math.random() < 0.5 ? -1 : 1
        const shift = Math.random() * (settings.shiftAmount - 10) + 10
        let shiftedHeading = roundedHeading + shift * shiftDirection

        // Ensure shifted heading stays within 1-360 range
        if (shiftedHeading <= 0) {
          shiftedHeading += 360
        } else if (shiftedHeading > 360) {
          shiftedHeading -= 360
        }

        const finalShiftedHeading = roundHeading(shiftedHeading)
        setTimeout(() => {
          setIsHeadingFlashing(true)
          setCurrentHeading(finalShiftedHeading)
          setTimeout(() => setIsHeadingFlashing(false), 500)
        }, 1500)
      }

      setTimeout(() => {
        setTurnStartTime(Date.now())
        generateTurn()
        setGameState("showing-direction")
        setTimeout(() => {
          setGameState("showing-angle")
        }, settings.delayMs)
      }, 2000)
    }
  }, [
    gameState,
    settings,
    direction,
    angle,
    currentHeading,
    calculateNewHeading,
    roundHeading,
    generateTurn,
    turnStartTime,
    sessionData.turnCount,
  ])

  const startSession = () => {
    setIsSessionActive(true)
    setSessionData({
      startTime: Date.now(),
      turnCount: 0,
      totalTime: 0,
      averageTime: 0,
    })
    setCurrentHeading(roundHeading(settings.initialHeading))

    // Automatically start first turn
    setTimeout(() => {
      setTurnStartTime(Date.now())
      generateTurn()
      setGameState("showing-direction")
      setTimeout(() => {
        setGameState("showing-angle")
      }, settings.delayMs)
    }, 1000)
  }

  // Pause session
  const pauseSession = () => {
    setIsSessionActive(false)
    setGameState("idle")
  }

  // Reset session
  const resetSession = () => {
    setIsSessionActive(false)
    setGameState("idle")
    setSessionData({
      startTime: 0,
      turnCount: 0,
      totalTime: 0,
      averageTime: 0,
    })
    setCurrentHeading(roundHeading(settings.initialHeading))
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dragons Heading Generator</h1>
          <Button variant="outline" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <LucideSettings className="h-4 w-4" />
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel settings={settings} onSettingsChange={setSettings} onClose={() => setShowSettings(false)} />
        )}

        {/* Main Display */}
        <Card className="p-8 text-center space-y-6">
          <HeadingDisplay heading={currentHeading} gameState={gameState} isFlashing={isHeadingFlashing} />

          <DirectionDisplay direction={direction} angle={angle} gameState={gameState} />

          {/* Action Button */}
          <div className="space-y-4">
            {gameState === "idle" && (
              <Button onClick={startSession} className="w-full h-16 text-lg font-semibold" disabled={isSessionActive}>
                Start Session
              </Button>
            )}

            {gameState === "showing-angle" && (
              <Button onClick={handleUserInput} className="w-full h-16 text-lg font-semibold" variant="secondary">
                Calculated
              </Button>
            )}

            {gameState === "showing-direction" && (
              <div className="h-16 flex items-center justify-center text-muted-foreground">Get ready...</div>
            )}

            {gameState === "showing-result" && (
              <div className="h-16 flex items-center justify-center text-muted-foreground">Next turn starting...</div>
            )}
          </div>
        </Card>

        {/* Session Controls */}
        <div className="flex gap-2">
          {!isSessionActive ? (
            <Button onClick={startSession} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={pauseSession} variant="outline" className="flex-1 bg-transparent">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}

          <Button onClick={resetSession} variant="outline" className="flex-1 bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Session Stats */}
        {isSessionActive && <SessionStats sessionData={sessionData} />}

        {/* Instructions */}
        <Card className="p-4">
          <p className="text-sm text-muted-foreground text-center">
            Tap the screen or press spacebar to advance. Calculate the new heading when the angle appears.
          </p>
        </Card>
      </div>
    </div>
  )
}
