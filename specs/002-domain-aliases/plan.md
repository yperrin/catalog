# Implementation Plan: Domain Aliases

**Branch**: `002-domain-aliases` | **Date**: 2025-11-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-domain-aliases/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Extend the existing domain data flow system to capture and display service-specific aliases for domains. Currently, domains like "Commercial Items" flow through multiple services, but each service may refer to the domain by multiple different names (e.g., JPharm calls it "References" or "Citations"). This feature will enhance the JSON data model to include an array of alias mappings within the data flow files, update Angular components to display these aliases in both domain and service views, and enhance the D3.js visualization to show alias annotations on service nodes.

## Technical Context

**Language/Version**: TypeScript 5.9.2 with Angular 20.3.0  
**Primary Dependencies**: Angular 20.3.0, RxJS 7.8.0, D3.js 7.9.0 (for data flow visualization), Analog.js Vite Plugin  
**Storage**: JSON files in `/src/assets/` (e.g., `commercial-items-data-flow.json`, `domains.json`, `services.json`)  
**Testing**: Vitest with @analogjs/vitest-angular, Playwright for E2E  
**Target Platform**: Web (SPA using Angular with Vite)  
**Project Type**: Web - Angular single-page application  
**Performance Goals**: Graph rendering <500ms for typical domain flows (5-15 nodes), UI updates <100ms  
**Constraints**: Must maintain backward compatibility with existing JSON structure, no breaking changes to current domain/service data model  
**Scale/Scope**: ~5-10 domains initially, ~20-30 services, expect 50+ services long-term

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Clear Visual Representation**: ✅ **PASS** - The plan enhances the existing graph-based visualization by adding alias annotations to service nodes in the D3.js data flow diagram. The domain and service list views will clearly display alias information alongside primary names, improving understanding of naming conventions across the system.

- **II. Bidirectional Traceability**: ✅ **PASS** - The alias data will be embedded in the existing data flow JSON files (e.g., `commercial-items-data-flow.json`), maintaining the bidirectional relationship structure. Users can trace from domain → services (with aliases displayed) and from service → domains (showing what the service calls each domain).

- **III. Data Integrity and Uniqueness**: ✅ **PASS** - The design preserves domain uniqueness by maintaining the primary domain name as the canonical identifier. Aliases are stored as service-specific metadata, preventing confusion between actual domains and their alternative names. The JSON schema will enforce the distinction between primary names and aliases.

- **IV. Architectural Insight**: ✅ **PASS** - By exposing service-specific naming conventions, this feature reveals implicit semantic mappings and integration patterns. It provides critical insight into which services use standard vs. custom terminology, helping identify areas for standardization and clarifying the impact of domain changes across heterogeneous service landscapes.

- **V. Extensibility and Modularity**: ✅ **PASS** - The alias mechanism is implemented as an extension to the existing JSON data structure without breaking changes. The node objects in data flow files will be enhanced with an optional `alias` field. This modular approach allows future extensions (e.g., versioned aliases, transformation rules) without disrupting the current architecture.

**Result**: All constitutional principles satisfied. No violations requiring complexity justification.

---

## Phase 1 Design Re-evaluation

After completing the design phase (research.md, data-model.md, contracts/, quickstart.md), re-evaluating constitutional alignment:

- **I. Clear Visual Representation**: ✅ **CONFIRMED** - The design includes specific UI patterns for displaying aliases:
  - Domain list: Shows alias count and preview tags
  - D3 visualization: Secondary text labels on nodes
  - Service view: Formatted "Domain (known as: Alias)" display
  - All approaches maintain graph clarity while adding semantic information

- **II. Bidirectional Traceability**: ✅ **CONFIRMED** - The data model preserves bidirectional relationships:
  - Domain → Services with aliases: Via data flow JSON files
  - Service → Domains with aliases: Computed by scanning all data flows
  - Both views implemented in service layer contracts
  - No degradation of existing traceability

- **III. Data Integrity and Uniqueness**: ✅ **CONFIRMED** - The design enforces integrity through:
  - JSON Schema validation for data structure
  - TypeScript type guards for runtime safety
  - Cross-file referential integrity validation
  - Optional fields prevent forced redundancy
  - Primary domain name remains canonical identifier

- **IV. Architectural Insight**: ✅ **CONFIRMED** - The implementation enhances architectural understanding:
  - Aliases expose semantic mapping patterns at integration boundaries
  - Visualization shows where naming diverges from standards
  - Service-centric view reveals terminology consistency
  - Data model documentation includes architectural implications

- **V. Extensibility and Modularity**: ✅ **CONFIRMED** - The design maintains modularity:
  - Optional alias field allows incremental adoption
  - No breaking changes to existing data or code
  - Utility functions provide reusable logic
  - Service interface contracts enable future enhancements
  - JSON schema versioning supports evolution

**Post-Design Conclusion**: All constitutional principles remain satisfied. The detailed design validates the initial constitution check. No violations introduced during design phase.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application with Angular
src/
├── app/
│   ├── domains/
│   │   ├── shared/
│   │   │   ├── models/
│   │   │   │   ├── domain.model.ts          # [MODIFY] Add alias type definitions
│   │   │   │   └── service.model.ts         # [MODIFY] Add service-domain alias mappings
│   │   │   └── services/
│   │   │       ├── data-flow.service.ts     # [MODIFY] Parse alias data from JSON
│   │   │       └── domain.service.ts        # [MODIFY] Expose alias information
│   │   └── domains/
│   │       ├── domain-flow/
│   │       │   ├── domain-flow.ts          # [MODIFY] Display aliases in D3 visualization
│   │       │   ├── domain-flow.html        # [MODIFY] Add alias display in template
│   │       │   └── domain-flow.css         # [MODIFY] Style alias annotations
│   │       └── domain-list/
│   │           ├── domain-list.ts          # [MODIFY] Show alias summary per domain
│   │           └── domain-list.html        # [MODIFY] Template updates for aliases
│   └── services/
│       └── services/
│           └── service-view/
│               ├── service-view.ts         # [MODIFY] Display domain aliases used by service
│               └── service-view.html       # [MODIFY] Template for alias display
└── assets/
    ├── commercial-items-data-flow.json     # [MODIFY] Add alias field to nodes
    ├── deals-data-flow.json                # [MODIFY] Add alias field to nodes
    ├── domains.json                        # [NO CHANGE] Remains unchanged
    └── services.json                       # [NO CHANGE] Remains unchanged

tests/
└── # Component tests for alias display functionality
```

**Structure Decision**: Web application structure with Angular. The alias feature is implemented as an enhancement to the existing data flow JSON files by adding an optional `aliases` field (array of strings) to node objects. Angular components in the `domains/` and `services/` folders will be updated to display alias information. No new files are required; all changes are modifications to existing components, services, and data files.


