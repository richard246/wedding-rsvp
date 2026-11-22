const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRsvp } = require('./server');

const validRsvp = {
  fullName: 'Taylor Guest',
  email: 'taylor@example.com',
  telephone: '+1 555 123 4567',
  mailingAddress: '123 Main Street, Springfield',
  partnerStatus: 'yes',
  partnerName: 'Jordan Guest',
};

test('accepts a complete registry entry and trims text fields', () => {
  assert.deepEqual(validateRsvp({ ...validRsvp, fullName: '  Taylor Guest  ' }), {
    ...validRsvp,
    fullName: 'Taylor Guest',
  });
});

test('accepts each spouse or partner response and an omitted guest name', () => {
  for (const partnerStatus of ['yes', 'no', 'undecided']) {
    assert.equal(validateRsvp({ ...validRsvp, partnerStatus, partnerName: '' }).partnerStatus, partnerStatus);
  }
});

test('rejects invalid email addresses and missing contact details', () => {
  assert.equal(validateRsvp({ ...validRsvp, email: 'not-an-email' }), null);
  assert.equal(validateRsvp({ ...validRsvp, telephone: ' ' }), null);
  assert.equal(validateRsvp({ ...validRsvp, mailingAddress: '' }), null);
});

test('rejects oversized names, addresses, telephone numbers, and guest names', () => {
  assert.equal(validateRsvp({ ...validRsvp, fullName: 'N'.repeat(101) }), null);
  assert.equal(validateRsvp({ ...validRsvp, mailingAddress: 'a'.repeat(501) }), null);
  assert.equal(validateRsvp({ ...validRsvp, telephone: '1'.repeat(41) }), null);
  assert.equal(validateRsvp({ ...validRsvp, partnerName: 'G'.repeat(101) }), null);
});
