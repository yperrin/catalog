import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Domain } from '../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private http = inject(HttpClient);
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
}
