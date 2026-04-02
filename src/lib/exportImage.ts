import type Konva from 'konva'
import type { GuardianProfile } from '../types/guardian'

export function downloadStageAsPng(stage: Konva.Stage, fileName: string): void {
  const dataUrl = stage.toDataURL({ pixelRatio: 2 })
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = fileName
  link.click()
}

function downloadDataUrl(dataUrl: string, fileName: string): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = fileName
  link.click()
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const chars = Array.from(text)
  let line = ''
  let y = startY

  chars.forEach((char) => {
    const next = line + char
    if (context.measureText(next).width > maxWidth && line) {
      context.fillText(line, x, y)
      line = char
      y += lineHeight
      return
    }
    line = next
  })

  if (line) {
    context.fillText(line, x, y)
  }

  return y
}

export function downloadGuardianProfileCard(
  stage: Konva.Stage,
  fileName: string,
  ownerName: string,
  guardian: GuardianProfile,
): void {
  const previewImage = new Image()
  previewImage.src = stage.toDataURL({ pixelRatio: 2 })

  previewImage.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 2020
    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    context.fillStyle = '#f6efe2'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = '#fffaf1'
    context.strokeStyle = 'rgba(92, 68, 54, 0.12)'
    context.lineWidth = 3
    context.beginPath()
    context.roundRect(40, 40, 1000, 1940, 36)
    context.fill()
    context.stroke()

    context.fillStyle = '#2c211c'
    context.font = '700 56px "Hiragino Sans", "Yu Gothic", sans-serif'
    context.fillText('守護神', 76, 130)

    context.fillStyle = '#7a6456'
    context.font = '400 26px "Hiragino Sans", "Yu Gothic", sans-serif'
    context.fillText(`名前: ${ownerName || '未入力'}`, 78, 178)

    context.drawImage(previewImage, 120, 220, 840, 840)

    const infoRows = [
      ['守護神名', guardian.displayName],
      ['身長', `${guardian.heightCm}cm`],
      ['性格', guardian.personalityLine],
      ['好きなもの', guardian.favoriteLine],
      ['嫌いなもの', guardian.weaknessLine],
      ['能力名', guardian.abilityName],
      ['能力', guardian.abilityDescription],
      ['使用武器', guardian.weapon],
      ['シード値', String(guardian.seed)],
    ] as const

    infoRows.forEach(([label, value], index) => {
      const cardX = 76
      const cardY = 1100 + index * 84

      context.fillStyle = '#fffaf1'
      context.strokeStyle = 'rgba(92, 68, 54, 0.12)'
      context.beginPath()
      context.roundRect(cardX, cardY, 928, 72, 20)
      context.fill()
      context.stroke()

      context.fillStyle = '#7a6456'
      context.font = '500 20px "Hiragino Sans", "Yu Gothic", sans-serif'
      context.fillText(label, cardX + 24, cardY + 28)

      context.fillStyle = '#2c211c'
      context.font = '700 24px "Hiragino Sans", "Yu Gothic", sans-serif'
      drawWrappedText(context, value, cardX + 24, cardY + 58, 880, 28)
    })

    if (guardian.recoveryCode) {
      context.fillStyle = '#7a6456'
      context.font = '500 18px "Hiragino Sans", "Yu Gothic", sans-serif'
      context.fillText('コード', 76, 1892)
      context.fillStyle = '#2c211c'
      context.font = '400 14px ui-monospace, SFMono-Regular, Menlo, monospace'
      drawWrappedText(context, guardian.recoveryCode, 76, 1922, 928, 18)
    }

    downloadDataUrl(canvas.toDataURL('image/png'), fileName)
  }
}
