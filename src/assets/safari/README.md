# Safari atmosphere SVG assets

Decorative wildlife and terrain graphics are currently rendered as inline SVG paths in `src/components/safari` to keep them color-token driven, accessible, and bundle-friendly.

If standalone SVG files are needed later, keep them monochrome, mark them decorative (`aria-hidden` or empty alt text), and use only the approved safari atmosphere opacity range of 3–8%.
