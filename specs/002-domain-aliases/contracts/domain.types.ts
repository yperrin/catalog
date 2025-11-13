/**
 * Core TypeScript type definitions for Domain Aliases feature
 * 
 * @module domain.types
 * @version 1.0.0
 */

/**
 * Represents a business domain/data category
 * 
 * @remarks
 * Domains have a canonical name that is used as the primary identifier.
 * Each domain has one associated data flow graph.
 */
export interface Domain {
  /** Canonical/primary name - unique across all domains */
  name: string;
  
  /** Top-level business division (e.g., "LS&H", "A&G") */
  division: string;
  
  /** Secondary organizational grouping */
  'sub-division': string;
  
  /** Human-readable business description */
  description: string;
  
  /** Filename (relative to /src/assets/) of the data flow JSON */
  dataFlowFile: string;
}

/**
 * Represents a service/system that processes domains
 */
export interface Service {
  /** Unique service identifier */
  name: string;
  
  /** Technical and business description */
  description: string;
  
  /** Business division */
  division: string;
  
  /** Optional sub-division (can be null) */
  'sub-division': string | null;
  
  /** Whether this is a content service (true) or consumer (false) */
  content: boolean;
}

/**
 * Represents a service's participation in a domain's data flow
 * 
 * @remarks
 * The optional `aliases` array captures what this specific service
 * calls the domain. If omitted, the service uses the canonical domain name.
 */
export interface DataFlowNode {
  /** Service name (must match a Service.name) */
  id: string;
  
  /** Whether this service modifies the domain data */
  modifies: boolean;
  
  /** 
   * Optional: array of service-specific names for the domain
   * 
   * @remarks
   * - If undefined: service uses the canonical domain name
   * - If present: these are what the service calls the domain internally
   * - Can include the domain name (explicit confirmation of standard naming)
   * - Multiple aliases support different contexts within the same service
   * 
   * @example
   * // JPharm calls "Commercial Items" by multiple aliases
   * { id: "JPharm", modifies: false, aliases: ["References", "Citations"] }
   * 
   * @example
   * // OCR uses the standard domain name (no aliases needed)
   * { id: "OCR", modifies: false }
   */
  aliases?: string[];
}

/**
 * Represents a directed edge in the data flow graph
 */
export interface DataFlowEdge {
  /** Source service name (must match a DataFlowNode.id) */
  source: string;
  
  /** Target service name (must match a DataFlowNode.id) */
  target: string;
}

/**
 * Complete data flow graph for a single domain
 * 
 * @remarks
 * This is an aggregate root containing all nodes, edges, and
 * initialization services for one domain's processing pipeline.
 */
export interface DomainDataFlow {
  /** Canonical domain name (must match a Domain.name) */
  domain: string;
  
  /** Services that process this domain */
  nodes: DataFlowNode[];
  
  /** Directed connections between services */
  edges: DataFlowEdge[];
  
  /** Entry point services for this domain */
  initialization: {
    /** Service names that initiate processing for this domain */
    services: string[];
  };
}

/**
 * Domain enriched with computed alias information
 * 
 * @remarks
 * This is a view model created by combining Domain data with
 * aliases extracted from the domain's data flow graph.
 */
export interface DomainWithAliases extends Domain {
  /** All service-specific aliases for this domain */
  aliases: ServiceAlias[];
}

/**
 * Represents one service's alias for a domain
 * 
 * @remarks
 * This is a value object computed from DataFlowNode data.
 */
export interface ServiceAlias {
  /** Name of the service using this alias */
  serviceName: string;
  
  /** The alias text (what the service calls the domain) */
  alias: string;
  
  /** The canonical domain name being aliased */
  domainName: string;
}

/**
 * Type guard to check if a node has aliases defined
 * 
 * @param node - The data flow node to check
 * @returns True if node has a non-empty aliases array
 * 
 * @example
 * if (hasAliases(node)) {
 *   console.log(node.aliases); // TypeScript knows aliases is defined
 * }
 */
export function hasAliases(node: DataFlowNode): node is DataFlowNode & { aliases: string[] } {
  return node.aliases !== undefined && node.aliases.length > 0;
}

/**
 * Get the primary display name for a service in a domain flow
 * 
 * @param node - The data flow node
 * @param domainName - The canonical domain name
 * @returns The first alias if present, otherwise the domain name
 * 
 * @example
 * getPrimaryDisplayName({ id: "JPharm", modifies: false, aliases: ["References", "Citations"] }, "Commercial Items")
 * // Returns: "References"
 * 
 * @example
 * getPrimaryDisplayName({ id: "OCR", modifies: false }, "Commercial Items")
 * // Returns: "Commercial Items"
 */
export function getPrimaryDisplayName(node: DataFlowNode, domainName: string): string {
  return node.aliases?.[0] ?? domainName;
}

