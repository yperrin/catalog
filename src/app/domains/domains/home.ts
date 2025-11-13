import { Component } from '@angular/core';
import { DomainList } from './domain-list/domain-list';

@Component({
  selector: 'app-domains-home',
  standalone: true,
  imports: [DomainList],
  template: `
    <h1>Domains</h1>
    <p>Domains represent the type of data that is being collected by the company's architecture.</p>
    <app-domain-list></app-domain-list>
  `,
})
export class DomainsHome { }
