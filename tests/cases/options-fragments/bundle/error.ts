import spx from 'spx';

spx.connect(
  {
    logLevel: 1,
    fragments: [
      '.using-class', // Fails
      '#using-hash', // Fails
      'is-valid', // Passes
      '[data-attr]' // Fails
    ]
  }
);
