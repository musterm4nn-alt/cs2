# CS2 layout battles: results record

Battles where AI models design a repeatable Cities: Skylines II district tile with the prompt in
[PROMPT.md](PROMPT.md). Rounds 1–4 were test rounds while the tool was being built and are not recorded.

The record has one section per frozen tool version, because a new version can change who wins. Results are never
moved between sections.

| Section | Tool | Rounds | Decided by |
|---|---|---|---|
| [v3.3.0](#v330-record-from-round-7) (current) | v3.3.0 | from 7 | fewer errors, then more points out of 100 |
| [v3.2.0](#v320-record-rounds-56) | v3.2.0 | 5–6 | five-row scorecard (errors, warnings, zoned share, coverage, upkeep) |

## Rules for every section

- A side that produced no layout (no page, or a page that never runs the validator) **loses**.
- If neither side produced a layout, the battle is recorded as **no result** and doesn't count.
- "Catalog files read" (from the END OF FILE markers) is shown for context and doesn't count by itself. The one
  exception: RULES.md requires every `zones-roads` catalog file, so a layout that doesn't confirm reading all of them
  gets a validator warning, and that warning counts like any other warning.
- Model names are recorded exactly as Arena reveals them. Effort levels (-high, -xhigh, -max) and codenames are
  separate entries, as on Arena's own leaderboard.

## v3.3.0 record (from round 7)

A battle is decided by **fewer errors**, then **more points out of 100**: capacity 25, balance 15, services 25,
traffic 20, cost 15, −3 per warning (details in the README and in every validator report). An exact tie falls back
to warnings, zoned share, coverage and upkeep per zoned cell; equal on all of those is a **draw**.

### Leaderboard (v3.3.0)

Sorted by wins, then win rate, then average points of valid layouts.

| Model | Battles | Wins | Losses | Draws | Valid layouts | Avg points (valid) |
|---|---|---|---|---|---|---|

### Battles (v3.3.0)

"Read" = catalog files confirmed read completely (of 21).

| Round | Battle | Model A | Errors A | Points A | Read A | Model B | Errors B | Points B | Read B | Winner | Decided by |
|---|---|---|---|---|---|---|---|---|---|---|---|

## v3.2.0 record (rounds 5–6)

A battle was decided by a five-row scorecard; the first difference decided: 1. fewer errors, 2. fewer warnings,
3. higher zoned share, 4. higher core service coverage, 5. lower upkeep per zoned cell. Equal on all five was a draw.

### Leaderboard (v3.2.0)

Sorted by wins, then win rate, then average zoned share of valid layouts.

| Model | Battles | Wins | Losses | Draws | Valid layouts | Avg zoned share (valid) |
|---|---|---|---|---|---|---|
| deepseek-v4.1-flash-max | 2 | 2 | 0 | 0 | 1 | 38% |
| claude-opus-5.5-low | 1 | 1 | 0 | 0 | 1 | 79% |
| claude-opus-5.5-high | 1 | 1 | 0 | 0 | 1 | 75% |
| claude-fable-5.1-max | 1 | 1 | 0 | 0 | 1 | 73% |
| mistral-large-4-high | 1 | 1 | 0 | 0 | 1 | 66% |
| gpt-6.1-terra-max | 1 | 1 | 0 | 0 | 1 | 65% |
| gemini-3.8-flash | 2 | 1 | 1 | 0 | 2 | 65% |
| muse-spark-1.3-xhigh | 1 | 0 | 1 | 0 | 1 | 26% |
| gpt-6-luna-max | 2 | 0 | 2 | 0 | 2 | 25% |
| kimi-k3.1-pro-max | 1 | 0 | 1 | 0 | 0 | – |
| minimax-m3-1-flash | 1 | 0 | 1 | 0 | 0 | – |
| qwen3.8-max-0902 | 1 | 0 | 1 | 0 | 0 | – |
| step-5-preview | 1 | 0 | 1 | 0 | 0 | – |

### Battles (v3.2.0)

Score columns: errors / warnings / zoned share / core coverage / ₡ per zoned cell. "Read" = catalog files confirmed
read completely (of 20 in v3.0.0, of 21 in v3.2.0). "Decided by" = the scorecard row that decided the battle.

| Round | Battle | Model A | Score A | Read A | Model B | Score B | Read B | Winner | Decided by |
|---|---|---|---|---|---|---|---|---|---|
| 5¹ | 05-01 | gemini-3.8-flash | 0 / 0 / 64% / 100% / ₡30 | 13 | step-5-preview | no layout | – | **gemini-3.8-flash** | no output |
| 5¹ | 05-02 | muse-spark-1.3-xhigh | 0 / 0 / 26% / 100% / ₡42 | 12 | deepseek-v4.1-flash-max | 0 / 0 / 38% / 100% / ₡61 | 12 | **deepseek-v4.1-flash-max** | zoned share |
| 5¹ | 05-03 | kimi-k3.1-pro-max | 6 / 0 / 57% / 100% / ₡26 | 9 | claude-opus-5.5-low | 0 / 0 / 79% / 83% / ₡13 | 6 | **claude-opus-5.5-low** | errors |
| 5¹ | 05-04 | deepseek-v4.1-flash-max | 1 / 0 / 24% / 97% / ₡88 | 10 | qwen3.8-max-0902 | no layout | – | **deepseek-v4.1-flash-max** | no output |
| 6 | 06-01 | gpt-6-luna-max | 0 / 0 / 21% / 83% / ₡25 | 8 | claude-fable-5.1-max | 0 / 0 / 73% / 100% / ₡22 | 14 | **claude-fable-5.1-max** | zoned share |
| 6 | 06-02 | gemini-3.8-flash | 0 / 1 / 65% / 100% / ₡37 | 14 | gpt-6.1-terra-max | 0 / 0 / 65% / 100% / ₡26 | 12 | **gpt-6.1-terra-max** | warnings² |
| 6 | 06-03 | mistral-large-4-high | 0 / 0 / 66% / 100% / ₡6 | 12 | gpt-6-luna-max | 0 / 0 / 29% / 100% / ₡36 | 11 | **mistral-large-4-high** | zoned share |
| 6 | 06-04 | minimax-m3-1-flash | 1 / 0 / 42% / 83% / ₡63 | 11 | claude-opus-5.5-high | 0 / 0 / 75% / 100% / ₡24 | 9 | **claude-opus-5.5-high** | errors |

¹ Round 5 ran on v3.0.0 (the prompt linked v3.0.0). All layouts were re-checked under the v3.2.0 rules: no layout
breaks the density rule added in v3.1/v3.2, so scorecards and winners are identical. The only difference is that these
models saw the catalog without the zone density column.

² 06-02-A's only warning is that it didn't read catalog/zones-roads-3.md (required reading, so it counts). Without
that warning B would still win, on row 5 (upkeep per zoned cell, ₡26 vs ₡37).

### Rounds 5–6 re-scored under v3.3.0 (reference only)

How these battles would have gone with the v3.3.0 points score. The official results above stay as recorded.
Round 5's catalog-marker warnings are ignored here (they came from the older v3.0.0 catalog).

| Battle | A | B | v3.2.0 winner | v3.3.0 winner |
|---|---|---|---|---|
| 05-01 | gemini-3.8-flash: 0 errors, 91.7 pts | step-5-preview: no layout | gemini-3.8-flash | gemini-3.8-flash |
| 05-02 | muse-spark-1.3-xhigh: 0 errors, 63.4 pts | deepseek-v4.1-flash-max: 0 errors, 67.0 pts | deepseek-v4.1-flash-max | deepseek-v4.1-flash-max |
| 05-03 | kimi-k3.1-pro-max: 6 errors, 81.6 pts | claude-opus-5.5-low: 0 errors, 83.1 pts | claude-opus-5.5-low | claude-opus-5.5-low |
| 05-04 | deepseek-v4.1-flash-max: 1 error, 69.4 pts | qwen3.8-max-0902: no layout | deepseek-v4.1-flash-max | deepseek-v4.1-flash-max |
| 06-01 | gpt-6-luna-max: 0 errors, 72.5 pts | claude-fable-5.1-max: 0 errors, 89.0 pts | claude-fable-5.1-max | claude-fable-5.1-max |
| 06-02 | gemini-3.8-flash: 0 errors, 1 warning, 86.1 pts | gpt-6.1-terra-max: 0 errors, 88.6 pts | gpt-6.1-terra-max | gpt-6.1-terra-max |
| 06-03 | mistral-large-4-high: 0 errors, 57.6 pts | gpt-6-luna-max: 0 errors, 80.1 pts | mistral-large-4-high | **gpt-6-luna-max** |
| 06-04 | minimax-m3-1-flash: 1 error, 61.6 pts | claude-opus-5.5-high: 0 errors, 87.2 pts | claude-opus-5.5-high | claude-opus-5.5-high |

06-03 flips: mistral-large-4-high zoned 66% but fed 119,000 households with only 15,000 jobs and minimal services
(balance 0/15); gpt-6-luna-max zoned 29% with a balanced, well-served tile.

## Runs outside Arena

Other harnesses (e.g. Claude Code, Codex) can download the full data and run the validator themselves, so these
results are kept separate and are not compared with Arena battles.

| Date | Harness | Model | Score | Read | Notes |
|---|---|---|---|---|---|
