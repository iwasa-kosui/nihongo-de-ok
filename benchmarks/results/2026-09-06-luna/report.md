# PR #1 執筆指示ベンチマーク

実行開始: 2026-09-05T15:28:29.195Z。対象: 3a8c676c39df49ebdd24754de49141090992b79a。

生成: gpt-5.6-luna / low、評価: gpt-5.6-terra / low。10課題 × 2反復 × 2条件。

| 指標 | スキルなし | スキルあり |
|---|---:|---:|
| 評価基準の合格数 | 79/100 | 91/100 |
| 全5基準合格の出力 | 11/20 | 11/20 |
| facts | 20/20 | 19/20 |
| grounding | 14/20 | 18/20 |
| role | 14/20 | 20/20 |
| clarity | 19/20 | 18/20 |
| economy | 12/20 | 16/20 |
| 初稿lint合格 | 13/20 | 20/20 |
| 最終稿lint合格 | 19/20 | 20/20 |
| 最終稿lint指摘数 | 2 | 0 |
| 平均本文文字数 | 407.5 | 207.6 |
| 生成呼び出し数（修正含む） | 27 | 20 |
| 入力トークン（cache込み） | 78400 | 156262 |
| 内cache入力トークン | 21504 | 21504 |
| 出力トークン | 12745 | 5282 |
| 平均生成時間・秒（修正含む） | 17.2 | 8.8 |

## 課題別

各セルは反復ごとの合格基準数（5点満点）。

| 課題 | なし | あり |
|---|---|---|
| ADRの判断と作業追跡の分離 | 3, 2 | 4, 4 |
| Design Docの構成・失敗条件・代替案 | 2, 2 | 5, 4 |
| 進捗報告で追跡情報を保持 | 5, 5 | 5, 5 |
| 障害記録の時系列と仮説 | 5, 4 | 5, 5 |
| 資料不足の手順を完成扱いしない | 5, 5 | 4, 4 |
| 既存文書の一文だけ修正 | 5, 5 | 5, 4 |
| 正本で済む依頼 | 5, 5 | 5, 4 |
| 文書を作る必要性の判断 | 4, 3 | 4, 5 |
| RFCで比較と未決定を保つ | 3, 1 | 4, 5 |
| 曖昧な表現を根拠に沿って具体化 | 5, 5 | 5, 5 |

## 判定根拠と出力

- ADRの判断と作業追跡の分離: [評価1](judgments/adr-boundary.1.json)、[評価2](judgments/adr-boundary.2.json)。[without_skill](records/adr-boundary.1.without_skill.json)、[with_skill](records/adr-boundary.1.with_skill.json)。
- Design Docの構成・失敗条件・代替案: [評価1](judgments/design-tradeoff.1.json)、[評価2](judgments/design-tradeoff.2.json)。[without_skill](records/design-tradeoff.1.without_skill.json)、[with_skill](records/design-tradeoff.1.with_skill.json)。
- 進捗報告で追跡情報を保持: [評価1](judgments/progress-retention.1.json)、[評価2](judgments/progress-retention.2.json)。[without_skill](records/progress-retention.1.without_skill.json)、[with_skill](records/progress-retention.1.with_skill.json)。
- 障害記録の時系列と仮説: [評価1](judgments/incident-record.1.json)、[評価2](judgments/incident-record.2.json)。[without_skill](records/incident-record.1.without_skill.json)、[with_skill](records/incident-record.1.with_skill.json)。
- 資料不足の手順を完成扱いしない: [評価1](judgments/runbook-missing.1.json)、[評価2](judgments/runbook-missing.2.json)。[without_skill](records/runbook-missing.1.without_skill.json)、[with_skill](records/runbook-missing.1.with_skill.json)。
- 既存文書の一文だけ修正: [評価1](judgments/surgical-edit.1.json)、[評価2](judgments/surgical-edit.2.json)。[without_skill](records/surgical-edit.1.without_skill.json)、[with_skill](records/surgical-edit.1.with_skill.json)。
- 正本で済む依頼: [評価1](judgments/canonical-reference.1.json)、[評価2](judgments/canonical-reference.2.json)。[without_skill](records/canonical-reference.1.without_skill.json)、[with_skill](records/canonical-reference.1.with_skill.json)。
- 文書を作る必要性の判断: [評価1](judgments/no-document.1.json)、[評価2](judgments/no-document.2.json)。[without_skill](records/no-document.1.without_skill.json)、[with_skill](records/no-document.1.with_skill.json)。
- RFCで比較と未決定を保つ: [評価1](judgments/comparison-rfc.1.json)、[評価2](judgments/comparison-rfc.2.json)。[without_skill](records/comparison-rfc.1.without_skill.json)、[with_skill](records/comparison-rfc.1.with_skill.json)。
- 曖昧な表現を根拠に沿って具体化: [評価1](judgments/plain-japanese.1.json)、[評価2](judgments/plain-japanese.2.json)。[without_skill](records/plain-japanese.1.without_skill.json)、[with_skill](records/plain-japanese.1.with_skill.json)。

## 解釈の範囲

これはSKILL.mdと関連資料を明示的に付与する比較であり、スキルの自動発火、親子エージェントの委譲、意味確認からの修正、モデル昇格は測っていない。両条件に同じlintフィードバックを最大1回返すため、スキル一式と通常運用の比較でもない。意味基準は最終稿だけを採点する。

判定は条件名を伏せ、A/Bの位置を均衡化した単一LLMによるもの。人間の盲検評価ではなく、採点の誤りと同系モデルの傾向が残る。課題は作成者がPRの狙いから選んだ10種で、うちADR・進捗・不足手順・部分修正は既存の動作確認を別の題材にした。独立したホールドアウトや40種全体の代表標本ではない。反復数は課題ごとの揺れを観測するもので、基準数を独立標本として扱わない。有意差・一般的な優位・金額の削減率は主張しない。

文字数だけでは品質を判定しない。トークンはCLI報告の実測値で、入力はcacheを含む。時間は並列実行・接続・cacheの影響を含む。評価モデルの利用量はsummary.jsonのjudgeUsageに別計上する。
