import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, take } from 'rxjs/operators';

export interface Division {
  division: string;
  'sub-divisions': string[];
}

@Injectable({
  providedIn: 'root'
})
export class DivisionService {
  private http = inject(HttpClient);
  private divisionsSubject = new BehaviorSubject<Division[]>([]);
  divisions$: Observable<Division[]> = this.divisionsSubject.asObservable();
  private divisions: Division[] = [];

  constructor() {
    this.loadDivisions();
  }

  private loadDivisions(): void {
    this.http.get<Division[]>('assets/divisions.json').pipe(
      take(1),
      tap(data => {
        this.divisions = data;
        this.divisionsSubject.next(this.divisions);
      }),
      catchError(error => {
        console.error('Error loading divisions:', error);
        this.divisions = [];
        this.divisionsSubject.next(this.divisions);
        return of([]);
      })
    ).subscribe();
  }

  getDivisions(): Observable<Division[]> {
    return this.divisions$;
  }
}
