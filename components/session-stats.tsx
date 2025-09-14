import { Card } from "@/components/ui/card"
import type { SessionData } from "@/app/page"

interface SessionStatsProps {
  sessionData: SessionData
}

export function SessionStats({ sessionData }: SessionStatsProps) {
  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(1) + "s"
  }

  const getSessionDuration = () => {
    if (sessionData.startTime === 0) return "0.0s"
    return formatTime(sessionData.totalTime)
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Session Stats</h3>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-primary">{sessionData.turnCount}</div>
          <div className="text-xs text-muted-foreground">Turns</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-primary">{getSessionDuration()}</div>
          <div className="text-xs text-muted-foreground">Total Time</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-primary">
            {sessionData.averageTime > 0 ? formatTime(sessionData.averageTime) : "0.0s"}
          </div>
          <div className="text-xs text-muted-foreground">Avg/Turn</div>
        </div>
      </div>
    </Card>
  )
}
