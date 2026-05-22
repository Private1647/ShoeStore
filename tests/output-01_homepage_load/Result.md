---
test: ../01_homepage_load_test.md
status: failed
started: 2026-05-22T15:25:55.884Z
duration_s: 532
session_id: 55ef9da3-17b1-4c5d-a717-58e2010ff6de
---

# TC-01: Homepage Load and Navigation — Result

## Open homepage ✓ passed (80.2s)
md5: 5bf0066c70f22ca0edc6edbd338326d0
Go to http://localhost:5000.
Verify the page loads and the SoleStyle logo/text is visible in the header.

## Verify hero section ✓ passed (62.1s)
md5: c6b42cdcae3564346ab9e1b691673d6f
Assert that a hero banner section is visible on the page with promotional content.

## Verify product grid ✗ failed (386.1s)
md5: 151b7704b72c4a146ba0dade1c489f5c
Reason: Maximum steps exceeded (26/25)
Scroll down and assert that product cards are displayed in a grid layout.
Assert that at least 6 product cards are visible.

## Verify navigation links ⏭ skipped

## Verify search bar ⏭ skipped

## Verify cart icon ⏭ skipped

## Verify footer ⏭ skipped
