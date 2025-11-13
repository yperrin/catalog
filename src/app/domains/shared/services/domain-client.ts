import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { Domain, DomainWithAliases, ServiceAlias } from '../models/domain';
import { DataFlowClient } from './data-flow-client';

@Injectable({
  providedIn: 'root'
})
export class DomainClient {
  private http = inject(HttpClient);
  private dataFlowClient = inject(DataFlowClient);
  private domainsSignal = signal<Domain[]>([]);
  public domains: Signal<Domain[]> = this.domainsSignal.asReadonly();

  constructor() {
    this.loadDomains();
  }

  private loadDomains(): void {
    this.http.get<Domain[]>('assets/domains.json').pipe(
      tap(data => {
        this.domainsSignal.set(data);
      }),
      catchError(error => {
        console.error('Error loading domains:', error);
        this.domainsSignal.set([]);
        return of([]);
      })
    ).subscribe();
  }

  getDomains(): Signal<Domain[]> {
    return this.domains;
  }

  // Get a single domain by name
  getDomain(name: string): Observable<Domain | undefined> {
    return of(this.domains()).pipe(
      map(domains => domains.find(d => d.name === name))
    );
  }

  // Get domain with computed aliases from data flow
  getDomainWithAliases(name: string): Observable<DomainWithAliases | undefined> {
    return this.getDomain(name).pipe(
      switchMap(domain => {
        if (!domain || !domain.dataFlowFile) {
          return of(domain ? { ...domain, aliases: [] } as DomainWithAliases : undefined);
        }
        
        return this.dataFlowClient.getAliasesForDomain(domain.dataFlowFile).pipe(
          map(aliases => ({
            ...domain,
            aliases
          } as DomainWithAliases))
        );
      })
    );
  }

  // Get all aliases for a specific domain
  getAliasesForDomain(domainName: string): Observable<ServiceAlias[]> {
    return this.getDomain(domainName).pipe(
      switchMap(domain => {
        if (!domain || !domain.dataFlowFile) {
          return of([]);
        }
        return this.dataFlowClient.getAliasesForDomain(domain.dataFlowFile);
      })
    );
  }
}
