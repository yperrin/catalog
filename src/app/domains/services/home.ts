import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ServiceList } from './service-list/service-list';

@Component({
  selector: 'app-services-home',
  standalone: true,
  imports: [MatButtonModule, ServiceList],
  template: `
    <h1>Services</h1>
    <p>Services represent programs, services or products which domains go through or are used by.</p>
    <app-service-list></app-service-list>
  `,
})
export class ServicesHome {
}
