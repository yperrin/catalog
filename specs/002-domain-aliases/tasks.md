# Tasks: Domain Aliases

**Input**: Design documents from `/specs/002-domain-aliases/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: NOT EXPLICITLY REQUESTED - No test tasks included per specification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**CRITICAL NOTE**: Only add alias fields to data flow JSON when the alias differs from the canonical domain name. Do not add redundant aliases.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

**Constitutional Alignment**: These tasks align with:
- **I. Clear Visual Representation**: Alias annotations enhance clarity
- **II. Bidirectional Traceability**: Aliases maintain domain-service relationships
- **III. Data Integrity and Uniqueness**: Primary domain names remain canonical
- **IV. Architectural Insight**: Aliases expose semantic mapping patterns
- **V. Extensibility and Modularity**: Optional alias field is backward compatible

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: TypeScript type definitions and utility functions

- [X] T001 [P] Update DataFlowNode interface with optional `aliases?: string[]` field in `src/app/domains/shared/models/domain.model.ts`
- [X] T002 [P] Add utility function `getPrimaryDisplayName(node, domainName)` in `src/app/domains/shared/models/domain.model.ts`
- [X] T003 [P] Add utility function `shouldDisplayAliases(node, domainName)` that returns true only when aliases differ from domain name in `src/app/domains/shared/models/domain.model.ts`
- [X] T004 [P] Add utility function `formatDomainWithAliases(domainName, aliases)` to format display string in `src/app/domains/shared/models/domain.model.ts`
- [X] T005 [P] Add type guard `hasAliases(node)` in `src/app/domains/shared/models/domain.model.ts`
- [X] T006 [P] Create ServiceAlias interface in `src/app/domains/shared/models/domain.model.ts`
- [X] T007 Verify TypeScript compilation succeeds with `npm run build`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core service layer enhancements that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Add `extractAliases(dataFlow)` utility function to extract all service-alias pairs from a domain's data flow in `src/app/domains/shared/models/domain.model.ts`
- [X] T009 Update DataFlowService with `getAliasesForDomain(filename)` method in `src/app/domains/shared/services/data-flow.service.ts`
- [X] T010 Update DataFlowService with `getServiceAlias(serviceName, filename)` method in `src/app/domains/shared/services/data-flow.service.ts`
- [X] T011 Update DomainService with `getDomainWithAliases(name)` method that combines domain and alias data in `src/app/domains/shared/services/domain.service.ts`
- [X] T012 Update DomainService with `getAliasesForDomain(domainName)` method in `src/app/domains/shared/services/domain.service.ts`
- [ ] T013 Run linting with `npm run lint` and fix any issues
- [ ] T014 Verify TypeScript compilation succeeds with `npm run build`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Domain with Service-Specific Aliases (Priority: P1) 🎯 MVP

**Goal**: Users can see all service-specific aliases for a domain, understanding that services use different terminology

**Independent Test**: View "Commercial Items" domain page and verify that JPharm's alias "References" is displayed, while services using the standard name show no redundant alias

### Data Enhancement for User Story 1

- [X] T015 [US1] Add `aliases: ["References"]` to JPharm node in `src/assets/commercial-items-data-flow.json` (ONLY because it differs from "Commercial Items")
- [X] T016 [US1] Review OCR node in `src/assets/commercial-items-data-flow.json` - DO NOT add aliases field if it uses "Commercial Items"
- [X] T017 [US1] Review Commercial Items Master node in `src/assets/commercial-items-data-flow.json` - DO NOT add aliases field if it uses "Commercial Items"
- [X] T018 [US1] Review all other nodes in `src/assets/commercial-items-data-flow.json` - only add aliases array if the service uses a name different from "Commercial Items"
- [ ] T019 [US1] Validate JSON syntax with `node -e "JSON.parse(require('fs').readFileSync('src/assets/commercial-items-data-flow.json'))"`

### UI Implementation for User Story 1

- [X] T020 [US1] Update DomainListComponent to load domains with aliases using `getDomainWithAliases()` in `src/app/domains/domains/domain-list/domain-list.ts`
- [X] T021 [US1] Add `getAliasCount(domain)` method to DomainListComponent in `src/app/domains/domains/domain-list/domain-list.ts`
- [X] T022 [US1] Add `getAliasText(domain)` method to format alias summary in `src/app/domains/domains/domain-list/domain-list.ts`
- [X] T023 [US1] Update template to display alias count summary with conditional rendering in `src/app/domains/domains/domain-list/domain-list.html`
- [X] T024 [US1] Add aliases preview section that shows service-alias tags in `src/app/domains/domains/domain-list/domain-list.html`
- [X] T025 [P] [US1] Add CSS styles for `.alias-info` class in `src/app/domains/domains/domain-list/domain-list.css`
- [X] T026 [P] [US1] Add CSS styles for `.aliases-preview` and `.alias-tag` classes in `src/app/domains/domains/domain-list/domain-list.css`
- [ ] T027 [US1] Run development server with `nx serve` and verify domain list displays alias counts
- [ ] T028 [US1] Verify "Commercial Items" shows JPharm's "References" alias but no redundant entries for services using standard name

**Checkpoint**: User Story 1 complete - domain list shows service-specific aliases only when they differ from canonical name

---

## Phase 4: User Story 2 - View Service with Domain Aliases (Priority: P2)

**Goal**: Users viewing a service can see what that service calls each domain, understanding the service's perspective and terminology

**Independent Test**: View "JPharm" service page and verify it shows "Commercial Items (known as: References)" while other services show only the domain name

### Implementation for User Story 2

- [X] T029 [P] [US2] Create DomainForService interface in `src/app/services/services/service-view/service-view.ts`
- [X] T030 [US2] Update ServiceViewComponent to load domains for current service in `src/app/services/services/service-view/service-view.ts`
- [X] T031 [US2] Implement `loadDomainsForService()` method that scans all data flows for current service in `src/app/services/services/service-view/service-view.ts`
- [X] T032 [US2] Add `formatDomainDisplay(domain)` method using `formatDomainWithAliases()` utility in `src/app/services/services/service-view/service-view.ts`
- [X] T033 [US2] Update template to display domains with aliases using `formatDomainDisplay()` in `src/app/services/services/service-view/service-view.html`
- [X] T034 [US2] Add conditional rendering for empty domains list in `src/app/services/services/service-view/service-view.html`
- [ ] T035 [P] [US2] Add CSS styles for `.domain-list` and `.domain-item` in `src/app/services/services/service-view/service-view.css`
- [ ] T036 [US2] Navigate to JPharm service view and verify "Commercial Items (known as: References)" displays
- [ ] T037 [US2] Navigate to OCR service view and verify it shows only "Commercial Items" without redundant alias annotation

**Checkpoint**: User Story 2 complete - service view shows aliases only when different from domain name

---

## Phase 5: User Story 3 - Trace Data Flow with Alias Awareness (Priority: P3)

**Goal**: Users viewing data flow diagrams see aliases annotated on service nodes, understanding how domain names transform across the system

**Independent Test**: View "Commercial Items" data flow diagram and verify JPharm node shows "References" annotation while other nodes don't show redundant alias text

### Implementation for User Story 3

- [X] T038 [US3] Update DomainFlowComponent to load domain and data flow using existing service in `src/app/domains/domains/domain-flow/domain-flow.ts`
- [X] T039 [US3] Import utility functions `shouldDisplayAliases()` and `getPrimaryDisplayName()` in `src/app/domains/domains/domain-flow/domain-flow.ts`
- [X] T040 [US3] Update `renderGraph()` method to include alias rendering logic in `src/app/domains/domains/domain-flow/domain-flow.ts`
- [X] T041 [US3] Add secondary text element for alias below service node labels in D3 rendering code in `src/app/domains/domains/domain-flow/domain-flow.ts`
- [X] T042 [US3] Implement conditional alias text rendering that uses `shouldDisplayAliases()` to avoid redundant display in `src/app/domains/domains/domain-flow/domain-flow.ts`
- [X] T043 [US3] Format alias text as `(alias1, alias2, ...)` for display in `src/app/domains/domains/domain-flow/domain-flow.ts`
- [X] T044 [US3] Update template if needed to support alias display in `src/app/domains/domains/domain-flow/domain-flow.html`
- [X] T045 [P] [US3] Add CSS style for `.node-alias` class with smaller font and lighter color in `src/app/domains/domains/domain-flow/domain-flow.css`
- [X] T046 [P] [US3] Add CSS style for `.node-label` to ensure visual hierarchy in `src/app/domains/domains/domain-flow/domain-flow.css`
- [ ] T047 [US3] Load "Commercial Items" data flow diagram and verify JPharm shows "(References)" below its name
- [ ] T048 [US3] Verify OCR and other services using standard name show NO alias annotation
- [ ] T049 [US3] Verify graph layout and readability are not degraded by alias text

**Checkpoint**: All user stories complete - full alias support across domain list, service view, and data flow visualization

---

## Phase 6: Additional Data Files Enhancement

**Purpose**: Apply alias pattern to remaining domain data flows

- [X] T050 [P] Review `src/assets/deals-data-flow.json` and add aliases array only for services using names different from "Deals"
- [X] T051 [P] Validate deals data flow JSON syntax with `node -e "JSON.parse(require('fs').readFileSync('src/assets/deals-data-flow.json'))"`
- [X] T052 [P] Review any other `*-data-flow.json` files in `src/assets/` and apply same alias pattern (only when different)
- [ ] T053 Test all domain flows in the UI to verify aliases display correctly across all domains

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and final verification

- [ ] T054 [P] Create JSON Schema validation script that checks all data flow files against `specs/002-domain-aliases/contracts/domain-data-flow.schema.json`
- [ ] T055 [P] Update main README.md with domain aliases feature documentation
- [ ] T056 [P] Create data maintenance guide documenting when to add aliases (only when different from domain name)
- [ ] T057 Run full lint check with `npm run lint`
- [ ] T058 Run full build with `npm run build` to verify no errors
- [ ] T059 Run E2E tests if available with `nx e2e catalog-e2e`
- [ ] T060 Verify performance: graph rendering completes in <500ms for typical domain flows
- [ ] T061 Run quickstart.md validation by following all implementation phases manually
- [ ] T062 Create examples in documentation showing correct vs incorrect alias usage

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) completion - Can run in parallel with US1
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) completion - Can run in parallel with US1 and US2
- **Additional Data (Phase 6)**: Depends on US1 completion (validates pattern works)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - Can start after Foundational
- **User Story 2 (P2)**: Independent - Can start after Foundational, parallel with US1
- **User Story 3 (P3)**: Independent - Can start after Foundational, parallel with US1/US2

### Within Each User Story

- **US1**: Data enhancement before UI implementation, CSS can be parallel with TypeScript
- **US2**: Interface/model definition can be parallel, implementation before template
- **US3**: D3 rendering logic before styles, CSS can be parallel with some TypeScript work

### Parallel Opportunities

**Setup Phase**: All tasks T001-T006 can run in parallel (different functions in same file, easily merged)

**Foundational Phase**: T009-T010 can run in parallel, T011-T012 can run in parallel after T008-T010

**User Story 1**: 
- T025-T026 (CSS) can run in parallel
- T020-T024 (logic and template) should be sequential

**User Story 2**:
- T029 can be parallel with other US2 tasks
- T035 (CSS) can be parallel with T029-T034

**User Story 3**:
- T045-T046 (CSS) can run in parallel
- T038-T043 (logic) should be mostly sequential

**Across User Stories**: US1, US2, and US3 can all proceed in parallel once Foundational is complete

**Additional Data Phase**: T050-T052 can all run in parallel (different files)

**Polish Phase**: T054-T056 can run in parallel (different deliverables)

---

## Parallel Example: Foundational Phase

```bash
# After T008 completes, launch in parallel:
Task: "Update DataFlowService with getAliasesForDomain() in data-flow.service.ts"
Task: "Update DataFlowService with getServiceAlias() in data-flow.service.ts"

