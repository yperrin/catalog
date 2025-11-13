# Data Model: Domain Aliases

**Feature**: 002-domain-aliases  
**Date**: 2025-11-11  
**Status**: Complete

## Overview

This document defines the data structures and relationships for capturing service-specific domain aliases within the existing catalog application. The model extends the current JSON-based data flow format to include optional alias information without breaking backward compatibility.

## Entities

### 1. Domain (Unchanged)

**Purpose**: Represents a business concept or data category with a canonical name.

**Source**: `src/assets/domains.json`

**Structure**:
```typescript
interface Domain {
  name: string;              // Canonical/primary name (e.g., "Commercial Items")
  division: string;          // Business division (e.g., "LS&H")
  "sub-division": string;    // Sub-division (e.g., "R&D")
  description: string;       // Business description
  dataFlowFile: string;      // Reference to data flow JSON file
}
```

**Properties**:
- `name`: Unique identifier and primary display name. This is the canonical name used throughout the system.
- `division`: Top-level organizational grouping
- `sub-division`: Secondary organizational grouping
- `description`: Human-readable explanation of the domain's business purpose
- `dataFlowFile`: Filename (relative to `/src/assets/`) containing the data flow graph for this domain

**Validation Rules**:
- `name` must be unique across all domains
- `name` cannot be empty or null
- `dataFlowFile` must reference an existing file in `/src/assets/`

**Relationships**:
- One domain has one data flow graph (1:1)
- One domain flows through many services (1:N)

**Example**:
```json
{
  "name": "Commercial Items",
  "division": "LS&H",
  "sub-division": "R&D",
  "description": "The true Commercial item represents Press releases but also a proxy for other items like Journals and Conferences",
  "dataFlowFile": "commercial-items-data-flow.json"
}
```

---

### 2. Service (Unchanged)

**Purpose**: Represents a system or application that processes domains.

**Source**: `src/assets/services.json`

**Structure**:
```typescript
interface Service {
  name: string;              // Unique service identifier (e.g., "JPharm")
  description: string;       // Purpose and function of the service
  division: string;          // Business division
  "sub-division": string | null;  // Optional sub-division
  content: boolean;          // Whether this is a content service (true) or consumer (false)
}
```

**Properties**:
- `name`: Unique identifier and display name
- `description`: Technical and business description of the service's role
- `division`: Organizational grouping
- `sub-division`: Optional secondary grouping (can be null)
- `content`: Flag indicating whether the service stores/processes content (true) or consumes it (false)

**Validation Rules**:
- `name` must be unique across all services
- `name` cannot be empty or null
- `content` must be a boolean

**Relationships**:
- One service processes many domains (1:N)
- One service appears in many data flow graphs (1:N)

**Example**:
```json
{
  "name": "JPharm",
  "description": "Legacy content system still used as part of integration with Cortellis architecture",
  "division": "LS&H",
  "sub-division": "R&D",
  "content": true
}
```

---

### 3. DataFlowNode (Enhanced)

**Purpose**: Represents a service's participation in a domain's data flow, including the service-specific names (aliases) for that domain.

**Source**: `src/assets/*-data-flow.json` (e.g., `commercial-items-data-flow.json`)

**Structure**:
```typescript
interface DataFlowNode {
  id: string;                // Service name (matches Service.name)
  modifies: boolean;         // Whether this service modifies the domain data
  aliases?: string[];        // Optional: array of service-specific names for the domain
}
```

**Properties**:
- `id`: References a service by name; must match an entry in `services.json`
- `modifies`: Indicates whether this service transforms/modifies the domain data
- `aliases`: **[NEW]** Optional array capturing what this service calls the domain
  - If omitted, the service uses the canonical domain name
  - If present, these are the names the service uses internally
  - Can include the canonical domain name (explicit confirmation of standard naming)
  - Can contain multiple aliases if the service uses different terms in different contexts

