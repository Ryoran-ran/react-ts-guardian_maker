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
    const weaponLabel = guardian.tone === '生活感' ? '使用アイテム' : '使用武器'
    const isQuirky = guardian.tone === '生活感'
    const pageBg = isQuirky ? '#f7f1e3' : '#f1ecdf'
    const shellFill = isQuirky ? '#fffaf0' : '#fcf8f1'
    const shellStroke = isQuirky ? 'rgba(158, 128, 86, 0.18)' : 'rgba(92, 68, 54, 0.12)'
    const titleColor = isQuirky ? '#3a2a20' : '#2c211c'
    const subtitleColor = isQuirky ? '#8a6b53' : '#7a6456'
    const panelFill = isQuirky ? '#fffdf7' : '#fffaf1'
    const panelStroke = isQuirky ? 'rgba(181, 150, 103, 0.2)' : 'rgba(92, 68, 54, 0.12)'
    const accentFill = isQuirky ? 'rgba(224, 196, 120, 0.16)' : 'rgba(117, 98, 170, 0.08)'
    const accentStroke = isQuirky ? 'rgba(192, 158, 88, 0.18)' : 'rgba(92, 68, 54, 0.08)'
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1860
    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    context.fillStyle = pageBg
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = shellFill
    context.strokeStyle = shellStroke
    context.lineWidth = 3
    context.beginPath()
    context.roundRect(40, 40, 1000, 1780, 36)
    context.fill()
    context.stroke()

    context.fillStyle = accentFill
    context.strokeStyle = accentStroke
    context.lineWidth = isQuirky ? 2 : 1.5
    context.beginPath()
    context.roundRect(68, 206, 944, 868, isQuirky ? 28 : 18)
    context.fill()
    context.stroke()

    context.fillStyle = titleColor
    context.font = '700 56px "Hiragino Sans", "Yu Gothic", sans-serif'
    context.fillText('守護神', 76, 130)

    context.fillStyle = subtitleColor
    context.font = '400 26px "Hiragino Sans", "Yu Gothic", sans-serif'
    context.fillText(`名前: ${ownerName || '未入力'}`, 78, 178)

    if (isQuirky) {
      context.fillStyle = 'rgba(212, 187, 128, 0.28)'
      context.beginPath()
      context.roundRect(790, 72, 150, 40, 14)
      context.fill()
      context.fillStyle = '#8a6b53'
      context.font = '600 16px "Hiragino Sans", "Yu Gothic", sans-serif'
      context.fillText('生活感モード', 818, 98)
    } else {
      context.strokeStyle = 'rgba(117, 98, 170, 0.18)'
      context.lineWidth = 2
      context.beginPath()
      context.moveTo(760, 92)
      context.lineTo(960, 92)
      context.stroke()
      context.fillStyle = '#7a6456'
      context.font = '600 16px "Hiragino Sans", "Yu Gothic", sans-serif'
      context.fillText('神秘感モード', 814, 99)
    }

    context.drawImage(previewImage, 120, 220, 840, 840)

    const infoRows = [
      ['守護神名', guardian.displayName],
      ['身長', `${guardian.heightCm}cm`],
      ['性格', guardian.personalityLine],
      ['好きなもの', guardian.favoriteLine],
      ['嫌いなもの', guardian.weaknessLine],
      ['能力', guardian.ability],
      [weaponLabel, guardian.weapon],
      ['シード値', String(guardian.seed)],
    ] as const

    infoRows.forEach(([label, value], index) => {
      const cardX = 76
      const cardY = 1100 + index * 84

      context.fillStyle = panelFill
      context.strokeStyle = panelStroke
      context.beginPath()
      context.roundRect(cardX, cardY, 928, 72, 20)
      context.fill()
      context.stroke()

      context.fillStyle = subtitleColor
      context.font = '500 20px "Hiragino Sans", "Yu Gothic", sans-serif'
      context.fillText(label, cardX + 24, cardY + 28)

      context.fillStyle = titleColor
      context.font = '700 24px "Hiragino Sans", "Yu Gothic", sans-serif'
      drawWrappedText(context, value, cardX + 24, cardY + 58, 880, 28)
    })

    downloadDataUrl(canvas.toDataURL('image/png'), fileName)
  }
}
