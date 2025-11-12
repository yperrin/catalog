import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DomainDataFlow, ServiceAlias, extractAliases } from '../models/domain';

@Injectable({
  providedIn: 'root'
})
export class DataFlowClient {
  private http = inject(HttpClient);

  getDataFlow(fileName: string): Observable<DomainDataFlow | undefined> {
    return this.http.get<DomainDataFlow>(`assets/${fileName}`).pipe(
      catchError(error => {
        console.error('Error loading data flow:', error);
        return of(undefined);
      })
    );
  }

  // Get all service-alias pairs for a domain
  getAliasesForDomain(filename: string): Observable<ServiceAlias[]> {
    return this.getDataFlow(filename).pipe(
      map(dataFlow => dataFlow ? extractAliases(dataFlow) : [])
    );
  }

  // Get alias for a specific service in a domain
  getServiceAlias(serviceName: string, filename: string): Observable<string | undefined> {
    return this.getDataFlow(filename).pipe(
      map(dataFlow => {
        if (!dataFlow) return undefined;
        const node = dataFlow.nodes.find(n => n.id === serviceName);
        return node?.aliases?.[0];
      })
    );
  }
}
