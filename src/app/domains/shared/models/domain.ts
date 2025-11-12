export interface Domain {
  name: string;
  description?: string;
  division?: string;
  'sub-division'?: string;
  dataFlowFile?: string;
}

export interface DataFlowNode {
  id: string;
  modifies: boolean;
  aliases?: string[];  // Optional array of service-specific names for the domain
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

export interface ServiceAlias {
  serviceName: string;
  alias: string;
  domainName: string;
}

export interface DomainWithAliases extends Domain {
  aliases: ServiceAlias[];
}

// Type guard for nodes with aliases
export function hasAliases(node: DataFlowNode): node is DataFlowNode & { aliases: string[] } {
  return node.aliases !== undefined && node.aliases.length > 0;
}

// Get primary display name (first alias or domain name)
export function getPrimaryDisplayName(node: DataFlowNode, domainName: string): string {
  return node.aliases?.[0] ?? domainName;
}

// Check if aliases should be displayed separately (only when different from domain name)
export function shouldDisplayAliases(node: DataFlowNode, domainName: string): boolean {
  if (!hasAliases(node)) return false;
  // Display if any alias differs from domain name
  return node.aliases.some(alias => alias !== domainName);
}

// Format single domain with alias for display
export function formatDomainWithAlias(domainName: string, alias?: string): string {
  if (!alias || alias === domainName) return domainName;
  return `${domainName} (known as: ${alias})`;
}

// Format domain with multiple aliases for display
export function formatDomainWithAliases(domainName: string, aliases?: string[]): string {
  if (!aliases || aliases.length === 0) return domainName;
  const uniqueAliases = aliases.filter(a => a !== domainName);
  if (uniqueAliases.length === 0) return domainName;
  return `${domainName} (known as: ${uniqueAliases.join(', ')})`;
}

// Extract all service-alias pairs from a data flow
export function extractAliases(dataFlow: DomainDataFlow): ServiceAlias[] {
  const aliases: ServiceAlias[] = [];
  
  for (const node of dataFlow.nodes) {
    if (hasAliases(node)) {
      for (const alias of node.aliases) {
        aliases.push({
          serviceName: node.id,
          alias: alias,
          domainName: dataFlow.domain
        });
      }
    }
  }
  
  return aliases;
}
