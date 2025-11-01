import { Route } from '@angular/router';
import { Home } from './home/home/home';
import { DomainsHome } from './domains/domains/home';
import { ServicesHome } from './domains/services/home';
import { DomainFlowComponent } from './domains/domains/domain-flow/domain-flow';

export const appRoutes: Route[] = [
  { path: '', component: Home },
  { path: 'domains', component: DomainsHome },
  { path: 'services', component: ServicesHome },
  { path: 'domain-flow/:name', component: DomainFlowComponent },
];

