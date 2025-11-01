# Research: Graph Visualization Library

**Date**: 2025-11-01

## Decision

We will use **d3.js** for rendering the data flow diagrams.

## Rationale

- **Power and Flexibility**: d3.js is a powerful and highly flexible library that can be used to create any kind of data visualization, including the process diagrams we need.
- **Community and Support**: It has a large and active community, which means there are plenty of resources, examples, and support available.
- **Integration with Angular**: While it's not a native Angular library, d3.js can be easily integrated into an Angular application.

## Alternatives Considered

- **mermaid.js**: A good library for creating diagrams from text. However, it might not offer the same level of customization and interactivity as d3.js.
- **ng-graph**: An Angular-specific graph visualization library. While it would be easier to integrate, it might not be as powerful or flexible as d3.js.
