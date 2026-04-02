export type Gender = '女性' | '男性' | 'その他'
export type GuardianTone = '神秘感' | '生活感'

export type GuardianFormInput = {
  name: string
  gender: Gender
  birthDate: string
  tone: GuardianTone
}

export type GuardianAppearance = {
  faceShape: string
  skinColor: string
  hairstyle: string
  hairVolume: string
  eyeSize: string
  eyeShape: string
  eyeSpacing: string
  eyeColor: string
  eyebrowShape: string
  eyebrowSize: string
  eyebrowThickness: string
  eyebrowColor: string
  earShape: string
  earSize: string
  noseShape: string
  noseSize: string
  neckLength: string
  mouthShape: string
  mouthPosition: string
  mouthSize: string
  shoulderWidth: string
  bodyType: string
  height: string
  armThickness: string
  armAngle: string
  armLength: string
  legLength: string
  legThickness: string
}

export type GuardianVisuals = {
  auraHue: number
  auraColor: string
  auraAccent: string
  sigilColor: string
  weaponColor: string
  robeColor: string
  hairColor: string
  hairScaleX: number
  hairScaleY: number
  eyebrowHex: string
  skinHex: string
  eyeHex: string
  bodyScaleX: number
  torsoHeight: number
  armLength: number
  armWidth: number
  legLength: number
  legWidth: number
  characterY: number
  headScaleX: number
  eyeScaleX: number
  eyeScaleY: number
  eyeOffsetX: number
  browWidth: number
  browStroke: number
  earWidth: number
  earHeight: number
  noseWidth: number
  noseHeight: number
  neckLength: number
  mouthY: number
  mouthWidth: number
  mouthCurve: number
  shoulderOffset: number
  armRotation: number
  armAttachX: number
  armAttachY: number
  weaponType: 'sword' | 'staff' | 'spear' | 'orb'
  hairVariant: 'short' | 'long' | 'spiky' | 'bob'
  faceVariant: 'round' | 'oval' | 'diamond'
  eyeVariant: 'round' | 'almond' | 'sharp' | 'cute' | 'cool'
  browVariant: 'straight' | 'arched' | 'angled' | 'gentle'
  earVariant: 'round' | 'leaf' | 'pointed'
  noseVariant: 'rounded' | 'sharp' | 'short'
}

export type GuardianProfile = {
  seed: number
  recoveryCode: string | null
  guardianName: string
  displayName: string
  ability: string
  heightCm: number
  personalityLine: string
  favoriteLine: string
  weaknessLine: string
  personality: string
  favorite: string
  weakness: string
  weapon: string
  appearance: GuardianAppearance
  visuals: GuardianVisuals
}
