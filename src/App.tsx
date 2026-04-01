import { useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import './index.css'
import { GuardianCanvas } from './components/GuardianCanvas'
import { GuardianForm } from './components/GuardianForm'
import { GuardianResult } from './components/GuardianResult'
import { downloadGuardianProfileCard, downloadStageAsPng } from './lib/exportImage'
import { generateGuardian, generateGuardianFromSeed } from './lib/generator'
import { decodeRecoveryCode } from './lib/recovery'
import type { GuardianFormInput } from './types/guardian'

const defaultInput: GuardianFormInput = {
  name: '天城ヒカリ',
  gender: '女性',
  birthDate: '1998-07-12',
}

function App() {
  const [draft, setDraft] = useState<GuardianFormInput>(defaultInput)
  const [submitted, setSubmitted] = useState<GuardianFormInput>(defaultInput)
  const [seedDraft, setSeedDraft] = useState('')
  const [recoveryDraft, setRecoveryDraft] = useState('')
  const [submittedSeed, setSubmittedSeed] = useState<number | null>(null)
  const stageRef = useRef<Konva.Stage>(null)

  const guardian = useMemo(
    () => (submittedSeed === null ? generateGuardian(submitted) : generateGuardianFromSeed(submittedSeed)),
    [submitted, submittedSeed],
  )

  const handleGenerate = () => {
    setSubmitted({
      ...draft,
      name: draft.name.trim(),
    })
    setSubmittedSeed(null)
    setSeedDraft('')
    setRecoveryDraft('')
  }

  const handleGenerateFromSeed = () => {
    const parsed = Number(seedDraft.trim())

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return
    }

    setSubmittedSeed(Math.floor(parsed))
  }

  const handleRecoverFromCode = () => {
    const recovered = decodeRecoveryCode(recoveryDraft)

    if (!recovered) {
      return
    }

    setDraft(recovered)
    setSubmitted(recovered)
    setSubmittedSeed(null)
    setSeedDraft('')
  }

  const handleSave = () => {
    if (!stageRef.current) {
      return
    }

    const safeName = draft.name.trim() || 'guardian'
    downloadStageAsPng(stageRef.current, `${safeName}-guardian.png`)
  }

  const handleSaveWithInfo = () => {
    if (!stageRef.current) {
      return
    }

    const safeName = draft.name.trim() || 'guardian'
    downloadGuardianProfileCard(
      stageRef.current,
      `${safeName}-guardian-profile.png`,
      submitted.name.trim(),
      guardian,
    )
  }

  return (
    <main className="app-shell">
      <section className="layout-grid">
        <GuardianForm
          value={draft}
          seedValue={seedDraft}
          recoveryValue={recoveryDraft}
          onChange={setDraft}
          onSeedChange={setSeedDraft}
          onRecoveryChange={setRecoveryDraft}
          onSubmit={handleGenerate}
          onSeedSubmit={handleGenerateFromSeed}
          onRecoverySubmit={handleRecoverFromCode}
        />

        <section className="right-column">
          <GuardianCanvas guardian={guardian} ref={stageRef} />
          <GuardianResult
            guardian={guardian}
            onSave={handleSave}
            onSaveWithInfo={handleSaveWithInfo}
          />
        </section>
      </section>
    </main>
  )
}

export default App
