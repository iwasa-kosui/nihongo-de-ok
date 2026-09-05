const DEFAULTS = new Map([
  ["観測", "確認・計測・調査など、実際に行ったことを書く（専門用語として必要な場合は除く）"],
  ["レバレッジ", "活用（文脈に応じて具体化）"],
  ["シームレス", "継ぎ目なく／一貫して（対象を明記）"],
  ["アクショナブル", "実行可能な／実行手順が明確な"],
  ["包括的な", "対象範囲を列挙する"],
  ["最適化された", "何をどの指標で改善したか明記する"],
  ["ホリスティック", "対象範囲と要素どうしの関係を列挙する"],
  ["プロアクティブに", "いつ、誰が、何を先回りして行うか明記する"],
  ["ロバストな", "想定する故障・入力と満たす性質を明記する"],
  ["価値を解き放つ", "誰にどの価値を提供するか明記する"],
  ["ゲームチェンジャー", "何がどのように変わるか明記する"],
  ["アラインメントを取る", "誰と何について合意するか明記する"]
]);

function nonUrlMatches(text, word) {
  const matches = [];
  for (let index = text.indexOf(word); index !== -1; index = text.indexOf(word, index + word.length)) {
    if (/https?:\/\/[^\s<>]*$/.test(text.slice(0, index))) continue;
    if (word === "観測" && text.slice(index - 1, index + word.length + 1) === "可観測性") continue;
    matches.push(index);
  }
  return matches;
}

export default function noAiJargon(context, options = {}) {
  const allow = new Set(options.allow ?? []);
  const entries = [...DEFAULTS].filter(([word]) => !allow.has(word));
  const { Syntax, getSource, report, RuleError, locator } = context;
  let quoteDepth = 0;
  return {
    [Syntax.BlockQuote]() { quoteDepth += 1; },
    [Syntax.BlockQuoteExit]() { quoteDepth -= 1; },
    [Syntax.Code]() {},
    [Syntax.Str](node) {
      if (quoteDepth > 0) return;
      const text = getSource(node);
      for (const [word, suggestion] of entries) {
        for (const index of nonUrlMatches(text, word)) {
        report(node, new RuleError(`直訳調・抽象的な表現です。「${suggestion}」など、対象と動作を具体化してください。`, {
          padding: locator.range([index, index + word.length])
        }));
        }
      }
    }
  };
}
