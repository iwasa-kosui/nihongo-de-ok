# 日本語でおｋ

日本語の業務・技術文書を執筆・推敲するエージェントスキルです。設計の理由、制約、例外を残して、短く分かりやすく整えます。

## インストール

GitとNode.js 22以降が必要です。使うエージェントの配置先を選びます（個人用）。

| エージェント | 配置先 |
| --- | --- |
| [Claude Code](https://code.claude.com/docs/en/skills) | `$HOME/.claude/skills` |
| [Codex](https://learn.chatgpt.com/docs/build-skills) | `$HOME/.agents/skills` |
| [Cursor](https://cursor.com/docs/skills) | `$HOME/.cursor/skills` |

`skills_dir` を上の配置先に合わせて実行します。`SKILL.md` と検査用スクリプトを含むリポジトリ全体をインストールします。

```sh
skills_dir="$HOME/.agents/skills" # 配置先を選ぶ（Codexの例）
mkdir -p "$skills_dir"
git clone --depth 1 https://github.com/iwasa-kosui/nihongo-de-ok.git "$skills_dir/nihongo-de-ok"
npm ci --prefix "$skills_dir/nihongo-de-ok"
```

他のエージェントでも、スキルの配置先を指定して導入できます。スキルを自動認識しない場合は、配置した `SKILL.md` のパスを伝えて読み込ませてください。

## 使い方

インストール後にエージェントの新しいセッションを開き、読者と目的を添えて依頼します。

```text
nihongo-de-ok を使って、この設計書を開発者向けに短く推敲して。
実現方式と不採用案の理由、制約、例外は残して。

（ここに草稿を貼る）
```

詳しくは[スキルの手順](SKILL.md)、[CLIでの検査](references/lint.md)、[出力の比較](benchmarks/results/2026-09-06-main-fb6fd0b/document-review/report.md)を参照してください。

[MIT License](LICENSE)
