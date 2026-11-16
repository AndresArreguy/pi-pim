# Security Policy

## Supported versions

Security fixes are provided for the latest released version. Please reproduce on
the latest tag before reporting.

## Reporting a vulnerability

**Do not open a public issue.**

Use GitHub's private vulnerability reporting:

1. Open the **Security** tab of this repository.
2. Choose **Report a vulnerability**.
3. Include the affected version, operating system, Pi version, reproduction
   steps, impact, and any proof of concept.

If private reporting is unavailable, contact the maintainer through GitHub and
ask for a private channel. Please do not include secrets, API keys or account
data in the report.

## Scope

Pim replaces Pi's main editor. Areas of interest include:

- Input handling that leaks typed text, paste content or prompt history.
- Key handling that bypasses Pi's confirmation or interrupt behavior.
- Extension code that executes untrusted input or writes outside the expected
  scope.
- Crashes or stack overflows reachable from normal keystrokes.

## Out of scope

- Vulnerabilities in Pi itself: report them to
  [earendil-works/pi](https://github.com/earendil-works/pi/security).
- Issues caused by another custom-editor extension overriding Pim.
- Reports that require an already-compromised local account.

## Disclosure

We aim to acknowledge reports within a few days and to coordinate a fix and
disclosure date with the reporter. No bug bounty is offered.
