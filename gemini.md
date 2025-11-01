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

### Angular Style Guide

Follow the instructions at the end of the file

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

# Angular

Angular — Deliver web apps with confidence 🚀

## Table of Contents

- [What is Angular](https://angular.dev/overview)
- [Installation guide](https://angular.dev/installation)
- [Style Guide](https://next.angular.dev/style-guide)

## Components

- [What is a component](https://angular.dev/guide/components)
- [Component selectors](https://angular.dev/guide/components/selectors)
- [Styling components](https://angular.dev/guide/components/styling)
- [Accepting data with input properties](https://angular.dev/guide/components/inputs)
- [Custom events with output](https://angular.dev/guide/components/outputs)
- [Content projection](https://angular.dev/guide/components/content-projection)
- [Component lifecycle](https://angular.dev/guide/components/lifecycle)

## Templates guides

- [Template Overview](https://angular.dev/guide/templates)
- [Adding event listeners](https://angular.dev/guide/templates/event-listeners)
- [Binding text, properties and attributes](https://angular.dev/guide/templates/binding)
- [Control Flow](https://angular.dev/guide/templates/control-flow)
- [Template variable declaration](https://angular.dev/guide/templates/variables)
- [Deferred loading of components](https://angular.dev/guide/templates/defer) 
- [Expression syntax](https://angular.dev/guide/templates/expression-syntax)

## Directives

- [Directives overview](https://angular.dev/guide/directives)
- [Attribute directives](https://angular.dev/guide/directives/attribute-directives)
- [Structural directives](https://angular.dev/guide/directives/structural-directives)
- [Directive composition](https://angular.dev/guide/directives/directive-composition-api)
- [Optimizing images](https://angular.dev/guide/image-optimization)

## Signals 

- [Signals overview](https://angular.dev/guide/signals)
- [Dependent state with linkedSignal](https://angular.dev/guide/signals/linked-signal)
- [Async reactivity with resources](https://angular.dev/guide/signals/resource)

## Dependency injection (DI)

- [Dependency Injection overview](https://angular.dev/guide/di)
- [Understanding Dependency injection](https://angular.dev/guide/di/dependency-injection)
- [Creating an injectable service](https://angular.dev/guide/di/creating-injectable-service)
- [Configuring dependency providers](https://angular.dev/guide/di/dependency-injection-providers)
- [Injection context](https://angular.dev/guide/di/dependency-injection-context)
- [Hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection)
- [Optimizing Injection tokens](https://angular.dev/guide/di/lightweight-injection-tokens)

## RxJS 

- [RxJS interop with Angular signals](https://angular.dev/ecosystem/rxjs-interop)
- [Component output interop](https://angular.dev/ecosystem/rxjs-interop/output-interop)

## Loading Data

- [HttpClient overview](https://angular.dev/guide/http)
- [Setting up the HttpClient](https://angular.dev/guide/http/setup)
- [Making requests](https://angular.dev/guide/http/making-requests)
- [Intercepting requests](https://angular.dev/guide/http/interceptors)
- [Testing](https://angular.dev/guide/http/testing)

## Forms
- [Forms overview](https://angular.dev/guide/forms)
- [Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Strictly types forms](https://angular.dev/guide/forms/typed-forms)
- [Template driven forms](https://angular.dev/guide/forms/template-driven-forms)
- [Validate forms input](https://angular.dev/guide/forms/form-validation)
- [Building dynamic forms](https://angular.dev/guide/forms/dynamic-forms)

## Routing
- [Routing overview](https://angular.dev/guide/routing)
- [Define routes](https://angular.dev/guide/routing/define-routes)
- [Show routes with outlets](https://angular.dev/guide/routing/show-routes-with-outlets)
- [Navigate to routes](https://angular.dev/guide/routing/navigate-to-routes)
- [Read route state](https://angular.dev/guide/routing/read-route-state)
- [Common routing tasks](https://angular.dev/guide/routing/common-router-tasks)
- [Creating custom route matches](https://angular.dev/guide/routing/routing-with-urlmatcher)

## Server Side Rendering (SSR)

- [SSR Overview](https://angular.dev/guide/performance)
- [SSR with Angular](https://angular.dev/guide/ssr)
- [Build-time prerendering (SSG)](https://angular.dev/guide/prerendering)
- [Hybrid rendering with server routing](https://angular.dev/guide/hybrid-rendering)
- [Hydration](https://angular.dev/guide/hydration)
- [Incremental Hydration](https://angular.dev/guide/incremental-hydration)

# CLI 
[Angular CLI Overview](https://angular.dev/tools/cli)

## Testing

- [Testing overview](https://angular.dev/guide/testing)
- [Testing coverage](https://angular.dev/guide/testing/code-coverage)
- [Testing services](https://angular.dev/guide/testing/services)
- [Basics of component testing](https://angular.dev/guide/testing/components-basics)
- [Component testing scenarios](https://angular.dev/guide/testing/components-scenarios)
- [Testing attribute directives](https://angular.dev/guide/testing/attribute-directives)
- [Testing pipes](https://angular.dev/guide/testing/pipes)
- [Debugging tests](https://angular.dev/guide/testing/debugging)
- [Testing utility apis](https://angular.dev/guide/testing/utility-apis)
- [Component harness overview](https://angular.dev/guide/testing/component-harnesses-overview)
- [Using component harness in tests](https://angular.dev/guide/testing/using-component-harnesses)
- [Creating a component harness for your components](https://angular.dev/guide/testing/creating-component-harnesses)

## Animations
- [Animations your content](https://angular.dev/guide/animations/css)
- [Route transition animation](https://angular.dev/guide/routing/route-transition-animations)
- [Migrating to native CSS animations](https://next.angular.dev/guide/animations/migration)

## APIs
- [API reference](https://angular.dev/api)
- [CLI command reference](https://angular.dev/cli)


## Others

- [Zoneless](https://angular.dev/guide/zoneless)
- [Error encyclopedia](https://angular.dev/errors)
- [Extended diagnostics](https://angular.dev/extended-diagnostics)
- [Update guide](https://angular.dev/update-guide)
- [Contribute to Angular](https://github.com/angular/angular/blob/main/CONTRIBUTING.md)
- [Angular's Roadmap](https://angular.dev/roadmap)
- [Keeping your projects up-to-date](https://angular.dev/update)
- [Security](https://angular.dev/best-practices/security)
- [Internationalization (i18n)](https://angular.dev/guide/i18n)