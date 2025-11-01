import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div>
      <h2>About This Project</h2>
      <p>
        This is a new UI application which will have a catalog of domains as well as services. The user will be able to add new domains, new services. Then the user will be able to add a source service, then a source service may go to one or more services. And so on, thus creating a chain of services a single domain may go through. The user would want to be able to see a graph of services a domain can go through. The user may also select a service and see all the domains going through this service. This is meant to help understand the architecture used to create our final product offerings which will be categorized as services. It should help us understand what happens if we need to retire a single service but also whether we may have multiple copies of the same domain.
      </p>
    </div>
  `,
  styles: [`
    div {
      padding: 2rem;
    }
  `]
})
export class Home {}
