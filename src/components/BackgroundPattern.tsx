import { useMemo } from 'react'
import { Group, Rect } from 'react-konva'
import { SeededRandom } from '../lib/seededRandom'
import type { GuardianProfile } from '../types/guardian'

type BackgroundPatternProps = {
  guardian: GuardianProfile
}

export function BackgroundPattern({ guardian }: BackgroundPatternProps) {
  const ornaments = useMemo(() => {
    const random = new SeededRandom(guardian.seed ^ 0x9e3779b9)
    const centerX = 260
    const startX = 90
    const startY = 92
    const cell = 34
    const rows = 10
    const cols = 5

    return Array.from({ length: rows * cols }, (_, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      const x = startX + col * cell
      const y = startY + row * cell
      const enabled = random.nextFloat() > 0.18
      const inset = random.nextInt(4, 9)
      const opacity = Number((0.1 + random.nextFloat() * 0.18).toFixed(3))
      const color = random.pick([guardian.visuals.sigilColor, guardian.visuals.auraAccent])

      return {
        id: `ornament-${index}`,
        enabled,
        x,
        y,
        mirrorX: centerX + (centerX - (x + cell)),
        inset,
        size: cell,
        opacity,
        color,
      }
    }).filter((ornament) => ornament.enabled)
  }, [guardian])

  return (
    <Group>
      {ornaments.map((ornament) => {
        const renderCell = (x: number, suffix: string) => (
          <Rect
            key={`${ornament.id}-${suffix}`}
            x={x + ornament.inset}
            y={ornament.y + ornament.inset}
            width={ornament.size - ornament.inset * 2}
            height={ornament.size - ornament.inset * 2}
            fill={ornament.color}
            opacity={ornament.opacity}
            cornerRadius={6}
          />
        )

        return (
          <Group key={ornament.id}>
            {renderCell(ornament.x, 'left')}
            {renderCell(ornament.mirrorX, 'right')}
          </Group>
        )
      })}
    </Group>
  )
}
