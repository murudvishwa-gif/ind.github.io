# Stackly industrial services

## Dashboard demo

Select User or Admin on `login.html`, enter a valid email and any nonempty password, and submit to open `user-dashboard.html` or `admin-dashboard.html`. This is a frontend demonstration: credentials are not verified or stored, and the role selector is not an authorization boundary. Both dashboard URLs are publicly accessible. Production authentication and server-enforced role permissions are required before using real client data.

The dashboards provide sample metrics, project and invoice tables, status filters, search, CSV export, a quotation-request dialog, settings, and mobile navigation. Requests and settings are saved only in this browser's local storage, separately for each demo role. They are not sent to the company. Log out returns to login; it does not clear locally saved demo records. Social login and sign-up remain previews.

Dashboard layout inspiration: https://themewagon.github.io/shadcn-admin/. The reference is a client-rendered app and did not expose its page contents to the browser reader; this implementation follows the requested sidebar/dashboard pattern in Stackly's dark and orange theme.

A static HTML, CSS, and JavaScript website. Open `index.html` directly or serve this folder with your preferred local web server. No build step is required.

## Pages

- `index.html`: existing industrial homepage, with updated navigation.
- `services.html`: service offerings, CNC machining, process, and industries.
- `about.html`: company overview, values, delivery process, and illustrative team profiles.
- `contact.html`: quotation enquiry form, visit information, and FAQs.
- `blogs.html`: filterable article directory linking to six complete articles.
- `login.html` and `signup.html`: account form previews with password visibility and validation.
- `forgot-password.html`: account support information.
- `404.html`: error page with updated navigation.

## Forms

The contact form prepares an email draft addressed to the existing company email. The visitor must send it from their email app. Newsletter requests work the same way.

Authentication is not connected. Login validates input, clears the password, and redirects to the selected demo dashboard. Sign-up displays a preview message and clears passwords. Neither form stores credentials, authenticates users, or creates accounts. Connect a backend authentication provider before enabling real account access or password recovery.

## Design and content

The supplied overview screenshot guides the page structure and visual treatment. Small text was unreadable, so supporting copy and articles were written for this implementation. Existing local images are reused; account-page artwork and team imagery are approximations, not exact Figma exports. The team images are labeled illustrative, and names or unverifiable company milestones were not invented.

Shared page styles live in `assets/pages.css`; navigation, filtering, FAQs (native HTML), and form behavior use `assets/js/pages.js`. The homepage retains its existing styles.

`assets/components.css` contains the shared component treatment from the second screenshot: outlined icon cards, orange accents, warm gradient hover/focus states, and navigation pills. Add `ui-card` to an existing icon card to reuse it. Homepage feature cards use the compact, photo-free variant; benefit cards use circular icon backgrounds. The stylesheet loads after page styles on all pages with main navigation.

## Checks

### Account page reference update

The login and sign-up pages now use `assets/auth.css` and the shared artwork `assets/images/auth-logistics.webp`. The artwork was generated using the built-in image-generation tool, not exported from Figma. CSS displays the left panel on login and the right panel on sign-up. Social sign-in buttons report their unavailable integration; terms and privacy links open accessible dialogs describing the preview behavior.

Artwork prompt: Two equal portrait panels, no gap or text. Left: bright cyan isometric miniature logistics scene with golden orange routes, white airplanes, parcels, delivery van, and small figures. Right: photoreal passenger airplane above a teal-and-orange container port at dusk, with delicate white network lines and pale coral nodes. No UI, logos, borders, or typography.

Run `node check-pages.cjs` to validate local links, asset paths, anchors, duplicate IDs, and primary headings. Run `node --check assets/js/pages.js` for JavaScript syntax validation.

## Responsive layout and motion

`assets/responsive.css` loads last on all 17 pages. It adapts grids, headers, forms, testimonials, footers, and dashboard panels for phones, tablets, and desktops. Dashboard tables scroll inside their panels. Login and Sign Up remain in the header on the main site pages.

`assets/js/scroll-animations.js` uses Intersection Observer and the browser's Web Animations API for staggered reveals across page content and footers. A reading-progress line follows native scrolling; phones use shorter movement. Dashboard view changes and blog filters register newly visible content. Reduced-motion preferences cancel effects, including when changed during a visit. Content remains visible without JavaScript or Intersection Observer. GSAP is no longer loaded.

`assets/js/hero-interaction.js` provides a pointer-responsive hero glow and a three-stage home hero explorer. Stage controls support click, touch, arrow keys, Home and End; each selection updates the image and description. `assets/motion.css` styles these interactions. Reduced motion disables the glow and image transitions while preserving the controls.

Home and Services each have 10 sections. About, Contact and Blog each have 7; each editorial article has 6 semantic sections. Account, dashboard and error screens retain their task-oriented layouts. All pages share the same footer; public and account pages share the site header, while dashboards retain their workspace navigation.

Browser verification covered all 17 pages at 320, 390, 768, 1024, 1440, and 1920 pixels in headless Chrome, mobile menus, dashboard views, scroll reveals, reduced-motion changes, and script-failure fallback. Run `node check-responsive.cjs` with Playwright and Chrome installed to repeat these checks. `--motion-only` runs the interaction and motion checks without repeating the full viewport matrix.
