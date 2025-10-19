/* Color Pallet - CrossDonate Theme */

export const neutral = {
  White: '#FFFFFF',
  Grey1: '#FAFAFA', // ライトモード背景
  Grey2: '#E5E5E5', // ボーダー、ライトモード
  Grey3: '#A3A3A3', // ミュートテキスト
  Grey4: '#737373', // サポートテキスト
  Grey5: '#262626', // ダークモード背景
  Grey6: '#171717', // デフォルトテキスト
  Black: '#000000',
  Text: '#171717',
} as const;

export const brand = {
  Primary: 'oklch(0.5 0.22 270)', // メインブランドカラー（紫）
  Secondary: 'oklch(0.95 0.01 270)', // セカンダリー（薄い紫）
  Accent1: 'oklch(0.6 0.24 190)', // アクセントカラー（シアン）
  Accent2: 'oklch(0.65 0.22 220)', // チャートカラー3

  // 互換性のために残しておく従来の色名
  Shuiro: 'oklch(0.5 0.22 270)', // brand.Primary と同じ
  Miyabi: 'oklch(0.95 0.01 270)', // brand.Secondary と同じ
  JordyBlue: 'oklch(0.6 0.24 190)', // brand.Accent1 と同じ
  BluePantone: 'oklch(0.5 0.22 270)', // brand.Primary と同じ
  BabyPink: 'oklch(0.65 0.22 220)', // brand.Accent2 と同じ
  CelesteGreen: 'oklch(0.98 0.005 270)', // ライトモード背景と同じ
} as const;

export const themeLight = {
  Primary: brand.Primary,
  PrimaryHighContrast: 'oklch(0.35 0.22 270)', // より濃い紫
  PrimaryLowContrast: 'oklch(0.95 0.05 270)', // より薄い紫
  PrimaryHover: 'oklch(0.55 0.22 270)', // ホバー時の紫
  PrimaryVisited: 'oklch(0.45 0.22 270)', // 訪問済みリンク

  Secondary: brand.Secondary,
  SecondaryHighContrast: 'oklch(0.85 0.01 270)',
  SecondaryLowContrast: 'oklch(0.98 0.005 270)',

  Link: brand.Primary,
  LinkHover: brand.Accent1,

  Body: neutral.Text,
  BodyLight: neutral.Grey4,
  Disable: neutral.Grey3,
  Background: 'oklch(0.98 0.005 270)', // ライトモード背景
  BackgroundHighlight: neutral.Grey1,
} as const;

export const info = {
  Success: 'oklch(0.6 0.15 140)', // 成功色（緑）
  SuccessLight: 'oklch(0.95 0.05 140)', // 成功背景色
  Error: 'oklch(0.577 0.245 27.325)', // エラー色（赤）
  ErrorLight: 'oklch(0.95 0.05 27.325)', // エラー背景色
  Attention: 'oklch(0.7 0.2 60)', // 注意色（オレンジ）
  AttentionLight: 'oklch(0.95 0.05 60)', // 注意背景色
} as const;

/* 
========== 元のカラー定義（参照用） ==========

export const neutral = {
  White: "#FFFFFF",
  Grey1: "#F7F7F7", // body background
  Grey2: "#D4D4D4", // lines, mouse over, lists or tables
  Grey3: "#B0B0B0", // disable (light theme)
  Grey4: "#646464", // supporting text, disable (dark theme)
  Grey5: "#222222", // dark theme background
  Grey6: "#141414", // default text color
  Black: "#000000",
} as const;

export const themeLight = {
  Primary: "#1C1CFF",
  PrimaryHighContrast: "#0B0B66",
  PrimaryLowContrast: "#DEDEFF",
  PrimaryHover: "#ABABFE",
  PrimaryVisited: "#090990",
  Body: neutral.Grey5,
  BodyLight: neutral.Grey4,
  Disable: neutral.Grey2,
  Background: neutral.White,
  BackgroundHighlight: neutral.Grey1,
} as const;

export const info = {
  Success: "#0A7146", // success message, success border
  SuccessLight: "#DDF4E4", // success background
  Error: "#B80000", // error message, error border
  ErrorLight: "#F7C8C8", // error background
  Attention: "#00e7e7", // notifications, announcement border
  AttentionLight: "#FFF8DF", // notifications background,  announcement background
} as const;

// do not use for UI elements
export const brand = {
  BabyPink: "#F0CDC2",
  CelesteGreen: "#B8FAF6",
  JordyBlue: "#88AAF1",
  BluePantone: "#1616B4",
  Miyabi: "#552266",
  Shuiro: "#FF5544",
} as const;
*/
