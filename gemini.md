# Gemini Project Plan: Data Domain & Service Catalog

This document outlines the plan for creating the Data Domain & Service Catalog application using Angular with Nx.

## Phase 1: Project Setup

1.  **Initialize Nx Workspace:**
    *   Create a new Nx workspace: `npx create-nx-workspace@latest data-catalog --preset=angular`
2.  **Create Angular Application:**
    *   Generate the Angular application within the Nx workspace: `nx g @nrwl/angular:application data-catalog-app`
3.  **Add Angular Material:**
    *   Add Angular Material to the application: `nx add @angular/material --project=data-catalog-app`
4.  **Create Core Libraries:**
    *   `domain`: For managing domains. `nx g @nrwl/angular:lib domain`
    *   `service`: For managing services. `nx g @nrwl/angular:lib service`
    *   `chain-of-custody`: For tracking the chain of custody. `nx g @nrwl/angular:lib chain-of-custody`
5.  **Set up Routing:**
    *   Configure routes for the different libraries.

## Phase 2: Core Feature Implementation

1.  **Domain Management:**
    *   Create a `Domain` model in the `domain` library.
    *   Create a `DomainService` for CRUD operations in the `domain` library.
    *   Create a component to list, add, edit, and delete domains in the `domain` library.
2.  **Service Management:**
    *   Create a `Service` model in the `service` library.
    *   Create a `ServiceService` for CRUD operations in the `service` library.
    *   Create a component to list, add, edit, and delete services in the `service` library.
3.  **Chain of Custody:**
    *   Create a `ChainOfCustody` model that links domains and services in the `chain-of-custody` library.
    *   Create a `ChainOfCustodyService` to record the transfer of a domain from one service to another in the `chain-of-custody` library.
    *   Create a component to view the chain of custody for a domain in the `chain-of-custody` library.

## Phase 3: UI/UX

1.  **Domain-Centric View:**
    *   Create a component that displays the full chain of services for a selected domain.
2.  **Service-Centric View:**
    *   Create a component that displays all domains that a selected service interacts with.
3.  **Navigation:**
    *   Create a navigation bar to switch between the different views.
