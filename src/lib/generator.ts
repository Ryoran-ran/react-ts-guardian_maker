import {
  abilityAdjectives,
  abilityConditions,
  abilityEffects,
  abilityTargets,
  armAngles,
  armThicknesses,
  armLengths,
  bodyTypes,
  earShapes,
  earSizes,
  eyeColors,
  eyeShapes,
  eyeSpacings,
  eyeSizes,
  eyebrowShapes,
  eyebrowColors,
  eyebrowSizes,
  eyebrowThicknesses,
  faceShapes,
  favorites,
  favoritePrefixes,
  favoriteMiddles,
  favoriteSubjects,
  guardianConnectors,
  guardianDescriptors,
  guardianNameEnds,
  guardianNameMiddles,
  guardianNameStarts,
  guardianNameSuffixes,
  guardianTitles,
  mysticWeaponLeadings,
  mysticWeaponModifiers,
  mysticWeaponSubjects,
  hairVolumes,
  hairstyles,
  heights,
  mouthShapes,
  mouthPositions,
  mouthSizes,
  neckLengths,
  noseShapes,
  noseSizes,
  personalities,
  personalityEndings,
  personalityLeadings,
  personalityMiddles,
  quirkyAbilityNodes,
  quirkyFavoriteNodes,
  quirkyGuardianEndings,
  quirkyGuardianLeadings,
  quirkyPersonalityNodes,
  quirkyWeaponLeadings,
  quirkyWeaponModifiers,
  quirkyWeaponSubjects,
  quirkyWeaknessNodes,
  skinColors,
  legThicknesses,
  legLengths,
  shoulderWidths,
  weaknessPrefixes,
  weaknessMiddles,
  weaknessSubjects,
  weaknesses,
} from '../data/masterData'
import type { GuardianAppearance, GuardianFormInput, GuardianProfile, GuardianTone } from '../types/guardian'
import { createSeedFromInput } from './hash'
import { encodeRecoveryCode } from './recovery'
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
    hairVolume: random.pick(hairVolumes),
    eyeSize: random.pick(eyeSizes),
    eyeShape: random.pick(eyeShapes),
    eyeSpacing: random.pick(eyeSpacings),
    eyeColor: random.pick(eyeColors),
    eyebrowShape: random.pick(eyebrowShapes),
    eyebrowSize: random.pick(eyebrowSizes),
    eyebrowThickness: random.pick(eyebrowThicknesses),
    eyebrowColor: random.pick(eyebrowColors),
    earShape: random.pick(earShapes),
    earSize: random.pick(earSizes),
    noseShape: random.pick(noseShapes),
    noseSize: random.pick(noseSizes),
    neckLength: random.pick(neckLengths),
    mouthShape: random.pick(mouthShapes),
    mouthPosition: random.pick(mouthPositions),
    mouthSize: random.pick(mouthSizes),
    shoulderWidth: random.pick(shoulderWidths),
    bodyType: random.pick(bodyTypes),
    height: random.pick(heights),
    armThickness: random.pick(armThicknesses),
    armAngle: random.pick(armAngles),
    armLength: random.pick(armLengths),
    legLength: random.pick(legLengths),
    legThickness: random.pick(legThicknesses),
  }
}

function composeGuardianName(random: SeededRandom, tone: GuardianTone): string {
  const coreName = `${random.pick(guardianNameStarts)}${random.pick(guardianNameMiddles)}${random.pick(guardianNameEnds)}${random.pick(guardianNameSuffixes)}`
  if (tone === '生活感') {
    return `${random.pick(quirkyGuardianLeadings)}の${random.pick(quirkyGuardianEndings)} ${coreName}`
  }

  return `${random.pick(guardianTitles)}${random.pick(guardianDescriptors)}${random.pick(guardianConnectors)} ${coreName}`
}

function buildAuraColor(hue: number, saturation: number, lightness: number): string {
  return `hsl(${hue} ${saturation}% ${lightness}%)`
}

function joinUnique(parts: string[]): string {
  return parts.filter((part, index) => parts.indexOf(part) === index).join('')
}

function buildMysticAbility(random: SeededRandom) {
  const condition = random.pick(abilityConditions)
  const target = random.pick(abilityTargets)
  const manner = random.pick(abilityAdjectives)
  const effect = random.pick(abilityEffects)

  return `${condition}${target}${manner}${effect}能力`
}

function buildQuirkyAbility(random: SeededRandom) {
  const node = random.pick(quirkyAbilityNodes)
  return `${random.pick(node.prefixes)}${node.result}能力`
}

