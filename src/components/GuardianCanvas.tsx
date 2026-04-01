import { forwardRef, useEffect, useRef, useState } from 'react'
import { Circle, Ellipse, Group, Layer, Line, Rect, RegularPolygon, Stage } from 'react-konva'
import type Konva from 'konva'
import type { GuardianProfile } from '../types/guardian'
import { BackgroundPattern } from './BackgroundPattern'

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
  const { hairColor, hairVariant, hairScaleX, hairScaleY } = guardian.visuals

  if (hairVariant === 'long') {
    return (
      <Group x={260} y={186} offsetX={260} offsetY={186} scaleX={hairScaleX} scaleY={hairScaleY}>
        <Ellipse x={260} y={186} radiusX={90} radiusY={104} fill={hairColor} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
        <Rect x={176} y={188} width={40} height={160} fill={hairColor} cornerRadius={20} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
        <Rect x={304} y={188} width={40} height={160} fill={hairColor} cornerRadius={20} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
      </Group>
    )
  }

  if (hairVariant === 'spiky') {
    return (
      <Group x={260} y={164} offsetX={260} offsetY={164} scaleX={hairScaleX} scaleY={hairScaleY}>
        <RegularPolygon x={260} y={124} sides={9} radius={82} fill={hairColor} rotation={-14} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
        <Ellipse x={260} y={176} radiusX={88} radiusY={76} fill={hairColor} />
      </Group>
    )
  }

  if (hairVariant === 'bob') {
    return (
      <Group x={260} y={184} offsetX={260} offsetY={184} scaleX={hairScaleX} scaleY={hairScaleY}>
        <Rect x={170} y={110} width={180} height={150} fill={hairColor} cornerRadius={48} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
        <Rect x={190} y={238} width={32} height={84} fill={hairColor} cornerRadius={16} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
        <Rect x={298} y={238} width={32} height={84} fill={hairColor} cornerRadius={16} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
      </Group>
    )
  }

  return (
    <Group x={260} y={170} offsetX={260} offsetY={170} scaleX={hairScaleX} scaleY={hairScaleY}>
      <Ellipse x={260} y={170} radiusX={86} radiusY={72} fill={hairColor} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
    </Group>
  )
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
  const { eyeHex, eyeScaleX, eyeScaleY, eyeVariant, eyeOffsetX } = guardian.visuals
  const radiusX = 18 * eyeScaleX
  const radiusY = 11 * eyeScaleY
  const leftX = 260 - eyeOffsetX
  const rightX = 260 + eyeOffsetX

  if (eyeVariant === 'sharp') {
    return (
      <>
        <Ellipse x={leftX} y={216} radiusX={25} radiusY={12} rotation={-12} fill="#fff" />
        <Ellipse x={rightX} y={216} radiusX={25} radiusY={12} rotation={12} fill="#fff" />
        <Ellipse x={leftX} y={216} radiusX={9} radiusY={9} fill={eyeHex} />
        <Ellipse x={rightX} y={216} radiusX={9} radiusY={9} fill={eyeHex} />
      </>
    )
  }

  if (eyeVariant === 'cute') {
    return (
      <>
        <Ellipse x={leftX} y={216} radiusX={24} radiusY={15} fill="#fff" />
        <Ellipse x={rightX} y={216} radiusX={24} radiusY={15} fill="#fff" />
        <Circle x={leftX} y={217} radius={10} fill={eyeHex} />
        <Circle x={rightX} y={217} radius={10} fill={eyeHex} />
      </>
    )
  }

  if (eyeVariant === 'cool') {
    return (
      <>
        <Ellipse x={leftX} y={214} radiusX={23} radiusY={10} rotation={-6} fill="#fff" />
        <Ellipse x={rightX} y={214} radiusX={23} radiusY={10} rotation={6} fill="#fff" />
        <Ellipse x={leftX} y={214} radiusX={8.5} radiusY={8.5} fill={eyeHex} />
        <Ellipse x={rightX} y={214} radiusX={8.5} radiusY={8.5} fill={eyeHex} />
      </>
    )
  }

  if (eyeVariant === 'almond') {
    return (
      <>
        <Ellipse x={leftX} y={214} radiusX={radiusX} radiusY={radiusY} fill="#fff" />
        <Ellipse x={rightX} y={214} radiusX={radiusX} radiusY={radiusY} fill="#fff" />
        <Ellipse x={leftX} y={214} radiusX={10} radiusY={9} fill={eyeHex} />
        <Ellipse x={rightX} y={214} radiusX={10} radiusY={9} fill={eyeHex} />
      </>
    )
  }

  return (
    <>
      <Circle x={leftX} y={214} radius={16 * eyeScaleY} fill="#fff" />
      <Circle x={rightX} y={214} radius={16 * eyeScaleY} fill="#fff" />
      <Circle x={leftX} y={214} radius={9.5} fill={eyeHex} />
      <Circle x={rightX} y={214} radius={9.5} fill={eyeHex} />
    </>
  )
}

