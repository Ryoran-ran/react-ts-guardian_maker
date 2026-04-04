import { useEffect, useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import './index.css'
import { GuardianCanvas } from './components/GuardianCanvas'
import { GuardianForm } from './components/GuardianForm'
import { GuardianResult } from './components/GuardianResult'
import { createGuardianProfileCardDataUrl, createStagePngDataUrl, downloadDataUrl } from './lib/exportImage'
import { generateGuardian, generateGuardianFromSeed } from './lib/generator'
import { createSeedFromInput } from './lib/hash'
import { decodeRecoveryCode } from './lib/recovery'
import type { GuardianFormInput, GuardianProfile } from './types/guardian'

const defaultInput: GuardianFormInput = {
  name: '天城ヒカリ',
  gender: '女性',
  birthDate: '1998-07-12',
  tone: '神秘感',
}

function DeveloperScreen() {
  const [draft, setDraft] = useState<GuardianFormInput>(defaultInput)
  const [submitted, setSubmitted] = useState<GuardianFormInput>(defaultInput)
  const [seedDraft, setSeedDraft] = useState('')
  const [recoveryDraft, setRecoveryDraft] = useState('')
  const [submittedSeed, setSubmittedSeed] = useState<number | null>(null)
  const [previewImage, setPreviewImage] = useState<{ dataUrl: string; fileName: string; title: string } | null>(null)
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
    setPreviewImage({
      dataUrl: createStagePngDataUrl(stageRef.current),
      fileName: `${safeName}-guardian.png`,
      title: '生成画像',
    })
  }

  const handleSaveWithInfo = async () => {
    if (!stageRef.current) {
      return
    }

    const safeName = draft.name.trim() || 'guardian'
    const dataUrl = await createGuardianProfileCardDataUrl(stageRef.current, submitted.name.trim(), guardian)
    setPreviewImage({
      dataUrl,
      fileName: `${safeName}-guardian-profile.png`,
      title: '情報付き画像',
    })
  }

  if (previewImage) {
    return (
      <SavedImageScreen
        mode="developer"
        previewImage={previewImage}
        onBack={() => setPreviewImage(null)}
      />
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
  const [phase, setPhase] = useState<'input' | 'loading' | 'result' | 'preview'>('input')
  const [submittedName, setSubmittedName] = useState(defaultInput.name)
  const [guardian, setGuardian] = useState<GuardianProfile>(() => generateGuardian(defaultInput))
  const [previewImage, setPreviewImage] = useState<{ dataUrl: string; fileName: string; title: string } | null>(null)
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
    const preparedInput = normalized
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
    setPreviewImage({
      dataUrl: createStagePngDataUrl(stageRef.current),
      fileName: `${safeName}-guardian.png`,
      title: '生成画像',
    })
    setPhase('preview')
  }

  const handleSaveWithInfo = async () => {
    if (!stageRef.current) {
      return
    }

    const safeName = submittedName || 'guardian'
    const dataUrl = await createGuardianProfileCardDataUrl(stageRef.current, submittedName, guardian)
    setPreviewImage({
      dataUrl,
      fileName: `${safeName}-guardian-profile.png`,
      title: '情報付き画像',
    })
    setPhase('preview')
  }

  const handleRestart = () => {
    setPhase('input')
    setPreviewImage(null)
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

  if (phase === 'preview' && previewImage) {
    return (
      <SavedImageScreen
        mode="public"
        previewImage={previewImage}
        onBack={() => setPhase('result')}
      />
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

type SavedImageScreenProps = {
  mode: 'developer' | 'public'
  previewImage: {
    dataUrl: string
    fileName: string
    title: string
  }
  onBack: () => void
}

function SavedImageScreen({ mode, previewImage, onBack }: SavedImageScreenProps) {
  const shellClassName = mode === 'developer' ? 'app-shell' : 'public-shell'

  return (
    <main className={shellClassName}>
      <section className="panel saved-image-screen">
        <div className="saved-image-header">
          <div>
            <p className="eyebrow">Preview</p>
            <h1>{previewImage.title}を表示しています</h1>
            <p className="panel-copy">このページで画像を確認してからダウンロードできます。スマートフォンでは画像を長押しして保存することもできます。</p>
          </div>
          <div className="saved-image-actions">
            <button className="secondary-button" type="button" onClick={onBack}>
              戻る
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={() => downloadDataUrl(previewImage.dataUrl, previewImage.fileName)}
            >
              ダウンロード
            </button>
          </div>
        </div>

        <div className="saved-image-frame">
          <img alt={previewImage.title} src={previewImage.dataUrl} />
        </div>
      </section>
    </main>
  )
}

function App() {
  const isDeveloperRoute = (() => {
    if (typeof window === 'undefined') {
      return false
    }

    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
    const normalizedPath = window.location.pathname.startsWith(basePath)
      ? window.location.pathname.slice(basePath.length) || '/'
      : window.location.pathname

    return normalizedPath === '/developer' || normalizedPath.startsWith('/developer/')
  })()

  return isDeveloperRoute ? <DeveloperScreen /> : <PublicFlow />
}

export default App
