# Agent routing

Index of the specialized agents (`.agents/`): **which agent for which job**, and how to delegate.

## 1. Routing table

| Work                                                                      | Agent                                                          |
| ------------------------------------------------------------------------- | -------------------------------------------------------------- |
| React component, page, hook or styling: any TSX                           | `react-feature-builder` ([rules](../react-feature-builder.md)) |
| Vague idea, feature to scope, issue without acceptance criteria           | `product` ([rules](../product.md))                             |
| Structural technical choice, module boundaries, ADRs                      | `architect` ([rules](../architect.md))                         |
| Endpoint, business logic, data access, migration: non-UI application code | `dev` ([rules](../dev.md))                                     |
| Tests to write (TDD, failing test before a fix, e2e)                      | `qa` ([rules](../qa.md))                                       |
| README, guides, changelog, documentation of a shipped feature             | `docs` ([rules](../docs.md))                                   |
| Review of a branch before merge                                           | `reviewer` ([rules](../reviewer.md))                           |
| Bug, red CI, unexpected behavior                                          | `debugger` ([rules](../debugger.md))                           |
| Multi-part task to plan, sprint, end of session (memory)                  | `lead` ([rules](../lead.md))                                   |

A task spanning several rows is split: one agent per part, the contract (API, types) finished first and handed to the next ones.

## 2. When not to delegate

Inline candidates: documentation, configuration, CI, issue upkeep, or a few-line fix whose cause is already established. Even then, the main session **asks the user before editing files itself** (see "Delegation" in `AGENTS.md`). Anything that creates a component, a page, an endpoint or a migration goes through the relevant agent.

## 3. Mandatory content of a delegation prompt

- The working directory, and the instruction "do not commit or push" (the main session keeps control of git).
- What has already been read: files, contracts, existing components to reuse.
- The acceptance criteria of the issue.
- The applicable rules from `.agents/rules/`, **restated**: a subagent does not inherit them.
- The checks to run before reporting back.

## 4. After the report

The report is a claim, not a verification. The main session **reviews the diff**, reruns the checks, sends back anything that breaks the rules, then commits.
