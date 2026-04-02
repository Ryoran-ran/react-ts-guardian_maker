import type { GuardianProfile } from '../types/guardian'

type GuardianResultProps = {
  guardian: GuardianProfile
  onSave: () => void
  onSaveWithInfo: () => void
}

const appearanceLabels: Array<keyof GuardianProfile['appearance']> = [
  'faceShape',
  'skinColor',
  'hairstyle',
  'hairVolume',
  'eyeSize',
  'eyeShape',
  'eyeSpacing',
  'eyeColor',
  'eyebrowShape',
  'eyebrowSize',
  'eyebrowThickness',
  'eyebrowColor',
  'earShape',
  'earSize',
  'noseShape',
  'noseSize',
  'neckLength',
  'mouthShape',
  'mouthPosition',
  'mouthSize',
  'shoulderWidth',
  'bodyType',
  'height',
  'armThickness',
  'armAngle',
  'armLength',
  'legLength',
  'legThickness',
]

const labelMap: Record<(typeof appearanceLabels)[number], string> = {
  faceShape: '顔の形',
  skinColor: '肌の色',
  hairstyle: '髪型',
  hairVolume: '髪のボリューム',
  eyeSize: '目の大きさ',
  eyeShape: '目の形',
  eyeSpacing: '目の間隔',
  eyeColor: '目の色',
  eyebrowShape: '眉の形',
  eyebrowSize: '眉の大きさ',
  eyebrowThickness: '眉の太さ',
  eyebrowColor: '眉の色',
  earShape: '耳の形',
  earSize: '耳の大きさ',
  noseShape: '鼻の形',
  noseSize: '鼻の大きさ',
  neckLength: '首の長さ',
  mouthShape: '口の形',
  mouthPosition: '口の位置',
  mouthSize: '口の大きさ',
  shoulderWidth: '肩幅',
  bodyType: '体型',
  height: '身長',
  armThickness: '腕の太さ',
  armAngle: '腕の角度',
  armLength: '手の長さ',
  legLength: '脚の長さ',
  legThickness: '脚の太さ',
}

export function GuardianResult({ guardian, onSave, onSaveWithInfo }: GuardianResultProps) {
  const weaponLabel = guardian.tone === '生活感' ? '使用アイテム' : '使用武器'

  return (
    <section className="panel result-panel">
      <div className="result-top">
        <div>
          <p className="eyebrow">Result</p>
          <h2>{guardian.guardianName}</h2>
        </div>
        <div className="result-actions">
          <button className="secondary-button" onClick={onSave} type="button">
            画像を保存
          </button>
          <button className="secondary-button" onClick={onSaveWithInfo} type="button">
            情報付きで保存
          </button>
        </div>
      </div>

      <dl className="summary-grid">
        <div>
          <dt>名前</dt>
          <dd>{guardian.displayName}</dd>
        </div>
        <div>
          <dt>身長</dt>
          <dd>{guardian.heightCm}cm</dd>
        </div>
        <div>
          <dt>性格</dt>
          <dd>{guardian.personalityLine}</dd>
        </div>
        <div>
          <dt>好きなもの</dt>
          <dd>{guardian.favoriteLine}</dd>
        </div>
        <div>
          <dt>嫌いなもの</dt>
          <dd>{guardian.weaknessLine}</dd>
        </div>
        <div>
          <dt>能力</dt>
          <dd>{guardian.ability}</dd>
        </div>
        <div>
          <dt>{weaponLabel}</dt>
          <dd>{guardian.weapon}</dd>
        </div>
        <div>
          <dt>シード値</dt>
          <dd>{guardian.seed}</dd>
        </div>
      </dl>

      {guardian.recoveryCode ? (
        <div className="code-strip">
          <span className="code-label">コード</span>
          <code className="code-value">{guardian.recoveryCode}</code>
        </div>
      ) : null}

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
