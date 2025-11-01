# Data Model: Domain Flow Diagram

**Date**: 2025-11-01

## Entities

### Domain

Represents a business domain.

**Fields**:

- `name` (string, mandatory): The name of the domain.
- `description` (string, optional): A description of the domain.
- `division` (string, optional): The division the domain belongs to.
- `sub-division` (string, optional): The sub-division the domain belongs to.
- `dataFlowFile` (string, optional): The name of the JSON file that defines the data flow for this domain.

### Data Flow

Represents the process of data moving through services for a specific domain.

**Fields**:

- `domain` (string, mandatory): The name of the domain this data flow belongs to.
- `nodes` (array of objects, mandatory): A list of the services involved in the data flow.
  - `id` (string, mandatory): The name of the service.
  - `modifies` (boolean, mandatory): Indicates whether the service modifies the data.
- `edges` (array of objects, mandatory): A list of the connections between services.
  - `source` (string, mandatory): The name of the source service.
  - `target` (string, mandatory): The name of the target service.
- `initialization` (object, mandatory): Defines the starting point of the data flow.
  - `services` (array of strings, mandatory): A list of the services that initialize the data flow.
