# Security Policy

## Supported Versions

The SUGNL website is actively maintained and supported on the current production version of the project and the latest published GitHub release.

| Version | Supported |
| ------- | --------- |
| Latest release / current main branch | :white_check_mark: |
| Previous stable release | :white_check_mark: if still in active use |
| Older or unmaintained releases | :x: |

If you are running an older revision, we strongly recommend upgrading to the latest supported version before reporting a vulnerability or relying on the site in production.

## Reporting a Vulnerability

Please do not disclose security vulnerabilities publicly in issues, pull requests, or comments before they have been assessed and addressed.

Instead, report vulnerabilities privately through the GitHub Security Advisories for this repository if available. If that is not possible, contact the project maintainers through the repository's official contact channel and clearly label the report as a security issue.

When reporting, please include:

- a clear description of the vulnerability
- affected pages, routes, APIs, or dependencies
- steps to reproduce the issue
- the impact of the issue
- any suggested remediation or mitigation

We aim to acknowledge valid reports promptly and will keep you informed throughout the review and remediation process.

If the report is accepted, we will work toward a fix and coordinate disclosure when appropriate. If the report is declined or cannot be reproduced, we will explain the outcome as clearly as possible.

## Best Practices

To help keep the SUGNL community website secure:

- keep dependencies updated
- use secure deployment settings on Vercel
- do not expose secrets in client-side code or public configuration
- validate and sanitize user-provided input on API routes
- use HTTPS in production and restrict access to admin or management functionality

Thank you for helping keep the project safe for the community.
