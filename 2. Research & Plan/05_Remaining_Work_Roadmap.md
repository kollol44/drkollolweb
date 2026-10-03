# Dr. Fahim Foysal Kollol — Remaining Work Roadmap (2026-10-01)

## DONE (prototype: 5. Hero Prototype/index.html)
1. Navbar (EN/BN toggle, Book a serial) — needs real links later
2. Hero — scroll-scrubbed incision video + code-drawn blood line + text rising from the cut
3. Meet Your Surgeon — pinned; name, title, degrees, 6 count-up stats, CTA, chamber days
4. Treatments — same pinned doctor; giant condition names scroll behind him (8, list not final)

## HOMEPAGE — still to build (same visual language)
| # | Section | Design idea (same pattern) | Copy status |
|---|---|---|---|
| 5 | "Does this sound like you?" symptom chips | Chips rise from bottom like the incision text; tap → condition page | not written |
| 6 | Treatment journey (4 steps: consult → tests → surgery → follow-up) | Pinned horizontal scroll, a thin red→teal "suture line" draws across steps | not written |
| 7 | Why patients trust him (proof) | Big count-up numbers + MMCH / FCPS / MACS / BMDC badges | partly (numbers) |
| 8 | Patient reviews | Glass cards drifting upward, quote marks scale in | needs real reviews from doctor |
| 9 | Myth vs Fact | Flip cards (myth front, fact back) on scroll | not written |
| 10 | Chambers (Sherpur first, Mymensingh) | 3 glass cards + "Today he is at…" live badge + maps | data ready, chamber 1 confirm |
| 11 | Blog preview (3 latest) | Cards slide up | needs blogs |
| 12 | FAQ | Accordion, text emerges like hero | not written |
| 13 | Final CTA | Short incision line re-draws + "Book a serial / WhatsApp" | not written |
| 14 | Footer | Address, phones, hours, BMDC, socials, mini sitemap | data ready |
| + | Mobile sticky bottom bar: Call · WhatsApp · Serial | — | — |

## OTHER PAGES
| Page | Must contain | Status |
|---|---|---|
| About the Doctor | Story, timeline 2015→2017 MMCH→2022 FCPS→now, degrees, memberships (SOSB, SELSB, MACS), training, 11 publications, photo | copy + publication list pending |
| Services hub | All conditions grouped (Colorectal / Laparoscopic / Breast / General / Urology?) | needs final list |
| Condition pages (×10 recommended) | Hero (big word behind doctor), symptoms, causes, when to see a doctor, treatment/surgery options, before & after surgery, recovery time, FAQ, CTA | all pending (biggest SEO job) |
| Chambers / Contact | 3 chambers, days/times, phones, Google Maps, serial numbers | data ready, chamber-1 name/time to confirm |
| Appointment | Form (name, phone, chamber, day, problem) → WhatsApp prefilled message + Supabase | pending |
| Blog list + 10 posts | Titles planned in 00_Foundation_Plan.md §8 | all 10 pending |
| Legal | Privacy, medical disclaimer | pending |

## DECISIONS / INPUTS NEEDED FROM DOCTOR
1. Final treatment list (10 recommended) — Appendix→Appendicitis, Breast→Breast Lump
2. Chamber 1 Sherpur: Asia Diagnostic (leaflet) vs Health Care Hospital (cards)
3. Permission to publish "250 fistula, 1 recurrence"
4. Keep urology (kidney stones)? ovarian cyst?
5. Real patient reviews (screenshots/written consent)
6. Publication list with links
7. Hi-res photos (2–3 poses, OT/chamber) — current cutout is 624px wide
8. Domain name; Google Business Profile access

## TECH / HANDOVER PENDING
- Convert prototype → Next.js + Tailwind (developer), frames served from CDN
- Admin panel (Supabase): treatments, chambers/times, notice banner, reviews, blogs, FAQ, appointments
- SEO: per-page title/description BN+EN, hreflang, Physician + MedicalClinic + FAQ schema, sitemap
- Performance: preload first frames, lazy-load rest, reduced-motion fallback
- Testing on real iPhone/Android + slow 3G
- Developer handover pack (guidelines, references, prompts, assets)
