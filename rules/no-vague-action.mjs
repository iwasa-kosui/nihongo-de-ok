const PATTERNS = [
  [/適切に対応(?:する|します|し(?:た|て|ない|ます))/, "何をどの基準で対応するか"],
  [/適切に実施(?:する|します|し(?:た|て|ない|ます))/, "誰が何をどの手順で実施するか"],
  [/これを実施(?:する|します|し(?:た|て|ない|ます))/, "「これ」が指す対象"],
  [/必要に応じて対応(?:する|します|し(?:た|て|ない|ます))/, "対応の条件と担当者"],
  [/十分に検討(?:する|します|し(?:た|て|ない|ます))/, "検討項目と判断基準"]
];

function nonUrlMatches(text, pattern) {
  const matches = [];
  const expression = new RegExp(pattern.source, `${pattern.flags.replace("g", "")}g`);
  for (const match of text.matchAll(expression)) {
    if (/https?:\/\/[^\s<>]*$/.test(text.slice(0, match.index))) continue;
    matches.push(match);
  }
  return matches;
}
export default function noVagueAction(context, options = {}) {
  const allow = new Set(options.allow ?? []);
  const { Syntax, getSource, report, RuleError, locator } = context;
  let quoteDepth = 0;
  return { [Syntax.BlockQuote]() { quoteDepth += 1; }, [Syntax.BlockQuoteExit]() { quoteDepth -= 1; }, [Syntax.Code]() {}, [Syntax.Str](node) {
    if (quoteDepth > 0) return;
    const text = getSource(node);
    for (const [pattern, detail] of PATTERNS) {
      for (const match of nonUrlMatches(text, pattern)) {
        if (allow.has(pattern.source) || allow.has(match[0])) continue;
        report(node, new RuleError(`曖昧な動作です。${detail}を具体化してください。`, { padding: locator.range([match.index, match.index + match[0].length]) }));
      }
    }
  }};
}
