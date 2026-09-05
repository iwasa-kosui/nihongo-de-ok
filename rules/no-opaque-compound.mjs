const DEFAULTS = new Map([
  ["価値創出最大化基盤", "価値を受ける相手、手段、指標を分けて書く"],
  ["意思決定高度化レイヤー", "どの判断をどのデータで支えるか書く"],
  ["顧客体験向上プラットフォーム", "改善する体験と機能を分けて書く"],
  ["データドリブン意思決定基盤", "データ、判断、利用者の関係を分けて書く"],
  ["組織横断価値創出", "連携する組織、目的、成果を分けて書く"]
]);

function nonUrlMatches(text, word) {
  const matches = [];
  for (let index = text.indexOf(word); index !== -1; index = text.indexOf(word, index + word.length)) {
    if (/https?:\/\/[^\s<>]*$/.test(text.slice(0, index))) continue;
    matches.push(index);
  }
  return matches;
}
export default function noOpaqueCompound(context, options = {}) {
  const allow = new Set(options.allow ?? []);
  const { Syntax, getSource, report, RuleError, locator } = context;
  let quoteDepth = 0;
  return { [Syntax.BlockQuote]() { quoteDepth += 1; }, [Syntax.BlockQuoteExit]() { quoteDepth -= 1; }, [Syntax.Code]() {}, [Syntax.Str](node) {
    if (quoteDepth > 0) return;
    const text = getSource(node);
    for (const [word, suggestion] of DEFAULTS) {
      if (allow.has(word)) continue;
      for (const index of nonUrlMatches(text, word)) {
        report(node, new RuleError(`意味が分解されていない造語です。${suggestion}。`, { padding: locator.range([index, index + word.length]) }));
      }
    }
  }};
}