**Validation Rules**:
- `id` must reference an existing service in `services.json`
- `modifies` must be a boolean
- `aliases` (when present) must be an array
- Each alias string must be non-empty
- `aliases` is optional; its absence is semantically meaningful ("uses domain name")

**Relationships**:
- One node represents one service's participation in one domain flow (N:1:1)
- Node.id → Service.name (foreign key relationship)
- Node is part of exactly one domain's data flow graph

**Example**:
```json
{
  "id": "JPharm",
  "modifies": false,
  "aliases": ["References", "Citations"]
}
```

**Edge Cases**:
```json
// No aliases field: service uses domain name
{
  "id": "OCR",
  "modifies": false
}

// Empty array: explicitly documented as having no aliases
{
  "id": "ServiceX",
  "modifies": false,
  "aliases": []
}

// Single alias
{
  "id": "CMS",
  "modifies": false,
  "aliases": ["Commercial Items"]
}
```

---

### 4. DomainDataFlow (Enhanced)

**Purpose**: Represents the complete data flow graph for a single domain, including all services it passes through and their relationships.

**Source**: `src/assets/*-data-flow.json`

**Structure**:
```typescript
interface DomainDataFlow {
  domain: string;                    // Canonical domain name (matches Domain.name)
  nodes: DataFlowNode[];             // Services in the flow (enhanced with aliases)
  edges: DataFlowEdge[];             // Connections between services
  initialization: {
    services: string[];              // Entry point services
  };
}

interface DataFlowEdge {
  source: string;                    // Source service name (node.id)
  target: string;                    // Target service name (node.id)
}
```

**Properties**:
- `domain`: References a domain by canonical name; must match an entry in `domains.json`
- `nodes`: Array of services that process this domain, with optional alias information
- `edges`: Directed connections showing data flow from one service to another
- `initialization.services`: Array of service names that are entry points for this domain

**Validation Rules**:
- `domain` must reference an existing domain in `domains.json`
- All `nodes[].id` must reference existing services in `services.json`
- All `edges[].source` and `edges[].target` must reference node IDs within this flow
- `initialization.services` must reference node IDs within this flow
- Graph must be acyclic (no service can transitively flow back to itself)

**Relationships**:
- One data flow belongs to exactly one domain (N:1)
- One data flow contains many nodes (1:N)
- One data flow contains many edges (1:N)

**Example**:
```json
{
  "domain": "Commercial Items",
  "nodes": [
    { "id": "OCR", "modifies": false, "alias": "Commercial Items" },
    { "id": "Commercial Items Master", "modifies": true },
    { "id": "JPharm", "modifies": false, "alias": "References" }
  ],
  "edges": [
    { "source": "OCR", "target": "Commercial Items Master" },
    { "source": "Commercial Items Master", "target": "JPharm" }
  ],
  "initialization": {
    "services": ["Data Acquisition Framework", "Commercial Items FTP Ingest"]
  }
}
```

---

## Conceptual Relationships

### Domain-Service-Alias Triad

The alias feature introduces a three-way relationship:

```
Domain (canonical name)
   ↓
   1:N
   ↓
DataFlowNode (service participation)
   ↓
   N:1
   ↓
Service (actual system)

Each DataFlowNode optionally captures an alias
```

**Key Insight**: The alias is not a property of the domain or the service; it's a property of their **relationship within a specific data flow context**.

### Alias Resolution Logic

```typescript
function getServiceAliasesForDomain(
  serviceName: string, 
  domainName: string, 
  dataFlow: DomainDataFlow
): string[] {
  const node = dataFlow.nodes.find(n => n.id === serviceName);
  if (!node) {
    throw new Error(`Service ${serviceName} not found in ${domainName} flow`);
  }
  return node.aliases ?? [domainName];  // Default to domain name if no aliases
}

function getPrimaryAliasForDisplay(
  serviceName: string, 
  domainName: string, 
  dataFlow: DomainDataFlow
): string {
  const aliases = getServiceAliasesForDomain(serviceName, domainName, dataFlow);
  return aliases[0] ?? domainName;  // Use first alias or domain name
}
```

