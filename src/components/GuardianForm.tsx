import type { ChangeEvent, FormEvent } from 'react'
import type { Gender, GuardianFormInput } from '../types/guardian'

type GuardianFormProps = {
  value: GuardianFormInput
  onChange: (value: GuardianFormInput) => void
  onSubmit: () => void
}

const genderOptions: Gender[] = ['女性', '男性', 'その他']

export function GuardianForm({ value, onChange, onSubmit }: GuardianFormProps) {
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

      <button className="primary-button" type="submit">
        生成
      </button>
    </form>
  )
}
