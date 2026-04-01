import { forwardRef, useEffect, useRef, useState } from 'react'
import { Circle, Ellipse, Group, Layer, Line, Rect, RegularPolygon, Stage } from 'react-konva'
import type Konva from 'konva'
import type { GuardianProfile } from '../types/guardian'

type GuardianCanvasProps = {
  guardian: GuardianProfile
}

const WIDTH = 520
const HEIGHT = 520
const PREVIEW_SCALE = 0.86
const GROUND_Y = 470
const OUTLINE_COLOR = '#5c4436'
const OUTLINE_WIDTH = 3

function Hair({ guardian }: GuardianCanvasProps) {
  const { hairColor, hairVariant } = guardian.visuals

  if (hairVariant === 'long') {
    return (
      <Group>
        <Ellipse x={260} y={186} radiusX={90} radiusY={104} fill={hairColor} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
        <Rect x={176} y={188} width={40} height={160} fill={hairColor} cornerRadius={20} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
        <Rect x={304} y={188} width={40} height={160} fill={hairColor} cornerRadius={20} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
      </Group>
    )
  }

  if (hairVariant === 'spiky') {
    return (
      <Group>
        <RegularPolygon x={260} y={124} sides={9} radius={82} fill={hairColor} rotation={-14} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
        <Ellipse x={260} y={176} radiusX={88} radiusY={76} fill={hairColor} />
      </Group>
    )
  }

  if (hairVariant === 'bob') {
    return (
      <Group>
        <Rect x={170} y={110} width={180} height={150} fill={hairColor} cornerRadius={48} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
        <Rect x={190} y={238} width={32} height={84} fill={hairColor} cornerRadius={16} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
        <Rect x={298} y={238} width={32} height={84} fill={hairColor} cornerRadius={16} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
      </Group>
    )
  }

  return <Ellipse x={260} y={170} radiusX={86} radiusY={72} fill={hairColor} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
}

function Ear({ x, y, guardian, direction }: { x: number; y: number; guardian: GuardianProfile; direction: 1 | -1 }) {
  const { earHeight, earWidth, earVariant, skinHex } = guardian.visuals

  if (earVariant === 'pointed') {
    return (
      <Line
        points={[x, y, x + direction * earWidth, y - earHeight / 2, x + direction * (earWidth + 2), y + earHeight / 2]}
        closed
        fill={skinHex}
        stroke={OUTLINE_COLOR}
        strokeWidth={OUTLINE_WIDTH}
      />
    )
  }

  if (earVariant === 'leaf') {
    return (
      <Ellipse
        x={x}
        y={y}
        radiusX={earWidth}
        radiusY={earHeight / 2}
        fill={skinHex}
        stroke={OUTLINE_COLOR}
        strokeWidth={OUTLINE_WIDTH}
        rotation={direction * 18}
      />
    )
  }

  return <Ellipse x={x} y={y} radiusX={earWidth} radiusY={earHeight / 2} fill={skinHex} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
}

function Eyes({ guardian }: GuardianCanvasProps) {
  const { eyeHex, eyeScaleX, eyeScaleY, eyeVariant } = guardian.visuals
  const radiusX = 18 * eyeScaleX
  const radiusY = 11 * eyeScaleY

  if (eyeVariant === 'sharp') {
    return (
      <>
        <Line points={[196, 212, 232, 202, 240, 214, 202, 224]} closed fill="#fff" />
        <Line points={[280, 214, 318, 204, 326, 216, 288, 226]} closed fill="#fff" />
        <Ellipse x={220} y={214} radiusX={10} radiusY={9} fill={eyeHex} />
        <Ellipse x={304} y={216} radiusX={10} radiusY={9} fill={eyeHex} />
      </>
    )
  }

  if (eyeVariant === 'almond') {
    return (
      <>
        <Ellipse x={220} y={214} radiusX={radiusX} radiusY={radiusY} fill="#fff" />
        <Ellipse x={304} y={214} radiusX={radiusX} radiusY={radiusY} fill="#fff" />
        <Ellipse x={220} y={214} radiusX={10} radiusY={9} fill={eyeHex} />
        <Ellipse x={304} y={214} radiusX={10} radiusY={9} fill={eyeHex} />
      </>
    )
  }

  return (
    <>
      <Circle x={220} y={214} radius={16 * eyeScaleY} fill="#fff" />
      <Circle x={304} y={214} radius={16 * eyeScaleY} fill="#fff" />
      <Circle x={220} y={214} radius={9.5} fill={eyeHex} />
      <Circle x={304} y={214} radius={9.5} fill={eyeHex} />
    </>
  )
}

function Mouth({ guardian }: GuardianCanvasProps) {
  const { mouthCurve, mouthWidth } = guardian.visuals
  const left = 260 - mouthWidth / 2
  const right = 260 + mouthWidth / 2

  return (
    <Line
      points={[left, 282, 260, 282 + mouthCurve, right, 282]}
      stroke="#7c3e49"
      strokeWidth={3}
      tension={0.6}
      lineCap="round"
    />
  )
}

