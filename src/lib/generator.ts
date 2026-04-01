import {
  armLengths,
  bodyTypes,
  earShapes,
  earSizes,
  eyeColors,
  eyeShapes,
  eyeSizes,
  eyebrowColors,
  eyebrowSizes,
  eyebrowThicknesses,
  faceShapes,
  favorites,
  guardianNameParts,
  guardianTitles,
  hairstyles,
  heights,
  jaws,
  mouthShapes,
  mouthSizes,
  personalities,
  skinColors,
  weapons,
  weaknesses,
} from '../data/masterData'
import type { GuardianAppearance, GuardianFormInput, GuardianProfile } from '../types/guardian'
import { createSeedFromInput } from './hash'
import { SeededRandom } from './seededRandom'

const skinHexMap: Record<string, string> = {
  白磁: '#f6dfcf',
  蜜色: '#dca678',
  褐色: '#a76e48',
  青白: '#c9d6e8',
}

const eyeHexMap: Record<string, string> = {
  蒼: '#4f74d9',
  翠: '#2fa475',
  琥珀: '#d49534',
  紫紺: '#5f4bc6',
}

const eyebrowHexMap: Record<string, string> = {
  黒: '#2d2433',
  茶: '#5f4334',
  銀: '#b6bccb',
  紺: '#334b7a',
}

const hairHexMap: Record<string, string> = {
  短髪: '#38465f',
  長髪: '#54395b',
  逆立ち: '#6d2e2e',
  切り揃え: '#3a5b4b',
}

function pickAppearance(random: SeededRandom): GuardianAppearance {
  return {
    faceShape: random.pick(faceShapes),
    skinColor: random.pick(skinColors),
    hairstyle: random.pick(hairstyles),
    eyeSize: random.pick(eyeSizes),
    eyeShape: random.pick(eyeShapes),
    eyeColor: random.pick(eyeColors),
    eyebrowSize: random.pick(eyebrowSizes),
    eyebrowThickness: random.pick(eyebrowThicknesses),
    eyebrowColor: random.pick(eyebrowColors),
    earShape: random.pick(earShapes),
    earSize: random.pick(earSizes),
    mouthShape: random.pick(mouthShapes),
    mouthSize: random.pick(mouthSizes),
    jaw: random.pick(jaws),
    bodyType: random.pick(bodyTypes),
    height: random.pick(heights),
    armLength: random.pick(armLengths),
  }
}

function composeGuardianName(random: SeededRandom): string {
  return `${random.pick(guardianTitles)}の${random.pick(guardianNameParts)}`
}

function buildAuraColor(hue: number, saturation: number, lightness: number): string {
  return `hsl(${hue} ${saturation}% ${lightness}%)`
}

export function generateGuardian(input: GuardianFormInput): GuardianProfile {
  const seed = createSeedFromInput(input)
  const random = new SeededRandom(seed)
  const appearance = pickAppearance(random)
  const auraHue = random.nextInt(0, 359)
  const weaponName = random.pick(weapons)

  const faceVariant =
    appearance.faceShape === '丸顔'
      ? 'round'
      : appearance.faceShape === '卵型'
        ? 'oval'
        : 'diamond'

  const eyeVariant =
    appearance.eyeShape === '丸い'
      ? 'round'
      : appearance.eyeShape === '切れ長'
        ? 'almond'
        : 'sharp'

  const earVariant =
    appearance.earShape === '丸耳'
      ? 'round'
      : appearance.earShape === '葉耳'
        ? 'leaf'
        : 'pointed'

  const hairVariant =
    appearance.hairstyle === '短髪'
      ? 'short'
      : appearance.hairstyle === '長髪'
        ? 'long'
        : appearance.hairstyle === '逆立ち'
          ? 'spiky'
          : 'bob'

  const weaponType = weaponName.includes('剣')
    ? 'sword'
    : weaponName.includes('槍')
      ? 'spear'
      : weaponName.includes('杖')
        ? 'staff'
        : weaponName.includes('珠')
          ? 'orb'
          : 'sword'

  return {
    seed,
    guardianName: composeGuardianName(random),
    personality: random.pick(personalities),
    favorite: random.pick(favorites),
    weakness: random.pick(weaknesses),
    weapon: weaponName,
    appearance,
    visuals: {
      auraHue,
      auraColor: buildAuraColor(auraHue, 82, 60),
      auraAccent: buildAuraColor((auraHue + 35) % 360, 74, 74),
      sigilColor: buildAuraColor((auraHue + 180) % 360, 58, 78),
      weaponColor: buildAuraColor((auraHue + 22) % 360, 30, 82),
      robeColor: buildAuraColor((auraHue + 300) % 360, 34, 34),
      hairColor: hairHexMap[appearance.hairstyle],
      eyebrowHex: eyebrowHexMap[appearance.eyebrowColor],
      skinHex: skinHexMap[appearance.skinColor],
      eyeHex: eyeHexMap[appearance.eyeColor],
      bodyScaleX:
        appearance.bodyType === '細身' ? 0.88 : appearance.bodyType === '均整' ? 1 : 1.15,
      torsoHeight:
        appearance.height === '低め' ? 146 : appearance.height === '標準' ? 164 : 184,
      armLength:
        appearance.armLength === '短め' ? 92 : appearance.armLength === '標準' ? 108 : 126,
      legLength:
        appearance.height === '低め' ? 76 : appearance.height === '標準' ? 94 : 114,
      characterY:
        appearance.height === '低め' ? 304 : appearance.height === '標準' ? 294 : 280,
      headScaleX:
        appearance.faceShape === '丸顔' ? 1.05 : appearance.faceShape === '卵型' ? 0.95 : 0.9,
      jawWidth:
        appearance.jaw === 'なめらか' ? 52 : appearance.jaw === 'シャープ' ? 42 : 60,
      eyeScaleX:
        appearance.eyeShape === '丸い' ? 1 : appearance.eyeShape === '切れ長' ? 1.35 : 1.2,
      eyeScaleY:
        appearance.eyeSize === '小さめ' ? 0.72 : appearance.eyeSize === '標準' ? 0.92 : 1.12,
      browWidth:
        appearance.eyebrowSize === '短め' ? 24 : appearance.eyebrowSize === '標準' ? 32 : 42,
      browStroke:
        appearance.eyebrowThickness === '細い'
          ? 2
          : appearance.eyebrowThickness === '標準'
            ? 4
            : 6,
      earWidth:
        appearance.earSize === '小さめ' ? 12 : appearance.earSize === '標準' ? 16 : 20,
      earHeight:
        appearance.earSize === '小さめ' ? 20 : appearance.earSize === '標準' ? 26 : 34,
      mouthWidth:
        appearance.mouthSize === '小さめ' ? 16 : appearance.mouthSize === '標準' ? 24 : 34,
      mouthCurve:
        appearance.mouthShape === '微笑み'
          ? 5
          : appearance.mouthShape === '凛々しい'
            ? -4
            : 2,
      weaponType,
      hairVariant,
      faceVariant,
      eyeVariant,
      earVariant,
    },
  }
}
