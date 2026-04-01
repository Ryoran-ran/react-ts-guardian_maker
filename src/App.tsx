import { useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import './index.css'
import { GuardianCanvas } from './components/GuardianCanvas'
import { GuardianForm } from './components/GuardianForm'
import { GuardianResult } from './components/GuardianResult'
import { downloadStageAsPng } from './lib/exportImage'
import { generateGuardian } from './lib/generator'
import type { GuardianFormInput } from './types/guardian'

const defaultInput: GuardianFormInput = {
  name: '天城ヒカリ',
  gender: '女性',
  birthDate: '1998-07-12',
}

function App() {
  const [draft, setDraft] = useState<GuardianFormInput>(defaultInput)
  const [submitted, setSubmitted] = useState<GuardianFormInput>(defaultInput)
  const stageRef = useRef<Konva.Stage>(null)

  const guardian = useMemo(() => generateGuardian(submitted), [submitted])

  const handleGenerate = () => {
    setSubmitted({
      ...draft,
      name: draft.name.trim(),
    })
  }

  const handleSave = () => {
    if (!stageRef.current) {
      return
    }

    const safeName = draft.name.trim() || 'guardian'
    downloadStageAsPng(stageRef.current, `${safeName}-guardian.png`)
  }

  return (
    <main className="app-shell">
      <section className="layout-grid">
        <GuardianForm value={draft} onChange={setDraft} onSubmit={handleGenerate} />

        <section className="right-column">
          <GuardianCanvas guardian={guardian} ref={stageRef} />
          <GuardianResult guardian={guardian} onSave={handleSave} />
        </section>
      </section>
    </main>
  )
}

export default App
