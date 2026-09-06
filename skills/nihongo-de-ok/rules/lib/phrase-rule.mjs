function literalRanges(text, phrase) {
  if (typeof phrase !== "string" || phrase.length === 0) {
    throw new Error("allow には空でない文字列を指定してください。");
  }
  const ranges = [];
  for (let index = text.indexOf(phrase); index !== -1; index = text.indexOf(phrase, index + 1)) {
    ranges.push([index, index + phrase.length]);
  }
  return ranges;
}

export function phraseRule(entries, describe) {
  return (context, options = {}) => {
    const { Syntax, getSource, report, RuleError, locator } = context;
    const allow = options.allow ?? [];
    if (!Array.isArray(allow)) throw new Error("allow は文字列の配列で指定してください。");
    for (const phrase of allow) literalRanges("", phrase);
    let quoteDepth = 0;
    return {
      [Syntax.BlockQuote]() { quoteDepth += 1; },
      [Syntax.BlockQuoteExit]() { quoteDepth -= 1; },
      [Syntax.Str](node) {
        if (quoteDepth > 0) return;
        const text = getSource(node);
        const excluded = [
          ...allow.flatMap((phrase) => literalRanges(text, phrase)),
          ...Array.from(text.matchAll(/https?:\/\/[^\s<>]+/g), (match) => [match.index, match.index + match[0].length])
        ];
        for (const [pattern, suggestion] of entries) {
          const ranges = typeof pattern === "string"
            ? literalRanges(text, pattern)
            : Array.from(text.matchAll(new RegExp(pattern.source, `${pattern.flags.replace(/[gy]/g, "")}g`)),
              (match) => [match.index, match.index + match[0].length]);
          for (const [start, end] of ranges) {
            if (excluded.some(([left, right]) => left <= start && end <= right)) continue;
            report(node, new RuleError(describe(suggestion), { padding: locator.range([start, end]) }));
          }
        }
      }
    };
  };
}
