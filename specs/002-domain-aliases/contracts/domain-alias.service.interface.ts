/**
 * Service layer contract for domain alias operations
 * 
 * @module domain-alias.service.interface
 * @version 1.0.0
 */

import { Observable } from 'rxjs';
import { Domain, DomainWithAliases, ServiceAlias, DomainDataFlow } from './domain.types';

/**
 * Service interface for domain alias operations
 * 
 * @remarks
 * This interface defines the contract for services that provide
 * domain and alias information to UI components.
 */
export interface DomainAliasService {
  /**
   * Get basic domain information by name
   * 
   * @param name - Canonical domain name
   * @returns Observable of domain data
   * @throws Error if domain not found
   */
  getDomain(name: string): Observable<Domain>;

  /**
   * Get all domains
   * 
   * @returns Observable of domain array
   */
  getAllDomains(): Observable<Domain[]>;

  /**
   * Get domain enriched with alias information
   * 
   * @param name - Canonical domain name
   * @returns Observable of domain with computed aliases
   * @throws Error if domain or data flow file not found
   * 
   * @remarks
   * This method loads both the domain metadata and its data flow graph,
   * then computes the ServiceAlias array from the flow nodes.
   */
  getDomainWithAliases(name: string): Observable<DomainWithAliases>;

  /**
   * Get all service-specific aliases for a domain
   * 
   * @param domainName - Canonical domain name
   * @returns Observable of alias array (may be empty)
   * @throws Error if domain or data flow file not found
   * 
   * @remarks
   * Returns only aliases that differ from the canonical domain name.
   * Services using the standard name are omitted.
   */
  getAliasesForDomain(domainName: string): Observable<ServiceAlias[]>;

  /**
   * Get the data flow graph for a domain
   * 
   * @param domainName - Canonical domain name
   * @returns Observable of complete data flow graph
   * @throws Error if domain or data flow file not found
   */
  getDataFlow(domainName: string): Observable<DomainDataFlow>;

  /**
   * Get the aliases a specific service uses for a domain
   * 
   * @param serviceName - Name of the service
   * @param domainName - Canonical domain name
   * @returns Observable of aliases array, or undefined if service uses canonical name
   * @throws Error if domain or service not found in data flow
   * 
   * @example
   * getServiceAliases("JPharm", "Commercial Items").subscribe(aliases => {
   *   console.log(aliases); // ["References", "Citations"]
   * });
   */
  getServiceAliases(serviceName: string, domainName: string): Observable<string[] | undefined>;
}

/**
 * Service interface for service-centric views
 * 
 * @remarks
 * Provides methods to view domains from a service's perspective,
 * including what each domain is called by that service.
 */
export interface ServiceViewService {
  /**
   * Get all domains processed by a service, with aliases
   * 
   * @param serviceName - Name of the service
   * @returns Observable of domains with their service-specific aliases
   * 
   * @remarks
   * Searches all data flow files to find domains that include this service,
   * then returns the domain with the alias the service uses.
   */
  getDomainsForService(serviceName: string): Observable<DomainServiceAlias[]>;
}

/**
 * Domain with the service-specific aliases
 * 
 * @remarks
 * Used in service-centric views to show what a service calls each domain.
 */
export interface DomainServiceAlias {
  /** Canonical domain name */
  domainName: string;
  
  /** What this service calls the domain (array of aliases) */
  aliases: string[];
  
  /** Domain metadata */
  domain: Domain;
}

/**
 * Data flow service interface
 * 
 * @remarks
 * Low-level service for loading and parsing data flow JSON files.
 */
export interface DataFlowService {
  /**
   * Load data flow from JSON file
   * 
   * @param filename - Filename relative to /src/assets/
   * @returns Observable of parsed data flow
   * @throws Error if file not found or invalid JSON
   */
  loadDataFlow(filename: string): Observable<DomainDataFlow>;

  /**
   * Validate data flow structure
   * 
   * @param dataFlow - Data flow object to validate
   * @returns Array of validation errors (empty if valid)
   * 
   * @remarks
   * Validates:
   * - All node IDs reference existing services
   * - All edge endpoints reference nodes in the flow
   * - Initialization services reference nodes in the flow
   * - Graph is acyclic
   */
  validateDataFlow(dataFlow: DomainDataFlow): ValidationError[];
}

/**
 * Data validation error
 */
export interface ValidationError {
  /** Error code for programmatic handling */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** JSON path to the problematic field (e.g., "nodes[2].id") */
  path?: string;
  
  /** Severity level */
  severity: 'error' | 'warning';
}
