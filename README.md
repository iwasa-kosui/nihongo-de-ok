# 日本語でおｋ

日本語の業務・技術文書を、読者が判断・行動できる最短の形にするエージェントスキル。

文書の役割を決め、安価なサブエージェントが必要な部分だけを書き、意味の確認と textlint の静的検査を行う。[ponytail](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) の「要件を満たす最初の段で止める」を文書執筆に応用した。

## 使う

Node.js 22 以降を使う。リポジトリ全体が一つのスキルになっている。Codex の個人用スキルとして配置する例:

```sh
git clone https://github.com/iwasa-kosui/nihongo-de-ok.git ~/.codex/skills/nihongo-de-ok
cd ~/.codex/skills/nihongo-de-ok
npm ci
```

`$CODEX_HOME` を変更している場合は、その配下の `skills/nihongo-de-ok` に置く。他のエージェントでも、スキル配置先にリポジトリ全体を置いて `SKILL.md` を読み込める。文章生成はホストのエージェント機能を使うため、このリポジトリから推論 API を呼ぶ設定はない。

```text
$nihongo-de-ok この資料から、バックエンド開発者向けの Design Doc を書いて。
実現方式と不採用案の理由を残し、進捗や作業チケットは含めないで。
```

## 文書の役割

[文書分類](references/document-types.md)に、各文書の読者・目的・目的ではないこと・最小内容を整理した。未知の種類もこの軸で扱う。

| 区分 | 例 | 残す情報 |
|---|---|---|
| ストック | PRD、Design Doc、ADR、仕様、Runbook | 要求、契約、方式、判断の理由、再利用する手順 |
| フロー | 計画、ロードマップ、進捗報告 | 担当、期限、現在地、次の作業 |
| 記録 | 調査結果、議事録、ポストモーテム | その時点の事実、経過、観察、結果 |

ストック文書に進捗・PR番号・Jira課題IDを混ぜない。ADR の採用・廃止・置換や仕様の業務状態は残す。区分は更新頻度で決めない。この分類は本スキルの執筆方針であり、業界共通の規格ではない。

## 執筆ラダー

不要な新設を避ける → 正本を参照する → 必要箇所だけ直す → 短文にする → 表・手順にする → 必要な章を設ける。

明示された成果物と必要情報を満たす最初の段で止める。[安価な実行者](references/delegation.md)に初稿と最大1回の修正を任せ、解決しない場合だけ次の能力帯へ1回上げる。数値、条件、例外、根拠を省いて短くしない。

文章で説明する箇条書きが5項目以上になる場合は、論点ごとの見出しと段落へ組み替える。短い項目名の列挙、確認欄、順序が必要な操作手順、ユーザーの指定形式は役割に応じて保つ。[日本語の基準](references/japanese.md#文章のまとまりを判断する)に沿って執筆者が構造を点検する。

## 静的検査だけ使う

```sh
node scripts/lint.mjs --type design-doc /absolute/path/design.md
node scripts/lint.mjs --type flow --format json /absolute/path/status.md
npm test
```

`--type` は必須。`prd`、`design-doc`、`adr`、`rfc`、`stock`、`flow`、`record` から選ぶ。前の5種類にはストック文書の検査も適用する。外部の作業ディレクトリからスクリプトの絶対パスで実行できる。

| ルール | 検査すること |
|---|---|
| `preset-japanese` | 助詞の重複、二重否定など既存の日本語ルール |
| `no-ai-jargon` | 直訳調・抽象表現の辞書と具体化の候補 |
| `no-opaque-compound` | 意味が読み取りにくい造語の辞書と書き換えの候補 |
| `no-vague-action` | 主体・対象・条件を確認すべき限定的な動作表現 |
| `stock-boundary` | 作業進捗、チェックボックス、PR・Jiraの追跡情報 |

終了コードは、合格が `0`、指摘ありが `1`、引数・設定・入出力のエラーが `2`。依存未導入など、スクリプト自体が起動しない場合も未検証として扱う。検査はファイルを変更しない。置換候補を見て文意を保って直し、再検査する。

辞書やパターンにない表現、文をまたぐ指示関係、事実の正しさは静的検査では保証しない。[日本語の基準](references/japanese.md)に沿った意味の確認も必要になる。一般の技術語を長さだけで禁止しない。

語を選ぶときは、読者になじみがあるか、実際の動作を表すか、専門語が必要な意味を持つかを判断する。抽象的な評価は範囲と基準に、複雑な名前は要素どうしの関係に戻して書く。辞書は、この判断を補助する事例集として使う。

文章ルールの例外語は [.textlintrc.json](.textlintrc.json) の該当ルールの `allow` に文字列で指定する。設定は同梱CLIが読み込む。例えば `"no-ai-jargon": { "allow": ["レバレッジ比率"] }` とすると、その用語の範囲だけを除外し、同じ段落の他の表現は検査する。3つの文章ルールで共通の仕組みを使う。理由を確認した用語だけ追加し、検査を通すための一括除外に使わない。

Jira課題IDの検出は、大文字のキーと番号から推定する。`ADR-001` や `UTF-8` などは除外するが、任意の仕様IDと課題IDを完全には区別できない。`stock-boundary.allow` には例外のID全体、または接頭辞を指定できる。追跡URL・進捗・チェックボックスはこの例外で無効にならない。

## 構成

- [SKILL.md](SKILL.md): 執筆から検査までの手順
- [文書分類](references/document-types.md): 読者と目的による書き分け
- [PRD・Design Doc・ADR・RFC](references/document-shapes.md): 最小内容と同じ題材での比較
- [委譲手順](references/delegation.md): モデルの選択、修正上限、合格条件
- [日本語の基準](references/japanese.md): 書き換え例と静的検査の限界
- [rules](rules): textlint カスタムルール

MIT License。ponytail の実装やフックへの依存はない。
