# Tasks: Basic Application Layout with Header

**Input**: Design documents from `/specs/001-basic-layout-header/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [x] T001 Create a `components` directory in `src/app`.
- [x] T002 Create a `header` directory in `src/app/components`.

---

## Phase 2: User Story 1 - View Application Header (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to see a consistent header at the top of every page so that I can easily identify the application and navigate to key sections.

**Independent Test**: The header can be tested on a single, simple page to verify its appearance and the presence of the title and navigation links.

### Implementation for User Story 1

- [x] T003 [US1] Create the `header.ts` file in `src/app/components/header`.
- [x] T004 [US1] Implement the header component in `src/app/components/header/header.ts` with the title "Catalog" and navigation links for "Domains" and "Services". The component should have an inline template and styles.
- [x] T005 [US1] Create the `header.spec.ts` file in `src/app/components/header`.
- [x] T006 [US1] Write unit tests for the header component in `src/app/components/header/header.spec.ts` to verify that the title and navigation links are rendered correctly.
- [x] T007 [US1] Update the main application component in `src/app/app.ts` to include the new header component.
- [x] T008 [US1] Create an end-to-end test file `header.spec.ts` in `e2e/src`.
- [x] T009 [US1] Write an end-to-end test in `e2e/src/header.spec.ts` to verify that the header is displayed correctly on the main page.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (Phase 1).

### Within Each User Story

- Unit tests should be written alongside the component implementation.
- The component should be created and tested before being integrated into the main application.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: User Story 1
3. **STOP and VALIDATE**: Test User Story 1 independently
4. Deploy/demo if ready