# After T009-T010 complete, launch in parallel:
Task: "Update DomainService with getDomainWithAliases() in domain.service.ts"
Task: "Update DomainService with getAliasesForDomain() in domain.service.ts"
```

---

## Parallel Example: After Foundational Complete

```bash
# Once Phase 2 is done, all user stories can start in parallel:
Team Member A: Phase 3 (User Story 1) - Domain list with aliases
Team Member B: Phase 4 (User Story 2) - Service view with aliases  
Team Member C: Phase 5 (User Story 3) - Data flow visualization with aliases

# Each story is independently testable and deployable
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (TypeScript types) → ~30 minutes
2. Complete Phase 2: Foundational (Service layer) → ~60 minutes
3. Complete Phase 3: User Story 1 (Domain list) → ~60 minutes
4. **STOP and VALIDATE**: Test domain list independently → ~15 minutes
5. **TOTAL MVP TIME**: ~2.5 hours
6. Deploy/demo domain list with alias support

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Types and services ready
2. **MVP** (Phase 3) → Domain list shows aliases → Deploy! ✅
3. **Enhancement 1** (Phase 4) → Service view shows aliases → Deploy! ✅
4. **Enhancement 2** (Phase 5) → Data flow visualization enhanced → Deploy! ✅
5. **Complete** (Phases 6-7) → All domains updated, documented → Deploy! ✅

