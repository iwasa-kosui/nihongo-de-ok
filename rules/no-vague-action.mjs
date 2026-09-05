import { phraseRule } from "./lib/phrase-rule.mjs";

const actionEnding = "(?:する|します|した|して|しない)";
const expressions = [
  [new RegExp(`(?:適切に|適宜|必要に応じて|状況に応じて)(?:対応|対処|実施|調整)${actionEnding}`), "実施条件、判断基準、担当者と動作"],
  [new RegExp(`(?:これ|それ|本件|当該事項)を(?:実施|推進)${actionEnding}`), "指示語が指す対象と、実際に行うこと"],
  [new RegExp(`(?:十分に|慎重に)(?:検討|評価)${actionEnding}`), "検討項目と判断基準"]
];

export default phraseRule(expressions, (suggestion) => `曖昧な動作の候補です。${suggestion}を具体化してください。`);
