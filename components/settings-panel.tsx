"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Settings } from "@/app/page"

interface SettingsPanelProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
  onClose: () => void
}

export function SettingsPanel({ settings, onSettingsChange, onClose }: SettingsPanelProps) {
  const updateSetting = (key: keyof Settings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    })
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="freq45">45° Frequency (%)</Label>
          <Input
            id="freq45"
            type="number"
            min="0"
            max="100"
            value={settings.frequency45}
            onChange={(e) => updateSetting("frequency45", Number.parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="freq90">90° Frequency (%)</Label>
          <Input
            id="freq90"
            type="number"
            min="0"
            max="100"
            value={settings.frequency90}
            onChange={(e) => updateSetting("frequency90", Number.parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="freq180">180° Frequency (%)</Label>
          <Input
            id="freq180"
            type="number"
            min="0"
            max="100"
            value={settings.frequency180}
            onChange={(e) => updateSetting("frequency180", Number.parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delay">Delay (ms)</Label>
          <Input
            id="delay"
            type="number"
            min="100"
            max="5000"
            step="100"
            value={settings.delayMs}
            onChange={(e) => updateSetting("delayMs", Number.parseInt(e.target.value) || 1000)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shiftTurns">Check After Turns</Label>
          <Input
            id="shiftTurns"
            type="number"
            min="1"
            max="50"
            value={settings.shiftAfterTurns}
            onChange={(e) => updateSetting("shiftAfterTurns", Number.parseInt(e.target.value) || 5)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="shiftAmount">Max Shift (°)</Label>
          <Input
            id="shiftAmount"
            type="number"
            min="5"
            max="50"
            value={settings.shiftAmount}
            onChange={(e) => updateSetting("shiftAmount", Number.parseInt(e.target.value) || 15)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="initialHeading">Initial Heading</Label>
          <Input
            id="initialHeading"
            type="number"
            min="1"
            max="360"
            value={settings.initialHeading}
            onChange={(e) => updateSetting("initialHeading", Number.parseInt(e.target.value) || 360)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roundTo">Round To Nearest</Label>
          <Input
            id="roundTo"
            type="number"
            min="1"
            max="10"
            value={settings.roundToNearest}
            onChange={(e) => updateSetting("roundToNearest", Number.parseInt(e.target.value) || 5)}
          />
        </div>
      </div>
    </Card>
  )
}