Each phase adds value without breaking previous functionality.

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

1. **Team completes Setup + Foundational together** (~1.5 hours total)
2. **Then split**:
   - Developer A: User Story 1 (Domain list) → ~60 min
   - Developer B: User Story 2 (Service view) → ~60 min
   - Developer C: User Story 3 (Data flow viz) → ~90 min
3. **Parallel completion**: All 3 stories done in ~90 min instead of 210 min sequential
4. **Team reconvenes**: Phase 6-7 together → ~60 min
5. **TOTAL TIME WITH 3 DEVS**: ~3 hours vs ~5.5 hours sequential

---

## Validation Checklist

After completing all tasks:

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Domain list shows alias counts only for services with different names
- [ ] Domain flow diagram displays aliases only when they differ from domain name
- [ ] Service view shows domain aliases formatted correctly
- [ ] JSON files validate against schema
- [ ] Backward compatibility maintained (existing data without aliases works)
- [ ] UI displays correctly with and without aliases
- [ ] No redundant aliases displayed (alias === domain name)
- [ ] Performance acceptable (graph render <500ms)
- [ ] All quickstart.md scenarios validated
- [ ] Documentation includes clear guidance on when to add aliases

---

## Critical Implementation Rules

### Alias Addition Rules (IMPORTANT!)

