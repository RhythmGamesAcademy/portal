export type RoleKind = "academy" | "major" | "faculty" | "lecture-category" | "language" | "state" | "other";

export interface RoleDefinition {
  code: string;
  kind: RoleKind;
  nameJa: string;
  nameEn: string;
}

export interface PortalRoleSnapshot {
  academyRoles: string[];
  majors: string[];
  majorCount: number;
  rolesAvailable: boolean;
}

// ロールIDを正本とし、表示名や分類をIDから解決する。名前だけで権限を判定しない。
export const ROLE_CATALOG: Record<string, RoleDefinition> = {
  ["1518532514518532206"]: { code: "academy", kind: "other", nameJa: "音楽ゲーム学園", nameEn: "Rhythm Games Academy" },
  ["1518532514518532205"]: { code: "dean", kind: "other", nameJa: "学園長", nameEn: "Dean" },
  ["1518532514518532203"]: { code: "academic-director", kind: "other", nameJa: "教務主事", nameEn: "Academic Director" },
  ["1518533017432359016"]: { code: "special-director", kind: "other", nameJa: "特任主事", nameEn: "Special Director" },
  ["1540358398669750303"]: { code: "suspended-instructor", kind: "state", nameJa: "活動停止（講師）", nameEn: "Suspended (Instructor)" },
  ["1535497157648326727"]: { code: "suspended-student", kind: "state", nameJa: "活動停止（学生）", nameEn: "Suspended (Student)" },
  ["1535497632187945030"]: { code: "warning", kind: "state", nameJa: "警告", nameEn: "Warning" },
  ["1551471020504780861"]: { code: "language-en", kind: "language", nameJa: "EN", nameEn: "EN" },
  ["1551470878032793641"]: { code: "language-ja", kind: "language", nameJa: "JA", nameEn: "JA" },
  ["1518532514518532202"]: { code: "honorary-instructor", kind: "academy", nameJa: "名誉講師", nameEn: "Honorary Instructor" },
  ["1518532514505822316"]: { code: "honorary-student", kind: "academy", nameJa: "名誉学生", nameEn: "Honorary Student" },
  ["1518532514518532201"]: { code: "instructor", kind: "academy", nameJa: "講師", nameEn: "Instructor" },
  ["1543529767444414484"]: { code: "student", kind: "academy", nameJa: "学生", nameEn: "Student" },
  ["1541010965800288317"]: { code: "event-organizer", kind: "other", nameJa: "イベンター", nameEn: "Event Organizer" },
  ["1536273517467926638"]: { code: "faculty-basic", kind: "faculty", nameJa: "音ゲー基礎学部", nameEn: "Rhythm Game Fundamentals Faculty" },
  ["1536273693259333724"]: { code: "faculty-practice", kind: "faculty", nameJa: "音ゲー実践学部", nameEn: "Rhythm Game Practice Faculty" },
  ["1518532514518532200"]: { code: "category-creative", kind: "lecture-category", nameJa: "創作系", nameEn: "Creative" },
  ["1518532514518532199"]: { code: "category-humanities", kind: "lecture-category", nameJa: "文理系", nameEn: "Humanities and Sciences" },
  ["1518532514518532198"]: { code: "category-arcade", kind: "lecture-category", nameJa: "アーケード系", nameEn: "Arcade" },
  ["1538465246975361095"]: { code: "category-standalone", kind: "lecture-category", nameJa: "スタンドアロン系", nameEn: "Standalone" },
  ["1518532514518532197"]: { code: "category-mobile", kind: "lecture-category", nameJa: "モバイル系", nameEn: "Mobile" }, ["1518532514489307223"]: { code: "major-01", kind: "major", nameJa: "ADOFAI", nameEn: "ADOFAI " },
  ["1518532514505822315"]: { code: "major-02", kind: "major", nameJa: "Arcaea", nameEn: "Arcaea " },
  ["1544532384765055107"]: { code: "major-03", kind: "major", nameJa: "Asterhythm", nameEn: "Asterhythm " },
  ["1533753509256757258"]: { code: "major-04", kind: "major", nameJa: "あんスタ", nameEn: "あんスタ " },
  ["1518532514489307226"]: { code: "major-05", kind: "major", nameJa: "バンドリ", nameEn: "バンドリ " },
  ["1535810629095657553"]: { code: "major-06", kind: "major", nameJa: "beatmania", nameEn: "beatmania " },
  ["1533753995699556412"]: { code: "major-07", kind: "major", nameJa: "Beat Saber", nameEn: "Beat Saber " },
  ["1544533088045109319"]: { code: "major-08", kind: "major", nameJa: "Berry Melody", nameEn: "Berry Melody " },
  ["1518532514505822314"]: { code: "major-09", kind: "major", nameJa: "CHUNITHM", nameEn: "CHUNITHM " },
  ["1533753876719599736"]: { code: "major-10", kind: "major", nameJa: "Cytus", nameEn: "Cytus " },
  ["1533753311260573736"]: { code: "major-11", kind: "major", nameJa: "D4DJ", nameEn: "D4DJ " },
  ["1535806471684624425"]: { code: "major-12", kind: "major", nameJa: "DDR", nameEn: "DDR " },
  ["1518532514489307220"]: { code: "major-13", kind: "major", nameJa: "DANCERUSH STARDOM", nameEn: "DANCERUSH STARDOM " },
  ["1518532514505822311"]: { code: "major-14", kind: "major", nameJa: "Deemo", nameEn: "Deemo " },
  ["1518532514505822310"]: { code: "major-15", kind: "major", nameJa: "DJMAX", nameEn: "DJMAX " },
  ["1518532514505822308"]: { code: "major-16", kind: "major", nameJa: "Dynamix", nameEn: "Dynamix " },
  ["1544532562167205918"]: { code: "major-17", kind: "major", nameJa: "ELLIA", nameEn: "ELLIA " },
  ["1544536228089692160"]: { code: "major-18", kind: "major", nameJa: "EZ2", nameEn: "EZ2 " },
  ["1535806936505655408"]: { code: "major-19", kind: "major", nameJa: "GITADORA", nameEn: "GITADORA " },
  ["1544535981779062874"]: { code: "major-20", kind: "major", nameJa: "グルーヴコースター", nameEn: "グルーヴコースター " },
  ["1544536845663346800"]: { code: "major-21", kind: "major", nameJa: "白鍵上のコンチェルト", nameEn: "白鍵上のコンチェルト " },
  ["1533753375617712140"]: { code: "major-22", kind: "major", nameJa: "ヒプノシスマイク", nameEn: "ヒプノシスマイク " },
  ["1533752779175362650"]: { code: "major-23", kind: "major", nameJa: "ホロライブドリームス", nameEn: "ホロライブドリームス " },
  ["1544531349862359120"]: { code: "major-24", kind: "major", nameJa: "Lumina Score", nameEn: "Lumina Score " },
  ["1533752049538306149"]: { code: "major-25", kind: "major", nameJa: "アイドルマスター", nameEn: "アイドルマスター " },
  ["1535807155742052482"]: { code: "major-26", kind: "major", nameJa: "jubeat", nameEn: "jubeat " },
  ["1518532514489307224"]: { code: "major-27", kind: "major", nameJa: "In Falsus", nameEn: "In Falsus " },
  ["1544530912082001950"]: { code: "major-28", kind: "major", nameJa: "KALPA", nameEn: "KALPA " },
  ["1533754906920615986"]: { code: "major-29", kind: "major", nameJa: "神椿市協奏中", nameEn: "神椿市協奏中 " },
  ["1544532212366704700"]: { code: "major-30", kind: "major", nameJa: "コトノネドライブ", nameEn: "コトノネドライブ " },
  ["1533754541256872096"]: { code: "major-31", kind: "major", nameJa: "Lanota", nameEn: "Lanota " },
  ["1533752933340938341"]: { code: "major-32", kind: "major", nameJa: "Liminality", nameEn: "Liminality " },
  ["1533753174853292145"]: { code: "major-33", kind: "major", nameJa: "ラブライブ", nameEn: "ラブライブ " },
  ["1518532514505822313"]: { code: "major-34", kind: "major", nameJa: "maimai", nameEn: "maimai " },
  ["1533753800706490549"]: { code: "major-35", kind: "major", nameJa: "Muse Dash", nameEn: "Muse Dash " },
  ["1544535833183387718"]: { code: "major-36", kind: "major", nameJa: "MUSYNC", nameEn: "MUSYNC " },
  ["1544535795053105202"]: { code: "major-37", kind: "major", nameJa: "MUSYNX", nameEn: "MUSYNX " },
  ["1544531027379363890"]: { code: "major-38", kind: "major", nameJa: "Nientum - Op.Zero", nameEn: "Nientum - Op.Zero " },
  ["1544631052537176104"]: { code: "major-39", kind: "major", nameJa: "NOISZ", nameEn: "NOISZ " },
  ["1544536125882765383"]: { code: "major-40", kind: "major", nameJa: "Notanote", nameEn: "Notanote " },
  ["1518532514489307221"]: { code: "major-41", kind: "major", nameJa: "ノスタルジア", nameEn: "ノスタルジア " },
  ["1544532926228734073"]: { code: "major-42", kind: "major", nameJa: "オウギヒメ", nameEn: "オウギヒメ " },
  ["1518532514505822312"]: { code: "major-43", kind: "major", nameJa: "オンゲキ", nameEn: "オンゲキ " },
  ["1544536038037262366"]: { code: "major-44", kind: "major", nameJa: "Orzmic", nameEn: "Orzmic " },
  ["1544532455153991791"]: { code: "major-45", kind: "major", nameJa: "OverRapid", nameEn: "OverRapid " },
  ["1544301450786508941"]: { code: "major-46", kind: "major", nameJa: "Paradigm: Reboot", nameEn: "Paradigm: Reboot " },
  ["1544530713913720833"]: { code: "major-47", kind: "major", nameJa: "Phigros", nameEn: "Phigros " },
  ["1544537766921117726"]: { code: "major-48", kind: "major", nameJa: "Platina :: Lab", nameEn: "Platina :: Lab " },
  ["1535806078762094704"]: { code: "major-49", kind: "major", nameJa: "pop'n music", nameEn: "pop'n music " },
  ["1518532514505822309"]: { code: "major-50", kind: "major", nameJa: "ポラリスコード", nameEn: "ポラリスコード " },
  ["1518532514489307227"]: { code: "major-51", kind: "major", nameJa: "プロセカ", nameEn: "プロセカ " },
  ["1533754420939194479"]: { code: "major-52", kind: "major", nameJa: "ProjectDIVA", nameEn: "ProjectDIVA " },
  ["1544538255272316948"]: { code: "major-53", kind: "major", nameJa: "Project Pentjet", nameEn: "Project Pentjet " },
  ["1544308082727719003"]: { code: "major-54", kind: "major", nameJa: "Pump It Up", nameEn: "Pump It Up " },
  ["1544532657965367397"]: { code: "major-55", kind: "major", nameJa: "RAVON", nameEn: "RAVON " },
  ["1544538404035891272"]: { code: "major-56", kind: "major", nameJa: "RESONARK", nameEn: "RESONARK " },
  ["1533752692785156239"]: { code: "major-57", kind: "major", nameJa: "Rotaeno", nameEn: "Rotaeno " },
  ["1533752584438022185"]: { code: "major-58", kind: "major", nameJa: "Rizline", nameEn: "Rizline " },
  ["1544535089537482843"]: { code: "major-59", kind: "major", nameJa: "Sixter Gate", nameEn: "Sixter Gate " },
  ["1544531526551863427"]: { code: "major-60", kind: "major", nameJa: "シノビスラッシュ", nameEn: "シノビスラッシュ " },
  ["1518532514489307219"]: { code: "major-61", kind: "major", nameJa: "Sound Voltex", nameEn: "Sound Voltex " },
  ["1544301814701101096"]: { code: "major-62", kind: "major", nameJa: "シンクロニカ", nameEn: "シンクロニカ " },
  ["1518803961153458297"]: { code: "major-63", kind: "major", nameJa: "太鼓の達人", nameEn: "太鼓の達人 " },
  ["1544613072713285673"]: { code: "major-64", kind: "major", nameJa: "シアトリズム", nameEn: "シアトリズム " },
  ["1536385849204281344"]: { code: "major-65", kind: "major", nameJa: "TAKUMI³", nameEn: "TAKUMI³ " },
  ["1533755090413027472"]: { code: "major-66", kind: "major", nameJa: "東方ダンマクカグラ", nameEn: "東方ダンマクカグラ " },
  ["1533754690804777011"]: { code: "major-67", kind: "major", nameJa: "Tone Sphere", nameEn: "Tone Sphere " },
  ["1544538186817212456"]: { code: "major-68", kind: "major", nameJa: "Trombone Champ", nameEn: "Trombone Champ " },
  ["1518532514489307225"]: { code: "major-69", kind: "major", nameJa: "Vivid/Stasis", nameEn: "Vivid/Stasis " },
  ["1533754243540979822"]: { code: "major-70", kind: "major", nameJa: "VOEZ", nameEn: "VOEZ " },
  ["1533752472298848266"]: { code: "major-71", kind: "major", nameJa: "夢のステラリウム", nameEn: "夢のステラリウム " },
  ["1544533527159251024"]: { code: "major-72", kind: "major", nameJa: "ゆんゆん電波シンドローム", nameEn: "ゆんゆん電波シンドローム " },
  ["1533755330453045339"]: { code: "major-73", kind: "major", nameJa: "その他", nameEn: "Other " },
};

