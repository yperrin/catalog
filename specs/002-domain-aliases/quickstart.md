# Quickstart: Domain Aliases Implementation

**Feature**: 002-domain-aliases  
**Date**: 2025-11-11  
**Estimated Implementation Time**: 4-6 hours

## Overview

This guide provides step-by-step instructions for implementing the domain aliases feature. The implementation enhances existing JSON data files and Angular components to display service-specific domain names.

## Prerequisites

- Angular 20.3.0 development environment
- TypeScript 5.9.2
- Familiarity with RxJS and D3.js
- Understanding of the existing domain/service data model

## Implementation Phases

### Phase 1: Type Definitions (30 minutes)

Update TypeScript interfaces to support optional alias field.

#### 1.1 Update Domain Model

**File**: `src/app/domains/shared/models/domain.model.ts`

```typescript
// Add to existing DataFlowNode interface
export interface DataFlowNode {
  id: string;
  modifies: boolean;
  alias?: string;  // NEW: Optional service-specific alias
}

// Add utility functions
export function getDisplayName(node: DataFlowNode, domainName: string): string {
  return node.alias ?? domainName;
}

export function shouldDisplayAlias(node: DataFlowNode, domainName: string): boolean {
  if (!node.alias || node.alias.trim() === '') return false;
  if (node.alias === domainName) return false;
  return true;
}

export function formatDomainWithAlias(domainName: string, alias?: string): string {
  if (!alias || alias === domainName) return domainName;
  return `${domainName} (known as: ${alias})`;
}
```

**Validation**: Run `npm run lint` to ensure no TypeScript errors.

---

### Phase 2: Data Files Update (45 minutes)

Add alias fields to data flow JSON files where services use non-standard naming.

#### 2.1 Update Commercial Items Data Flow

**File**: `src/assets/commercial-items-data-flow.json`

```json
{
  "domain": "Commercial Items",
  "nodes": [
    {
      "id": "Data Acquisition Framework",
      "modifies": false
    },
    {
      "id": "Commercial Items FTP Ingest",
      "modifies": false
    },
    {
      "id": "OCR",
      "modifies": false,
      "alias": "Commercial Items"
    },
    {
      "id": "Commercial Items Master",
      "modifies": true
    },
    {
      "id": "JPharm",
      "modifies": false,
      "alias": "References"
    },
    {
      "id": "CMS",
      "modifies": false
    },
    {
      "id": "Databricks",
      "modifies": false
    },
    {
      "id": "CI",
      "modifies": false
    },
    {
      "id": "CDI",
      "modifies": false
    }
  ],
  "edges": [
    {
      "source": "Data Acquisition Framework",
      "target": "OCR"
    },
    {
      "source": "Commercial Items FTP Ingest",
      "target": "OCR"
    },
    {
      "source": "OCR",
      "target": "Commercial Items Master"
    },
    {
      "source": "Commercial Items Master",
      "target": "JPharm"
    },
    {
      "source": "Commercial Items Master",
      "target": "CMS"
    },
    {
      "source": "Commercial Items Master",
      "target": "Databricks"
    },
    {
      "source": "JPharm",
      "target": "CI"
    },
    {
      "source": "CMS",
      "target": "CDI"
    }
  ],
  "initialization": {
    "services": ["Data Acquisition Framework", "Commercial Items FTP Ingest"]
  }
}
```

**Key Changes**:
- Added `"alias": "References"` to JPharm node (service uses different name)
- Added `"alias": "Commercial Items"` to OCR node (explicit confirmation)
- Other nodes have no alias (implicitly use domain name)

#### 2.2 Update Deals Data Flow

**File**: `src/assets/deals-data-flow.json`

Follow the same pattern. Review actual service naming conventions for Deals domain and add aliases where services use non-standard terminology.

**Validation**: Validate JSON syntax with `npx ajv-cli validate -s specs/002-domain-aliases/contracts/domain-data-flow.schema.json -d "src/assets/*-data-flow.json"`

---

### Phase 3: Service Layer Updates (60 minutes)

