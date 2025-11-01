import { Route } from '@angular/router';
import { Home } from './components/home/home';
import { Placeholder } from './components/placeholder/placeholder';

export const appRoutes: Route[] = [
  { path: '', component: Home },
  { path: 'domains', component: Placeholder, data: { pageTitle: 'Domains' } },
  { path: 'services', component: Placeholder, data: { pageTitle: 'Services' } },
];