const ROLE_BY_CODE = Object.fromEntries(Object.values(ROLE_CATALOG).map((role) => [role.code, role]));

export function rolesFromDiscordIds(roleIds: string[]): PortalRoleSnapshot {
  const academyRoles: string[] = [];
  const majorCodes: string[] = [];
  for (const roleId of roleIds) {
    const role = ROLE_CATALOG[roleId];
    if (!role) continue;
    if (role.kind === "academy" && !academyRoles.includes(role.code)) academyRoles.push(role.code);
    if (role.kind === "major" && !majorCodes.includes(role.code)) majorCodes.push(role.code);
  }
  return { academyRoles, majors: majorCodes.slice(0, 5), majorCount: majorCodes.length, rolesAvailable: true };
}

export function unavailableRoleSnapshot(): PortalRoleSnapshot {
  return { academyRoles: [], majors: [], majorCount: 0, rolesAvailable: false };
}

export function roleLabel(code: string, locale: "ja" | "en"): string | null {
  const role = ROLE_BY_CODE[code];
  return role ? (locale === "ja" ? role.nameJa : role.nameEn) : null;
}

export function displayableRoleLabels(snapshot: PortalRoleSnapshot, locale: "ja" | "en") {
  return {
    academy: snapshot.academyRoles.map((code) => roleLabel(code, locale)).filter((label): label is string => Boolean(label)),
    majors: snapshot.majors.map((code) => roleLabel(code, locale)).filter((label): label is string => Boolean(label)),
  };
}
