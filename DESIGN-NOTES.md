# DeltaLabs visual revision

## References reviewed

Reviewed live desktop views and product sections before rebuilding:

- [SpaceX Starship](https://www.spacex.com/vehicles/starship/): full-bleed cinematography, slow motion, minimal competing copy, product detail through imagery.
- [Eight Sleep](https://www.eightsleep.com/sleep-quality/): customer benefit first, then explain the integrated system and how a night with the product works.
- [Oura](https://ouraring.com/): a simple consumer proposition, product photography, and clear next actions.
- [Nothing](https://us.nothing.tech/): product scale, material detail, and strong visual hierarchy.
- [Lumafield](https://www.lumafield.com/): explain what changes for the customer before diving into the engineering.

The site uses these principles with original DeltaLabs media, not copied brand assets or competitor performance claims.

## Product hierarchy

1. Full-screen mask, turning slowly through fixed light.
2. Understand sleep patterns, with planned EEG/EOG-based estimates and app education.
3. Integrated sound and wake light, with outcomes still to validate.
4. Comfort, flexible fit, removable washable cushion.
5. $99 target and no planned subscription.

Wireless charging is a specification, not a lead selling point. Detailed evidence and development limitations remain available through the design dialog and research page.

## Animation

All three product films are newly rendered from the existing DeltaLabs Blender model. The studio lights do not move. Object transforms are periodic, fabric coordinates move with the object, and the woven material includes crossed thread relief, micrograin, roughness variation, and sheen.

- Mask: a slow, continuous turn beneath fixed strip lighting.
- Assembly: a complete rotation that separates and reassembles the layers.
- Material: a continuous close camera view of the fabric surface turning through light.

Each video encodes one complete cycle without duplicating the closing frame. A separately rendered frame at phase 1 is compared with phase 0, and the last-to-first step is compared with ordinary adjacent-frame motion. See `assets/animation-checks.json` for the measured checks.

Reduced-motion visitors see posters. A motion control pauses the films. Offscreen films pause and resume in place, rather than resetting to frame zero.

## Sleep in the wild

`sleep.html` is a separate, photography-led exploration inspired by GENED 1038. It uses the course's frigatebird, mallard, and jumping-spider examples, followed by a controlled human sleep-restriction study. It links to the original studies and retains uncertainty and study conditions. The detailed course guide remains at `science.html`.

Photographs are licensed and attributed in the research page and `assets/media-credits.json`. They illustrate species and environments; they are not presented as recordings of the cited experiments. CSS crops, dark overlays, and slow periodic image movement give the page a documentary treatment.
