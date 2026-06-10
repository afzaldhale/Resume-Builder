# Integration Tests

## Purpose
Document the integration test suite for controlled layout migration.

## Scope
- Verify rendered DOM parity between current shared renderer and extracted layout families.
- Validate section order, header structure, and sidebar behavior.
- Confirm `ResumeDocument.tsx` output remains identical for selected templates.

## Test Fixtures
- Normal resume
- Long multi-page resume
- Stress resume

## Execution
- Use React Testing Library or Playwright to compare DOM structure.
- Keep the existing production renderer active until controlled migration is validated.
