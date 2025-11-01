import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, take } from 'rxjs/operators';
import { Domain } from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private http = inject(HttpClient);
  private domainsSubject = new BehaviorSubject<Domain[]>([]);
  domains$: Observable<Domain[]> = this.domainsSubject.asObservable();
  private domains: Domain[] = [];

  constructor() {
    this.loadDomains();
  }

  private loadDomains(): void {
    this.http.get<Domain[]>('assets/domains.json').pipe(
      take(1),
      tap(data => {
        this.domains = data;
        this.domainsSubject.next(this.domains);
      }),
      catchError(error => {
        console.error('Error loading domains:', error);
        // If domains.json is not found or empty, initialize with an empty array
        this.domains = [];
        this.domainsSubject.next(this.domains);
        return of([]);
      })
    ).subscribe();
  }

  getDomains(): Observable<Domain[]> {
    return this.domains$;
  }

}