**Example**:
- `getServiceAliasesForDomain("JPharm", "Commercial Items", flow)` → `["References", "Citations"]`
- `getServiceAliasesForDomain("OCR", "Commercial Items", flow)` → `["Commercial Items"]`
- `getPrimaryAliasForDisplay("JPharm", "Commercial Items", flow)` → `"References"`

---

## State Transitions

### Alias Lifecycle

Aliases are **static configuration data** and don't have runtime state transitions. However, the data model supports evolutionary changes:

1. **Initial State**: Node has no `aliases` field
   - **Interpretation**: Service uses canonical domain name
   - **Display**: Show domain name only

2. **Aliases Added**: Developer adds `aliases` array to node
   - **Trigger**: Documentation of actual service terminology
   - **Display**: Show "Domain Name (known as: Alias1, Alias2, ...)"

3. **Aliases Updated**: Developer changes `aliases` array values or adds/removes items
   - **Trigger**: Service terminology changes or correction of documentation
   - **Display**: Show updated aliases immediately (no migration needed)

4. **Aliases Removed**: Developer removes `aliases` field or sets to empty array
   - **Trigger**: Service adopts standard domain name
   - **Display**: Revert to domain name only

**No Runtime State**: Aliases are not computed, generated, or modified at runtime. They are authored data.

---

## Data Integrity Constraints

### Cross-File Referential Integrity

| File | Field | Must Reference | Validation |
|------|-------|----------------|------------|
| `domains.json` | `name` | N/A | Unique, non-empty |
| `domains.json` | `dataFlowFile` | File in `/src/assets/` | Must exist |
| `*-data-flow.json` | `domain` | `domains.json[].name` | Must exist |
| `*-data-flow.json` | `nodes[].id` | `services.json[].name` | Must exist |
| `*-data-flow.json` | `edges[].source` | `nodes[].id` | Must exist in same flow |
| `*-data-flow.json` | `edges[].target` | `nodes[].id` | Must exist in same flow |
| `*-data-flow.json` | `initialization.services[]` | `nodes[].id` | Must exist in same flow |

### Semantic Constraints

1. **Acyclic Graph**: The data flow graph must not contain cycles
   - **Rationale**: Data flows in one direction through processing pipeline
   - **Validation**: Topological sort must succeed

2. **Connected Components**: All nodes should be reachable from initialization services
   - **Rationale**: Unreachable services indicate data modeling errors
   - **Validation**: Graph traversal from initialization services should reach all nodes

3. **Alias Distinctness** (soft constraint): Within a single domain flow, different services should ideally use different aliases
   - **Rationale**: If multiple services use the same alias, it suggests they might be the same semantic concept
   - **Validation**: Warning only, not an error

---

## Domain-Driven Design Patterns

### Value Objects

**DomainAlias**: The combination of (serviceName, domainName, aliasText) is a value object
- **Immutable**: Once defined in JSON, doesn't change during runtime
- **No Identity**: Two aliases are equal if all three components match
- **Computed Display**: The UI representation is computed from these values
- **Array Support**: A service can have multiple aliases for the same domain

```typescript
interface DomainAlias {
  readonly serviceName: string;
  readonly domainName: string;
  readonly aliasText: string;  // One of potentially multiple aliases
}

function equals(a1: DomainAlias, a2: DomainAlias): boolean {
  return a1.serviceName === a2.serviceName 
      && a1.domainName === a2.domainName
      && a1.aliasText === a2.aliasText;
}
```

### Aggregates

**DomainDataFlow is an Aggregate Root**:
- **Consistency Boundary**: All nodes and edges are managed together
- **Transaction Boundary**: Changes to the data flow file are atomic
- **Referential Integrity**: Node IDs in edges must reference nodes in the same aggregate

