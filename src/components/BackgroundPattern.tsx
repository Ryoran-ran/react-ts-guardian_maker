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
    const startX = guardian.tone === '生活感' ? 86 : 90
    const startY = guardian.tone === '生活感' ? 88 : 92
    const cell = guardian.tone === '生活感' ? 36 : 34
    const rows = 10
    const cols = 5

    return Array.from({ length: rows * cols }, (_, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      const x = startX + col * cell
      const y = startY + row * cell
      const enabled = random.nextFloat() > (guardian.tone === '生活感' ? 0.12 : 0.18)
      const inset = guardian.tone === '生活感' ? random.nextInt(3, 8) : random.nextInt(4, 9)
      const opacity = Number(
        ((guardian.tone === '生活感' ? 0.14 : 0.1) + random.nextFloat() * (guardian.tone === '生活感' ? 0.16 : 0.18)).toFixed(3),
      )
      const color = guardian.tone === '生活感'
        ? random.pick([guardian.visuals.auraAccent, guardian.visuals.auraColor])
        : random.pick([guardian.visuals.sigilColor, guardian.visuals.auraAccent])
      const cornerRadius = guardian.tone === '生活感' ? random.pick([8, 12, 16]) : 6

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
        cornerRadius,
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
            cornerRadius={ornament.cornerRadius}
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