Update domain and data flow services to expose alias information.

#### 3.1 Update Data Flow Service

**File**: `src/app/domains/shared/services/data-flow.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomainDataFlow, DataFlowNode, extractAliases, ServiceAlias } from '../models/domain.model';

@Injectable({ providedIn: 'root' })
export class DataFlowService {
  constructor(private http: HttpClient) {}

  loadDataFlow(filename: string): Observable<DomainDataFlow> {
    return this.http.get<DomainDataFlow>(`/assets/${filename}`);
  }

  // NEW: Get aliases for a domain
  getAliasesForDomain(filename: string): Observable<ServiceAlias[]> {
    return this.loadDataFlow(filename).pipe(
      map(dataFlow => extractAliases(dataFlow))
    );
  }

  // NEW: Get alias for specific service in a domain
  getServiceAlias(serviceName: string, filename: string): Observable<string | undefined> {
    return this.loadDataFlow(filename).pipe(
      map(dataFlow => {
        const node = dataFlow.nodes.find(n => n.id === serviceName);
        return node?.alias;
      })
    );
  }
}
```

#### 3.2 Update Domain Service

**File**: `src/app/domains/shared/services/domain.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Domain, DomainWithAliases, ServiceAlias } from '../models/domain.model';
import { DataFlowService } from './data-flow.service';

@Injectable({ providedIn: 'root' })
export class DomainService {
  constructor(
    private http: HttpClient,
    private dataFlowService: DataFlowService
  ) {}

  getDomains(): Observable<Domain[]> {
    return this.http.get<Domain[]>('/assets/domains.json');
  }

  getDomain(name: string): Observable<Domain | undefined> {
    return this.getDomains().pipe(
      map(domains => domains.find(d => d.name === name))
    );
  }

  // NEW: Get domain with computed aliases
  getDomainWithAliases(name: string): Observable<DomainWithAliases | undefined> {
    return this.getDomain(name).pipe(
      switchMap(domain => {
        if (!domain) return of(undefined);
        
        return this.dataFlowService.getAliasesForDomain(domain.dataFlowFile).pipe(
          map(aliases => ({
            ...domain,
            aliases
          }))
        );
      })
    );
  }
}
```

**Validation**: Run `npm run lint` and fix any issues.

---

### Phase 4: Domain List Component (45 minutes)

Update the domain list view to show alias summary.

#### 4.1 Update Domain List Component

**File**: `src/app/domains/domains/domain-list/domain-list.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DomainService } from '../../shared/services/domain.service';
import { DomainWithAliases } from '../../shared/models/domain.model';

@Component({
  selector: 'app-domain-list',
  templateUrl: './domain-list.html',
  styleUrls: ['./domain-list.css']
})
export class DomainListComponent implements OnInit {
  domains$!: Observable<DomainWithAliases[]>;

  constructor(private domainService: DomainService) {}

  ngOnInit(): void {
    // Load all domains with alias counts
    this.domains$ = this.domainService.getDomains().pipe(
      switchMap(domains => {
        const domainWithAliases$ = domains.map(domain =>
          this.domainService.getDomainWithAliases(domain.name)
        );
        return combineLatest(domainWithAliases$);
      }),
      map(domains => domains.filter(d => d !== undefined) as DomainWithAliases[])
    );
  }

  getAliasCount(domain: DomainWithAliases): number {
    return domain.aliases.length;
  }

  getAliasText(domain: DomainWithAliases): string {
    const count = this.getAliasCount(domain);
    if (count === 0) return 'No service-specific names';
    if (count === 1) return '1 service-specific name';
    return `${count} service-specific names`;
  }
}
```

#### 4.2 Update Domain List Template

**File**: `src/app/domains/domains/domain-list/domain-list.html`

