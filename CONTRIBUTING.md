# Contributing to Canva Clone

Thank you for your interest in contributing! This project is a community-driven, open-source foundation for building graphic design tools. Every contribution — whether it's a bug fix, new feature, documentation improvement, or translation — is welcome and appreciated.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Branch & Commit Conventions](#branch--commit-conventions)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Style Guide](#style-guide)
- [License](#license)

---

## Code of Conduct

By participating in this project, you agree to be respectful, inclusive, and constructive. Harassment or dismissive behavior of any kind will not be tolerated. Please treat everyone as a collaborator, not a competitor.

---

## Getting Started

Before diving in, take a few minutes to:

1. Read the [README](./README.md) to understand what this project is and what it is not.
2. Browse the [open issues](../../issues) to see what is already being worked on.
3. Check the [project documentation](https://www.canvaclone.com/docs) for architecture context.

---

## Project Structure

This is an [Nx](https://nx.dev/) monorepo managed with [pnpm](https://pnpm.io/) workspaces.

```
canva-clone/
├── apps/
│   ├── canva-web/        # Next.js frontend (main user-facing app)
│   ├── canva-admin/      # Strapi-based admin/CMS backend
│   ├── mock-api/         # Express mock API for local development
│   ├── canva-web-e2e/    # Playwright end-to-end tests
│   └── i18n/             # Internationalisation string management
└── libs/
    └── canva-editor/     # Core React canvas editor library
```

---

## Development Setup

### Prerequisites

| Tool       | Version  |
|------------|----------|
| Node.js    | 20.x     |
| pnpm       | latest   |
| PostgreSQL | 15+      |

### Installation

```bash
# 1. Fork & clone the repo
git clone https://github.com/kenvinlu/canva-editor.git
cd canva-clone

# 2. Install dependencies
pnpm install

# 3. Copy and configure environment variables
cp apps/canva-web/.env.example apps/canva-web/.env
# Edit the file and fill in your DB connection, auth secrets, etc.
```

### Running the apps

| Command                   | What it does                             |
|---------------------------|------------------------------------------|
| `make web_up`             | Start the Next.js frontend (dev mode)    |
| `make admin_up`           | Start the Strapi admin backend           |
| `make mock_up`            | Start the mock Express API               |
| `make editor_up`          | Start the canvas editor in watch mode    |
| `make build_editor`       | Build the `canva-editor` library         |
| `make build_web`          | Production build of the frontend         |
| `make gen_i18n`           | Regenerate all i18n string files         |

### Database (local)

```bash
# Create a local database
make create_db DB_NAME=canva_dev

# Restore sample data from the included dump
make restore_db_local DB_NAME=canva_dev

# Seed default users
make create_default_data DB_NAME=canva_dev
```

---

## How to Contribute

### Good first contributions

Looking for somewhere to start? Look for issues labelled:

- `good first issue` — approachable tasks suitable for newcomers
- `help wanted` — tasks where maintainers would especially welcome outside help
- `documentation` — docs improvements that don't require deep codebase knowledge

### Picking up an issue

1. Comment on the issue to let others know you are working on it.
2. Wait for a maintainer to assign it to you (or self-assign if the repo permissions allow).
3. Create a branch from `main` following the naming convention below.

### Submitting new work

If you want to work on something that does not have an open issue yet, **open an issue first** and describe what you plan to do. This avoids duplicate effort and lets maintainers give early feedback on approach.

---

## Branch & Commit Conventions

### Branch names

```
feat/<short-description>        # new feature
fix/<short-description>         # bug fix
docs/<short-description>        # documentation
refactor/<short-description>    # code refactoring without behaviour change
test/<short-description>        # adding or fixing tests
chore/<short-description>       # tooling, CI, dependency updates
```

### Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short imperative summary>

[optional body]

[optional footer: closes #123]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Scopes (examples):** `editor`, `canva-web`, `admin`, `i18n`, `mock-api`, `deps`

```bash
# Good examples
feat(editor): add text shadow support to text layers
fix(canva-web): correct template thumbnail aspect ratio
docs: add database restore instructions to README
chore(deps): upgrade Next.js to 16.x
```

---

## Pull Request Guidelines

1. **Keep PRs focused.** One logical change per PR. If you find unrelated bugs while working, open a separate issue or PR.
2. **Fill in the PR template** (created automatically when you open a PR).
3. **Link the related issue** using `Closes #<issue-number>` in the PR description.
4. **Ensure all checks pass** — lint, type-check, and any unit tests must be green before requesting review.
5. **Add tests** for any new behaviour you introduce, where practical.
6. **Screenshots or recordings** are very helpful for UI changes.
7. **Keep commits clean.** Squash work-in-progress commits before marking the PR as ready for review.

### Running checks locally before pushing

```bash
# Lint
pnpm nx run-many --target=lint

# Type-check
pnpm nx run-many --target=typecheck

# Unit tests
pnpm nx run-many --target=test
```

---

## Reporting Bugs

Please [open an issue](../../issues/new?template=bug_report.md) and include:

- A clear, descriptive title.
- Steps to reproduce the problem.
- Expected vs actual behaviour.
- Browser / OS / Node version.
- Relevant screenshots, console errors, or network logs.

---

## Requesting Features

[Open a feature request issue](../../issues/new?template=feature_request.md) and describe:

- The problem you are trying to solve.
- Your proposed solution or API.
- Any alternatives you considered.
- Why this belongs in the core project vs a fork or plugin.

---

## Style Guide

- **Language:** TypeScript everywhere. Avoid `any`; use proper types.
- **Formatting:** [Prettier](https://prettier.io/) is configured at the repo root. Run `pnpm prettier --write .` before committing.
- **Linting:** ESLint with the repo config. Fix all errors; warnings should be minimised.
- **Styling:** Tailwind CSS for the web app; styled-components inside `canva-editor`.
- **State management:** Zustand for client state. Keep store slices focused and small.
- **No commented-out code** in committed changes.
- **No console.log** left in production paths.

---

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](./LICENSE.md) that covers this project.
