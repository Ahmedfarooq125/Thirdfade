# Review section

Updated 7 October 2026 with the two review screenshots supplied by the user.

- `public/assets/reviews/client-reviews-01.png`: Tim Beanland, Paul Warner, Ben McQueen, Jaydon Slater.
- `public/assets/reviews/client-reviews-02.png`: Gavin Harris, Natalie Young, Marcus Brody, Olivia Chen.
- Original PNGs are preserved. CSS frames display the corresponding avatar or screenshot column.
- `src/data/reviews.ts` contains the visible review excerpts and captured relative dates. Truncated text remains truncated; these are not live Google data.
- The existing review card structure is retained with an Aceternity Apple Cards Carousel adaptation. Browse with touch, drag, horizontal scrolling or focused Left/Right/Home/End keys. There are no arrow controls. View review opens an accessible native dialog with the supplied screenshot; Escape, the close button or the backdrop closes it.

# Hero headline

Memorable is plain black HTML text, with no canvas animation or moving lines. The by design line uses DepthText, described below.

Carousel reference: [Aceternity Apple Cards Carousel](https://ui.aceternity.com/components/apple-cards-carousel). Both adaptations use the site's existing React, Framer Motion and Lucide dependencies.

## DepthText headline update

The by design line now uses React Bits DepthText (the JS and CSS registry version), with 34 layers, 2.4px depth, a dark-grey face and black extrusion. A stronger white text shadow is applied only to the front face so the stage preserves its 3D layers. Its size inherits the responsive hero font variable. The component supports pointer tracking, gentle orbit, Pause motion, reduced-motion preferences, page visibility and off-screen suspension. The accessible text appears once; depth layers are hidden from assistive technology. Memorable is now static HTML text.

Files: src/components/DepthText.jsx, DepthText.css and DepthText.d.ts. The declaration file supports the existing TypeScript app. Installed with npx shadcn@latest add @react-bits/DepthText-JS-CSS.