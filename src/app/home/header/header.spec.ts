import { TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
    }).compileComponents();
  });

  it('should create the header', () => {
    const fixture = TestBed.createComponent(Header);
    const header = fixture.componentInstance;
    expect(header).toBeTruthy();
  });

  it(`should have as title 'Catalog'`, () => {
    const fixture = TestBed.createComponent(Header);
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Catalog');
  });

  it('should render domains link', () => {
    const fixture = TestBed.createComponent(Header);
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('a[routerLink="/domains"]').textContent).toContain('Domains');
  });

  it('should render services link', () => {
    const fixture = TestBed.createComponent(Header);
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('a[routerLink="/services"]').textContent).toContain('Services');
  });
});
