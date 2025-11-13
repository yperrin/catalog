# Tasks: View Service Page

**Feature Branch**: `001-view-service-page` | **Date**: November 1, 2025 | **Spec**: C:\Projects\experiments\catalog\specs\001-view-service-page\spec.md
**Input**: Implementation plan from `C:\Projects\experiments\catalog\specs\001-view-service-page\plan.md`

## Summary

This document outlines the actionable, dependency-ordered tasks for implementing the "View Service Page" feature. The feature aims to provide a dedicated page for displaying service details, associated domains, and navigation to domain-flow pages, utilizing Angular Signals for state management.

## Implementation Strategy

The implementation will follow an MVP-first approach, delivering core functionality for each user story incrementally. Tasks are organized by user story to facilitate independent development and testing.

## Phase 1: Setup

- [x] T001 Create the `service-view` directory: `src/app/domains/services/service-view/`
- [x] T002 Generate the `ServiceView` within `src/app/domains/services/service-view/`: `src/app/domains/services/service-view/service-view.ts`
- [x] T003 Create the routing file for the `service-view` component: `src/app/domains/services/service-view.routes.ts`
- [x] T004 Configure the main application routing to include the `service-view` route: `src/app/app.routes.ts`

## Phase 2: Foundational Tasks

- [x] T005 Implement a loading signal for data fetching: `src/app/domains/services/service-view/service-view.ts`
- [x] T006 Implement error handling for data fetching: `src/app/domains/services/service-view/service-view.ts`
- [x] T007 Implement data fetching for service details using `ServiceService`: `src/app/domains/services/service-view/service-view.ts`
- [x] T008 Implement data fetching for associated domains using `DomainService`: `src/app/domains/services/service-view/service-view.ts`

## Phase 3: User Story 1 - View Service Details [US1]

**Goal**: As a user, I want to view the details of a single service, including its name and description, so I can understand what the service does.
**Independent Test**: Navigate to a service's view page and verify the name and description are displayed correctly.

- [x] T009 [US1] Display the service name in the template: `src/app/domains/services/service-view/service-view.html`
- [x] T010 [US1] Display the service description in the template: `src/app/domains/services/service-view/service-view.html`
- [x] T011 [US1] Implement a loading spinner/skeleton screen for service details: `src/app/domains/services/service-view/service-view.html`

## Phase 4: User Story 2 - View Associated Domains [US2]

**Goal**: As a user, I want to see a list of domains that pass through the service, along with an indication of whether the service modifies the data, so I can understand the service's impact on data flow.
**Independent Test**: Navigate to a service's view page and verify the table of domains and their modification status is displayed correctly.

- [x] T012 [US2] Create a table structure for associated domains: `src/app/domains/services/service-view/service-view.html`
- [x] T013 [US2] Populate the table with domain names: `src/app/domains/services/service-view/service-view.html`
- [x] T014 [US2] Add a column to the table indicating data modification status: `src/app/domains/services/service-view/service-view.html`
- [x] T015 [US2] Handle the display of "No associated domains" message when applicable: `src/app/domains/services/service-view/service-view.html`
- [x] T016 [US2] Implement a loading spinner/skeleton screen for the domains table: `src/app/domains/services/service-view/service-view.html`

## Phase 5: User Story 3 - Navigate to Domain Flow [US3]

**Goal**: As a user, I want to be able to click on a domain in the table and be taken to its domain-flow page, so I can explore the data flow of that specific domain.
**Independent Test**: Click on a domain in the table and verify that the correct domain-flow page is loaded.

- [x] T017 [US3] Make each domain name in the table a clickable link: `src/app/domains/services/service-view/service-view.html`
- [x] T018 [US3] Implement navigation to the domain-flow page on domain link click: `src/app/domains/services/service-view/service-view.ts`
- [x] T019 [US3] Handle cases where a domain link leads to a non-existent domain-flow page (e.g., disable link or show error): `src/app/domains/services/service-view/service-view.ts`, `src/app/domains/services/service-view/service-view.html`

## Final Phase: Polish & Cross-Cutting Concerns

- [x] T020 Ensure consistent styling across the component: `src/app/domains/services/service-view/service-view.css`
- [x] T021 Review component for accessibility best practices: `src/app/domains/services/service-view/service-view.html`
- [x] T022 Optimize performance for data rendering and interactions: `src/app/domains/services/service-view/service-view.ts`, `src/app/domains/services/service-view/service-view.html`

## Dependencies

- Phase 1 (Setup) must be completed before any other phases.
- Phase 2 (Foundational Tasks) must be completed before Phases 3, 4, and 5.
- Phase 3 (US1) can be implemented in parallel with Phase 4 (US2) and Phase 5 (US3) once foundational tasks are complete, but US1 is a prerequisite for a meaningful display.
- Phase 4 (US2) is dependent on US1 for the service context.
- Phase 5 (US3) is dependent on US2 for the domain table.
- The Final Phase can begin once all user story phases are complete.

## Parallel Execution Examples

- **After Phase 2**:
    - Implement T009 [US1] and T010 [US1] (display service details)
    - Implement T012 [US2] and T013 [US2] (create table and populate with domain names)
- **After T013 [US2]**:
    - Implement T014 [US2] (add data modification status column)
    - Implement T017 [US3] (make domain names clickable links)

## Suggested MVP Scope

The MVP for this feature would include completing Phase 1, Phase 2, and Phase 3 (User Story 1 - View Service Details). This provides the core functionality of displaying service name and description.