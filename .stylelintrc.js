module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended-scss",
    "stylelint-config-rational-order",
    "stylelint-config-prettier",
  ],
  plugins: [
    "stylelint-scss",
    "stylelint-order",
    "stylelint-a11y",
    "stylelint-prettier",
  ],
  rules: {
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    "no-empty-source": null,
    "rule-empty-line-before": null,
    "selector-list-comma-newline-after": null,
    "no-descending-specificity": null,
    "prettier/prettier": true,
  },
};
