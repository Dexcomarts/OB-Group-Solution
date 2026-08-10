const targetUrl = process.env.LHCI_URL || "http://localhost:4321";

module.exports = {
  ci: {
    collect: {
      url: [targetUrl],
      numberOfRuns: 3,
      startServerCommand:
        targetUrl === "http://localhost:4321"
          ? "npm run preview -- --host 127.0.0.1"
          : undefined,
      startServerReadyPattern: "Local:",
      startServerReadyTimeout: 30000,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "resource-summary:script:size": ["warn", { maxNumericValue: 174080 }],
        "resource-summary:image:size": ["warn", { maxNumericValue: 1572864 }],
        "resource-summary:total:size": ["warn", { maxNumericValue: 3145728 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
