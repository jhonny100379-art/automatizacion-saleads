export default {
  default: {
    language: 'es',
    paths: ['features/**/*.feature'],
    import: [
      'support/env.js',
      'support/world.js',
      'support/hooks.js',
      'step-definitions/simple.steps.js',
    ],
    format: [
      'progress-bar',
      'html:report/cucumber-report.html',
      'json:report/cucumber-report.json',
    ],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true,
    timeout: 60000,
    parallel: 1,
  },
};
