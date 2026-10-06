const kanaToRomaji: Record<string, string> = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", を: "wo", ん: "n",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  ゔ: "vu",
  ぁ: "a", ぃ: "i", ぅ: "u", ぇ: "e", ぉ: "o",
  ゃ: "ya", ゅ: "yu", ょ: "yo", ゎ: "wa",
  きゃ: "kya", きゅ: "kyu", きょ: "kyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo",
  ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo",
  ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  じゃ: "ja", じゅ: "ju", じょ: "jo",
  ぢゃ: "ja", ぢゅ: "ju", ぢょ: "jo",
  びゃ: "bya", びゅ: "byu", びょ: "byo",
  ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
  うぁ: "wa", うぃ: "wi", うぇ: "we", うぉ: "wo",
  いぇ: "ye",
  きぇ: "kye", ぎぇ: "gye",
  しぇ: "she", じぇ: "je", ちぇ: "che",
  つぁ: "tsa", つぃ: "tsi", つぇ: "tse", つぉ: "tso",
  てぃ: "ti", てゅ: "tyu", でぃ: "di", でゅ: "dyu",
  とぅ: "tu", どぅ: "du",
  ふぁ: "fa", ふぃ: "fi", ふぇ: "fe", ふぉ: "fo",
  ふゅ: "fyu",
  ゔぁ: "va", ゔぃ: "vi", ゔぇ: "ve", ゔぉ: "vo",
  ゔゅ: "vyu",
};

function toHiragana(character: string): string {
  const codePoint = character.codePointAt(0);
  if (codePoint !== undefined && codePoint >= 0x30a1 && codePoint <= 0x30f6) {
    return String.fromCodePoint(codePoint - 0x60);
  }
  return character;
}

export function romanizeKana(value: string): string {
  const characters = Array.from(value.normalize("NFKC"), toHiragana);
  let result = "";
  let geminate = false;

  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index];
    if (character === "っ") {
      geminate = true;
      continue;
    }
    if (character === "ー") {
      const lastVowel = result.match(/[aeiou](?!.*[aeiou])/);
      if (lastVowel) result += lastVowel[0];
      continue;
    }

    const nextCharacter = characters[index + 1];
    const kana = character + (["ゃ", "ゅ", "ょ", "ぇ"].includes(nextCharacter) ? nextCharacter : "");
    const romanized = character === "ん" && /^[aeiouy]/i.test(kanaToRomaji[nextCharacter] ?? "")
      ? "n'"
      : kanaToRomaji[kana] ?? kanaToRomaji[character] ?? character;
    if (geminate) {
      const initial = romanized.match(/^(ch|sh|[bcdfghjklmnpqrstvwxyz])/i)?.[0];
      if (initial) result += initial[0].toLowerCase();
      geminate = false;
    }
    result += romanized;
    if (kana.length > character.length) index += 1;
  }

  return result;
}

export function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase();
}

export function matchesSearchText(query: string, searchableValues: string[]): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const romanizedQuery = normalizeSearchText(romanizeKana(normalizedQuery));
  return searchableValues.some((value) => {
    const normalizedValue = normalizeSearchText(value);
    const romanizedValue = normalizeSearchText(romanizeKana(normalizedValue));
    return normalizedValue.includes(normalizedQuery)
      || normalizedValue.includes(romanizedQuery)
      || romanizedValue.includes(normalizedQuery)
      || romanizedValue.includes(romanizedQuery);
  });
}

export function searchMatchRank(
  query: string,
  formalNames: string[],
  readingAliases: string[],
  abbreviations: string[],
): number | null {
  if (matchesSearchText(query, formalNames)) return 0;

  const hiraganaAliases = readingAliases.filter((alias) => /[\u3040-\u309f]/u.test(alias));
  if (matchesSearchText(query, hiraganaAliases)) return 1;

  const katakanaAliases = readingAliases.filter((alias) => /[\u30a0-\u30ff]/u.test(alias));
  if (matchesSearchText(query, katakanaAliases)) return 2;

  const otherFormalAliases = readingAliases.filter(
    (alias) => !/[\u3040-\u309f\u30a0-\u30ff]/u.test(alias),
  );
  if (matchesSearchText(query, otherFormalAliases)) return 0;

  if (matchesSearchText(query, abbreviations)) return 3;
  return null;
}
