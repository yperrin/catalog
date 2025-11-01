import { TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
    }).compileComponents();
  });

  it('should create the home component', () => {
    const fixture = TestBed.createComponent(Home);
    const home = fixture.componentInstance;
    expect(home).toBeTruthy();
  });

  it(`should display the title 'About This Project'`, () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('About This Project');
  });
});
