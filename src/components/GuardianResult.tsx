import type { GuardianProfile } from '../types/guardian'

type GuardianResultProps = {
  guardian: GuardianProfile
  onSave: () => void
}

const appearanceLabels: Array<keyof GuardianProfile['appearance']> = [
  'faceShape',
  'skinColor',
  'hairstyle',
  'eyeSize',
  'eyeShape',
  'eyeColor',
  'eyebrowSize',
  'eyebrowThickness',
  'eyebrowColor',
  'earShape',
  'earSize',
  'mouthShape',
  'mouthSize',
  'jaw',
  'bodyType',
  'height',
]

const labelMap: Record<(typeof appearanceLabels)[number], string> = {
  faceShape: '顔の形',
  skinColor: '肌の色',
  hairstyle: '髪型',
  eyeSize: '目の大きさ',
  eyeShape: '目の形',
  eyeColor: '目の色',
  eyebrowSize: '眉の大きさ',
  eyebrowThickness: '眉の太さ',
  eyebrowColor: '眉の色',
  earShape: '耳の形',
  earSize: '耳の大きさ',
  mouthShape: '口の形',
  mouthSize: '口の大きさ',
  jaw: '顎',
  bodyType: '体型',
  height: '身長',
}

export function GuardianResult({ guardian, onSave }: GuardianResultProps) {
  return (
    <section className="panel result-panel">
      <div className="result-top">
        <div>
          <p className="eyebrow">Result</p>
          <h2>{guardian.guardianName}</h2>
        </div>
        <button className="secondary-button" onClick={onSave} type="button">
          画像を保存
        </button>
      </div>

      <dl className="summary-grid">
        <div>
          <dt>シード値</dt>
          <dd>{guardian.seed}</dd>
        </div>
        <div>
          <dt>性格</dt>
          <dd>{guardian.personality}</dd>
        </div>
        <div>
          <dt>好きなもの</dt>
          <dd>{guardian.favorite}</dd>
        </div>
        <div>
          <dt>苦手なもの</dt>
          <dd>{guardian.weakness}</dd>
        </div>
        <div>
          <dt>使用武器</dt>
          <dd>{guardian.weapon}</dd>
        </div>
      </dl>

      <div className="appearance-block">
        <h3>外見パラメータ</h3>
        <dl className="appearance-grid">
          {appearanceLabels.map((key) => (
            <div key={key}>
              <dt>{labelMap[key]}</dt>
              <dd>{guardian.appearance[key]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
