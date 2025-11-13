import { Route } from '@angular/router';
import { Home } from './home/home/home';
import { DomainsHome } from './domains/domains/home';
import { ServicesHome } from './domains/services/home';
import { DomainFlow } from './domains/domains/domain-flow/domain-flow';
import { ServiceView } from './domains/services/service-view/service-view';

export const appRoutes: Route[] = [
  { path: '', component: Home },
  { path: 'domains', component: DomainsHome },
  { path: 'services', component: ServicesHome },
  { path: 'service-view/:name', component: ServiceView },
  { path: 'domain-flow/:name', component: DomainFlow },
];

