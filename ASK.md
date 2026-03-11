# ASK.md — Agent Questions for Owner

> Questions the agent needs answered. Owner reviews async. Don't interrupt sessions.
> Updated: Session 20 (2026-03-11)

---

## Open Questions

### Q1 — Identity Hierarchy: URL Structure

Owner clarified: **Language + Culture = primary**, Distance = secondary.

**Current:** `/be/ke` → BeKenya (country level only)

**Possible URL structures for tribes/locations:**

- `/be/ke/maasai` → BeMaasai (tribe within Kenya)
- `/be/ke/nairobi` → BeNairobi (location within Kenya)
- `/be/maasai` → BeMaasai (tribe as top-level, cross-country — Maasai span KE+TZ)

**What I need to know:**

1. Should tribes be nested under countries (`/be/ke/maasai`) or top-level (`/be/maasai`)?
2. What's the word preference: "tribe", "community", "culture", "people"?
3. Does each tribe/location get its own Gate page with unique content?

---

### Q2 — Logo Variants

You mentioned "adapt the logo." Questions:

1. Does each Be[X] get a unique logo variant?
2. Dynamic (template-generated) or manually designed?
3. Should frontpage logo change based on detected identity?

---

### Q3 — Mock Data Scope

"Ensure all data visible that is not generic is placed in mock."

1. Should tribe-level mock data be created now? (Maasai, Kikuyu, Luo, etc.)
2. Location-level? (Nairobi, Mombasa, Nakuru)
3. Any specific content on current pages that needs to move to mock?

---

## Answered / Recorded

### A1 — Grouping Priority (Session 20)

**Owner said:** "The most important is Language and culture. Based on that we want to bring people together but also lever potentials. Distance is also a factor."

**Recorded as:** Language + Culture = primary grouping. Distance = secondary. Purpose: connect people AND lever potentials.

**Impact on architecture:**

- Matching engine should weight cultural/language affinity higher than geographic distance
- Country is a deployment unit, but identity (tribe/culture/language) is the connection layer
- A Maasai in Tanzania and a Maasai in Kenya are culturally "closer" than two different tribes in same city
- This is the core differentiator: identity-first routing, not geography-first

---

_(Move questions to Answered once resolved)_