function Arm({ side, color, length }: { side: 'left' | 'right'; color: string; length: number }) {
  const isLeft = side === 'left'
  const armHeight = Math.max(92, length * 0.92)

  return (
    <Rect
      x={isLeft ? -92 : 92}
      y={58}
      offsetX={17}
      offsetY={armHeight / 2}
      width={34}
      height={armHeight}
      cornerRadius={17}
      rotation={isLeft ? 20 : -20}
      fill={color}
      stroke={OUTLINE_COLOR}
      strokeWidth={OUTLINE_WIDTH}
    />
  )
}

export const GuardianCanvas = forwardRef<Konva.Stage, GuardianCanvasProps>(function GuardianCanvas(
  { guardian },
  ref,
) {
  const { visuals } = guardian
  const faceRadiusX = 76 * visuals.headScaleX
  const earOffsetX = faceRadiusX + Math.max(4, visuals.earWidth * 0.35)
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const element = frameRef.current

    if (!element) {
      return
    }

    const updateScale = () => {
      const nextScale = Math.min(1, element.clientWidth / WIDTH)
      setScale(nextScale)
    }

    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="panel canvas-panel">
      <div className="panel-header">
        <p className="eyebrow">Preview</p>
        <h2>守護神プレビュー</h2>
      </div>

      <div className="canvas-frame" ref={frameRef}>
        <Stage width={WIDTH * scale} height={HEIGHT * scale} scaleX={scale} scaleY={scale} ref={ref}>
          <Layer>
            <Rect width={WIDTH} height={HEIGHT} fill="#f7f1e5" />
            <Group x={260} y={288} offsetX={260} offsetY={260} scaleX={PREVIEW_SCALE} scaleY={PREVIEW_SCALE}>
              <Rect x={76} y={GROUND_Y} width={368} height={6} fill="#d7c6a7" cornerRadius={999} opacity={0.9} />
              <Circle x={260} y={258} radius={188} fill={visuals.auraAccent} opacity={0.18} />
              <Circle x={260} y={240} radius={148} fill={visuals.auraColor} opacity={0.22} />
              <RegularPolygon
                x={260}
                y={240}
                sides={8}
                radius={130}
                stroke={visuals.sigilColor}
                strokeWidth={4}
                opacity={0.48}
                rotation={22}
              />
              <RegularPolygon
                x={260}
                y={240}
                sides={3}
                radius={92}
                stroke={visuals.sigilColor}
                strokeWidth={2}
                opacity={0.52}
                rotation={-30}
              />

              <Group
                x={260}
                y={GROUND_Y - (visuals.torsoHeight + visuals.legLength - 22)}
                offsetX={260}
                offsetY={306}
              >
                <Group x={260} y={306} scaleX={visuals.bodyScaleX}>
                  <Rect x={-72} y={-18} width={144} height={visuals.torsoHeight} fill={visuals.robeColor} cornerRadius={34} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
                  <Arm side="left" color={visuals.robeColor} length={visuals.armLength} />
                  <Arm side="right" color={visuals.robeColor} length={visuals.armLength} />
                  <Rect x={-46} y={visuals.torsoHeight - 22} width={34} height={visuals.legLength} fill="#453428" cornerRadius={18} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
                  <Rect x={12} y={visuals.torsoHeight - 22} width={34} height={visuals.legLength} fill="#453428" cornerRadius={18} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
                  <Circle x={0} y={14} radius={18} fill={visuals.auraAccent} opacity={0.65} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
                </Group>

                <Hair guardian={guardian} />
                <Ear x={260 - earOffsetX} y={232} guardian={guardian} direction={-1} />
                <Ear x={260 + earOffsetX} y={232} guardian={guardian} direction={1} />
                <Group x={260} offsetX={260} scaleX={visuals.headScaleX}>
                  <Ellipse x={260} y={226} radiusX={76} radiusY={88} fill={visuals.skinHex} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
                </Group>

                <Line
                  points={[220 - visuals.browWidth / 2, 182, 220 + visuals.browWidth / 2, 178]}
                  stroke={visuals.eyebrowHex}
                  strokeWidth={visuals.browStroke}
                  lineCap="round"
                />
                <Line
                  points={[304 - visuals.browWidth / 2, 178, 304 + visuals.browWidth / 2, 182]}
                  stroke={visuals.eyebrowHex}
                  strokeWidth={visuals.browStroke}
                  lineCap="round"
                />

                <Eyes guardian={guardian} />
                <Circle x={220} y={214} radius={3.6} fill="#161616" />
                <Circle x={304} y={214} radius={3.6} fill="#161616" />
                <Circle x={216} y={210} radius={2.2} fill="#ffffff" opacity={0.8} />
                <Circle x={300} y={210} radius={2.2} fill="#ffffff" opacity={0.8} />

                <Line points={[260, 226, 252, 252, 260, 256]} stroke={OUTLINE_COLOR} strokeWidth={2.5} tension={0.6} lineCap="round" />
                <Mouth guardian={guardian} />
              </Group>
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  )
})