```html
<div class="domain-list">
  <h2>Domains</h2>
  
  @for (domain of domains$ | async; track domain.name) {
    <div class="domain-card">
      <h3>{{ domain.name }}</h3>
      <p class="description">{{ domain.description }}</p>
      <div class="metadata">
        <span class="division">{{ domain.division }} / {{ domain['sub-division'] }}</span>
        <span class="alias-info">{{ getAliasText(domain) }}</span>
      </div>
      
      @if (domain.aliases.length > 0) {
        <div class="aliases-preview">
          @for (alias of domain.aliases; track alias.serviceName) {
            <span class="alias-tag">{{ alias.serviceName }}: {{ alias.alias }}</span>
          }
        </div>
      }
    </div>
  }
</div>
```

#### 4.3 Add Styles

**File**: `src/app/domains/domains/domain-list/domain-list.css`

```css
.alias-info {
  color: #666;
  font-size: 0.9em;
  font-style: italic;
}

.aliases-preview {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.alias-tag {
  background: #e3f2fd;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  color: #1976d2;
}
```

**Validation**: Run `nx serve` and verify domain list shows alias counts.

---

### Phase 5: Domain Flow Visualization (90 minutes)

Update the D3.js data flow diagram to display aliases on service nodes.

#### 5.1 Update Domain Flow Component

**File**: `src/app/domains/domains/domain-flow/domain-flow.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
import { DataFlowService } from '../../shared/services/data-flow.service';
import { DomainDataFlow, DataFlowNode, getDisplayName, shouldDisplayAlias } from '../../shared/models/domain.model';

@Component({
  selector: 'app-domain-flow',
  templateUrl: './domain-flow.html',
  styleUrls: ['./domain-flow.css']
})
export class DomainFlowComponent implements OnInit {
  private dataFlow: DomainDataFlow | null = null;

  constructor(
    private route: ActivatedRoute,
    private dataFlowService: DataFlowService
  ) {}

  ngOnInit(): void {
    const domainName = this.route.snapshot.paramMap.get('domain');
    if (domainName) {
      this.loadDataFlow(domainName);
    }
  }

  private loadDataFlow(domainName: string): void {
    // Load domain to get data flow file
    this.domainService.getDomain(domainName).subscribe(domain => {
      if (domain) {
        this.dataFlowService.loadDataFlow(domain.dataFlowFile).subscribe(dataFlow => {
          this.dataFlow = dataFlow;
          this.renderGraph(dataFlow);
        });
      }
    });
  }

  private renderGraph(dataFlow: DomainDataFlow): void {
    // Existing D3 setup code...
    const svg = d3.select('#flow-diagram');
    const width = 800;
    const height = 600;

    // Create force simulation (existing code)
    const simulation = d3.forceSimulation(dataFlow.nodes)
      .force('link', d3.forceLink(dataFlow.edges).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw edges (existing code)
    const link = svg.selectAll('.link')
      .data(dataFlow.edges)
      .join('line')
      .attr('class', 'link');

    // Draw nodes (existing code with alias enhancement)
    const node = svg.selectAll('.node')
      .data(dataFlow.nodes)
      .join('g')
      .attr('class', 'node');

    // Add circle for node (existing)
    node.append('circle')
      .attr('r', 20)
      .attr('class', (d: DataFlowNode) => d.modifies ? 'modifies' : 'reads');

    // Add primary label (existing)
    node.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', '-25')
      .text((d: DataFlowNode) => d.id);

    // NEW: Add alias label below service name
    node.append('text')
      .attr('class', 'node-alias')
      .attr('text-anchor', 'middle')
      .attr('dy', '-10')
      .text((d: DataFlowNode) => {
        if (shouldDisplayAlias(d, dataFlow.domain)) {
          return `(${d.alias})`;
        }
        return '';
      });

    // Update positions on simulation tick (existing code)
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
  }
}
```

#### 5.2 Update Domain Flow Styles

**File**: `src/app/domains/domains/domain-flow/domain-flow.css`

```css
/* Existing styles... */

.node-alias {
  font-size: 10px;
  fill: #666;
  font-style: italic;
}

.node-label {
  font-size: 12px;
  font-weight: 600;
  fill: #333;
}
```

**Validation**: Navigate to a domain's flow diagram and verify aliases appear below service names.

---

### Phase 6: Service View Updates (60 minutes)

