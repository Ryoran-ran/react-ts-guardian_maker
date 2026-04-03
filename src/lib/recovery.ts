import type { GuardianFormInput, GuardianTone } from '../types/guardian'

type RecoveryPayload = {
  name: string
  gender: GuardianFormInput['gender']
  birthDate: string
  tone?: GuardianTone
}

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
  return atob(normalized + padding)
}

function bytesToBinary(bytes: Uint8Array): string {
  let result = ''
  bytes.forEach((byte) => {
    result += String.fromCharCode(byte)
  })
  return result
}

function binaryToBytes(binary: string): Uint8Array {
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

export function encodeRecoveryCode(input: GuardianFormInput): string {
  const payload: RecoveryPayload = {
    name: input.name.trim(),
    gender: input.gender,
    birthDate: input.birthDate.trim(),
    tone: input.tone,
  }

  const json = JSON.stringify(payload)
  const binary = bytesToBinary(new TextEncoder().encode(json))
  return toBase64Url(binary)
}

export function decodeRecoveryCode(code: string): GuardianFormInput | null {
  try {
    const binary = fromBase64Url(code.trim())
    const json = new TextDecoder().decode(binaryToBytes(binary))
    const parsed = JSON.parse(json) as Partial<RecoveryPayload>

    if (
      typeof parsed.name !== 'string' ||
      typeof parsed.gender !== 'string' ||
      typeof parsed.birthDate !== 'string'
    ) {
      return null
    }

    if (!['女性', '男性', 'その他'].includes(parsed.gender)) {
      return null
    }

    return {
      name: parsed.name,
      gender: parsed.gender as GuardianFormInput['gender'],
      birthDate: parsed.birthDate,
      tone: parsed.tone === '生活感' ? '生活感' : '神秘感',
    }
  } catch {
    return null
  }
}
