import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';

describe('App', () => {
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the royal registry and requested RSVP fields', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#registry-title')?.textContent).toContain('Guest Registry');
    expect(compiled.querySelector('form')?.textContent).toContain('Telephone number');
    expect(compiled.querySelector('form')?.textContent).toContain('Mailing address');
    expect(compiled.querySelector('form')?.textContent).toContain('spouse or partner');
  });

  it('submits the RSVP to Formspree and shows confirmation', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const setField = (name: string, value: string) => {
      const field = fixture.nativeElement.querySelector(
        `[formControlName="${name}"]`,
      ) as HTMLInputElement | HTMLTextAreaElement;
      field.value = value;
      field.dispatchEvent(new Event('input'));
    };
    setField('fullName', 'Taylor Guest');
    setField('email', 'taylor@example.com');
    setField('telephone', '+1 555 123 4567');
    setField('mailingAddress', '123 Main Street');

    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );

    const request = httpTesting.expectOne((req) => req.url.startsWith('https://formspree.io/f/'));
    expect(request.request.method).toBe('POST');
    expect(request.request.headers.get('Accept')).toBe('application/json');
    expect(request.request.body).toEqual(
      jasmine.objectContaining({
        fullName: 'Taylor Guest',
        email: 'taylor@example.com',
        _subject: 'Royal Guest Registry RSVP',
      }),
    );
    request.flush({ ok: true });

    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Your RSVP has been received.');
  });
});
