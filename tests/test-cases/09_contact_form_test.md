---
mode: testing
max_steps: 30
timeout: 120
---

# TC-09: Contact Form (Shadow DOM)

## Navigate to contact page
Go to http://localhost:5000/contact.
Assert that the Contact page loads with contact information visible.

## Verify contact details
Assert that a phone number, email address, and physical address are displayed on the page.

## Submit empty form
Click the "Send Message" button inside the contact form without filling any fields.
Assert that a validation error message appears saying to fill in all fields.

## Fill and submit form
Type "Test User" into the Name field in the contact form.
Type "test@example.com" into the Email field in the contact form.
Type "This is a test message for the SoleStyle team." into the Message textarea in the contact form.
Click the "Send Message" button.
Assert that a success toast or confirmation message appears indicating the message was sent.
