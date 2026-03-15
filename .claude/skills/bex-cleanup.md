---
name: bex-cleanup
description: Boy Scout Rule — leave code cleaner than you found it
---

# Cleanup Checklist

After any feature, check the files you touched:

1. **Dead code** — unused imports, unreachable branches, commented-out blocks → delete
2. **DRY** — duplicated logic → extract to shared module in `lib/`
3. **YAGNI** — speculative features, unused params, over-abstraction → remove
4. **Types** — `any` → proper types, missing return types on exports
5. **Naming** — matches vocabulary (`lib/vocabulary.ts`): Explorer/Host/Opportunity/Exchange
6. **Console** — no `console.log` in committed code (except error handlers)
7. **Brand** — colors use `brand-*` tokens, no hex literals
