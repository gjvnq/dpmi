export interface LocalizedString {
  base: string
  lang: string
}

export function newLocalizedString(base: string, lang: string): LocalizedString {
  return {
    base: base,
    lang: lang
  }
}

