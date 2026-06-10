# Conference Logo Assets

Source: https://conference.tum-blockchain.com/_next/static/media/c26-wordmark.38783bd5.svg

## Logos

- `logos/c26-wordmark-full.svg`: full official wordmark from the conference site.
- `logos/wordmark-tum.svg`: TUM line.
- `logos/wordmark-blockchain.svg`: blocky BLOCKCHAIN line.
- `logos/wordmark-conference.svg`: CONFERENCE line.
- `logos/mark-26.svg`: gradient 26 mark.
- `logos/wordmark-conference-26.svg`: CONFERENCE plus 26.
- `logos/mark-plus.svg`: hand-drawn plus sign.
- `logos/wordmark-hackathon.svg`: hand-drawn Hackathon wordmark.
- `logos/wordmark-hackathon-plus.svg`: plus sign and Hackathon wordmark.
- `logos/wordmark-tum-blockchain.svg`: TUM plus BLOCKCHAIN.

## Fonts

The conference site loads Montserrat and Space Grotesk web fonts through Next.js font assets. Those files are mirrored in `fonts/`, with `fonts/conference-fonts.css` defining reusable `@font-face` rules and the CSS variables `--font-tbc-sans` and `--font-tbc-display`.

The red `Hackathon` lettering is not exposed as a typeable web font on the site. It is vector path artwork inside the official SVG, so use `logos/wordmark-hackathon.svg` for the exact mark. If editable/typeable text in that handwritten style is required, get the original design/Figma file or font name from the TUM Blockchain design team; the deployed website does not include that font file.