**DO add aliases field when**:
- Service uses a completely different name (e.g., JPharm calls "Commercial Items" → "References")
- Service uses a variation or abbreviation that's not obvious (e.g., "CI" for "Commercial Items")

**DO NOT add aliases field when**:
- Service uses the exact canonical domain name
- Alias would be identical to domain name
- You're not sure - omit the field and let default behavior apply

**Example**:
```json
// CORRECT - JPharm uses different name
{
  "id": "JPharm",
  "modifies": false,
  "aliases": ["References"]
}

// CORRECT - OCR uses standard name, no aliases field
{
  "id": "OCR", 
  "modifies": false
}

// WRONG - Don't add redundant alias
{
  "id": "OCR",
  "modifies": false,
  "aliases": ["Commercial Items"]  // ❌ Don't do this!
}
```

### Display Logic

The `shouldDisplayAliases()` utility function ensures:
- Missing aliases → show domain name only
- Aliases present but all match domain name → show domain name only  
- At least one alias differs from domain name → show aliases with "known as:" format

This approach minimizes clutter and highlights only meaningful naming differences.

---

## Time Estimates

| Phase | Estimated Time | Dependencies |
|-------|----------------|--------------|
| 1. Setup | 30 min | None |
| 2. Foundational | 60 min | Phase 1 |
| 3. User Story 1 (P1) | 60 min | Phase 2 |
| 4. User Story 2 (P2) | 60 min | Phase 2 |
| 5. User Story 3 (P3) | 90 min | Phase 2 |
| 6. Additional Data | 30 min | Phase 3-5 |
| 7. Polish | 60 min | Phase 3-6 |
| **Total Sequential** | **6.5 hours** | |
| **Total with 3 Devs** | **3 hours** | (after foundation) |

Add 1 hour buffer for debugging and refinement.

---

## Notes

- **[P]** tasks can run in parallel (different files or independent code sections)
- **[Story]** label maps task to specific user story for traceability
- Each user story is independently completable and testable
- **CRITICAL**: Only add `aliases` array when service uses different name than domain
- Commit after completing each phase or logical task group
- Stop at checkpoints to validate story independence
- Avoid redundant alias annotations (alias === domain name)
- The `shouldDisplayAliases()` utility enforces the "only when different" rule

---

## Resources

- **Spec**: `specs/002-domain-aliases/spec.md`
- **Plan**: `specs/002-domain-aliases/plan.md`
- **Research**: `specs/002-domain-aliases/research.md`
- **Data Model**: `specs/002-domain-aliases/data-model.md`
- **Quickstart**: `specs/002-domain-aliases/quickstart.md`
- **Contracts**: `specs/002-domain-aliases/contracts/`
- **Angular Docs**: https://angular.io/docs
- **D3.js Docs**: https://d3js.org/
- **RxJS Docs**: https://rxjs.dev/
