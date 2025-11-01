import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-domains-home',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <h1>Domains</h1>
    <p>Domains represent the type of data that is being collected by the company's architecture.</p>
    @if (isEmpty) {
      <div>
        <p>No domains found. Get started by adding a new one.</p>
        <button mat-raised-button color="primary">Add Domain</button>
      </div>
    } @else {
      <p>Welcome to the domains section.</p>
    }
  `,
})
export class DomainsHome {
  isEmpty = true;
}
