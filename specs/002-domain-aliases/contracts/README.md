# Contracts: Domain Aliases

This directory contains the API contracts and interface definitions for the domain aliases feature.

## Contents

- **`domain.types.ts`**: Core TypeScript interfaces for domains, data flows, and aliases
- **`domain-alias.service.interface.ts`**: Service layer contract for alias operations
- **`data-flow-node.schema.json`**: JSON Schema for validating DataFlowNode objects
- **`domain-data-flow.schema.json`**: JSON Schema for validating DomainDataFlow files

## Purpose

These contracts serve as:
1. **Type Safety**: Compile-time validation for TypeScript code
2. **Data Validation**: Runtime validation for JSON data files
3. **Documentation**: Clear specification of data structures
4. **Contract Testing**: Basis for automated contract tests

## Usage

### In Angular Components

```typescript
import { DataFlowNode, DomainDataFlow, getPrimaryDisplayName } from '@contracts/domain.types';

@Component({...})
export class DomainFlowComponent {
  dataFlow: DomainDataFlow | null = null;
  
  getDisplayName(node: DataFlowNode): string {
    return getPrimaryDisplayName(node, this.dataFlow?.domain ?? '');
  }
}
```

### In Services

```typescript
import { DomainAliasService } from '@contracts/domain-alias.service.interface';

@Injectable()
export class DomainServiceImpl implements DomainAliasService {
  getAliasesForDomain(domainName: string): Observable<ServiceAlias[]> {
    // Implementation
  }
}
```

### For JSON Validation

```typescript
import dataFlowSchema from '@contracts/domain-data-flow.schema.json';
import Ajv from 'ajv';

const ajv = new Ajv();
const validate = ajv.compile(dataFlowSchema);

if (!validate(data)) {
  console.error(validate.errors);
}
```

## Versioning

These contracts follow semantic versioning:
- **Major**: Breaking changes to interfaces (e.g., removing fields)
- **Minor**: Additive changes (e.g., adding optional fields)
- **Patch**: Documentation or clarification changes

**Current Version**: 1.0.0 (Initial release with alias support)
