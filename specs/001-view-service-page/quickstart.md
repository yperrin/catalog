# Quickstart Guide: View Service Page

This guide outlines the steps to get the 'View Service Page' feature up and running locally.

## Prerequisites

- Node.js (LTS version)
- npm (comes with Node.js)
- Nx CLI (installed globally or via `npx`)

## Running the Application

1.  **Clone the repository** (if you haven't already):

    ```bash
    git clone <repository-url>
    cd catalog
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Start the development server**:

    ```bash
    npx nx run catalog:serve
    ```

    The application will typically be available at `http://localhost:4200/`.

## Accessing the Service View Page

Once the application is running, you will be able to access the service view page by navigating to a specific URL pattern. Assuming a service with the name `[SERVICE_NAME]` exists, the URL will likely be:

`http://localhost:4200/services/[SERVICE_NAME]`

Replace `[SERVICE_NAME]` with an actual service name from your data (e.g., from `src/assets/services.json`).

## Running Tests

### Unit Tests

To run the unit tests for the `catalog` project:

```bash
npx nx run catalog:test
```

### End-to-End Tests

To run the end-to-end tests for the `catalog-e2e` project:

```bash
npx nx run catalog-e2e:e2e
```
