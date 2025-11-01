import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <div>
      <h2>{{ pageTitle }}</h2>
    </div>
  `,
  styles: [`
    div {
      padding: 2rem;
    }
  `]
})
export class Placeholder {
  @Input() pageTitle = 'Page';
}
