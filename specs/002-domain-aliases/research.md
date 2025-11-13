# Research: Domain Aliases

**Feature**: 002-domain-aliases  
**Date**: 2025-11-11  
**Status**: Complete

## Overview

This document consolidates research findings for implementing service-specific domain aliases in the catalog application. The research addresses data model design, JSON schema patterns, Angular component integration, and D3.js visualization enhancements.

## Research Questions & Findings

### 1. JSON Schema Design for Aliases

**Question**: How should we structure the JSON data to capture service-specific aliases while maintaining backward compatibility with the existing data flow format?

**Decision**: Add an optional `alias` field to node objects in the data flow JSON files.

**Rationale**:
- **Backward Compatible**: Optional fields don't break existing parsers; systems that don't support aliases will simply ignore the field
- **Locality**: The alias is stored directly on the node object, making it immediately accessible when processing or rendering nodes
- **Semantic Clarity**: The alias is contextual to the specific domain flow, which matches the business requirement (JPharm calls Commercial Items "References" in the Commercial Items flow)
- **Minimal Redundancy**: Avoids creating a separate lookup table or mapping file that would need to be synchronized

**Alternatives Considered**:
1. **Separate aliases.json file**: Rejected because it introduces synchronization issues and requires additional file loading/merging logic
2. **Add aliases to services.json**: Rejected because aliases are domain-specific relationships, not service properties
3. **Create a domain-service mapping table**: Rejected as over-engineered for the current scale and requirements

**Implementation Pattern**:
```json
{
  "domain": "Commercial Items",
  "nodes": [
    {
      "id": "OCR",
      "modifies": false,
      "alias": "Commercial Items"  // Optional: explicit when same as domain
    },
    {
      "id": "JPharm",
      "modifies": false,
      "alias": "References"  // Service-specific alias
    }
  ]
}
```

---

### 2. TypeScript Type Safety for Aliases

**Question**: How should we model aliases in TypeScript to ensure type safety and IDE support while accommodating the optional nature of aliases?

**Decision**: Define interfaces with optional `alias` property and create utility functions for alias resolution.

**Rationale**:
- **Type Safety**: TypeScript interfaces ensure compile-time validation of data structure
- **Optional Handling**: Using `alias?: string` allows nodes without aliases while providing type checking when present
- **Default Logic**: Utility functions can handle the common pattern "if no alias exists, use the domain name"
- **IntelliSense Support**: Developers get autocomplete and type hints when working with alias data

**Alternatives Considered**:
1. **Always require alias field**: Rejected because it forces redundant data (setting alias = domain name for most services)
2. **Use union types (string | undefined)**: Rejected in favor of optional property syntax which is more idiomatic in TypeScript
3. **Create separate AliasedNode and SimpleNode types**: Rejected as over-complicated; discriminated unions not needed here

**Implementation Pattern**:
```typescript
export interface DataFlowNode {
  id: string;
  modifies: boolean;
  alias?: string;  // Optional: service-specific name for the domain
}

export interface DomainDataFlow {
  domain: string;  // Primary canonical name
  nodes: DataFlowNode[];
  edges: DataFlowEdge[];
  initialization: { services: string[] };
}

// Utility function for consistent alias resolution
export function getDisplayName(node: DataFlowNode, domainName: string): string {
  return node.alias ?? domainName;
}
```

---

### 3. Angular Component Update Strategy

**Question**: What's the best approach for updating Angular components to display alias information without causing UI clutter or confusion?

**Decision**: Display aliases inline with contextual formatting: "Primary Name (known as: Alias)" pattern in lists and labels in visualizations.

**Rationale**:
- **Clarity**: The "known as" phrase explicitly signals that this is an alternative name, not a separate entity
- **Compactness**: Inline display avoids adding separate UI sections or modals for simple alias information
- **Contextual**: The primary domain name appears first, maintaining the canonical identifier as the primary reference
- **Scannable**: Users can quickly identify whether aliases differ from the primary name

**Alternatives Considered**:
1. **Tooltips only**: Rejected because important information should be visible without interaction
2. **Separate "Aliases" section**: Rejected as too heavyweight for what's often a single alternative name
3. **Badge/pill UI components**: Rejected because they would clutter list views and distract from primary information

