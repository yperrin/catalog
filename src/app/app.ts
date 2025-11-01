import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from './home/header/header';

@Component({
  imports: [RouterModule, Header],
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'catalog';
}
