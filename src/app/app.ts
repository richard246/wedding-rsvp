import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type PartnerStatus = 'yes' | 'no' | 'undecided';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  protected readonly submitting = signal(false);
  protected readonly responseMessage = signal('');
  protected readonly responseIsError = signal(false);

  protected readonly rsvpForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    telephone: ['', [Validators.required, Validators.maxLength(40)]],
    mailingAddress: ['', [Validators.required, Validators.maxLength(500)]],
    partnerStatus: ['yes' as PartnerStatus, Validators.required],
    partnerName: ['', Validators.maxLength(100)],
  });

  protected submitRsvp(): void {
    this.responseMessage.set('');
    if (this.rsvpForm.invalid) {
      this.rsvpForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.http.post<{ message: string }>('/api/rsvp', this.rsvpForm.getRawValue()).subscribe({
      next: (response) => {
        this.responseIsError.set(false);
        this.responseMessage.set(response.message);
        this.rsvpForm.reset({
          fullName: '',
          email: '',
          telephone: '',
          mailingAddress: '',
          partnerStatus: 'yes',
          partnerName: '',
        });
        this.submitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.responseIsError.set(true);
        this.responseMessage.set(
          typeof error.error?.message === 'string'
            ? error.error.message
            : 'We could not send your RSVP right now. Please try again later.',
        );
        this.submitting.set(false);
      },
    });
  }
}
