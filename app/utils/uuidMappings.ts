import { hairIconData, skinColorData, outfitData, genderData } from "../data/ElfieCustomizationData"

export const getHairStyleByUUID = (uuid: string) => {
  return hairIconData.find((item) => item.uuid === uuid) || null
}

export const getSkinColorByUUID = (uuid: string) => {
  return skinColorData.find((item) => item.uuid === uuid) || null
}

export const getOutfitByUUID = (uuid: string) => {
  return outfitData.find((item) => item.uuid === uuid) || null
}

export const getGenderByUUID = (uuid: string) => {
  return genderData.find((item) => item.uuid === uuid) || null
}