/**
 * Get all display names for a service in a domain flow
 * 
 * @param node - The data flow node
 * @param domainName - The canonical domain name
 * @returns All aliases if present, otherwise an array with the domain name
 * 
 * @example
 * getAllDisplayNames({ id: "JPharm", modifies: false, aliases: ["References", "Citations"] }, "Commercial Items")
 * // Returns: ["References", "Citations"]
 * 
 * @example
 * getAllDisplayNames({ id: "OCR", modifies: false }, "Commercial Items")
 * // Returns: ["Commercial Items"]
 */
export function getAllDisplayNames(node: DataFlowNode, domainName: string): string[] {
  if (hasAliases(node)) {
    return node.aliases;
  }
  return [domainName];
}

/**
 * Check if aliases should be displayed separately from the domain name
 * 
 * @param node - The data flow node
 * @param domainName - The canonical domain name
 * @returns True if the node has aliases that differ from the domain name
 * 
 * @remarks
 * Returns false if:
 * - Node has no aliases
 * - Aliases array is empty
 * - All aliases exactly equal domain name
 * 
 * @example
 * shouldDisplayAliases({ id: "JPharm", aliases: ["References", "Citations"] }, "Commercial Items")
 * // Returns: true
 * 
 * @example
 * shouldDisplayAliases({ id: "OCR", aliases: ["Commercial Items"] }, "Commercial Items")
 * // Returns: false (redundant)
 */
export function shouldDisplayAliases(node: DataFlowNode, domainName: string): boolean {
  if (!hasAliases(node)) return false;
  // Display if any alias differs from domain name
  return node.aliases.some(alias => alias !== domainName);
}

/**
 * Format domain name with optional alias for display
 * 
 * @param domainName - The canonical domain name
 * @param alias - Optional service-specific alias
 * @returns Formatted string for UI display
 * 
 * @example
 * formatDomainWithAlias("Commercial Items", "References")
 * // Returns: "Commercial Items (known as: References)"
 * 
 * @example
 * formatDomainWithAlias("Commercial Items", undefined)
 * // Returns: "Commercial Items"
 * 
 * @example
 * formatDomainWithAlias("Commercial Items", "Commercial Items")
 * // Returns: "Commercial Items" (no redundant annotation)
 */
export function formatDomainWithAlias(domainName: string, alias?: string): string {
  if (!alias || alias === domainName) return domainName;
  return `${domainName} (known as: ${alias})`;
}

/**
 * Format domain name with optional aliases array for display
 * 
 * @param domainName - The canonical domain name
 * @param aliases - Optional array of service-specific aliases
 * @returns Formatted string for UI display
 * 
 * @example
 * formatDomainWithAliases("Commercial Items", ["References", "Citations"])
 * // Returns: "Commercial Items (known as: References, Citations)"
 * 
 * @example
 * formatDomainWithAliases("Commercial Items", undefined)
 * // Returns: "Commercial Items"
 * 
 * @example
 * formatDomainWithAliases("Commercial Items", ["Commercial Items"])
 * // Returns: "Commercial Items" (no redundant annotation)
 */
export function formatDomainWithAliases(domainName: string, aliases?: string[]): string {
  if (!aliases || aliases.length === 0) return domainName;
  const uniqueAliases = aliases.filter(a => a !== domainName);
  if (uniqueAliases.length === 0) return domainName;
  return `${domainName} (known as: ${uniqueAliases.join(', ')})`;
}

/**
 * Extract all aliases from a domain data flow
 * 
 * @param dataFlow - The domain data flow graph
 * @returns Array of service aliases (flattened from all nodes)
 * 
 * @remarks
 * Only includes nodes with explicit aliases that differ from the domain name.
 * Services using only the canonical name are omitted.
 * Each alias from a node's aliases array becomes a separate ServiceAlias entry.
 * 
 * @example
 * extractAliases(commercialItemsFlow)
 * // Returns: [
 * //   { serviceName: "JPharm", alias: "References", domainName: "Commercial Items" },
 * //   { serviceName: "JPharm", alias: "Citations", domainName: "Commercial Items" }
 * // ]
 */
export function extractAliases(dataFlow: DomainDataFlow): ServiceAlias[] {
  const result: ServiceAlias[] = [];
  
  for (const node of dataFlow.nodes) {
    if (!hasAliases(node)) continue;
    
    for (const alias of node.aliases) {
      // Only include aliases that differ from the domain name
      if (alias !== dataFlow.domain) {
        result.push({
          serviceName: node.id,
          alias: alias,
          domainName: dataFlow.domain
        });
      }
    }
  }
  
  return result;
}

/**
 * Get the aliases a specific service uses for a domain
 * 
 * @param serviceName - Name of the service
 * @param dataFlow - The domain data flow graph
 * @returns The aliases array, or undefined if service not found or has no aliases
 * 
 * @example
 * getAliasesForService("JPharm", commercialItemsFlow)
 * // Returns: ["References", "Citations"]
 * 
 * @example
 * getAliasesForService("OCR", commercialItemsFlow)
 * // Returns: undefined (uses domain name)
 */
export function getAliasesForService(
  serviceName: string, 
  dataFlow: DomainDataFlow
): string[] | undefined {
  const node = dataFlow.nodes.find(n => n.id === serviceName);
  return node?.aliases;
}
