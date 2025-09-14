import type { GameState } from "@/app/page"

interface HeadingDisplayProps {
  heading: number
  gameState: GameState
  isFlashing?: boolean
}

export function HeadingDisplay({ heading, gameState, isFlashing = false }: HeadingDisplayProps) {
  const formatHeading = (h: number) => {
    return h.toString().padStart(3, "0")
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Reference Heading</div>
      <div
        className={`text-6xl font-mono font-bold transition-all duration-300 ${
          gameState === "showing-result" ? "text-primary" : "text-foreground"
        } ${isFlashing ? "animate-pulse bg-primary text-primary-foreground rounded-lg px-4 py-2" : ""}`}
      >
        {formatHeading(heading)}°
      </div>
    </div>
  )
}