**Implementation Guidelines**:
- **Domain List View**: Show alias count summary (e.g., "3 service-specific names")
- **Domain Flow View**: Annotate service nodes in D3 graph with aliases below service name
- **Service View**: Display "DomainName (known as: Alias)" for each domain processed

---

### 4. D3.js Visualization Enhancement

**Question**: How should we display alias information in the D3.js force-directed graph without cluttering the visualization or impacting performance?

**Decision**: Add a secondary text element below each service node label showing the alias in a smaller, lighter font style.

**Rationale**:
- **Visual Hierarchy**: Primary service name remains prominent; alias is secondary
- **No Interaction Required**: Alias is always visible, unlike tooltips which require hover
- **Performance**: Text elements are lightweight; adding one per node has negligible impact
- **Layout Stability**: Text doesn't affect force simulation; nodes position based on existing logic

**Alternatives Considered**:
1. **Tooltips on hover**: Rejected because it requires user action and hides important context by default
2. **Edge labels**: Rejected because aliases are properties of nodes (services), not relationships
3. **Color coding**: Rejected because color should indicate modification status, not aliases
4. **Expandable nodes**: Rejected as over-engineered; the alias text is short and doesn't require progressive disclosure

**Implementation Pattern**:
```typescript
// In domain-flow.ts D3 rendering logic
nodeGroup.append('text')
  .attr('class', 'node-label')
  .text(d => d.id);

// Add alias text below primary label
nodeGroup.append('text')
  .attr('class', 'node-alias')
  .attr('dy', '1.2em')  // Position below primary label
  .style('font-size', '10px')
  .style('fill', '#666')
  .text(d => d.alias && d.alias !== domainName ? `(${d.alias})` : '');
```

---

### 5. Data Migration and Backward Compatibility

**Question**: How do we ensure existing functionality continues to work while introducing alias support?

**Decision**: Make the alias field optional and ensure all existing code treats missing aliases as "use the domain name."

**Rationale**:
- **No Breaking Changes**: Existing JSON files without alias fields will continue to parse correctly
- **Gradual Adoption**: Teams can add aliases incrementally as they map service-specific terminology
- **Defensive Coding**: Use optional chaining (`node.alias?.`) and nullish coalescing (`??`) to handle missing aliases
- **Default Behavior**: When no alias is present, the system behaves exactly as before

**Alternatives Considered**:
1. **Require aliases for all nodes**: Rejected because it forces immediate migration of all data files
2. **Add default aliases during parsing**: Rejected because it modifies source data semantics
3. **Create a migration script**: Rejected as unnecessary since optional fields provide natural migration path

**Migration Strategy**:
1. Deploy code changes with optional alias support
2. Update data files one domain at a time
3. Add aliases only where services use different terminology
4. No downtime or coordination required

---

### 6. Edge Cases and Validation

**Question**: What validation rules should we enforce for aliases, and how do we handle edge cases?

**Decision**: 
- Aliases are optional strings with no length constraints
- Empty strings are treated as "no alias"
- Aliases identical to domain name are allowed but not displayed differently
- No uniqueness constraints on aliases across services

**Rationale**:
- **Simplicity**: Minimal validation reduces implementation complexity
- **Flexibility**: Services may legitimately use variations of the domain name
- **Disambiguation**: The UI context (service view) makes it clear which service uses which alias
- **Reality Alignment**: In real systems, multiple services might coincidentally use the same alternative name for different domains

**Edge Cases Addressed**:
1. **Alias = Domain Name**: Display only domain name (no redundant "known as" clause)
2. **Empty/Null Alias**: Treat as missing; use domain name
3. **Very Long Aliases**: UI will truncate with ellipsis in constrained layouts
4. **Special Characters**: Allow any valid string; no sanitization needed (data is trusted)

