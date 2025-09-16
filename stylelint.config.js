export default {
  customSyntax: 'postcss-html',
  overrides: [
    {
      files: ['*.vue', '**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  plugins: ['stylelint-order'],
  rules: {
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'comment-no-empty': true,
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-no-duplicate-names': true,
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'keyframe-declaration-no-important': true,
    'media-feature-name-no-unknown': true,
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-empty-source': null, // Allow empty Vue style blocks
    'no-invalid-double-slash-comments': true,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes'],
      },
    ],
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    'string-no-newline': true,
    'unit-no-unknown': true,

    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'variants', 'responsive', 'screen', 'config', 'theme'],
      },
    ],

    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'screen'],
      },
    ],

    'order/properties-order': [
      'display',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'width',
      'height',
      'margin',
      'padding',
      'border',
      'background',
      'color',
      'font-size',
      'line-height',
    ],

    // Disabled rules
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'declaration-no-important': null,
  },
}