function buildQuirkyPersonality(random: SeededRandom) {
  const node = random.pick(quirkyPersonalityNodes)
  return `${node.lead}${random.pick(node.connectors)}${random.pick(node.habits)}`
}

function buildQuirkyWeapon(random: SeededRandom) {
  return `${random.pick(quirkyWeaponLeadings)}${random.pick(quirkyWeaponModifiers)}${random.pick(quirkyWeaponSubjects)}`
}

function buildMysticWeapon(random: SeededRandom) {
  return `${random.pick(mysticWeaponLeadings)}${random.pick(mysticWeaponModifiers)}${random.pick(mysticWeaponSubjects)}`
}

function buildQuirkyFavorite(random: SeededRandom) {
  const node = random.pick(quirkyFavoriteNodes)
  return `${random.pick(node.leadings)}${random.pick(node.modifiers)}${node.subject}`
}

function buildQuirkyWeakness(random: SeededRandom) {
  const node = random.pick(quirkyWeaknessNodes)
  return `${random.pick(node.leadings)}${random.pick(node.modifiers)}${node.subject}`
}

function buildGuardianFromSeed(seed: number, recoveryCode: string | null, tone: GuardianTone): GuardianProfile {
  const profileRandom = new SeededRandom(seed)
  const nameRandom = new SeededRandom((seed ^ 0x85ebca6b) >>> 0 || 1)
  const textRandom = new SeededRandom((seed ^ 0x9e3779b9) >>> 0 || 1)
  const heightRandom = new SeededRandom((seed ^ 0xc2b2ae35) >>> 0 || 1)
  const appearance = pickAppearance(profileRandom)
  const auraHue = profileRandom.nextInt(0, 359)
  const weaponName = tone === '生活感' ? buildQuirkyWeapon(textRandom) : buildMysticWeapon(profileRandom)
  const guardianName = composeGuardianName(nameRandom, tone)
  const ability = tone === '生活感' ? buildQuirkyAbility(textRandom) : buildMysticAbility(textRandom)
  const personalityLine =
    tone === '生活感'
      ? buildQuirkyPersonality(textRandom)
      : joinUnique([
          textRandom.pick(personalityLeadings),
          textRandom.pick(personalityMiddles),
          textRandom.pick(personalityEndings),
        ])
  const favoriteLine =
    tone === '生活感'
      ? buildQuirkyFavorite(textRandom)
      : joinUnique([
          textRandom.pick(favoritePrefixes),
          textRandom.pick(favoriteMiddles),
          textRandom.pick(favoriteSubjects),
        ])
  const weaknessLine =
    tone === '生活感'
      ? buildQuirkyWeakness(textRandom)
      : joinUnique([
          textRandom.pick(weaknessPrefixes),
          textRandom.pick(weaknessMiddles),
          textRandom.pick(weaknessSubjects),
        ])

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
        : appearance.eyeShape === 'つり目'
          ? 'sharp'
          : appearance.eyeShape === '可愛い'
            ? 'cute'
            : 'cool'

  const earVariant =
    appearance.earShape === '丸耳'
      ? 'round'
      : appearance.earShape === '葉耳'
        ? 'leaf'
        : 'pointed'

  const noseVariant =
    appearance.noseShape === '丸い'
      ? 'rounded'
      : appearance.noseShape === 'すっきり'
        ? 'sharp'
        : 'short'

  const browVariant =
    appearance.eyebrowShape === 'まっすぐ'
      ? 'straight'
      : appearance.eyebrowShape === 'アーチ'
        ? 'arched'
        : appearance.eyebrowShape === 'きりり'
          ? 'angled'
          : 'gentle'

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
        : weaponName.includes('傘') ||
            weaponName.includes('竿') ||
            weaponName.includes('木べら') ||
            weaponName.includes('靴べら') ||
            weaponName.includes('洗濯ばさみ')
          ? 'staff'
          : weaponName.includes('ふた') || weaponName.includes('かご')
            ? 'orb'
        : weaponName.includes('珠')
          ? 'orb'
          : 'sword'

  return {
    seed,
    tone,
    recoveryCode,
    guardianName,
    displayName: guardianName,
    ability,
    heightCm:
      appearance.height === '低め'
        ? heightRandom.nextInt(138, 154)
        : appearance.height === '標準'
          ? heightRandom.nextInt(155, 173)
          : heightRandom.nextInt(174, 196),
    personalityLine,
    favoriteLine,
    weaknessLine,
    personality: personalityLine || textRandom.pick(personalities),
    favorite: favoriteLine || textRandom.pick(favorites),
    weakness: weaknessLine || textRandom.pick(weaknesses),
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
      hairScaleX:
        appearance.hairVolume === '少なめ'
          ? 0.9
          : appearance.hairVolume === '標準'
            ? 1
            : 1.12,
      hairScaleY:
        appearance.hairVolume === '少なめ'
          ? 0.88
          : appearance.hairVolume === '標準'
            ? 1
            : 1.16,
      eyebrowHex: eyebrowHexMap[appearance.eyebrowColor],
      skinHex: skinHexMap[appearance.skinColor],
      eyeHex: eyeHexMap[appearance.eyeColor],
      bodyScaleX:
        appearance.bodyType === '細身' ? 0.88 : appearance.bodyType === '均整' ? 1 : 1.15,
      torsoHeight:
        appearance.height === '低め' ? 146 : appearance.height === '標準' ? 164 : 184,
      armWidth:
        appearance.armThickness === '細め'
          ? 28
          : appearance.armThickness === '標準'
            ? 34
            : 40,
      armLength:
        appearance.armLength === '短め' ? 92 : appearance.armLength === '標準' ? 108 : 126,
      legLength:
        (appearance.height === '低め' ? 76 : appearance.height === '標準' ? 94 : 114)
        + (appearance.legLength === '短め' ? -10 : appearance.legLength === '標準' ? 0 : 12),
      legWidth:
        appearance.legThickness === '細め'
          ? 28
          : appearance.legThickness === '標準'
            ? 34
            : 40,
      characterY:
        appearance.height === '低め' ? 304 : appearance.height === '標準' ? 294 : 280,
      headScaleX:
        appearance.faceShape === '丸顔' ? 1.05 : appearance.faceShape === '卵型' ? 0.95 : 0.9,
      eyeScaleX:
        appearance.eyeShape === '丸い' ? 1 : appearance.eyeShape === '切れ長' ? 1.35 : 1.2,
      eyeScaleY:
        appearance.eyeSize === '小さめ' ? 0.72 : appearance.eyeSize === '標準' ? 0.92 : 1.12,
      eyeOffsetX:
        appearance.eyeSpacing === '狭め' ? 36 : appearance.eyeSpacing === '標準' ? 42 : 48,
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
      noseWidth:
        appearance.noseSize === '小さめ' ? 6 : appearance.noseSize === '標準' ? 8 : 10,
      noseHeight:
        appearance.noseSize === '小さめ' ? 22 : appearance.noseSize === '標準' ? 28 : 34,
      neckLength:
        appearance.neckLength === '短め'
          ? 14
          : appearance.neckLength === '標準'
            ? 24
            : 34,
      mouthY:
        appearance.mouthPosition === '高め'
          ? 274
          : appearance.mouthPosition === '標準'
            ? 282
            : 290,
      mouthWidth:
        appearance.mouthSize === '小さめ' ? 16 : appearance.mouthSize === '標準' ? 24 : 34,
      mouthCurve:
        appearance.mouthShape === '微笑み'
          ? 5
          : appearance.mouthShape === '凛々しい'
            ? -4
            : 2,
      shoulderOffset:
        appearance.shoulderWidth === '狭め'
          ? 82
          : appearance.shoulderWidth === '標準'
            ? 92
            : 104,
      armRotation:
        appearance.armAngle === '内寄り'
          ? 12
          : appearance.armAngle === '標準'
            ? 20
            : 28,
      armAttachX:
        72
        - (appearance.armThickness === '細め'
            ? 28
            : appearance.armThickness === '標準'
              ? 34
              : 40) * 0.42
        + (appearance.shoulderWidth === '狭め'
            ? -4
            : appearance.shoulderWidth === '標準'
              ? 0
              : 4),
      armAttachY:
        6
        + ((appearance.armAngle === '標準'
            ? 20
            : appearance.armAngle === '内寄り'
              ? 12
              : 28)
            - 20) * -0.25,
      weaponType,
      hairVariant,
      faceVariant,
      eyeVariant,
      browVariant,
      earVariant,
      noseVariant,
    },
  }
}

export function generateGuardian(input: GuardianFormInput): GuardianProfile {
  return buildGuardianFromSeed(createSeedFromInput(input), encodeRecoveryCode(input), input.tone)
}

export function generateGuardianFromSeed(seed: number, tone: GuardianTone = '神秘感'): GuardianProfile {
  return buildGuardianFromSeed((seed >>> 0) || 1, null, tone)
}
