# OB Group Website CI/CD Security Research

Date: 2026-08-09
Branch: `ci-cd-workflows`
Project: OB Group Solution website, planned as an Astro + React islands + Tailwind + Three.js/GSAP frontend.

## Goal

Design GitHub Actions workflows that keep the website buildable, optimized, secure, and deployable without exposing secrets or weakening domain ownership.

The workflow set should protect against:

- Broken builds and type errors.
- Regressions in accessibility, browser behavior, and 3D rendering.
- Oversized JavaScript, images, and 3D assets.
- Leaked `.env` values or committed credentials.
- Vulnerable npm dependencies and risky licenses.
- Unsafe GitHub Actions permissions, third-party actions, and untrusted pull request execution.
- Domain/subdomain takeover through dangling DNS records or incorrect custom domain setup.
- Accidental production deployment from an unreviewed branch.

## Recommended Workflow Architecture

Use multiple small workflows instead of one large workflow:

1. `ci.yml`
   - Runs on pull requests and pushes to `main`.
   - Installs with `npm ci` from the lockfile.
   - Runs format check, lint, `astro check`, tests, and production build.
   - Uploads the `dist/` build artifact only when needed.

2. `security.yml`
   - Runs on pull requests, pushes to `main`, and a weekly schedule.
   - Runs secret scanning with GitHub secret scanning/push protection where available, plus a repo-level scanner such as Gitleaks or TruffleHog.
   - Runs GitHub dependency review on pull requests.
   - Runs CodeQL for JavaScript/TypeScript and GitHub Actions workflow scanning.
   - Optionally runs OpenSSF Scorecard on schedule.

3. `preview-e2e.yml`
   - Runs after a preview deployment succeeds, or manually against a preview URL.
   - Runs Playwright against the deployed preview.
   - Checks critical user paths: home, OB Apples Shop, OB Net-Tech, WhatsApp CTA, maps/call links, responsive layouts, and nonblank 3D canvas.

4. `performance.yml`
   - Runs after preview deployment or on pull requests when the app can be served locally.
   - Runs Lighthouse CI with budgets.
   - Enforces budgets for JS, CSS, image transfer, 3D model size, and Core Web Vitals signals.

5. `deploy-production.yml`
   - Runs only from `main` or manual `workflow_dispatch`.
   - Uses GitHub environments such as `production`.
   - Requires approval before production secrets are released.
   - Uses `concurrency` so only one production deployment runs at a time.
   - Uses OIDC where the deployment provider supports it.

## Baseline GitHub Actions Hardening

Every workflow should start from these defaults:

```yaml
permissions:
  contents: read
```

Only add permissions per job when required. Examples:

- `pull-requests: read` for dependency review.
- `security-events: write` for CodeQL or SARIF upload.
- `pages: write` and `id-token: write` only for GitHub Pages deployment.
- `id-token: write` only in deployment jobs that need OIDC.

Recommended guardrails:

- Avoid `pull_request_target` unless there is a documented reason.
- Never check out untrusted PR code in privileged workflows.
- Pin important third-party actions to full commit SHAs for high-security workflows.
- Use Dependabot to keep GitHub Actions and npm dependencies current.
- Avoid passing PR titles, comments, issue bodies, or arbitrary event data into shell commands.
- Do not print env values or secrets in logs.
- Keep production deployment in a protected environment.
- Use branch protection/rulesets to require CI, security, and review before merging to `main`.

## Secret And `.env` Protection

Repository rules:

- Commit `.env.example`, never `.env`, `.env.local`, `.env.production`, or provider credential files.
- Use GitHub repository/environment secrets for private values.
- Use public environment variables only for values safe to ship to browsers, such as `PUBLIC_*` values in Astro.
- Prefer OIDC over long-lived deployment tokens when the host supports it.
- Rotate any secret immediately if it is committed, even if deleted later.

Workflow checks:

- GitHub secret scanning and push protection should be enabled in repository settings if available.
- Add a CI secret scan using Gitleaks or TruffleHog.
- Fail pull requests when verified secrets are detected.
- Scan the full repository periodically, not just the newest diff.

## Build And Quality Gates

For the Astro website, CI should require:

- `npm ci` rather than `npm install`.
- `npm run format:check`.
- `npm run lint`.
- `npm run check` using `astro check`.
- `npm run test` using Vitest for modules and utilities.
- `npm run build` for production output.
- `npm run preview` only inside E2E/performance jobs when needed.

Astro build scripts should eventually look like:

```json
{
  "scripts": {
    "check": "astro check",
    "build": "astro check && astro build"
  }
}
```

## Security Gates

Recommended checks:

- CodeQL for JavaScript/TypeScript and GitHub Actions workflow analysis.
- Dependency Review Action on pull requests.
- Dependabot security updates and weekly/monthly version updates.
- OpenSSF Scorecard on a weekly schedule.
- Optional Harden-Runner in audit mode first, then block mode after allowed outbound hosts are known.

For this project, high-risk third-party outbound destinations should be explicit:

- npm registry for dependency install.
- GitHub for actions and repository operations.
- Deployment provider.
- Lighthouse/Playwright browser downloads if not using a container image.

## Performance And 3D Optimization Gates

This site will use futuristic 3D/product animation, so CI must prevent visual ambition from breaking performance.

Recommended budgets:

- Keep initial JavaScript small by isolating React/Three islands.
- Lazy-load 3D scenes below the first viewport when possible.
- Budget GLB/GLTF files and texture sizes separately.
- Fail if model files exceed agreed limits unless explicitly approved.
- Use Lighthouse CI assertions for performance, accessibility, best practices, and SEO.
- Run Playwright screenshot/canvas checks for 3D sections so a successful build cannot hide a blank canvas.