function Mouth({ guardian }: GuardianCanvasProps) {
  const { mouthCurve, mouthWidth, mouthY } = guardian.visuals
  const left = 260 - mouthWidth / 2
  const right = 260 + mouthWidth / 2

  return (
    <Line
      points={[left, mouthY, 260, mouthY + mouthCurve, right, mouthY]}
      stroke="#7c3e49"
      strokeWidth={3}
      tension={0.6}
      lineCap="round"
    />
  )
}

function Nose({ guardian }: GuardianCanvasProps) {
  const { noseVariant, noseWidth, noseHeight } = guardian.visuals
  const x = 260
  const y = 226

  if (noseVariant === 'sharp') {
    return (
      <Line
        points={[x + 2, y, x - noseWidth, y + noseHeight * 0.78, x + noseWidth * 0.2, y + noseHeight]}
        stroke={OUTLINE_COLOR}
        strokeWidth={2.5}
        tension={0.2}
        lineCap="round"
        lineJoin="round"
      />
    )
  }

  if (noseVariant === 'short') {
    return (
      <Line
        points={[x, y + 4, x - noseWidth * 0.55, y + noseHeight * 0.6, x + noseWidth * 0.4, y + noseHeight * 0.66]}
        stroke={OUTLINE_COLOR}
        strokeWidth={2.5}
        tension={0.7}
        lineCap="round"
        lineJoin="round"
      />
    )
  }

  return (
    <Line
      points={[x, y, x - noseWidth, y + noseHeight * 0.82, x + noseWidth * 0.3, y + noseHeight]}
      stroke={OUTLINE_COLOR}
      strokeWidth={2.5}
      tension={0.6}
      lineCap="round"
      lineJoin="round"
    />
  )
}

function Brows({ guardian }: GuardianCanvasProps) {
  const { browVariant, browWidth, browStroke, eyebrowHex, eyeOffsetX } = guardian.visuals
  const leftX = 260 - eyeOffsetX
  const rightX = 260 + eyeOffsetX

  if (browVariant === 'arched') {
    return (
      <>
        <Line
          points={[leftX - browWidth / 2, 184, leftX, 176, leftX + browWidth / 2, 184]}
          stroke={eyebrowHex}
          strokeWidth={browStroke}
          tension={0.45}
          lineCap="round"
        />
        <Line
          points={[rightX - browWidth / 2, 184, rightX, 176, rightX + browWidth / 2, 184]}
          stroke={eyebrowHex}
          strokeWidth={browStroke}
          tension={0.45}
          lineCap="round"
        />
      </>
    )
  }

  if (browVariant === 'angled') {
    return (
      <>
        <Line
          points={[leftX - browWidth / 2, 186, leftX + browWidth / 2, 178]}
          stroke={eyebrowHex}
          strokeWidth={browStroke}
          lineCap="round"
        />
        <Line
          points={[rightX - browWidth / 2, 178, rightX + browWidth / 2, 186]}
          stroke={eyebrowHex}
          strokeWidth={browStroke}
          lineCap="round"
        />
      </>
    )
  }

  if (browVariant === 'gentle') {
    return (
      <>
        <Line
          points={[leftX - browWidth / 2, 178, leftX, 184, leftX + browWidth / 2, 186]}
          stroke={eyebrowHex}
          strokeWidth={browStroke}
          tension={0.4}
          lineCap="round"
        />
        <Line
          points={[rightX - browWidth / 2, 186, rightX, 184, rightX + browWidth / 2, 178]}
          stroke={eyebrowHex}
          strokeWidth={browStroke}
          tension={0.4}
          lineCap="round"
        />
      </>
    )
  }

  return (
    <>
      <Line
        points={[leftX - browWidth / 2, 182, leftX + browWidth / 2, 178]}
        stroke={eyebrowHex}
        strokeWidth={browStroke}
        lineCap="round"
      />
      <Line
        points={[rightX - browWidth / 2, 178, rightX + browWidth / 2, 182]}
        stroke={eyebrowHex}
        strokeWidth={browStroke}
        lineCap="round"
      />
    </>
  )
}

