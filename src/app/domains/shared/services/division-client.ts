import { Injectable, inject, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Division {
  division: string;
  'sub-divisions': string[];
}

@Injectable({
  providedIn: 'root'
})
export class DivisionClient {
  private http = inject(HttpClient);
  private divisionsSignal = signal<Division[]>([]);
  public divisions: Signal<Division[]> = this.divisionsSignal.asReadonly();

  constructor() {
    this.loadDivisions();
  }

  private loadDivisions(): void {
    this.http.get<Division[]>('assets/divisions.json').pipe(
      tap(data => {
        this.divisionsSignal.set(data);
      }),
      catchError(error => {
        console.error('Error loading divisions:', error);
        this.divisionsSignal.set([]);
        return of([]);
      })
    ).subscribe();
  }

  getDivisions(): Signal<Division[]> {
    return this.divisions;
  }
}
