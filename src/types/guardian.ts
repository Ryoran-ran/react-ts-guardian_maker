export type Gender = '女性' | '男性' | 'その他'

export type GuardianFormInput = {
  name: string
  gender: Gender
  birthDate: string
}

export type GuardianAppearance = {
  faceShape: string
  skinColor: string
  hairstyle: string
  eyeSize: string
  eyeShape: string
  eyeColor: string
  eyebrowSize: string
  eyebrowThickness: string
  eyebrowColor: string
  earShape: string
  earSize: string
  mouthShape: string
  mouthSize: string
  jaw: string
  bodyType: string
  height: string
  armLength: string
}

export type GuardianVisuals = {
  auraHue: number
  auraColor: string
  auraAccent: string
  sigilColor: string
  weaponColor: string
  robeColor: string
  hairColor: string
  eyebrowHex: string
  skinHex: string
  eyeHex: string
  bodyScaleX: number
  torsoHeight: number
  armLength: number
  legLength: number
  characterY: number
  headScaleX: number
  jawWidth: number
  eyeScaleX: number
  eyeScaleY: number
  browWidth: number
  browStroke: number
  earWidth: number
  earHeight: number
  mouthWidth: number
  mouthCurve: number
  weaponType: 'sword' | 'staff' | 'spear' | 'orb'
  hairVariant: 'short' | 'long' | 'spiky' | 'bob'
  faceVariant: 'round' | 'oval' | 'diamond'
  eyeVariant: 'round' | 'almond' | 'sharp' | 'cute' | 'cool'
  earVariant: 'round' | 'leaf' | 'pointed'
}

export type GuardianProfile = {
  seed: number
  guardianName: string
  personality: string
  favorite: string
  weakness: string
  weapon: string
  appearance: GuardianAppearance
  visuals: GuardianVisuals
}
