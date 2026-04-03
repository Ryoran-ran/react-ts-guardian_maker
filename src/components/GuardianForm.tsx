import type { ChangeEvent, FormEvent } from 'react'
import type { Gender, GuardianFormInput, GuardianTone } from '../types/guardian'

type GuardianFormProps = {
  value: GuardianFormInput
  seedValue: string
  recoveryValue: string
  onChange: (value: GuardianFormInput) => void
  onSeedChange: (value: string) => void
  onRecoveryChange: (value: string) => void
  onSubmit: () => void
  onSeedSubmit: () => void
  onRecoverySubmit: () => void
}

const genderOptions: Gender[] = ['男性', '女性', 'その他']
const toneOptions: GuardianTone[] = ['神秘感', '生活感']

export function GuardianForm({
  value,
  seedValue,
  recoveryValue,
  onChange,
  onSeedChange,
  onRecoveryChange,
  onSubmit,
  onSeedSubmit,
  onRecoverySubmit,
}: GuardianFormProps) {
  const handleFieldChange =
    (field: keyof GuardianFormInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange({
        ...value,
        [field]: event.target.value,
      })
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="panel-header">
        <p className="eyebrow">Input</p>
        <h1>守護神メーカー</h1>
        <p className="panel-copy">
          名前・性別・生年月日からシード値を作り、毎回同じ守護神を呼び出します。
        </p>
      </div>

      <label className="field">
        <span>名前</span>
        <input
          type="text"
          value={value.name}
          onChange={handleFieldChange('name')}
          placeholder="例: 佐藤ひかり"
          required
        />
      </label>

      <label className="field">
        <span>性別</span>
        <select value={value.gender} onChange={handleFieldChange('gender')}>
          {genderOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>生年月日</span>
        <input
          type="date"
          value={value.birthDate}
          onChange={handleFieldChange('birthDate')}
          required
        />
      </label>

      <label className="field">
        <span>文章の雰囲気</span>
        <select value={value.tone} onChange={handleFieldChange('tone')}>
          {toneOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <small className="field-hint">迷ったら「神秘感」のままで大丈夫です。</small>
      </label>

      <button className="primary-button" type="submit">
        生成
      </button>

      <label className="field">
        <span>シード値から再生成</span>
        <input
          type="text"
          inputMode="numeric"
          className="code-input"
          value={seedValue}
          onChange={(event) => onSeedChange(event.target.value)}
          placeholder="例: 2447797810"
        />
      </label>

      <button className="secondary-button" type="button" onClick={onSeedSubmit}>
        シードから再生成
      </button>

      <label className="field">
        <span>復元コードから再入力</span>
        <input
          type="text"
          className="code-input"
          value={recoveryValue}
          onChange={(event) => onRecoveryChange(event.target.value)}
          placeholder="復元コードを貼り付け"
        />
      </label>

      <button className="secondary-button" type="button" onClick={onRecoverySubmit}>
        復元コードから再入力
      </button>
    </form>
  )
}
