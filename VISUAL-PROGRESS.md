# Visual progress

- [x] 2. Download, process and credit banner images. Ten licensed Unsplash sources, 20 warm-graded WebP files; largest 168KB. Sources and licence recorded.
- [x] 3. Build illustrations, devices and sample UI components. Six line-art service illustrations, laptop/phone frames, labelled sample UI, bento and ten CC0 technology marks.
- [x] 4. Rebuild the home page. Cinematic devices, illustrated services, staggered work, delivery bento, exact five facts and photographic CTA.
- [x] 5. Add page and service banners. All page templates use local responsive decorative banners; service rows and heroes use their service illustration.
- [x] 6. Add motion, navigation, footer and brand assets. Shared visible-by-default observer, reduced-motion support, scroll navbar, gold active rule, decorative footer SVG, cube icons and new OG.
- [x] 7. Verify all translations. All 13 visual keys and list entries are translated in en, hi, ar, de and fr; every step typechecked and prerendered 80 pages.
- [x] 8. Complete responsive and performance QA.
- [x] 9. Deploy, verify production and push. Deployed 2026-11-14; 14 production routes and assets return 200, no console errors on live pages.

Decisions: UI illustrations are labelled as samples; photography is decorative, not a representation of CubicTech premises or staff. Existing DESIGN-PLAN.md remains applicable except its imagery and motion restrictions.

Translation check: all 13 visual keys and all list entries exist in all five locales; brand names remain in Latin script. Sample UI is explicitly labelled in every language.

QA decisions: selected-work device pairs use the same project; the separate home phone demo has a translated kind badge. Public styles are embedded in prerendered HTML, with responsive hero and small Latin display-font preloads. Public enhancements load after first paint; workspace shells keep immediate startup and external CSS. Mobile banners reserve space before fonts arrive. Lighthouse uses explicitly applied DevTools mobile throttling; its measurements are reported separately from conservative simulated estimates.
