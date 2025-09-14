import { ChevronLeft, ChevronRight } from "lucide-react"
import type { GameState } from "@/app/page"

interface DirectionDisplayProps {
  direction: "left" | "right"
  angle: number
  gameState: GameState
}

export function DirectionDisplay({ direction, angle, gameState }: DirectionDisplayProps) {
  if (gameState !== "showing-direction" && gameState !== "showing-angle") {
    return <div className="h-20" />
  }

  return (
    <div className="space-y-4">
      {/* Direction Arrow */}
      <div className="flex justify-center">
        {direction === "left" ? (
          <ChevronLeft className="h-12 w-12 text-accent animate-pulse" />
        ) : (
          <ChevronRight className="h-12 w-12 text-accent animate-pulse" />
        )}
      </div>

      {/* Angle */}
      {gameState === "showing-angle" && (
        <div className="text-4xl font-bold text-secondary animate-in fade-in duration-300">{angle}°</div>
      )}
    </div>
  )
}
