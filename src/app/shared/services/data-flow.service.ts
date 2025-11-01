import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface DataFlow {
  domain: string;
  nodes: { id: string; modifies: boolean }[];
  edges: { source: string; target: string }[];
  initialization: { services: string[] };
}

@Injectable({
  providedIn: 'root'
})
export class DataFlowService {
  private http = inject(HttpClient);

  getDataFlow(fileName: string): Observable<DataFlow | undefined> {
    return this.http.get<DataFlow>(`assets/${fileName}`).pipe(
      catchError(error => {
        console.error('Error loading data flow:', error);
        return of(undefined);
      })
    );
  }
}
