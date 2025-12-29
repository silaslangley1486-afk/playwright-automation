# QA Automation Portfolio

This repository demonstrates a Playwright-based automation approach focused on accessibility-aware end-to-end testing using TypeScript. It is intentionally scoped to model production-style QA strategies rather than provide a comprehensive test suite.

The tests target the public demo application at:
https://www.saucedemo.com/

## Purpose and Scope

The goal of this project is to demonstrate:

- Structuring Playwright tests using page object models and fixtures

- Writing maintainable, deterministic automation in TypeScript

- Incorporating accessibility testing into E2E workflows

- Validating keyboard-only navigation, ARIA roles, and semantic structure

- Using axe-core to identify automated WCAG issues

To keep the focus on test design and quality, the test coverage is intentionally limited to:

- The login flow

- Post-login onboarding behavior on the inventory page

## Test Structure

Page models

- LoginPage and InventoryPage encapsulate selectors and user interactions

Fixtures

- Authentication and setup logic are handled via Playwright fixtures to support reusable test setup

Accessibility tests (/a11y)

- Accessibility checks are separated to emphasize accessibility as a first-class concern rather than an afterthought

- Includes axe-core scans, keyboard navigation validation, and role-based queries

Auto-generated tests (/auto-generated)

- Contains tests generated via Playwright’s codegen tool from manual exploratory testing

- Included for comparison and evaluation against hand-written, maintainable test code

## Design Principles

- Tests favor role-based selectors and user-centric interactions

- Accessibility is validated as part of normal user workflows, not as a separate audit step

- The project prioritizes clarity and maintainability over test quantity

## Notes

This repository is intended as a portfolio example illustrating how accessibility-aware automation can be integrated into modern QA workflows. It is not intended to represent full application coverage or production test volume. Some areas are intentionally left minimal to keep the focus on test design rather than complete coverage.
