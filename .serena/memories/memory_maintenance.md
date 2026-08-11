# Memory Maintenance

## Discovery Model

- Core principle: progressive discovery through references, building a graph of memories.
- Initially, agents are provided with the list of all memories (names only).
- Agents should read `mem:core` as the top-level entry point (graph root).
- Memory references must use a mem: prefix inside backticks, e.g. `mem:tech_stack`.
- Folders can mirror project structure or topics.

## Style

Dense agent notes, not prose docs. Prefer invariants, terse bullets.
Avoid obvious context, rationale, and examples unless they prevent likely mistakes.
Keep guidance durable and generalizable, not task-local.

## Add/update threshold

Add or update memories only with stable, non-obvious project conventions.
Do not add: quick-read facts; generic language knowledge; one-off task notes; volatile line-level details.

## Maintenance Actions

- Renaming memories: use Serena's rename tool so references update.
- Checking stale memories: `serena memories check` from project root.
