import { useEffect, useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import './index.css'
import { GuardianCanvas } from './components/GuardianCanvas'
import { GuardianForm } from './components/GuardianForm'
import { GuardianResult } from './components/GuardianResult'
import { downloadGuardianProfileCard, downloadStageAsPng } from './lib/exportImage'
import { generateGuardian, generateGuardianFromSeed } from './lib/generator'
import { createSeedFromInput } from './lib/hash'
import { decodeRecoveryCode } from './lib/recovery'
import type { GuardianFormInput, GuardianProfile, GuardianTone } from './types/guardian'

const defaultInput: GuardianFormInput = {
  name: '天城ヒカリ',
  gender: '女性',
  birthDate: '1998-07-12',
  tone: '神秘感',
}

function inferToneFromInput(input: GuardianFormInput): GuardianTone {
  return createSeedFromInput(input) % 2 === 0 ? '神秘感' : '生活感'
}

function DeveloperScreen() {
  const [draft, setDraft] = useState<GuardianFormInput>(defaultInput)
  const [submitted, setSubmitted] = useState<GuardianFormInput>(defaultInput)
  const [seedDraft, setSeedDraft] = useState('')
  const [recoveryDraft, setRecoveryDraft] = useState('')
  const [submittedSeed, setSubmittedSeed] = useState<number | null>(null)
  const stageRef = useRef<Konva.Stage>(null)

  const guardian = useMemo(
    () => (submittedSeed === null ? generateGuardian(submitted) : generateGuardianFromSeed(submittedSeed, submitted.tone)),
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
          mode="developer"
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
            mode="developer"
            guardian={guardian}
            onSave={handleSave}
            onSaveWithInfo={handleSaveWithInfo}
          />
        </section>
      </section>
    </main>
  )
}

function PublicFlow() {
  const [draft, setDraft] = useState<GuardianFormInput>(defaultInput)
  const [phase, setPhase] = useState<'input' | 'loading' | 'result'>('input')
  const [submittedName, setSubmittedName] = useState(defaultInput.name)
  const [guardian, setGuardian] = useState<GuardianProfile>(() =>
    generateGuardian({
      ...defaultInput,
      tone: inferToneFromInput(defaultInput),
    }),
  )
  const stageRef = useRef<Konva.Stage>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleGenerate = () => {
    const normalized = {
      ...draft,
      name: draft.name.trim(),
    }
    const tone = inferToneFromInput(normalized)
    const preparedInput = {
      ...normalized,
      tone,
    }
    const seed = createSeedFromInput(preparedInput)
    const waitMs = 3000 + (seed % 4001)

    setDraft(preparedInput)
    setSubmittedName(preparedInput.name)
    setPhase('loading')

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      setGuardian(generateGuardian(preparedInput))
      setPhase('result')
    }, waitMs)
  }

  const handleSave = () => {
    if (!stageRef.current) {
      return
    }

    const safeName = submittedName || 'guardian'
    downloadStageAsPng(stageRef.current, `${safeName}-guardian.png`)
  }

  const handleSaveWithInfo = () => {
    if (!stageRef.current) {
      return
    }

    const safeName = submittedName || 'guardian'
    downloadGuardianProfileCard(stageRef.current, `${safeName}-guardian-profile.png`, submittedName, guardian)
  }

  const handleRestart = () => {
    setPhase('input')
  }

  if (phase === 'input') {
    return (
      <main className="public-shell">
        <section className="public-screen public-start">
          <div className="public-form-wrap">
            <GuardianForm mode="public" value={draft} onChange={setDraft} onSubmit={handleGenerate} />
          </div>
        </section>
      </main>
    )
  }

  if (phase === 'loading') {
    return (
      <main className="public-shell">
        <section className="panel public-screen public-loading">
          <div className="loading-orb" />
          <p className="eyebrow">Summoning</p>
          <h1>守護神を呼び出しています</h1>
          <p className="panel-copy">光と気配を集めています。少しだけ待ってください。</p>
          <div className="loading-bar">
            <span className="loading-bar-fill" />
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="public-shell">
      <section className="public-result-layout">
        <div className="public-result-actions">
          <button className="secondary-button" type="button" onClick={handleRestart}>
            もう一度診断する
          </button>
        </div>
        <GuardianCanvas guardian={guardian} ref={stageRef} />
        <GuardianResult mode="public" guardian={guardian} onSave={handleSave} onSaveWithInfo={handleSaveWithInfo} />
      </section>
    </main>
  )
}

function App() {
  const isDeveloperRoute =
    typeof window !== 'undefined' &&
    (window.location.pathname === '/developer' || window.location.pathname.startsWith('/developer/'))

  return isDeveloperRoute ? <DeveloperScreen /> : <PublicFlow />
}

export default App
