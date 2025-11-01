import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header>
      <h1><a routerLink="/">Catalog</a></h1>
      <nav>
        <ul>
          <li><a routerLink="/domains">Domains</a></li>
          <li><a routerLink="/services">Services</a></li>
        </ul>
      </nav>
    </header>
  `,
  styles: [`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #007bff;
      color: white;
    }
    h1 {
      margin: 0;
    }
    h1 a {
      color: white;
      text-decoration: none;
      cursor: pointer;
    }
    nav ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
    }
    nav li {
      margin-left: 1rem;
    }
    nav a {
      color: white;
      text-decoration: none;
      cursor: pointer;
    }
    nav a:hover {
      text-decoration: underline;
    }
  `]
})
export class Header {}
