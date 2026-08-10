# OB Group Website

Official web platform for OB Group and its two divisions:

- **OB Apples Shop:** product discovery and customer inquiries for Apple devices.
- **OB Net-Tech:** networking, connectivity, CCTV, and installation services.

## Status

Architecture and research are complete. Application scaffolding has not started.

## Architecture

- Astro 7 with strict TypeScript.
- Static HTML by default with isolated React islands.
- Tailwind CSS 4 and a documented design-token layer.
- React Three Fiber, Three.js, and GSAP for the approved product-theater island.
- Astro Content Collections for validated products, services, projects, and testimonials.
- Vitest for unit tests and Playwright for browser, accessibility, and visual verification.

The application follows a feature-oriented module structure:

```text
src/pages       Route composition
src/layouts     Page shells
src/modules     Business capabilities
src/components  Business-neutral UI and site chrome
src/lib         Shared technical infrastructure
src/config      Typed site policy
src/content     Validated business content
src/assets      Build-processed images and fonts
```

The 3D runtime and source-asset pipeline are isolated from ordinary page bundles. Every production model must have verified usage rights, optimization metadata, and a static poster fallback.

## Development

Development commands will be documented after the Astro scaffold and lockfile are created.

## Repository policy

- `main` is the protected release branch.
- Feature work uses short-lived branches and pull requests.
- `npm run verify` will be the required local and CI quality gate.
- Secrets and private asset sources must never be committed.
- Product, pricing, inventory, testimonial, and partnership claims require verified business data.

## License

Copyright OB Group. No open-source license has been granted at this stage.
