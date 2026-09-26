export const BODY_PARTS = ['胸', '背中', '足', '肩', '二頭筋', '三頭筋', '腹筋'] as const

export type BodyPart = (typeof BODY_PARTS)[number]

export const EXERCISE_CATALOG: Record<BodyPart, string[]> = {
  胸: ['ベンチプレス', 'インクラインベンチプレス', 'ダンベルプレス', 'ダンベルフライ', 'チェストプレス', 'プッシュアップ'],
  背中: ['デッドリフト', '懸垂(チンニング)', 'ラットプルダウン', 'ベントオーバーロウ', 'シーテッドロウ', 'ワンハンドロウ'],
  足: ['スクワット', 'レッグプレス', 'レッグエクステンション', 'レッグカール', 'ランジ', 'カーフレイズ'],
  肩: ['ショルダープレス', 'サイドレイズ', 'フロントレイズ', 'リアレイズ', 'アップライトロウ'],
  二頭筋: ['バーベルカール', 'ダンベルカール', 'ハンマーカール', 'インクラインダンベルカール', 'ケーブルカール'],
  三頭筋: ['トライセプスエクステンション', 'キックバック', 'ナローベンチプレス', 'ケーブルプレスダウン', 'ダンベルフレンチプレス', 'スカルクラッシャー'],
  腹筋: ['クランチ', 'レッグレイズ', 'プランク', 'シットアップ', 'アブローラー'],
}

export function findBodyPartForExercise(exerciseName: string): BodyPart | undefined {
  return BODY_PARTS.find((part) => EXERCISE_CATALOG[part].includes(exerciseName))
}