**Validation Rules**:
```typescript
function isValidAlias(alias: string | undefined, domainName: string): boolean {
  // Missing alias is valid
  if (!alias) return true;
  
  // Empty string treated as missing
  if (alias.trim() === '') return true;
  
  // Any non-empty string is valid
  return true;
}

function shouldDisplayAlias(alias: string | undefined, domainName: string): boolean {
  // Don't display if missing or empty
  if (!alias || alias.trim() === '') return false;
  
  // Don't display if identical to domain name
  if (alias === domainName) return false;
  
  return true;
}
```

---

## Best Practices Summary

### JSON Data Files
- Add `alias` field only when the service uses a different name than the domain
- Omit `alias` field when the service uses the standard domain name
- Use clear, business-meaningful alias names that match actual system terminology

### TypeScript Models
- Use optional properties (`alias?: string`) for alias fields
- Provide utility functions for common operations (getDisplayName, shouldDisplayAlias)
- Leverage TypeScript's type system to prevent null/undefined errors

### Angular Components
- Use consistent formatting: "Primary Name (known as: Alias)"
- Show aliases inline in context rather than in separate UI sections
- Provide summary information in list views, detailed aliases in detail views

### D3.js Visualization
- Add alias text as secondary labels below service names
- Use visual hierarchy (smaller font, lighter color) to indicate secondary information
- Ensure alias text doesn't interfere with graph layout or interactivity

### Testing Strategy
- Test missing alias (should display domain name)
- Test explicit alias (should display both)
- Test alias = domain name (should display only once)
- Test empty string alias (should display domain name)
- Verify backward compatibility with JSON files lacking alias fields

---

## Performance Considerations

**Data Loading**: Adding optional alias fields has negligible impact on JSON parsing time. The additional string data is minimal (typically <50 characters per node).

**Rendering**: Adding secondary text elements to D3 visualizations adds minimal overhead:
- One additional text element per service node (~10-20 nodes typical)
- No impact on force simulation calculations
- Text rendering is GPU-accelerated in modern browsers

**Memory**: Alias strings add ~50 bytes per node. For 100 services across 10 domains, this is ~50KB total, negligible in modern web applications.

**Expected Impact**: <5% increase in data size, <2% increase in rendering time, imperceptible to users.

---

## Technology-Specific Patterns

### Angular Signals (if using Angular 16+)
Current application uses Angular 20.3.0, which supports signals. Consider using signals for reactive alias display:

```typescript
// In domain service
domainAlias = computed(() => {
  const node = this.currentNode();
  const domain = this.currentDomain();
  return node?.alias ?? domain?.name ?? '';
});
```

### RxJS Streams
For components using observables (current pattern in the codebase):

```typescript
// In component
displayName$ = combineLatest([
  this.dataFlowService.selectedNode$,
  this.domainService.currentDomain$
]).pipe(
  map(([node, domain]) => node?.alias ?? domain.name)
);
```

### D3.js v7 Patterns
Use D3 v7's selection.join() for efficient updates when alias data changes:

```typescript
const aliasText = nodeGroup.selectAll('.node-alias')
  .data(d => [d])
  .join('text')
  .attr('class', 'node-alias')
  .text(d => shouldDisplayAlias(d.alias, domainName) ? `(${d.alias})` : '');
```

---

## Implementation Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| UI becomes cluttered with alias text | Medium | Low | Use secondary styling, conditional display |
| Confusion between domains and aliases | High | Low | Clear labeling with "known as" pattern |
| Data inconsistency across files | Medium | Medium | Validation script, documentation |
| Performance impact on large graphs | Medium | Very Low | Conditional rendering, text element pooling |

---

## References

- Existing data model: `src/assets/*-data-flow.json`
- TypeScript interfaces: `src/app/domains/shared/models/`
- D3 visualization: `src/app/domains/domains/domain-flow/`
- Angular services: `src/app/domains/shared/services/`

---

## Conclusion

The alias feature can be implemented with minimal changes to the existing architecture. By adding optional alias fields to data flow JSON files and updating Angular components to display this information contextually, we provide significant value (clarifying service-specific terminology) with low implementation risk and minimal performance impact.

**Key Success Factors**:
1. Maintain backward compatibility through optional fields
2. Use consistent UI patterns for alias display
3. Leverage TypeScript for type safety
4. Keep visualization enhancements simple and non-intrusive
5. Document alias conventions for data maintainers
