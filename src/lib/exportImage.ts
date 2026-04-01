import type Konva from 'konva'

export function downloadStageAsPng(stage: Konva.Stage, fileName: string): void {
  const dataUrl = stage.toDataURL({ pixelRatio: 2 })
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = fileName
  link.click()
}
