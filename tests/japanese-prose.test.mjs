import test from "node:test";
import assert from "node:assert/strict";
import { createLinter } from "textlint";
import { createDescriptor } from "../scripts/lint.mjs";

const proseRules = ["no-vague-action", "no-ai-jargon", "no-opaque-compound"];
async function lint(text, rule, options = true) {
  const rules = Object.fromEntries(proseRules.map((name) => [name, name === rule ? options : false]));
  const descriptor = await createDescriptor("flow", { rules: {
    ...rules, "preset-japanese": false, "stock-boundary": false, "table-cell-length": false
  } });
  return (await createLinter({ descriptor }).lintText(text, "input.md")).messages;
}

test("vague actions survive conjugation, particles, nominalization and inserted arguments", async () => {
  const candidates = [
    "適切に対応する", "適切に対応しました", "適切に対応しません", "適切に対応すれば", "適切に対応しよう",
    "適切な対応を行います", "適切な対応を行わなかった", "適切な対応は行った", "適切な対応を実施しました",
    "適切に担当者が対応する", "適切に担当者が内容の評価を行う", "適切に、対応しました",
    "慎重な検討を行った", "十分な評価を行わなかった", "慎重に評価します", "適宜の調整を行う",
    "必要に応じて、対応を実施しました", "必要に応じた対応を行う", "状況に応じ、担当者が調整を行う",
    "これを実施すれば", "それは実施しません", "これについても実施します", "本件の実施を行う", "それへの対応を推進する",
    "これに対応します", "それにも対応する", "本件に対する対応を行います", "本件に関して対応する",
    "十分なリスク評価を行う", "慎重な性能評価を行う", "適切な問い合わせ対応を行う"
  ];
  for (const text of candidates) {
    const found = await lint(`${text}。`, "no-vague-action");
    assert.equal(found.length, 1, text);
    assert.equal(found[0].range[0], 0, text);
  }
  assert.equal((await lint("必要に応じて配信を停止する。", "no-vague-action")).length, 1);
});

test("borrowed expressions use lexical boundaries, basic forms and permitted particles", async () => {
  for (const text of [
    "価値を解き放った", "価値は解き放たれます", "価値をも解き放ちます", "価値を利用者が解き放つ",
    "アラインメントを取った", "アラインメントは取りません", "アラインメントをとる",
    "包括的に調べる", "包括的だった", "ロバストに動く", "プロアクティブな対応", "最適化されました", "最適化されている",
    "価値の解放", "アラインメントの取得", "昨日観測した", "昨日、観測した", "異常を本日観測しました", "異常を本日、観測しました",
    "段3で止める", "段３から再開する", "段12を試す"
  ]) assert.equal((await lint(`${text}。`, "no-ai-jargon")).length, 1, text);
});

test("opaque nouns generalize to new purposes and の without banning nouns by length", async () => {
  for (const text of [
    "価値創出最大化基盤", "顧客体験向上プラットフォーム", "顧客の体験の向上プラットフォーム",
    "意思決定の高度化レイヤー", "意思決定高度化レイヤー", "組織横断価値創出",
    "問い合わせ対応品質向上基盤", "運用成熟度向上支援機構", "業務効率化促進システム", "判断迅速化推進機構",
    "業務効率化基盤", "業務効率化システム", "業務の効率化の基盤"
  ]) assert.equal((await lint(`${text}。`, "no-opaque-compound")).length, 1, text);
});

test("nearby grammatical or technical uses are not mistaken for the candidate patterns", async () => {
  const accepted = {
    "no-vague-action": [
      "適切な対応表を作った。", "本件の処理速度を測定する。", "適切な値を指定する。",
      "適切に値を設定して対応する。", "それを保存する。", "障害の種類に応じて再試行回数を変える。",
      "当番が失敗率を確認する。5%を超えたら配信を停止する。", "慎重に。評価する。", "適切に「値を設定する」と書く。対応する。"
    ],
    "no-ai-jargon": [
      "捕獲した鳥を解き放った。", "価値を確認してから鳥を解き放った。", "価値が分かる。鳥を解き放つ。",
      "観測所の記録。", "包括契約の対象を確認した。", "クエリ最適化器を実装した。",
      "配列のアラインメントを16バイトに指定した。", "価値は鳥を解き放つことにある。",
      "階段3段を上がる。", "上段3行を読む。", "段階3で止める。", "ステップ3で止める。", "二段落に分ける。"
    ],
    "no-opaque-compound": [
      "情報処理安全確保支援士。", "顧客体験の向上を調査する。", "意思決定と描画レイヤーを分離する。",
      "画像処理システムの最適化。", "認証基盤の設定を更新する。", "価値提供と課題解決は具体的に書く。",
      "データ解析基盤の性能向上を検証する。", "高速画像処理基盤の最適化。",
      "最適化の対象システム。", "最適化対象システム。", "最適化問題の評価システム。"
    ]
  };
  for (const [rule, texts] of Object.entries(accepted)) {
    for (const text of texts) assert.deepEqual(await lint(text, rule), [], `${rule}: ${text}`);
  }
});

test("prose crosses emphasis, link labels and soft line breaks with exact source ranges", async () => {
  for (const text of [
    "😀**適切**な[対応](https://example.test)を行った。",
    "## 適切に**対応**しません。", "適切に\n対応しました。",
    "| 手順 |\n| --- |\n| 適切に**対応**する |",
    "<https://example.test/path>適切に対応する。"
  ]) {
    const found = await lint(text, "no-vague-action");
    assert.equal(found.length, 1, text);
    assert.equal(found[0].range[0], text.indexOf("適切"), text);
    const end = text.indexOf("。", text.indexOf("適切"));
    if (end !== -1) assert.equal(found[0].range[1], end, text);
  }
});

test("sentences, quotes, code, URLs, images and separate cells cannot form invented phrases", async () => {
  for (const text of [
    "適切に。対応する。", "適切に\n\n対応する。", "適切に`値を設定`対応する。",
    "適切に![操作](image.png)対応する。", "適切に  \n対応する。",
    "| 適切に | 対応する |\n| --- | --- |", "> 適切に対応する。\n> > 適切な対応をする。",
    "```md\n適切に対応する。\n```", "[URL](https://example.test/適切に対応する)",
    "https://example.test/適切に対応する", "適切に<br>対応する。"
  ]) assert.deepEqual(await lint(text, "no-vague-action"), [], text);
});

test("allow is local across Markdown and negation stays inside reported source spans", async () => {
  const text = "**適切な対応を行わなかった**という原文。適切に対応しません。";
  const found = await lint(text, "no-vague-action", { allow: ["適切な対応を行わなかったという原文"] });
  assert.equal(found.length, 1);
  assert.equal(text.slice(...found[0].range), "適切に対応しません");
  for (const text of ["価値は解き放たれませんでした", "適切な対応を行わなかった", "適切に対応してはいません",
    "適切に対応するべきではない", "適切に対応しなければならない", "必要に応じない", "アラインメントを取ってはいけません",
    "適切な対応ではない", "適切な対応はない", "慎重な評価ではありません"]) {
    const rule = /^(価値|アラインメント)/.test(text) ? "no-ai-jargon" : "no-vague-action";
    const [found] = await lint(`${text}。`, rule);
    assert.equal(text.slice(...found.range), text);
    assert.equal(found.fix, undefined);
  }
});
