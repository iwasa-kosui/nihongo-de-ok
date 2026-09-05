# 日本語でおｋ

日本語の業務・技術文書を、読者が判断・行動できる短さに整えるエージェントスキルです。文書の役割を定め、必要な範囲を執筆し、日本語の意味確認と textlint による静的検査を行います。

## 導入

Node.js 22 以降が必要です。リポジトリ全体が一つのスキルなので、Codex の個人用スキル配置先へ clone し、依存関係をインストールします。

```sh
git clone https://github.com/iwasa-kosui/nihongo-de-ok.git ~/.codex/skills/nihongo-de-ok
cd ~/.codex/skills/nihongo-de-ok
npm ci
```

`CODEX_HOME` を変更している場合は、その配下の `skills/nihongo-de-ok` に置いてください。他のエージェントでも、利用するエージェントのスキル配置先へリポジトリ全体を置き、`SKILL.md` を読み込んでください。文章生成はホストのエージェント機能を使い、このリポジトリから推論 API は呼びません。

## 依頼例

```text
$nihongo-de-ok この資料から、バックエンド開発者向けの Design Doc を書いて。
実現方式と不採用案の理由を残し、進捗や作業チケットは含めないで。
```

## CLIを始める

スキルルートから、対象文書の区分を `--type` で必ず指定します。

```sh
node scripts/lint.mjs --type stock README.md
```

全ての区分、ルール、設定、終了コードは [CLIと静的検査の詳細](references/lint.md) を参照してください。

静的検査は既知の言い回しや表の長さを検出しますが、日本語の意味、事実の正しさ、文書の役割は保証しません。[日本語の基準](references/japanese.md)に沿った確認と、根拠資料との照合も必要です。

## 主要資料

- [SKILL.md](SKILL.md): 執筆と検査
- [文書分類](references/document-types.md): 読者と目的
- [文書の形](references/document-shapes.md): 種別ごとの構成
- [委譲手順](references/delegation.md): 執筆者と修正上限
- [日本語の基準](references/japanese.md): 語と構成の確認

保守者は [iwasa-kosui](https://github.com/iwasa-kosui) です。ライセンスは [MIT License](LICENSE) です。
