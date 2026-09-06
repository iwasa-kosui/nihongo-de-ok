import { phraseRule } from "./lib/phrase-rule.mjs";

const expressions = [
  ["価値創出最大化基盤", "価値を受ける相手、手段、指標を分けて書く"],
  ["意思決定高度化レイヤー", "どの判断をどのデータで支えるか書く"],
  ["顧客体験向上プラットフォーム", "改善する体験と機能を分けて書く"],
  ["データドリブン意思決定基盤", "データ、判断、利用者の関係を分けて書く"],
  ["組織横断価値創出", "連携する組織、目的、成果を分けて書く"]
];

export default phraseRule(expressions, (suggestion) => `名詞の関係が分かりにくい表現の候補です。${suggestion}。`);