function Arm({
  side,
  color,
  length,
  width,
  shoulderOffset,
  rotation,
}: {
  side: 'left' | 'right'
  color: string
  length: number
  width: number
  shoulderOffset: number
  rotation: number
}) {
  const isLeft = side === 'left'
  const armHeight = Math.max(92, length * 0.92)
  const armWidth = width
  const radius = armWidth / 2
  const armX = isLeft ? -(shoulderOffset - armWidth * 0.45) : shoulderOffset - armWidth * 0.55

  return (
    <Rect
      x={armX}
      y={52}
      offsetX={radius}
      offsetY={armHeight / 2}
      width={armWidth}
      height={armHeight}
      cornerRadius={radius}
      rotation={isLeft ? rotation : -rotation}
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
  const earOffsetX =
    visuals.earVariant === 'pointed'
      ? faceRadiusX - 6
      : visuals.earVariant === 'leaf'
        ? faceRadiusX + 2
        : faceRadiusX + Math.max(2, visuals.earWidth * 0.15)
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
              <BackgroundPattern guardian={guardian} />
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
                  <Arm side="left" color={visuals.robeColor} length={visuals.armLength} width={visuals.armWidth} shoulderOffset={visuals.shoulderOffset} rotation={visuals.armRotation} />
                  <Arm side="right" color={visuals.robeColor} length={visuals.armLength} width={visuals.armWidth} shoulderOffset={visuals.shoulderOffset} rotation={visuals.armRotation} />
                  <Rect x={-(visuals.legWidth + 12)} y={visuals.torsoHeight - 22} width={visuals.legWidth} height={visuals.legLength} fill="#453428" cornerRadius={visuals.legWidth / 2} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
                  <Rect x={12} y={visuals.torsoHeight - 22} width={visuals.legWidth} height={visuals.legLength} fill="#453428" cornerRadius={visuals.legWidth / 2} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
                  <Rect x={-72} y={-18} width={144} height={visuals.torsoHeight} fill={visuals.robeColor} cornerRadius={34} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
                  <Circle x={0} y={14} radius={18} fill={visuals.auraAccent} opacity={0.65} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
                </Group>

                <Hair guardian={guardian} />
                <Ear x={260 - earOffsetX} y={232} guardian={guardian} direction={-1} />
                <Ear x={260 + earOffsetX} y={232} guardian={guardian} direction={1} />
                <Group x={260} offsetX={260} scaleX={visuals.headScaleX}>
                  <Ellipse x={260} y={226} radiusX={76} radiusY={88} fill={visuals.skinHex} stroke={OUTLINE_COLOR} strokeWidth={OUTLINE_WIDTH} />
                </Group>
                <Brows guardian={guardian} />
                <Eyes guardian={guardian} />
              {visuals.eyeVariant === 'sharp' ? (
                <>
                  <Circle x={260 - visuals.eyeOffsetX} y={216} radius={3.4} fill="#161616" />
                  <Circle x={260 + visuals.eyeOffsetX} y={216} radius={3.4} fill="#161616" />
                  <Circle x={256 - visuals.eyeOffsetX} y={212} radius={2.1} fill="#ffffff" opacity={0.8} />
                  <Circle x={256 + visuals.eyeOffsetX} y={212} radius={2.1} fill="#ffffff" opacity={0.8} />
                </>
              ) : visuals.eyeVariant === 'cute' ? (
                <>
                  <Circle x={260 - visuals.eyeOffsetX} y={217} radius={3.6} fill="#161616" />
                  <Circle x={260 + visuals.eyeOffsetX} y={217} radius={3.6} fill="#161616" />
                  <Circle x={256 - visuals.eyeOffsetX} y={212} radius={2.3} fill="#ffffff" opacity={0.85} />
                  <Circle x={256 + visuals.eyeOffsetX} y={212} radius={2.3} fill="#ffffff" opacity={0.85} />
                </>
              ) : visuals.eyeVariant === 'cool' ? (
                <>
                  <Circle x={260 - visuals.eyeOffsetX} y={214} radius={3.2} fill="#161616" />
                  <Circle x={260 + visuals.eyeOffsetX} y={214} radius={3.2} fill="#161616" />
                  <Circle x={256 - visuals.eyeOffsetX} y={211} radius={1.9} fill="#ffffff" opacity={0.75} />
                  <Circle x={256 + visuals.eyeOffsetX} y={211} radius={1.9} fill="#ffffff" opacity={0.75} />
                </>
              ) : (
                <>
                  <Circle x={260 - visuals.eyeOffsetX} y={214} radius={3.6} fill="#161616" />
                  <Circle x={260 + visuals.eyeOffsetX} y={214} radius={3.6} fill="#161616" />
                  <Circle x={256 - visuals.eyeOffsetX} y={210} radius={2.2} fill="#ffffff" opacity={0.8} />
                  <Circle x={256 + visuals.eyeOffsetX} y={210} radius={2.2} fill="#ffffff" opacity={0.8} />
                </>
              )}

                <Nose guardian={guardian} />
                <Mouth guardian={guardian} />
              </Group>
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  )
})
