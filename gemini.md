# Gemini Assistant Guidelines

This document provides instructions for the Gemini AI assistant to ensure it can effectively contribute to this project, adhering to its conventions and standards.

## 1. Project Overview

- **Goal:** To build a catalog of domains and their associated services.
- **Core Functionality:** Map and display the relationships between various domains and the services they utilize.

## 2. Tech Stack

- **Framework:** Angular
- **Workspace Management:** Nx
- **Package Manager:** npm

## 3. Project Structure

- `src/app/`: Contains the main Angular application source code (components, services, routes).
  - Pages related to domains should be located in a `domains` folder within `src/app/`.
  - Pages related to services should be located in a `services` folder within `src/app/`.
- `e2e/`: Contains the Playwright end-to-end tests.
- `public/`: Static assets, such as `favicon.ico`.
- `project.json`: Nx project configuration for the main application.
- `e2e/project.json`: Nx project configuration for the e2e tests.

## 4. Development Workflow

Use `npx` to execute all `nx` commands.

- **Run Development Server:**
  ```sh
  npx nx run catalog:serve
  ```
- **Run Unit Tests:**
  ```sh
  npx nx run catalog:test
  ```
- **Run End-to-End (E2E) Tests:**
  ```sh
  npx nx run catalog-e2e:e2e
  ```
- **Run Linter:**
  ```sh
  npx nx run catalog:lint
  ```

## 5. Code Style and Conventions

- **Formatting:** This project uses Prettier for automated code formatting. All code should be formatted before committing.
- **Linting:** This project uses ESLint for code quality and style checking. Adhere to the rules defined in `eslint.config.mjs`.
- **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps maintain a clear and automated version history.
  - **Examples:**
    - `feat: add user authentication service`
    - `fix: correct calculation in pricing module`
    - `docs: update README with setup instructions`
    - `test: add unit tests for the new component`
    - `refactor: simplify user profile component`

## 6. AI Assistant Guidelines

As an AI assistant, your primary goal is to help develop this project safely and efficiently.

- **Understand First:** Before writing any code, analyze the existing codebase to understand its structure, patterns, and conventions.
- **Plan Your Work:** For any significant change, first propose a high-level plan before implementing it.
- **Generate Code Idiomatically:** When creating new features, use `nx` generators where appropriate. For example, to create a new component:
  ```sh
  npx nx generate @nx/angular:component my-new-component --project=catalog
  ```
- **Testing:**
  - Only write tests when explicitly requested by the user.
  - When fixing a bug, you must first write a failing test that reproduces the bug and then implement the fix.
- **Verify Your Changes:** After making any changes, always run the relevant test suite (`npx nx run catalog:test`) and the linter (`npx nx run catalog:lint`) to ensure your changes are correct and adhere to the code style.
- **Be Secure:** Always consider security best practices. Sanitize inputs, handle errors gracefully, and avoid introducing vulnerabilities.
- **Ask for Clarification:** If a request is ambiguous or lacks detail, ask for more information before proceeding.