Suggested first budgets:

- Individual 3D model: target under 2 MB compressed for hero-critical models.
- Initial route JS: target under 170 KB gzip before 3D chunks.
- Total image transfer on home: target under 1.5 MB for mobile.
- Lighthouse accessibility: at least 95.
- Lighthouse best practices and SEO: at least 90.

These numbers should be tightened after the first working prototype and real assets.

## Deployment Recommendation

For V1, the best practical deployment model is:

- Build static Astro output.
- Deploy previews for every pull request.
- Deploy production only from protected `main`.
- Use a protected `production` environment with required reviewers.
- Use deployment concurrency to avoid overlapping production releases.
- Keep deployment secrets as environment secrets, not repository-wide secrets.

If using GitHub Pages:

- Use Astro's official GitHub Pages action flow.
- Set GitHub Pages source to GitHub Actions.
- Add the custom domain in GitHub before creating DNS records.
- Verify the custom domain before use.

If using Vercel/Netlify/Cloudflare:

- Prefer the platform Git integration for preview deployments.
- Keep GitHub Actions for CI/security/performance checks.
- Use provider deployment protection and domain verification.

## Domain And Anti-Takeover Controls

Domain security is not solved only by GitHub Actions. It needs DNS and registrar controls:

- Enable registrar lock/transfer lock.
- Use strong registrar account MFA.
- Use DNSSEC if the DNS provider supports it cleanly.
- Add CAA records to restrict certificate authorities.
- Avoid wildcard DNS records unless there is a clear routing need.
- Keep an inventory of every DNS record and the service/resource it points to.
- Remove DNS records before deleting the cloud resource they target.
- Verify custom domains with the hosting provider before pointing DNS.
- Run periodic dangling DNS/subdomain takeover checks.
- Monitor Certificate Transparency logs for unexpected certificates.
- Avoid parent-domain cookies such as `.example.com`; use host-scoped cookies if the project later adds auth.

## Branch Protection Recommendation

Protect `main` with:

- Require pull request before merge.
- Require at least one approval.
- Require status checks:
  - CI build.
  - Security scan.
  - Dependency review.
  - Playwright smoke test when available.
  - Lighthouse budget when available.
- Require conversation resolution.
- Block force pushes and branch deletion.
- Prefer linear history.
- Do not allow bypass for production rules unless there is a named emergency process.

## Initial Workflow Implementation Order

1. Add app scaffold and package scripts.
2. Add `ci.yml` for install, typecheck, lint, tests, and build.
3. Add `.github/dependabot.yml`.
4. Add `security.yml` with dependency review, CodeQL, and secret scan.
5. Add Playwright once first pages exist.
6. Add Lighthouse CI after first deployable visual prototype.
7. Add production deployment workflow only after the hosting target is chosen.
8. Add DNS/domain checks before connecting the final business domain.

## References

- GitHub Actions secure use reference: https://docs.github.com/en/actions/reference/security/secure-use
- GitHub Actions deployments and environments: https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
- GitHub deploying with Actions, environments, and concurrency: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments
- GitHub Actions OIDC reference: https://docs.github.com/en/actions/reference/security/oidc
- GitHub Actions secrets: https://docs.github.com/en/actions/concepts/security/secrets
- GitHub secret scanning push protection bypass requests: https://docs.github.com/en/code-security/concepts/secret-security/bypass-requests
- GitHub protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub Dependency Review Action: https://github.com/actions/dependency-review-action
- GitHub Dependabot security updates: https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-security-updates
- GitHub Dependabot configuration file: https://docs.github.com/en/code-security/concepts/supply-chain-security/about-the-dependabot-yml-file
- GitHub CodeQL code scanning: https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning
- CodeQL GitHub Actions query help: https://codeql.github.com/codeql-query-help/actions/
- GitHub artifact attestations: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations
- OWASP GitHub Actions Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html
- OWASP CI/CD Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html
- OWASP Secrets Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- Gitleaks: https://github.com/gitleaks/gitleaks
- TruffleHog scanning in CI: https://trufflesecurity.com/docs/scanning-in-ci
- OpenSSF Scorecard: https://scorecard.dev/
- OpenSSF Scorecard Action: https://github.com/ossf/scorecard-action
- StepSecurity Harden-Runner: https://docs.stepsecurity.io/harden-runner
- npm ci: https://docs.npmjs.com/cli/v8/commands/npm-ci/
- Astro TypeScript and `astro check`: https://docs.astro.build/en/guides/typescript/
- Astro deployment guide: https://docs.astro.build/en/guides/deploy/
- Astro GitHub Pages deployment: https://docs.astro.build/en/guides/deploy/github/
- Vite production build: https://vite.dev/guide/build.html
- Vite performance guide: https://vite.dev/guide/performance
- Playwright CI: https://playwright.dev/docs/ci
- Lighthouse CI getting started: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md
- Lighthouse CI configuration: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
- OWASP Subdomain Takeover Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Subdomain_Takeover_Prevention_Cheat_Sheet.html
- OWASP Web Security Testing Guide: subdomain takeover: https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/10-Test_for_Subdomain_Takeover
- Microsoft dangling DNS/subdomain takeover guidance: https://learn.microsoft.com/en-us/azure/security/fundamentals/subdomain-takeover
- GitHub Pages custom domain security warning: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