```typescript
class DomainDataFlowAggregate {
  constructor(private dataFlow: DomainDataFlow) {
    this.validateIntegrity();
  }
  
  private validateIntegrity(): void {
    // Ensure all edge references are valid
    const nodeIds = new Set(this.dataFlow.nodes.map(n => n.id));
    for (const edge of this.dataFlow.edges) {
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
        throw new Error("Edge references non-existent node");
      }
    }
  }
  
  getAliasesForService(serviceName: string): string[] | undefined {
    return this.dataFlow.nodes.find(n => n.id === serviceName)?.aliases;
  }
  
  getPrimaryAliasForService(serviceName: string): string {
    const aliases = this.getAliasesForService(serviceName);
    return aliases?.[0] ?? this.dataFlow.domain;
  }
}
```

---

## TypeScript Type Definitions

### Core Types

```typescript
// src/app/domains/shared/models/domain.model.ts

export interface Domain {
  name: string;
  division: string;
  'sub-division': string;
  description: string;
  dataFlowFile: string;
}

export interface DataFlowNode {
  id: string;
  modifies: boolean;
  aliases?: string[];  // NEW: Optional array of service-specific aliases
}

export interface DataFlowEdge {
  source: string;
  target: string;
}

export interface DomainDataFlow {
  domain: string;
  nodes: DataFlowNode[];
  edges: DataFlowEdge[];
  initialization: {
    services: string[];
  };
}
```

### Utility Types

```typescript
// Type guards
export function hasAliases(node: DataFlowNode): node is DataFlowNode & { aliases: string[] } {
  return node.aliases !== undefined && node.aliases.length > 0;
}

// Display name resolution (returns first alias or domain name)
export function getPrimaryDisplayName(node: DataFlowNode, domainName: string): string {
  return node.aliases?.[0] ?? domainName;
}

// Get all display names (aliases + domain name if no aliases)
export function getAllDisplayNames(node: DataFlowNode, domainName: string): string[] {
  if (hasAliases(node)) {
    return node.aliases;
  }
  return [domainName];
}

// Check if aliases should be displayed separately from the domain name
export function shouldDisplayAliases(node: DataFlowNode, domainName: string): boolean {
  if (!hasAliases(node)) return false;
  // Display if any alias differs from domain name
  return node.aliases.some(alias => alias !== domainName);
}

// Format for UI display (single alias)
export function formatDomainWithAlias(domainName: string, alias?: string): string {
  if (!alias || alias === domainName) return domainName;
  return `${domainName} (known as: ${alias})`;
}

// Format for UI display (multiple aliases)
export function formatDomainWithAliases(domainName: string, aliases?: string[]): string {
  if (!aliases || aliases.length === 0) return domainName;
  const uniqueAliases = aliases.filter(a => a !== domainName);
  if (uniqueAliases.length === 0) return domainName;
  return `${domainName} (known as: ${uniqueAliases.join(', ')})`;
}
```

### Domain Service Types

```typescript
// src/app/domains/shared/services/domain.service.ts

export interface DomainWithAliases extends Domain {
  aliases: ServiceAlias[];  // Computed from data flow
}

export interface ServiceAlias {
  serviceName: string;
  alias: string;
  domainName: string;
}

// Service method signatures
interface DomainService {
  getDomain(name: string): Observable<Domain>;
  getDomainWithAliases(name: string): Observable<DomainWithAliases>;
  getAliasesForDomain(domainName: string): Observable<ServiceAlias[]>;
}
```

---

## JSON Schema Validation

