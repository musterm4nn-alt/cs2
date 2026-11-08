# CS2 layout battles: results record

Battles where AI models design a repeatable Cities: Skylines II district tile with the prompt in
[PROMPT.md](PROMPT.md). Every result here was checked with the **same frozen tool: v3.0.0** (rules, data,
validator and scoring). Rounds 1–4 were test rounds while the tool was being built and are not recorded.

## How a battle is decided

Each layout gets a scorecard from the validator. Two layouts are compared row by row; the first difference decides:

1. fewer errors
2. fewer warnings
3. higher zoned share of the 200 × 200 tile (whole %)
4. higher average coverage of fire, police, health, education, parks and telecom (whole %)
5. lower upkeep per zoned cell (whole ₡)

Edge cases:

- A side that produced no layout (no page, or a page that never runs the validator) **loses**.
- If neither side produced a layout, the battle is recorded as **no result** and doesn't count.
- Equal on all five rows is a **draw**.
- "Catalog files read" (from the END OF FILE markers) is shown for context; it doesn't affect the result.
- Model names are recorded exactly as Arena reveals them. Effort levels (-high, -xhigh, -max) and codenames are
  separate entries, as on Arena's own leaderboard.

## Leaderboard (Code Arena)

Sorted by wins, then win rate, then average zoned share of valid layouts.

| Model | Battles | Wins | Losses | Draws | Valid layouts | Avg zoned share (valid) |
|---|---|---|---|---|---|---|

## Battles (Code Arena)

Score columns: errors / warnings / zoned share / core coverage / ₡ per zoned cell. "Read" = catalog files confirmed
read completely (of 20). "Decided by" = the scorecard row that decided the battle.

| Round | Battle | Model A | Score A | Read A | Model B | Score B | Read B | Winner | Decided by |
|---|---|---|---|---|---|---|---|---|---|

## Runs outside Arena

Other harnesses (e.g. Claude Code, Codex) can download the full data and run the validator themselves, so these
results are kept separate and are not compared with Arena battles.

| Date | Harness | Model | Score | Read | Notes |
|---|---|---|---|---|---|
