## 1. Specification
- [x] 1.1 Create `openspec/specs/tab-switch-android/spec.md` (bug spec: context, root cause, requirements, scenarios)
- [x] 1.2 Amend `openspec/specs/entry-constants/spec.md` with a graceful-degradation requirement + scenario

## 2. Change Artifacts
- [x] 2.1 Create change `.openspec.yaml` + `proposal.md` + `design.md` + `tasks.md`

## 3. Code — Guard populateSelects()
- [x] 3.1 Add `typeof CATEGORIES`/`ACCOUNTS` guard at the top of `populateSelects()` in `src/index.html` (warn + early return)
- [x] 3.2 Verify the guard is the FIRST statement in `populateSelects()`, i.e. before any listener registration depends on init completing

## 4. Documentation — README
- [x] 4.1 Correct the false "all CSS and JS are inline" claim in README Option A
- [x] 4.2 Document the Android `file://` limitation + HTTP-server requirement

## 5. Verification
- [x] 5.1 Code inspection: re-read edited `populateSelects()`; confirm no throw path before listener registration (static)
- [x] 5.2 Syntax check: extract inline `<script>` from `index.html` and run `node --check`
- [ ] 5.3 Runtime (Android, file://): tapping List / Add Transaction switches views — **pending user**
- [ ] 5.4 Runtime (HTTP, Android): Category / Account dropdowns populate — **pending user**
- [ ] 5.5 Desktop (file://): tabs switch and dropdowns populate — **pending user** (optional)

## 6. Memory Bank
- [x] 6.1 Update `memory-bank/activeContext.md` with the bug + fix + root cause
- [x] 6.2 Update `memory-bank/progress.md` with the bug fix

## 7. Archive
- [x] 7.1 Commit the change (spec + artifacts + code + README + memory bank)