Update service view to show domain aliases used by that service.

#### 6.1 Update Service View Component

**File**: `src/app/services/services/service-view/service-view.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { DomainService } from '../../../domains/shared/services/domain.service';
import { DataFlowService } from '../../../domains/shared/services/data-flow.service';
import { formatDomainWithAlias } from '../../../domains/shared/models/domain.model';

interface DomainForService {
  domainName: string;
  alias: string;
}

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.html',
  styleUrls: ['./service-view.css']
})
export class ServiceViewComponent implements OnInit {
  serviceName: string = '';
  domains$!: Observable<DomainForService[]>;

  constructor(
    private route: ActivatedRoute,
    private domainService: DomainService,
    private dataFlowService: DataFlowService
  ) {}

  ngOnInit(): void {
    this.serviceName = this.route.snapshot.paramMap.get('service') ?? '';
    this.loadDomainsForService();
  }

  private loadDomainsForService(): void {
    // Get all domains, then find which ones use this service
    this.domains$ = this.domainService.getDomains().pipe(
      switchMap(domains => {
        const domainFlows$ = domains.map(domain =>
          this.dataFlowService.loadDataFlow(domain.dataFlowFile).pipe(
            map(dataFlow => {
              const node = dataFlow.nodes.find(n => n.id === this.serviceName);
              if (!node) return null;
              
              return {
                domainName: domain.name,
                alias: node.alias ?? domain.name
              };
            })
          )
        );
        
        return combineLatest(domainFlows$);
      }),
      map(results => results.filter(r => r !== null) as DomainForService[])
    );
  }

  formatDomainDisplay(domain: DomainForService): string {
    return formatDomainWithAlias(domain.domainName, domain.alias);
  }
}
```

#### 6.2 Update Service View Template

**File**: `src/app/services/services/service-view/service-view.html`

```html
<div class="service-view">
  <h2>Service: {{ serviceName }}</h2>
  
  <section class="domains-section">
    <h3>Domains Processed</h3>
    
    @if (domains$ | async; as domains) {
      @if (domains.length === 0) {
        <p class="no-domains">This service doesn't process any domains.</p>
      } @else {
        <ul class="domain-list">
          @for (domain of domains; track domain.domainName) {
            <li class="domain-item">
              {{ formatDomainDisplay(domain) }}
            </li>
          }
        </ul>
      }
    }
  </section>
</div>
```

**Validation**: Navigate to a service view and verify domains show with aliases.

---

### Phase 7: Testing (60 minutes)

Add tests for the new alias functionality.

#### 7.1 Unit Tests for Utility Functions

**File**: `src/app/domains/shared/models/domain.model.spec.ts`

```typescript
import { getDisplayName, shouldDisplayAlias, formatDomainWithAlias, DataFlowNode } from './domain.model';

describe('Domain Alias Utilities', () => {
  describe('getDisplayName', () => {
    it('should return alias when present', () => {
      const node: DataFlowNode = { id: 'JPharm', modifies: false, alias: 'References' };
      expect(getDisplayName(node, 'Commercial Items')).toBe('References');
    });

    it('should return domain name when alias missing', () => {
      const node: DataFlowNode = { id: 'OCR', modifies: false };
      expect(getDisplayName(node, 'Commercial Items')).toBe('Commercial Items');
    });
  });

  describe('shouldDisplayAlias', () => {
    it('should return true when alias differs from domain', () => {
      const node: DataFlowNode = { id: 'JPharm', modifies: false, alias: 'References' };
      expect(shouldDisplayAlias(node, 'Commercial Items')).toBe(true);
    });

    it('should return false when alias equals domain', () => {
      const node: DataFlowNode = { id: 'OCR', modifies: false, alias: 'Commercial Items' };
      expect(shouldDisplayAlias(node, 'Commercial Items')).toBe(false);
    });

    it('should return false when alias missing', () => {
      const node: DataFlowNode = { id: 'OCR', modifies: false };
      expect(shouldDisplayAlias(node, 'Commercial Items')).toBe(false);
    });
  });

  describe('formatDomainWithAlias', () => {
    it('should format with alias when different', () => {
      expect(formatDomainWithAlias('Commercial Items', 'References'))
        .toBe('Commercial Items (known as: References)');
    });

    it('should return domain name only when alias same', () => {
      expect(formatDomainWithAlias('Commercial Items', 'Commercial Items'))
        .toBe('Commercial Items');
    });

    it('should return domain name only when alias undefined', () => {
      expect(formatDomainWithAlias('Commercial Items', undefined))
        .toBe('Commercial Items');
    });
  });
});
```

