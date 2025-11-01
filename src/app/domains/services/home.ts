import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-services-home',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <h1>Services</h1>
    <p>Services represent programs, services or products which domains go through or are used by.</p>
    @if (isEmpty) {
      <div>
        <p>No services found. Get started by adding a new one.</p>
        <button mat-raised-button color="primary">Add Service</button>
      </div>
    } @else {
      <p>Welcome to the services section.</p>
    }
  `,
})
export class ServicesHome {
  isEmpty = true;
}