### DataFlowNode Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "modifies"],
  "properties": {
    "id": {
      "type": "string",
      "minLength": 1,
      "description": "Service name from services.json"
    },
    "modifies": {
      "type": "boolean",
      "description": "Whether this service modifies domain data"
    },
    "alias": {
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 1
      },
      "description": "Optional array of service-specific names for the domain"
    }
  }
}
```

### DomainDataFlow Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["domain", "nodes", "edges", "initialization"],
  "properties": {
    "domain": {
      "type": "string",
      "minLength": 1,
      "description": "Canonical domain name"
    },
    "nodes": {
      "type": "array",
      "items": { "$ref": "#/definitions/DataFlowNode" },
      "minItems": 1
    },
    "edges": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["source", "target"],
        "properties": {
          "source": { "type": "string" },
          "target": { "type": "string" }
        }
      }
    },
    "initialization": {
      "type": "object",
      "required": ["services"],
      "properties": {
        "services": {
          "type": "array",
          "items": { "type": "string" },
          "minItems": 1
        }
      }
    }
  }
}
```

---

## Migration Path

### Phase 1: Code Deployment (No Data Changes)

1. Deploy TypeScript type updates with optional `aliases?` array field
2. Deploy Angular component updates that handle missing aliases
3. Deploy D3.js rendering logic that conditionally displays aliases
4. **Validation**: Existing functionality works unchanged

### Phase 2: Data Enhancement (Incremental)

1. Identify services that use non-standard domain naming
2. Add `aliases` array field to relevant nodes in data flow files
3. Validate JSON structure against schema
4. **Validation**: Aliases display correctly in UI

### Phase 3: Documentation and Maintenance

1. Document alias conventions in README
2. Create validation script to check cross-file references
3. Add alias information to data flow diagram exports
4. **Validation**: Data maintainers can add/update aliases confidently

---

## Example Data Flow Enhancement

### Before (existing)

```json
{
  "domain": "Commercial Items",
  "nodes": [
    { "id": "OCR", "modifies": false },
    { "id": "Commercial Items Master", "modifies": true },
    { "id": "JPharm", "modifies": false }
  ],
  "edges": [
    { "source": "OCR", "target": "Commercial Items Master" },
    { "source": "Commercial Items Master", "target": "JPharm" }
  ],
  "initialization": { "services": ["Data Acquisition Framework"] }
}
```

### After (enhanced with aliases)

```json
{
  "domain": "Commercial Items",
  "nodes": [
    { 
      "id": "OCR", 
      "modifies": false, 
      "aliases": ["Commercial Items"]
    },
    { 
      "id": "Commercial Items Master", 
      "modifies": true
      // No aliases: uses domain name
    },
    { 
      "id": "JPharm", 
      "modifies": false, 
      "aliases": ["References", "Citations"]
    }
  ],
  "edges": [
    { "source": "OCR", "target": "Commercial Items Master" },
    { "source": "Commercial Items Master", "target": "JPharm" }
  ],
  "initialization": { "services": ["Data Acquisition Framework"] }
}
```

**Impact**:
- OCR: Displays "Commercial Items" (explicit confirmation)
- Commercial Items Master: Displays "Commercial Items" (default)
- JPharm: Displays "References, Citations (aliases for Commercial Items)"

---

## Summary

The domain alias data model is a **minimal, backward-compatible extension** to the existing data flow JSON structure. By adding an optional `aliases` array field to `DataFlowNode` objects, we capture service-specific naming conventions without disrupting existing functionality. The model supports:

✅ **Backward Compatibility**: Existing files work without modification  
✅ **Semantic Clarity**: Aliases are explicit, not inferred  
✅ **Type Safety**: TypeScript interfaces enforce structure  
✅ **Extensibility**: Model can accommodate future enhancements (multiple aliases per service)  
✅ **Data Integrity**: Cross-file references are validated  
✅ **Incremental Adoption**: Aliases can be added file-by-file

**Key Design Principles**:
1. Optional by default (don't require aliases where not needed)
2. Contextual (aliases are specific to domain-service relationships)
3. Simple (no complex mapping tables or join logic)
4. Maintainable (JSON files remain human-readable and editable)
5. Flexible (supports multiple aliases when services use different terms in different contexts)