#### 7.2 Component Tests

**File**: `src/app/domains/domains/domain-list/domain-list.spec.ts`

Add tests for alias display in domain list component.

**File**: `src/app/services/services/service-view/service-view.spec.ts`

Add tests for alias display in service view component.

**Validation**: Run `nx test` and ensure all tests pass.

---

### Phase 8: Documentation (30 minutes)

Update documentation with alias feature information.

#### 8.1 Update README

Add section explaining alias feature:

```markdown
## Domain Aliases

Services may use different names for domains than the canonical name. For example:
- **Domain**: Commercial Items
- **JPharm**: Refers to it as "References"
- **OCR**: Uses the standard name "Commercial Items"

Aliases are defined in the data flow JSON files and displayed throughout the UI.
```

#### 8.2 Data Maintenance Guide

Create guide for adding/updating aliases:

```markdown
## Adding Domain Aliases

1. Open the domain's data flow file (e.g., `src/assets/commercial-items-data-flow.json`)
2. Find the node for the service
3. Add an `alias` field with the service-specific name:
   ```json
   {
     "id": "ServiceName",
     "modifies": false,
     "alias": "What ServiceName calls this domain"
   }
   ```
4. Omit the `alias` field if the service uses the canonical domain name
```

---

## Validation Checklist

After completing all phases, verify:

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] All tests pass (`nx test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Domain list shows alias counts
- [ ] Domain flow diagram displays aliases on nodes
- [ ] Service view shows domain aliases
- [ ] JSON files validate against schema
- [ ] Backward compatibility maintained (existing data works)
- [ ] UI displays correctly with and without aliases
- [ ] Performance is acceptable (graph render <500ms)

## Troubleshooting

### Issue: Aliases not displaying

**Check**:
1. JSON file has correct `alias` field syntax
2. Component is using updated model types
3. Template has proper bindings

### Issue: TypeScript errors

**Check**:
1. All imports updated to include alias types
2. Optional chaining used for `alias?` field
3. Utility functions imported where needed

### Issue: D3 visualization broken

**Check**:
1. Node rendering code handles undefined aliases
2. Text elements positioned correctly
3. CSS classes applied properly

## Next Steps

After completing this implementation:

1. **User Testing**: Have domain experts validate alias accuracy
2. **Data Migration**: Add aliases to remaining domain flow files
3. **Enhancement**: Consider adding alias history/versioning
4. **Export**: Include aliases in diagram export functionality

## Time Estimates

| Phase | Estimated Time | Dependencies |
|-------|----------------|--------------|
| 1. Type Definitions | 30 min | None |
| 2. Data Files | 45 min | Phase 1 |
| 3. Service Layer | 60 min | Phase 1, 2 |
| 4. Domain List | 45 min | Phase 3 |
| 5. Domain Flow | 90 min | Phase 3 |
| 6. Service View | 60 min | Phase 3 |
| 7. Testing | 60 min | Phases 4-6 |
| 8. Documentation | 30 min | All phases |
| **Total** | **6 hours** | |

Add 1-2 hours buffer for debugging and refinement.

## Resources

- **Spec**: `specs/002-domain-aliases/spec.md`
- **Research**: `specs/002-domain-aliases/research.md`
- **Data Model**: `specs/002-domain-aliases/data-model.md`
- **Contracts**: `specs/002-domain-aliases/contracts/`
- **Angular Docs**: https://angular.io/docs
- **D3.js Docs**: https://d3js.org/
