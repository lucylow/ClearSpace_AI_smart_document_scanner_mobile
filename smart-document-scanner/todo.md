# Project TODO

- [x] Initialize Expo SDK 54 React Native project
- [x] Review supplied 200-page Smart Document Scanner codebook
- [x] Create mobile interface design plan
- [ ] Configure Smart Document Scanner branding and custom app icon
- [x] Add scanner domain types and shared utilities
- [x] Add local document persistence and scan store
- [x] Add user credits and Pro state store
- [x] Implement root navigation and iOS-style tab navigation
- [x] Implement camera scan screen with permission and capture states
- [x] Implement document edge overlay and capture controls
- [x] Implement review screen with filters and retake flow
- [x] Implement PDF export and system sharing
- [x] Implement documents gallery with search, favorite, delete, and empty states
- [x] Implement document detail screen and export actions
- [x] Implement Pro/settings screen with restore and rewarded-ad states
- [x] Add advanced scan quality helpers and automatic-capture modules
- [ ] Add analytics/event bus and supporting services from continuation codebook
- [x] Add deterministic unit tests for pure scanner and document modules
- [x] Run TypeScript, lint, and test checks
- [ ] Save final checkpoint and deliver the project version

## Improvement pass

- [x] Add expo-camera dependency and native camera permission configuration
- [x] Replace demo capture with a real CameraView path while retaining a safe web fallback
- [x] Add image-library import for scanning existing photos
- [x] Improve scan processing with a real local image manipulation boundary
- [x] Improve document rename and favorite actions
- [x] Add event bus analytics hooks for scan and export lifecycle events
- [x] Add regression tests for credits, scan persistence, and document updates
- [x] Re-run TypeScript, lint, tests, and preview verification

## Improvement pass 2

- [x] Add expo-image-manipulator for local resize, rotation, and filter processing
- [x] Replace no-op image processing methods with native-ready implementations and safe fallbacks
- [x] Make PDF export produce a real local PDF when supported and report unsupported cases clearly
- [x] Add regression tests for user credits and document-store update behavior
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Improvement pass 3

- [x] Add robust image URI handling and cleanup for native and web paths
- [x] Add PDF export naming and temporary-file lifecycle handling
- [x] Add isolated persistence adapters for deterministic store testing
- [x] Add regression tests for rename, favorite, delete, and scan lifecycle events
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Improvement pass 4

- [x] Add a reusable async storage adapter with an in-memory test implementation
- [x] Add a document detector interface with heuristic and native bridge implementations
- [x] Improve scan hydration and persistence error handling
- [x] Add regression tests for storage adapters, detector geometry, and PDF fallback behavior
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Improvement pass 5

- [x] Add detector confidence and validation helpers
- [x] Add explicit scan session state transitions and reset behavior
- [x] Make export and persistence service failures observable without breaking the UI
- [x] Add lifecycle regression tests for detector confidence, scan sessions, and service failures
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Improvement pass 6

- [x] Add explicit capture error recovery and retry UI
- [x] Add scan review retry and processing failure feedback
- [x] Improve document gallery sorting and favorite filtering
- [x] Add regression tests for capture recovery and gallery filtering
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Improvement pass 7

- [x] Add review-screen retry and error recovery states
- [x] Add export result validation and user-facing failure handling
- [x] Improve export filename sanitization and page metadata
- [x] Add regression tests for review recovery and export result handling
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Improvement pass 8

- [x] Add multi-page review state and page navigation
- [x] Add per-page retry and removal controls before export
- [x] Add native share capability checks and clearer share failures
- [x] Remove the deprecated pointer-events warning from the UI
- [x] Add regression tests for multi-page review and share-result helpers
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Improvement pass 9

- [x] Add pages from camera and photo library during review
- [x] Persist generated PDFs to a durable local document directory when supported
- [x] Add cleanup helpers for temporary export artifacts
- [x] Add regression tests for add-page state and PDF persistence helpers
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Improvement pass 10

- [x] Add direct camera capture from inside the review screen
- [x] Add local PDF storage usage helpers and cleanup policy
- [x] Add native-ready storage capability reporting
- [x] Add regression tests for camera-page state and storage cleanup decisions
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Continuation codebook improvement pass

- [x] Add feature flags for OCR, batch scanning, experimental crop, and privacy lock
- [x] Add analytics provider wiring to the existing event bus
- [x] Add normalized document index and search suggestions
- [x] Add legacy scan migration helpers into the current document model
- [x] Add batch scan processing service with per-item failure isolation
- [x] Integrate search, feature flags, and analytics into document workflows
- [x] Add regression tests for the new continuation modules
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Continuation integration pass

- [x] Add feature-flag controls to Settings
- [x] Replace gallery text filtering with indexed search and suggestions
- [x] Add batch-scan screen entry point and photo selection flow
- [x] Add batch progress, retry, and per-item failure feedback
- [x] Add regression tests for integration selectors and batch workflow state
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Workflow hardening pass

- [x] Persist feature-flag preferences through the existing storage adapter
- [x] Add batch retry for failed items
- [x] Add export of successful batch pages into the document store
- [x] Add batch completion summary and empty-result handling
- [x] Add regression tests for persisted flags and batch retry/export state
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Advanced sync and OCR codebook pass

- [x] Add advanced document/page domain types and cloning helpers
- [x] Add conflict resolution, patch application, and sync queue utilities
- [x] Add retry policy and deterministic backoff helpers
- [x] Add cache eviction, quota, checksum, deduplication, and outbox utilities
- [x] Add OCR normalization, inverted index, and search helpers
- [x] Integrate safe migration and conflict helpers into app services
- [x] Add regression tests for advanced sync and OCR modules
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Advanced integration pass

- [x] Add sync-status summary helpers and UI state model
- [x] Integrate OCR text indexing into document search data
- [x] Add native-ready biometric lock service with web fallback
- [x] Add Settings controls and document workflow indicators for the new capabilities
- [x] Add regression tests for sync summaries, OCR indexing, and biometric fallback
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Monetization codebook pass

- [x] Add monetization domain types, product catalog, and currency helpers
- [x] Add entitlement derivation, paywall rules, offer ranking, and trial policy
- [x] Add credit ledger, credit policy, rewarded-ad safety, and attribution helpers
- [x] Add purchase state, error mapping, restore, receipt, and entitlement cache helpers
- [x] Add revenue, KPI, promotion, and paywall analytics helpers
- [x] Integrate safe monetization state into Settings and export access feedback
- [x] Add regression tests for monetization safety and purchase-state helpers
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Production integration pass

- [x] Add a billing-provider adapter boundary with restore and purchase states
- [x] Add biometric app-lock state and unlock flow with web fallback
- [x] Add visible sync-status summary to the document experience
- [x] Add regression tests for billing adapters, lock state, and sync indicators
- [x] Re-run TypeScript, lint, unit tests, and preview verification

## Continued mobile improvement pass

- [x] Add page reordering controls to the multi-page review workflow
- [x] Add a storage-quota summary and cleanup action to Documents or Settings
- [x] Add regression coverage for reordering and quota calculations
- [x] Re-run TypeScript, lint, tests, and preview verification

## Continued production pass

- [x] Add a native-ready biometric lock gate at the app root with a safe web fallback
- [x] Persist and restore app-lock state alongside feature flags
- [x] Add regression coverage for lock gating and fallback behavior
- [x] Re-run TypeScript, lint, tests, and preview verification

## Native workflow improvement pass

- [x] Add app lifecycle-aware auto-lock timeout handling
- [x] Add a configurable passcode fallback policy for unavailable biometrics
- [x] Add regression coverage for lifecycle lock transitions and fallback policy
- [x] Re-run TypeScript, lint, tests, and preview verification

## Lock controls polish pass

- [x] Add Settings controls for auto-lock timeout duration
- [x] Add Settings controls for biometric fallback policy
- [x] Persist and restore the lock preferences safely
- [x] Add regression coverage for lock preference persistence
- [x] Re-run TypeScript, lint, tests, and preview verification

## Document management improvement pass

- [x] Add an immediate Lock now action to Settings
- [x] Add a safer bulk document cleanup preview and confirmation flow
- [x] Add regression coverage for cleanup selection and lock-now state
- [x] Re-run TypeScript, lint, tests, and preview verification

## Cleanup recovery improvement pass

- [x] Add an undo window for recently cleaned documents
- [x] Show estimated storage reclaimed before cleanup confirmation
- [x] Add regression coverage for cleanup undo and estimate calculations
- [x] Re-run TypeScript, lint, tests, and preview verification

## Monetization improvement pass

- [x] Add purchase and restore loading/error state handling in Settings
- [x] Add a clearer Pro value summary and offer selection surface
- [x] Add idempotent purchase outcome handling through the billing adapter
- [x] Add regression coverage for monetization UI state and purchase outcomes
- [x] Re-run TypeScript, lint, tests, and preview verification

## Paywall UX improvement pass

- [x] Add a dedicated paywall route with feature-value messaging
- [x] Add paywall offer selection and restore actions
- [x] Add entitlement-aware entry from premium feature settings
- [x] Add regression coverage for paywall context and offer selection
- [x] Re-run TypeScript, lint, tests, and preview verification

## Contextual monetization improvement pass

- [x] Add feature-specific paywall context for OCR and export limits
- [x] Persist cached entitlement state through the existing storage adapter
- [x] Restore cached Pro state safely during app hydration
- [x] Add regression coverage for contextual copy and entitlement persistence
- [x] Re-run TypeScript, lint, tests, and preview verification

## Entitlement lifecycle improvement pass

- [x] Add freshness metadata and expiration handling to cached entitlements
- [x] Add restore outcome categories for restored, already active, and no purchase found
- [x] Surface entitlement freshness and restore status in paywall/settings UX
- [x] Add regression coverage for stale caches and restore outcomes
- [x] Re-run TypeScript, lint, tests, and preview verification

## Subscription lifecycle visibility pass

- [x] Add subscription status and next-refresh visibility in Settings
- [x] Add a production-provider readiness state to purchase surfaces
- [x] Add explicit purchase retry and unavailable-store messaging
- [x] Add regression coverage for lifecycle summaries and provider readiness
- [x] Re-run TypeScript, lint, tests, and preview verification

## Subscription management improvement pass

- [x] Add a refresh subscription status action in Settings
- [x] Add a manage-plan surface with safe local-provider messaging
- [x] Add a clear deactivate/restore-state confirmation flow
- [x] Add regression coverage for subscription management state transitions
- [x] Re-run TypeScript, lint, tests, and preview verification

## Purchase recovery diagnostics pass

- [x] Add a retryable purchase recovery state in the paywall
- [x] Add support-oriented subscription diagnostics in Settings
- [x] Add a safe copyable summary without exposing sensitive receipt data
- [x] Add regression coverage for recovery states and diagnostics formatting
- [x] Re-run TypeScript, lint, tests, and preview verification

## Billing UX improvement pass

- [x] Add a clear trial and savings explanation to the featured yearly offer
- [x] Add an offer comparison summary for monthly, yearly, and lifetime plans
- [x] Add regression coverage for offer savings calculations and display state
- [x] Re-run TypeScript, lint, tests, and preview verification

## Purchase and offer management pass

- [x] Add a selected-offer state that persists while users compare plans
- [x] Add a clear purchase summary before starting checkout
- [x] Add offer-selection regression coverage and purchase-summary formatting
- [x] Re-run TypeScript, lint, tests, and preview verification

## Checkout persistence improvement pass

- [x] Persist the selected paywall offer through the existing storage adapter
- [x] Add a final checkout confirmation step before purchase
- [x] Add regression coverage for selected-offer persistence and confirmation state
- [x] Re-run TypeScript, lint, tests, and preview verification

## Checkout eligibility improvement pass

- [x] Add explicit eligibility copy for trial and already-owned offers
- [x] Add renewal and one-time purchase clarity to the confirmation state
- [x] Add regression coverage for eligibility and checkout copy helpers
- [x] Re-run TypeScript, lint, tests, and preview verification

## Receipt recovery improvement pass

- [x] Add a safe receipt-recovery state for interrupted purchases
- [x] Add entitlement refresh guidance after restore or stale-cache detection
- [x] Add regression coverage for receipt recovery and entitlement refresh copy
- [x] Re-run TypeScript, lint, tests, and preview verification

## Store refresh recovery pass

- [x] Add a direct Refresh store status action to the paywall recovery area
- [x] Add a retry counter and escalation guidance after repeated failures
- [x] Add regression coverage for refresh and repeated-recovery messaging
- [x] Re-run TypeScript, lint, tests, and preview verification

## Pending purchase safeguards pass

- [x] Add deterministic pending-purchase state and recovery copy
- [x] Add refresh throttling to prevent repeated store requests
- [x] Add regression coverage for pending and throttled states
- [x] Re-run TypeScript, lint, tests, and preview verification

## Pending purchase visibility pass

- [x] Persist a privacy-safe pending purchase marker for the current offer
- [x] Show pending purchase status and next action when returning to the paywall
- [x] Add regression coverage for pending marker persistence and clearing
- [x] Re-run TypeScript, lint, tests, and preview verification

## Pending state expiry diagnostics pass

- [x] Add deterministic pending-marker age and expiry helpers
- [x] Clear expired pending markers safely during paywall hydration
- [x] Surface pending-state age in privacy-safe Settings diagnostics
- [x] Add regression coverage for expiry and diagnostics formatting
- [x] Re-run TypeScript, lint, tests, and preview verification

## Production hardening continuation

- [x] Add visible pending purchase age and expiry copy on the paywall
- [x] Add app lifecycle reconciliation for persisted pending purchases through a native-safe billing boundary
- [x] Add a Settings action that copies only sanitized subscription diagnostics
- [x] Fix the Vitest/Rollup parser failure caused by importing React Native Flow modules into the test-facing reconciliation boundary
- [x] Add regression coverage for reconciliation and web fallback behavior
- [x] Re-run TypeScript and the full regression suite: 64 passing, 1 skipped
- [ ] Save the final checkpoint and deliver the project version

## Deferred native billing follow-up

- [ ] Replace LocalBillingProvider with a production billing adapter
- [ ] Wire real native store transaction listeners
- [ ] Add a visible refresh countdown for throttled store requests
- [ ] Add a dedicated pending-offer expiry countdown component
- [ ] Connect sanitized diagnostics to a formal support ticket or feedback workflow

## Validation

- [x] `pnpm check`
- [x] `pnpm test -- --run`
- [x] 13 test files passed, 1 skipped
- [x] 64 tests passed, 1 skipped
- [x] No parser errors remain

## Current checkpoint

- [ ] Save checkpoint
- [ ] Attach project version
- [ ] Deliver implementation summary

## Error handling continuation

- [x] Add shared safe error normalization with sensitive-field redaction and message length bounds
- [x] Add paywall recovery for hydration, purchase, restore, reconciliation, and persisted-selection failures
- [x] Add Settings recovery for hydration, preference persistence, billing, lock settings, and cleanup failures
- [x] Add batch-scan recovery for photo selection, cancellation, processing, retry, and export failures
- [x] Add regression coverage for safe error normalization and cancellation handling
- [x] Re-run TypeScript and the full regression suite: 65 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Additional error-handling continuation

- [x] Harden the root biometric lock gate against storage, authentication, hydration, and lifecycle persistence failures
- [x] Keep the app locked when security state loading or saving fails
- [x] Harden the persisted user store against corrupt JSON, invalid credits, storage failures, and rejected fire-and-forget writes
- [x] Catch Pro entitlement persistence failures during activation and plan changes
- [x] Restart the Expo development services after the node_modules watcher ENOENT failure
- [x] Re-run TypeScript and the full regression suite: 65 passing, 1 skipped
- [x] Confirm the restarted dev server is running and bundling
- [ ] Save checkpoint and deliver the updated project version

## Gallery and integration error-handling continuation

- [x] Add Gallery recovery feedback for hydration, search-index rebuild, favorites, and document deletion
- [x] Prevent unhandled external-browser failures and show a retry-oriented native alert
- [x] Remove remaining duplicate imports and Array<T> lint warnings
- [x] Preserve intentional lifecycle dependency behavior with an explicit lint explanation
- [x] Re-run TypeScript, lint, and the full regression suite: 65 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Next error-handling continuation

- [ ] Audit current runtime logs and remaining async failure paths
- [ ] Add targeted recovery handling for any newly identified failures
- [ ] Add regression coverage for the new handling
- [ ] Re-run TypeScript, lint, tests, and dev-server validation
- [ ] Save checkpoint and deliver the updated project version

## Scanner permission and import continuation

- [x] Catch camera-permission request failures from both lifecycle hydration and the permission button
- [x] Catch photo-library launch and import failures with safe user-facing messages
- [x] Handle canceled or unreadable photo selections without entering processing state
- [x] Re-run TypeScript, lint, and the full regression suite: 65 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Service recovery and error-handling continuation

- [ ] Restore and verify the development services
- [ ] Audit remaining runtime and async failure paths
- [ ] Add targeted defensive handling for newly identified failures
- [ ] Add regression coverage where practical
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Global render recovery continuation

- [x] Restore the stopped Expo and API development services
- [x] Audit recent runtime logs and remaining async failure paths
- [x] Add a global AppErrorBoundary around the root navigation tree
- [x] Provide a safe retry screen for unexpected render-time failures
- [x] Keep boundary messages sanitized and bounded through the shared error helper
- [x] Re-run TypeScript, lint, tests, and runtime bundling validation
- [x] 65 tests passed, 1 skipped; no actionable runtime errors in the latest bundling output
- [ ] Save checkpoint and deliver the updated project version

## Follow-up error-handling continuation

- [ ] Audit latest runtime logs and remaining failure paths
- [ ] Add targeted defensive handling for newly identified issues
- [ ] Add regression coverage where practical
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Persistence rollback continuation

- [x] Audit scan-store mutations for persistence failures
- [x] Add rollback behavior when scan persistence fails after optimistic updates
- [x] Prevent event-bus delivery failures from invalidating persisted scans
- [x] Repair the temporary Zustand import/runtime error introduced during refactoring
- [x] Re-run TypeScript, lint, tests, and web bundling validation
- [x] 65 tests passed, 1 skipped; no Metro error remains in the latest bundle output
- [ ] Save checkpoint and deliver the updated project version

## Persistence and runtime hardening continuation

- [ ] Audit latest runtime logs and remaining async failure paths
- [ ] Add targeted recovery handling for newly identified failures
- [ ] Add regression coverage where practical
- [ ] Re-run TypeScript, lint, tests, and runtime bundling validation
- [ ] Save checkpoint and deliver the updated project version

## Search suggestion recovery continuation

- [x] Guard Gallery search suggestions against local-index failures
- [x] Preserve document browsing when search suggestions are unavailable
- [x] Re-run TypeScript, lint, tests, and web bundling validation
- [x] 65 tests passed, 1 skipped; no Metro or actionable runtime errors in the latest bundle output
- [ ] Save checkpoint and deliver the updated project version

## User-action recovery continuation

- [ ] Audit latest logs and remaining user-action failure paths
- [ ] Add targeted defensive handling for newly identified failures
- [ ] Add regression coverage where practical
- [ ] Re-run TypeScript, lint, tests, and runtime bundling validation
- [ ] Save checkpoint and deliver the updated project version

## Settings reward recovery continuation

- [x] Catch credit-reward persistence failures instead of showing false success
- [x] Report a safe retry-oriented message when credits cannot be added
- [x] Stop the orphaned TypeScript watch process after the exit-137 memory failure
- [x] Re-run TypeScript, lint, and the full regression suite under lower memory pressure
- [x] 65 tests passed, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Continued error-hardening pass

- [ ] Audit latest runtime logs and remaining failure paths
- [ ] Add targeted defensive handling for newly identified issues
- [ ] Add regression coverage where practical
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Camera modal recovery continuation

- [x] Catch camera permission-request failures inside the review camera modal
- [x] Guard capture against missing permission and unavailable camera references
- [x] Handle empty photo results and capture exceptions with safe user-facing feedback
- [x] Re-run TypeScript, lint, tests, and runtime bundling validation
- [x] 65 tests passed, 1 skipped; latest web bundles completed without Metro errors
- [ ] Save checkpoint and deliver the updated project version

## Camera and user-action hardening continuation

- [ ] Audit latest runtime logs and remaining user-action failure paths
- [ ] Add targeted defensive handling for newly identified issues
- [ ] Add regression coverage where practical
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## PDF export recovery continuation

- [x] Make empty or invalid export inputs fail explicitly instead of returning a misleading empty URI
- [x] Make missing PDF output files surface a sanitized export error to the caller
- [x] Isolate export analytics event failures from export success or failure handling
- [x] Re-run TypeScript, lint, tests, and runtime bundling validation
- [x] 65 tests passed, 1 skipped; restarted Expo/API services are running
- [ ] Save checkpoint and deliver the updated project version

## Export and runtime hardening continuation

- [ ] Audit latest runtime logs and remaining user-action failure paths
- [ ] Add targeted defensive handling for newly identified issues
- [ ] Add regression coverage where practical
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Review route recovery continuation

- [x] Safely handle malformed encoded review URIs
- [x] Report canceled or unreadable added-photo selections
- [x] Surface filter-processing failures with bounded recovery messages
- [x] Validate camera-page callbacks before adding new pages
- [x] Surface PDF creation and document-save failures through the review error panel
- [x] Re-run TypeScript, lint, tests, and runtime bundling validation
- [x] 65 tests passed, 1 skipped; latest web bundles completed without Metro errors
- [ ] Save checkpoint and deliver the updated project version

## Export and troubleshooting UX continuation

- [ ] Add cancellable export progress for large documents
- [ ] Add retry controls after export failures
- [ ] Add a local sanitized diagnostics panel for camera, processing, and export failures
- [ ] Add user-friendly recovery toast notifications in the review route
- [ ] Add regression coverage for progress, cancellation, diagnostics redaction, and recovery notifications
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Export and troubleshooting UX completion

- [x] Add cancellable per-page export progress with an AbortController boundary
- [x] Add cancel and retry controls to the review export panel
- [x] Add a local diagnostics panel with bounded, redacted troubleshooting details
- [x] Add copy-to-clipboard for sanitized diagnostics
- [x] Add recovery toasts for successful filter, page, camera, removal, ordering, cancellation, and export actions
- [x] Add regression coverage for the platform-agnostic cancellation error and diagnostics redaction
- [x] Re-run TypeScript, lint, tests, and runtime validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Mobile UI polish continuation

- [ ] Audit current scanner, gallery, review, settings, and paywall visual hierarchy
- [ ] Refine spacing, typography, surfaces, controls, and feedback states
- [ ] Improve accessibility labels and touch-target clarity
- [ ] Validate responsive rendering and interaction states
- [ ] Save checkpoint and deliver the updated project version

## Mobile UI polish completion

- [x] Refine scanner hierarchy with a branded web-mode badge, stronger guidance, calmer action tray, and clearer processing status
- [x] Refine permission and empty states with iconography, explanatory copy, and clearer primary actions
- [x] Refine gallery header, search field, sync status, filter chips, document cards, and empty state
- [x] Add accessible labels and selected states to key scanner and gallery actions
- [x] Validate mobile-sized preview rendering for scanner and gallery screens
- [x] Re-run TypeScript, lint, tests, and runtime bundling validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Cross-screen UI polish continuation

- [ ] Audit Settings, Paywall, and Review visual hierarchy and interaction states
- [ ] Apply consistent cards, spacing, typography, controls, and accessibility labels
- [ ] Validate responsive rendering across the polished screens
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Cross-screen UI polish completion

- [x] Refine Settings with a workspace eyebrow, plan badge, elevated cards, clearer status hierarchy, and stronger section spacing
- [x] Refine Paywall with a readiness pill, value chips, premium yearly offer emphasis, and clearer status treatment
- [x] Refine Review with a branded workspace header, page-status pill, framed preview card, and clearer empty state
- [x] Add or preserve accessible labels for important controls
- [x] Validate mobile-sized rendering for Settings, Paywall, and Review
- [x] Re-run TypeScript, lint, tests, and runtime validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Document workflow UI continuation

- [ ] Audit Batch Scan and document-detail visual hierarchy and interaction states
- [ ] Refine workflow cards, controls, progress, empty states, and accessibility labels
- [ ] Validate responsive rendering across the polished workflows
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Document workflow UI completion

- [x] Refine Batch Scan with a branded workflow header, step card, progress hierarchy, queue statuses, and stronger empty state
- [x] Add clearer Batch Scan action grouping and accessible photo-selection/back controls
- [x] Refine document detail with metadata card, favorite action, page list, framed page placeholders, and danger-zone treatment
- [x] Improve document-not-found recovery with explanatory copy and a clear return action
- [x] Validate mobile-sized rendering for Batch Scan and document detail
- [x] Re-run TypeScript, lint, tests, and runtime validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Library navigation UI continuation

- [ ] Audit gallery document-list hierarchy and tab navigation clarity
- [ ] Refine search, filters, cards, and empty/loading states for compact mobile use
- [ ] Improve tab labels, active-state contrast, and accessibility hints
- [ ] Validate mobile rendering and interaction states
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Library navigation UI completion

- [x] Add clear-search affordance and compact search behavior to Documents
- [x] Add a dedicated library section header with result count
- [x] Refine filter controls and empty-library hierarchy for mobile discovery
- [x] Improve tab-bar active/inactive contrast, spacing, labels, and accessibility hints
- [x] Validate mobile rendering for Documents and navigation surfaces
- [x] Remove the unused navigation theme variable and clear the lint warning
- [x] Re-run TypeScript, lint, and tests: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Scan experience UI continuation

- [ ] Audit scanner camera states, capture controls, and quick actions
- [ ] Refine camera guidance, permission, processing, and empty states
- [ ] Improve capture control hierarchy and accessibility labels
- [ ] Validate mobile rendering and interaction states
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Scan experience UI completion

- [x] Add a compact scan-state indicator with confidence percentage
- [x] Group guidance copy into a clearer camera instruction block
- [x] Elevate Import Photo and Advanced Scan into a focused bottom capture panel
- [x] Preserve accessible labels for camera, import, and advanced-scan actions
- [x] Validate mobile rendering of the refreshed scanner state
- [x] Re-run TypeScript, lint, tests, and runtime validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Recent scan feedback UI continuation

- [ ] Audit recent-scan discovery and capture feedback surfaces
- [ ] Add a compact recent-scans shortcut to the Scan screen
- [ ] Improve capture confirmation and action affordances
- [ ] Validate mobile rendering and interactions
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Recent scan feedback UI completion

- [x] Add a compact Recent scans panel below the capture controls
- [x] Add View all and recent-document quick-open actions with accessibility labels
- [x] Preserve the capture panel hierarchy and action feedback while adding recent discovery
- [x] Validate the scanner mobile rendering after the update
- [x] Re-run TypeScript, lint, tests, and runtime validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Capture feedback UI continuation

- [ ] Audit capture confirmation and recent-scan interaction surfaces
- [ ] Add clearer capture success and processing feedback
- [ ] Refine recent-scan rows with stronger action affordances
- [ ] Validate mobile rendering and interactions
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Capture feedback UI completion

- [x] Show clearer readiness copy when document confidence is high
- [x] Preserve explicit processing feedback while capture and detection are busy
- [x] Refine recent-scan rows with larger tap affordances and stronger chevrons
- [x] Validate mobile rendering after the interaction polish
- [x] Re-run TypeScript, lint, tests, and runtime validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Document preview UI continuation

- [ ] Audit document preview and recent-scan visual surfaces
- [ ] Improve document recognition with stronger page-preview treatment
- [ ] Refine recent-scan visual metadata and quick-open affordances
- [ ] Validate mobile rendering and interactions
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Document preview UI completion

- [x] Render real processed page thumbnails when preview media is available
- [x] Add numbered page badges for faster visual scanning
- [x] Preserve a styled fallback when a page preview is unavailable
- [x] Validate document-detail preview rendering and interactions
- [x] Re-run TypeScript, lint, tests, and runtime validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Document preview interaction continuation

- [ ] Audit page preview interaction and multi-page navigation
- [ ] Add clearer page inspection and accessible preview controls
- [ ] Add a focused page preview state without disrupting document actions
- [ ] Validate mobile rendering and interactions
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Document preview interaction completion

- [x] Make page rows tappable with accessible Inspect page labels
- [x] Add a focused full-screen page preview state with close control
- [x] Add Previous and Next navigation for multi-page scans
- [x] Preserve a clear preview-unavailable fallback inside the inspector
- [x] Re-run TypeScript, lint, tests, and runtime validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Page inspector UI continuation

- [ ] Audit page-inspector and document-detail action hierarchy
- [ ] Improve close, navigation, share, favorite, and delete affordances
- [ ] Add pressed and disabled feedback for preview controls
- [ ] Validate mobile rendering and interactions
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Page inspector UI completion

- [x] Give page rows stronger pressed and chevron affordances
- [x] Add a larger, clearly tappable Close control in the inspector
- [x] Add pressed feedback to Previous and Next controls
- [x] Preserve disabled styling at the first and last pages
- [x] Re-run TypeScript, lint, tests, and runtime validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## End-to-end UX continuation

- [ ] Audit scan, review, and export task feedback and recovery flows
- [ ] Improve completion feedback and next-step affordances
- [ ] Improve retry, cancellation, and recovery messaging across the main task flow
- [ ] Validate accessibility and mobile interactions
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## End-to-end UX completion

- [x] Add inline Retry export action beside review errors
- [x] Keep Diagnostics and Dismiss actions grouped beneath the error message
- [x] Clarify the primary review actions as Start over and Export & Save PDF
- [x] Preserve cancellation and progress recovery behavior
- [x] Re-run TypeScript, lint, tests, and runtime validation: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Completion feedback UX continuation

- [ ] Audit scan, review, and export completion feedback
- [ ] Add clearer export-success summary and next-step actions
- [ ] Improve recovery affordances after cancellation or failure
- [ ] Validate accessibility and mobile rendering
- [ ] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Completion feedback UX completion

- [x] Fix post-export navigation to open the newly saved document detail route instead of a missing preview route
- [x] Preserve success toast before navigating to the saved document
- [x] Keep retry, cancellation, diagnostics, and failure recovery behavior intact
- [x] Validate TypeScript, lint, tests, and runtime bundling: 66 passing, 1 skipped
- [ ] Save checkpoint and deliver the updated project version

## Post-export UX continuation

- [x] Audit post-export document-detail and sharing flows
- [x] Add clearer completion summary and next-step actions
- [x] Improve Share PDF, Back to Documents, and return-to-scan affordances
- [x] Validate accessibility and mobile rendering
- [x] Re-run TypeScript, lint, tests, and runtime validation
- [ ] Save checkpoint and deliver the updated project version

## Page inspector UX continuation

- [x] Audit page inspector interaction and gesture support
- [x] Add pinch-to-zoom and double-tap zoom behavior
- [x] Add swipe navigation between inspected pages
- [x] Add clearer inspector quick-action affordances
- [x] Validate gestures, accessibility, mobile rendering, and regressions
- [ ] Save checkpoint and deliver the updated project version

## Inspector and gallery interaction pass

- [x] Add rotate, crop, and filter quick actions inside the page inspector
- [x] Add smooth inspector opening and closing transitions
- [x] Add swipe actions for favorite and delete in the Documents gallery
- [x] Preserve safe deletion confirmation and accessible alternatives
- [x] Validate interactions, accessibility, rendering, and regressions
- [ ] Save checkpoint and deliver the updated project version

## Reversible editing UX pass

- [x] Add filter preset live previews with explicit save/cancel
- [x] Replace centered crop with adjustable crop handles
- [x] Add undo snackbar after swipe deletion
- [x] Preserve safe persistence rollback and accessibility alternatives
- [x] Validate previews, gestures, rendering, and regressions
- [ ] Save checkpoint and deliver the updated project version

## Production hardening continuation

- [x] Audit editing and undo flows for stale-state and failure edge cases
- [x] Harden concurrent edit recovery and undo persistence behavior
- [x] Add focused regression coverage for editing and recovery helpers
- [x] Improve user-facing safeguards for unavailable or incomplete media
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Edit history hardening continuation

- [x] Audit current edit persistence and undo lifecycle
- [x] Add bounded edit-history snapshots for safe revert
- [x] Add document-detail revert controls with clear state feedback
- [x] Harden undo lifecycle for repeated deletes and failed restores
- [x] Add regression coverage for history and undo helpers
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Maintainability continuation

- [x] Audit edit-history persistence boundaries and recovery states
- [x] Refine persistence helpers and edit-history user feedback
- [x] Add focused regression coverage and validate runtime behavior
- [ ] Save checkpoint and deliver the updated project version

## History presentation and storage safety continuation

- [x] Audit edit-history presentation and snapshot storage behavior
- [x] Add compact edit-history timeline with clearer restore affordances
- [x] Add snapshot-size safeguards and cleanup guidance
- [x] Add persistence edge-case regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Persistence compatibility continuation

- [x] Audit saved-document compatibility and history restore flows
- [x] Add backward-compatible scan and page normalization
- [x] Add individual history-entry restore actions
- [x] Add migration and restoration regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Persistence schema reliability continuation

- [x] Audit persistence schema and restore interaction boundaries
- [x] Add persisted schema versioning and compatibility metadata
- [x] Add restore preview confirmation before applying history changes
- [x] Add sanitized migration diagnostics for local troubleshooting
- [x] Add migration and restore-safety regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Diagnostics and recovery continuation

- [x] Audit current diagnostics and persistence recovery surfaces
- [x] Add sanitized migration diagnostics visibility
- [x] Add persistence recovery safeguards for failed saves and loads
- [x] Add regression coverage and validate runtime behavior
- [ ] Save checkpoint and deliver the updated project version

## Backup and diagnostics continuation

- [x] Audit persistence backup and diagnostics integration points
- [x] Add local backup safeguards before persistence migrations
- [x] Add clearer sanitized diagnostics detail UX
- [x] Add backup and diagnostics regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Backup restore continuation

- [x] Audit backup API and Settings recovery boundaries
- [x] Add backup availability and age visibility
- [x] Add confirmed user-controlled backup restore flow
- [x] Add backup rotation and failed-save regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Backup recovery safeguards continuation

- [x] Audit restore confirmation and persistence failure boundaries
- [x] Add before/after restore impact summary
- [x] Improve failed-restore recovery feedback
- [x] Add failure-injection regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Backup management continuation

- [x] Audit backup cleanup and recovery boundaries
- [x] Add confirmed local-backup deletion control
- [x] Add retryable feedback for failed backup reads or restores
- [x] Add cleanup and recovery regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Recovery status UX continuation

- [x] Audit recovery-state presentation and backup age logic
- [x] Add reusable recovery status presentation
- [x] Add stale-backup warning and clearer age guidance
- [x] Add recovery-status regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Active recovery workflow continuation

- [x] Audit backup refresh and active-workflow integration points
- [x] Add manual backup refresh action with safe feedback
- [x] Add compact recovery status to active document workflows
- [x] Add refresh and recovery regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Workflow recovery visibility continuation

- [x] Audit Document detail and Review integration points
- [x] Add compact recovery status to Document detail
- [x] Add context-aware recovery status to Review
- [x] Add workflow recovery regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Post-export storage health continuation

- [x] Audit post-export and storage-health integration points
- [x] Add post-export backup refresh shortcut
- [x] Add clearer local storage-health guidance
- [x] Add regression coverage for refresh and storage-health helpers
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Export reliability continuation

- [x] Audit export sizing and local storage feedback paths
- [x] Add clearer progress context for large-library export and refresh
- [x] Add low-storage safeguards before large saves
- [x] Add export reliability regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Capture storage safeguard continuation

- [x] Audit scanner capture and import storage paths
- [x] Add low-storage guidance before photo import and camera capture
- [x] Add safe blocking behavior for critically full local storage
- [x] Add capture-flow regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Capture cleanup navigation continuation

- [x] Audit scanner warning and cleanup navigation paths
- [x] Add direct Open storage cleanup action from scanner warnings
- [x] Preserve capture-warning dismissal and accessibility behavior
- [x] Add warning-navigation regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Early capture storage warning continuation

- [x] Audit scanner warning thresholds and cleanup guidance
- [x] Add earlier low-storage warning state
- [x] Preserve critical block and direct cleanup navigation
- [x] Add threshold and navigation regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Cleanup candidate summary continuation

- [x] Audit scanner storage warning and cleanup candidate data
- [x] Add removable-document count and reclaim summary
- [x] Preserve cleanup navigation and critical capture blocking
- [x] Add cleanup-summary regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Cleanup preview continuation

- [x] Audit cleanup candidate data and confirmation surfaces
- [x] Add cleanup preview listing removable documents
- [x] Preserve favorite protection and undo recovery
- [x] Add cleanup-preview regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Selective cleanup continuation

- [x] Audit cleanup selection state and deletion boundaries
- [x] Add per-document selection for cleanup candidates
- [x] Add selective cleanup confirmation and reclaim summary
- [x] Preserve favorite protection and undo recovery
- [x] Add selection and recovery regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Cleanup controls continuation

- [x] Audit selective cleanup state and reclaim calculations
- [x] Add Select all and Clear all cleanup controls
- [x] Add per-document reclaim-size details
- [x] Preserve selective deletion and undo recovery
- [x] Add cleanup-control regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Cleanup interaction continuation

- [x] Audit cleanup selection and undo presentation
- [x] Add explicit per-document selection controls
- [x] Improve post-cleanup undo feedback
- [x] Preserve selective deletion and favorite protection
- [x] Add cleanup interaction regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Undo countdown continuation

- [x] Audit undo timing and repeated-cleanup state
- [x] Add live undo countdown display
- [x] Prevent repeated cleanup actions from overwriting recoverable state
- [x] Add undo-timing regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Cleanup expiry feedback continuation

- [x] Audit current expiry and cleanup-control behavior
- [x] Add explicit cleanup-expiry feedback
- [x] Improve cleanup control resilience after expiry and failed undo
- [x] Add regression coverage for expiry feedback
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Partial cleanup recovery continuation

- [x] Audit cleanup mutation failure behavior
- [x] Preserve successfully removed documents when a later removal fails
- [x] Offer recovery for partial cleanup failures
- [x] Add failure-path regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Partial cleanup outcome continuation

- [x] Audit partial-failure feedback and available document state
- [x] Add per-document removal outcome feedback
- [x] Preserve undo recovery for successfully removed documents
- [x] Add outcome-message regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Failed cleanup retry continuation

- [x] Audit failed-document outcome state and retry boundaries
- [x] Add a safe retry action for the failed document
- [x] Preserve successful removals and undo recovery during retry
- [x] Add retry regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Direct cleanup restore continuation

- [x] Audit current undo and per-document outcome state
- [x] Add a direct restore action for removed documents
- [x] Preserve retry, undo, and expiry safeguards
- [x] Add restore regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Bulk cleanup restore continuation

- [x] Audit current removed-document recovery state
- [x] Add a bulk restore action for removed documents
- [x] Preserve individual restore, retry, undo, and expiry safeguards
- [x] Add bulk-restore regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Bulk restore confirmation continuation

- [x] Audit bulk restore flow and outcome history
- [x] Add confirmation before bulk restoration
- [x] Add richer outcome history and failure details
- [x] Preserve individual restore, retry, undo, and expiry safeguards
- [x] Add regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Bulk restore progress continuation

- [x] Audit bulk restore progress and busy-state behavior
- [x] Add visible progress feedback for bulk restoration
- [x] Preserve confirmation, retry, undo, and expiry safeguards
- [x] Add progress regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Bulk restore progress polish continuation

- [x] Audit current bulk restore progress state
- [x] Add compact progress bar and current-document context
- [x] Preserve confirmation, retry, undo, and expiry safeguards
- [x] Add progress presentation regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Bulk restore cancellation continuation

- [x] Audit bulk restore cancellation boundaries
- [x] Add safe cancellation for bulk restoration
- [x] Preserve already-restored documents and remaining recovery state
- [x] Add cancellation regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Bulk restore cancellation summary continuation

- [x] Audit cancellation completion and summary state
- [x] Add explicit restored-versus-remaining cancellation summary
- [x] Preserve retry, undo, expiry, and partial recovery safeguards
- [x] Add cancellation-summary regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Cancellation confirmation continuation

- [x] Audit cancellation confirmation and remaining-document state
- [x] Add confirmation after restoration begins
- [x] Show documents that remain recoverable after cancellation
- [x] Preserve partial recovery, retry, undo, and expiry safeguards
- [x] Add cancellation UX regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Resumable bulk restore continuation

- [x] Audit cancelled-batch state and resume boundaries
- [x] Add a safe Continue restoring action
- [x] Preserve already-restored and still-recoverable documents
- [x] Add resume regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Resume summary continuation

- [x] Audit resume prompt and remaining-document data
- [x] Show remaining documents before resuming
- [x] Show remaining reclaim size before resuming
- [x] Preserve resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add resume-summary regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Resume summary card continuation

- [x] Audit resume alert and cleanup outcome presentation
- [x] Add compact summary card for remaining documents
- [x] Preserve resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add resume-card regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Resume summary modal continuation

- [x] Audit resume card and modal thresholds
- [x] Add dedicated resume summary modal for larger batches
- [x] Preserve compact card, resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add modal regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Consistent resume modal continuation

- [x] Audit modal threshold and resume entry points
- [x] Use the resume summary modal for every cancelled batch
- [x] Preserve compact status, resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add consistent-modal regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Selected resume continuation

- [x] Audit cancelled-batch selection and recovery state
- [x] Add Resume selected flow for chosen documents
- [x] Preserve the remaining recoverable set and existing safeguards
- [x] Add selected-resume regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Resume selection controls continuation

- [x] Audit selected-resume modal state and size calculations
- [x] Add Select all and Clear all controls
- [x] Show selected count and estimated selected restore size
- [x] Preserve selected resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add selection-control regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Selected resume accessibility continuation

- [x] Audit selected-resume accessibility and progress behavior
- [x] Add accessibility labels and selection hints
- [x] Add clearer progress feedback for partial restoration
- [x] Preserve selected resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add accessibility and progress regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Resume accessibility polish continuation

- [x] Audit resume modal focus and progress semantics
- [x] Add semantic progress indicator and accessible completion value
- [x] Improve keyboard focus behavior when the modal opens and closes
- [x] Preserve selected resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add accessibility regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Resume focus and percentage continuation

- [x] Audit resume opener and progress display
- [x] Restore keyboard focus after modal dismissal
- [x] Add readable restore progress percentage
- [x] Preserve selected resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add accessibility regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Restore announcement continuation

- [x] Audit selected-restore notices and live announcement surfaces
- [x] Add explicit completion announcements
- [x] Add explicit cancellation announcements
- [x] Preserve selected resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add announcement regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Recovery history continuation

- [x] Audit recovery outcome state and history surfaces
- [x] Add concise entries for completed restores
- [x] Add concise entries for cancelled and partial-failure restores
- [x] Preserve selected resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add history regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Recovery history metadata continuation

- [x] Audit recovery-history entry shape and display
- [x] Add timestamps to recovery-history entries
- [x] Add affected-document counts to recovery-history entries
- [x] Preserve selected resume, retry, undo, expiry, and partial recovery safeguards
- [x] Add history metadata regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Recovery history clear continuation

- [x] Audit recovery-history state and clear-action boundaries
- [x] Add confirmed clear-history action
- [x] Ensure clearing history never changes document recovery state
- [x] Add clear-history regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Persisted recovery history continuation

- [x] Audit local persistence adapters and recovery-history lifecycle
- [x] Persist recovery history across app restarts
- [x] Hydrate and sanitize recovery history safely
- [x] Keep clear-history isolated from document recovery payloads
- [x] Add persistence regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Recovery history filtering continuation

- [x] Audit persisted history shape and filtering needs
- [x] Add completed, cancelled, and failed outcome filters
- [x] Harden malformed-data recovery and storage-write handling
- [x] Preserve document recovery state and clear-history isolation
- [x] Add history resilience regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Recovery history UX continuation

- [x] Audit recovery-history filter and detail presentation
- [x] Add filter result counts
- [x] Add compact per-entry detail disclosure
- [x] Preserve persisted history, clear-history isolation, and recovery safeguards
- [x] Add history UX regression coverage
- [x] Validate TypeScript, lint, tests, and runtime bundling
- [ ] Save checkpoint and deliver the updated project version

## Recovery history persistence tests continuation

- [x] Audit persistence test seams and recovery-history validation
- [x] Add malformed-record persistence regression coverage
- [x] Add storage-write failure regression coverage
- [x] Preserve current history UX and document recovery safeguards
- [x] Run full TypeScript, lint, and regression validation
- [ ] Save checkpoint and deliver the updated project version

## Recovery history empty state and accessibility continuation
- [x] Audit filtered-history rendering and restore accessibility seams
- [x] Add a clear empty state for filters with no matching history
- [x] Add a one-tap action to return to All history
- [x] Add deterministic accessibility helper coverage for restore progress and focus recovery
- [x] Preserve existing recovery semantics and persistence safeguards
- [x] Run full TypeScript, lint, and regression validation
- [ ] Save checkpoint and deliver the updated project version

## Restore accessibility hardening continuation
- [x] Audit restore announcement and focus-recovery behavior
- [x] Add reusable accessibility announcement decision helpers
- [x] Add reusable focus-recovery decision helper
- [x] Preserve restore, cancellation, and selection semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Restore cancellation announcement continuation
- [x] Audit cancellation announcement and restore status seams
- [x] Add reusable cancellation announcement helper
- [x] Integrate explicit polite cancellation status announcement
- [x] Preserve restore, partial-recovery, and retry semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Cancelled recovery card UX continuation
- [x] Audit cancelled-state card and resume trigger behavior
- [x] Add direct Continue restoring action to the cancelled-state card
- [x] Clarify remaining-document and recoverable-size context
- [x] Preserve selected, partial, retry, undo, and expiry semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Recovery history resume-link continuation
- [x] Audit recovery-history entries and resume-flow availability
- [x] Add direct link from the latest cancelled entry to resume flow
- [x] Preserve history filters, persistence, and recovery semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Recovery resume expiry hardening continuation
- [x] Audit undo expiry state and history-link eligibility
- [x] Make resume-link eligibility explicitly expiry-aware
- [x] Add clear expired-state status copy where recovery remains visible
- [x] Preserve cleanup expiry and recovery semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Recovery history expired indicator continuation
- [x] Audit expired history-entry presentation
- [x] Add compact expired-state indicator for historical cancelled entries
- [x] Add accessible labeling that does not imply resumability
- [x] Preserve recovery filters, persistence, and expiry semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Recovery history expired count continuation
- [x] Audit recovery-history counts and expired-entry derivation
- [x] Add compact expired-event count to history summary
- [x] Add accessible summary copy that distinguishes expired from resumable work
- [x] Preserve recovery filters, persistence, and recovery semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Cancelled filter expired count continuation
- [x] Audit filter counts and expired-event derivation
- [x] Add filter-specific expired count for the Cancelled view
- [x] Add accessible summary copy for filtered expired activity
- [x] Preserve recovery filters, persistence, and recovery semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Recovery history filter badge continuation
- [x] Audit filter-chip rendering and count data
- [x] Add compact expired-count badges to recovery filters
- [x] Add accessible labels describing filter and expired count
- [x] Preserve filter behavior, persistence, and recovery semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Recovery filter badge expiry transition continuation
- [x] Audit expiry transition and badge derivation
- [x] Implement stable badge updates when the undo window closes
- [x] Preserve recovery, filter, persistence, and accessibility semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Active recovery countdown hint continuation
- [x] Audit active recovery countdown and presentation seams
- [x] Add compact countdown hint to the current resumable recovery state
- [x] Add accessible active-window countdown copy
- [x] Preserve expiry, recovery, filter, and persistence semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Active undo visual countdown continuation
- [x] Audit active undo countdown presentation and semantics
- [x] Add compact visual countdown treatment to the active recovery state
- [x] Add accessible progress semantics for the countdown
- [x] Preserve countdown text, expiry, and recovery safeguards
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Undo countdown warning state continuation
- [x] Audit countdown warning thresholds and current styles
- [x] Add deterministic warning-state styling helper
- [x] Apply warning colors and accessible state labels near expiry
- [x] Preserve progress semantics, expiry, and recovery safeguards
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Reduced-motion countdown continuation
- [x] Audit platform motion preferences and countdown rendering
- [x] Add reduced-motion-safe countdown behavior
- [x] Preserve warning tones, semantic progress, and recovery safeguards
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Reduced-motion accessibility copy continuation
- [x] Audit reduced-motion accessibility copy and state exposure
- [x] Add explicit reduced-motion status labeling to the countdown
- [x] Preserve visual warning states, progress semantics, and recovery safeguards
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Reduced-motion status cue continuation
- [x] Audit recovery-card status copy and reduced-motion state
- [x] Add concise reduced-motion status cue to the active recovery card
- [x] Add accessible status wording without implying a recovery change
- [x] Preserve recovery behavior, progress semantics, and safeguards
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Active versus expired recovery status continuation
- [x] Audit recovery status wording and expiry state
- [x] Add active and expired recovery status cue
- [x] Add accessible status wording without changing action eligibility
- [x] Preserve recovery, persistence, filter, and countdown semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Recovery status visual styling continuation
- [x] Audit recovery status styling and tone mapping
- [x] Add distinct active and expired status styles
- [x] Preserve accessible wording, action eligibility, and recovery semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## High-contrast recovery status continuation
- [x] Audit high-contrast detection and recovery status colors
- [x] Add contrast-aware recovery status presentation
- [x] Preserve accessible wording, action eligibility, and countdown semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## High-contrast countdown bar continuation
- [x] Audit countdown bar tones and contrast presentation
- [x] Add high-contrast countdown bar and warning styles
- [x] Preserve semantic progress, reduced-motion, expiry, and recovery behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## High-contrast warning fill continuation
- [x] Audit warning and expired countdown fill styling
- [x] Add contrast-safe warning and expired fill styles
- [x] Preserve semantic progress, reduced-motion, expiry, and recovery behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## High-contrast transition coverage continuation
- [x] Audit high-contrast countdown transition seams
- [x] Add deterministic warning and expired presentation transition coverage
- [x] Preserve recovery behavior, accessibility semantics, and visual treatment
- [x] Run full TypeScript, lint, and regression validation
- [ ] Save checkpoint and deliver the updated project version

## Non-color countdown cues continuation
- [x] Audit countdown state cues and accessible presentation
- [x] Add non-color cues for active, warning, and expired states
- [x] Preserve recovery semantics, high-contrast styling, and progress values
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localization-ready recovery cues continuation
- [x] Audit recovery cue strings and formatting seams
- [x] Centralize active, warning, and expired cue formatting
- [x] Preserve recovery behavior, accessibility semantics, countdown logic, and safeguards
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Locale-aware recovery cues continuation
- [x] Audit cue labels and locale integration seams
- [x] Add locale-aware recovery cue resolver
- [x] Preserve recovery behavior, accessibility semantics, countdown logic, and safeguards
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Device-locale recovery cues continuation
- [x] Audit device-locale access and Settings integration seams
- [x] Connect device locale to recovery cue presentation
- [x] Preserve English fallback, recovery behavior, accessibility semantics, countdown logic, and safeguards
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Spanish recovery cues continuation
- [x] Audit built-in translation scope and cue wording
- [x] Add Spanish active, warning, and expired recovery cues
- [x] Preserve English fallback, recovery behavior, accessibility semantics, and safeguards
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized countdown messages continuation
- [x] Audit countdown and expiry message seams
- [x] Add locale-aware pluralized countdown and expiry messages
- [x] Integrate localized messages without changing English defaults or recovery behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized recovery announcements continuation
- [x] Audit progress and cancellation announcement seams
- [x] Add locale-aware progress and cancellation messages
- [x] Integrate localized announcements without changing English defaults or recovery behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized recovery history continuation
- [x] Audit recovery history label seams
- [x] Add locale-aware history filters, empty states, and status labels
- [x] Integrate localized history labels without changing English defaults or recovery semantics
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized recovery actions continuation
- [x] Audit remaining recovery action and accessibility label seams
- [x] Add locale-aware recovery action labels and accessibility announcements
- [x] Integrate localized actions without changing English defaults or recovery behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized recovery dialogs continuation
- [x] Audit recovery dialog and accessibility copy seams
- [x] Add locale-aware confirmation-dialog copy and accessibility labels
- [x] Integrate localized dialog copy without changing English defaults or recovery behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized cleanup UX continuation
- [x] Audit cleanup confirmation and selection label seams
- [x] Add locale-aware cleanup confirmation copy and document-selection accessibility labels
- [x] Integrate localized cleanup copy without changing English defaults or cleanup safeguards
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized cleanup outcomes continuation
- [x] Audit cleanup outcome status seams
- [x] Add locale-aware Removed, Restored, Failed, and detail labels
- [x] Integrate localized outcomes without changing English defaults or cleanup behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized cleanup notices continuation
- [x] Audit cleanup toast and notice seams
- [x] Add locale-aware cleanup success and failure notices
- [x] Integrate localized notices without changing English defaults or error handling
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized expiry and error notices continuation
- [x] Audit cleanup expiry and error notice seams
- [x] Add locale-aware expiry and error-recovery messages
- [x] Integrate localized notices without changing English defaults or error handling
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized backup notices continuation
- [x] Audit backup notice and confirmation seams
- [x] Add locale-aware backup deletion and restore notices
- [x] Integrate localized backup copy without changing English defaults or safety behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized monetization notices continuation
- [x] Audit subscription and purchase notice seams
- [x] Add locale-aware subscription and purchase notices
- [x] Integrate localized monetization copy without changing English defaults or purchase behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized paywall continuation
- [x] Audit paywall product and pending-diagnostics seams
- [x] Add locale-aware product descriptions, pricing context, and pending-purchase diagnostics
- [x] Integrate localized paywall copy without changing English defaults or purchase behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized paywall accessibility continuation
- [x] Audit paywall accessibility and plan-switch copy seams
- [x] Add locale-aware paywall accessibility labels and plan-switch confirmations
- [x] Integrate localized paywall copy without changing English defaults or purchase behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized plan-state continuation
- [x] Audit plan-state and billing-readiness label seams
- [x] Add locale-aware plan-state and billing-readiness labels
- [x] Integrate localized plan copy without changing English defaults or purchase behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized device-status continuation
- [x] Audit biometric and migration status label seams
- [x] Add locale-aware biometric and storage-migration labels
- [x] Integrate localized device-status copy without changing English defaults or security behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized privacy and security continuation
- [x] Audit privacy and security setting label seams
- [x] Add locale-aware privacy, biometric-lock, and safeguard descriptions
- [x] Integrate localized security copy without changing English defaults or secure behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized experimental settings continuation
- [x] Audit experimental and batch-scan setting label seams
- [x] Add locale-aware experimental-feature and batch-scan labels
- [x] Integrate localized settings copy without changing English defaults or feature behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized scan controls continuation
- [x] Audit OCR and scan-quality control label seams
- [x] Add locale-aware OCR, document-processing, and scan-quality labels
- [x] Integrate localized scan copy without changing English defaults or feature behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized advanced scanner continuation
- [x] Audit advanced scanner guidance and quality feedback seams
- [x] Add locale-aware advanced scanner guidance and frame-quality labels
- [x] Integrate localized scanner copy without changing English defaults or scan behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized camera guidance continuation
- [x] Audit camera guidance and storage-warning label seams
- [x] Add locale-aware camera guidance and storage-warning labels
- [x] Integrate localized camera copy without changing English defaults or scan behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized camera errors continuation
- [x] Audit camera permission and capture-error seams
- [x] Add locale-aware permission prompts and capture/import failure messages
- [x] Integrate localized errors without changing English defaults or error detail handling
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized camera error actions continuation
- [x] Audit camera error-action label seams
- [x] Add locale-aware dismiss and storage-cleanup recovery actions
- [x] Integrate localized actions without changing English defaults or error detail handling
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized web demo continuation
- [x] Audit web-demo and library-accessibility label seams
- [x] Add locale-aware web-demo and document-library labels
- [x] Integrate localized labels without changing English defaults or navigation behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized document metadata continuation
- [x] Audit document metadata formatting seams
- [x] Add locale-aware document titles, page counts, and recent-scan metadata
- [x] Integrate localized metadata without changing English defaults or navigation behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized Review and Gallery processing continuation
- [x] Audit Review and Gallery document-processing label seams
- [x] Add locale-aware Review and Gallery processing labels
- [x] Integrate localized UI copy without changing English defaults or navigation behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Expanded document UI localization continuation
- [x] Audit French and Portuguese document UI translation seams
- [x] Add French and Portuguese document UI registries
- [x] Preserve locale fallback, accessibility labels, and existing navigation behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## In-app language preference continuation
- [x] Audit locale resolution and Settings preference seams
- [x] Add persisted language preference for English, Spanish, French, and Portuguese
- [x] Integrate the selected locale across scanner, Review, Gallery, and Settings
- [x] Add accessible preference UI and regression coverage
- [x] Run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Expanded locale integration continuation
- [x] Audit remaining locale consumers and language-selector copy
- [x] Localize the language selector heading and explanatory text
- [x] Extend selected locale to Settings, document detail, paywall, and diagnostics surfaces
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Reset language preference continuation
- [x] Audit language preference reset seams
- [x] Add reset-to-device-language behavior and feedback
- [x] Preserve persistence, fallback, accessibility, and navigation behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized preference UX continuation
- [x] Audit language preference labels and Settings source indicator seams
- [x] Localize reset action and feedback messages for English, Spanish, French, and Portuguese
- [x] Add a custom-versus-device language source indicator
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized action UX continuation
- [x] Audit Paywall and document-detail action and error seams
- [x] Add localized Paywall and document-detail action labels and error feedback
- [x] Preserve accessibility, purchase, editing, recovery, and navigation behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized page inspector continuation
- [x] Audit page-inspector action and filter labels
- [x] Add localized rotate, crop, filter, preview, and page-navigation labels
- [x] Preserve editing safety, recovery, accessibility, and fallback behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized inspector polish continuation
- [x] Audit remaining inspector guidance and editing error seams
- [x] Add localized zoom/swipe guidance and editing error feedback
- [x] Preserve editing safety, recovery, accessibility, and fallback behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized edit history continuation
- [x] Audit edit-history and document-detail metadata seams
- [x] Add localized history labels, timestamps, restore confirmations, and metadata
- [x] Preserve recovery safety, accessibility, and locale fallback behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized page metadata continuation
- [x] Audit page metadata and title-editing label seams
- [x] Add localized page labels, filter names, original-capture metadata, thumbnail accessibility, and title-editing labels
- [x] Preserve edit, recovery, accessibility, and navigation behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized document-detail polish continuation
- [x] Audit remaining document-detail presentation copy
- [x] Add localized eyebrow, success-card, and filter presentation copy
- [x] Preserve existing workflows, accessibility, and fallback behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized filter and notice continuation
- [x] Audit filter naming and asynchronous notice seams
- [x] Add localized filter display names and document-detail success/recovery notices
- [x] Preserve existing workflows, accessibility, and fallback behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized success feedback continuation
- [x] Audit filter presentation and success-notice seams
- [x] Add localized filter names in preview and edit history
- [x] Add translated rename, edit-save, and PDF-sharing success notices
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized failure feedback continuation
- [x] Audit rename, edit-save, and PDF-share error seams
- [x] Add localized failure feedback with safe error details
- [x] Preserve accessibility announcements and existing workflows
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized recovery-error feedback continuation
- [x] Audit deletion and recovery-restoration error seams
- [x] Add localized deletion and restoration failure feedback with safe error details
- [x] Preserve accessibility announcements and existing workflows
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized gallery recovery continuation
- [x] Audit gallery deletion and undo-recovery error seams
- [x] Add localized gallery deletion and undo-recovery failure feedback
- [x] Preserve swipe-action safety, accessibility semantics, and gallery workflows
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized gallery feedback continuation
- [x] Audit gallery success and refresh-error seams
- [x] Add localized deletion and undo success notices
- [x] Add translated search-index and refresh failure feedback
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized gallery status continuation
- [x] Audit gallery favorite, suggestion, and hydration seams
- [x] Add localized favorite-toggle success and failure feedback
- [x] Add translated search-suggestion and hydration failure feedback
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Localized scanner status continuation
- [x] Audit scanner recent-scan status seams
- [x] Add localized recent-scan success and failure feedback
- [x] Preserve scanner flow, accessibility labels, and fallback behavior
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Expanded scanner localization continuation
- [x] Audit camera label and capture-success seams
- [x] Add French and Portuguese camera labels and guidance
- [x] Add localized capture-success feedback before Review navigation
- [x] Add regression coverage and run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Scanner status accessibility continuation
- [ ] Audit scanner warning and quality-announcement seams
- [ ] Add localized storage-warning and document-edge quality feedback
- [ ] Add timing-safe regression coverage for capture-success feedback
- [ ] Run full TypeScript, lint, and test validation
- [ ] Save checkpoint and deliver the updated project version

## Multilingual scanner hardening pass

- [x] Add localized scanner quality guidance and storage cleanup warnings
- [x] Add localized batch scan status, progress, queue labels, actions, and failure feedback
- [x] Add regression coverage for scanner quality, storage warnings, and English fallback
- [x] Re-run TypeScript, lint, and full regression tests
- [ ] Validate text expansion and VoiceOver/TalkBack announcements on physical iOS and Android devices
- [ ] Complete timing-safe capture-success announcement test before Review navigation
- [ ] Audit and localize remaining raw diagnostics and monetization copy outside the scanner and batch routes

## Diagnostics and monetization localization pass

- [x] Add localized paywall restore, pending-purchase, purchase, store-refresh, and selection-save failure copy
- [x] Preserve safe underlying error details while translating user-facing failure context
- [x] Add regression coverage for French, Portuguese, and English fallback paywall errors
- [x] Resolve React hook dependency warnings introduced by reactive locale copy
- [x] Re-run TypeScript, lint, and full regression tests
- [ ] Audit remaining raw diagnostics and non-error monetization labels outside the paywall route

## Paywall surface localization pass

- [x] Wire localized Pro benefits into the paywall value chips and summary
- [x] Add French and Portuguese overrides for Pro benefits and month/year price labels
- [x] Add regression coverage for regional paywall labels and localized pricing
- [x] Re-run TypeScript, lint, and full regression tests
- [ ] Localize remaining non-error paywall action labels and contextual marketing copy

## Paywall actions and accessibility pass

- [x] Add localized contextual paywall titles and subtitles for OCR, credits, and default entry points
- [x] Localize offer selection, confirmation, retry, restore, refresh, and dismissal actions
- [x] Add localized pending-purchase live-region feedback and header semantics
- [x] Add regression coverage for regional action labels, pending status, and accessibility copy
- [x] Consolidate duplicate imports and remove new lint warnings
- [x] Re-run TypeScript, lint, and full regression tests
- [ ] Validate paywall accessibility labels and translated layout expansion on physical devices

## Accessibility and security diagnostics pass

- [x] Extract capture-success announcement sequencing into a deterministic helper
- [x] Add regression coverage proving announcement precedes Review navigation
- [x] Prevent navigation when the announcement wait fails
- [x] Localize app-lock titles, prompts, authentication failures, session expiry, and persistence diagnostics
- [x] Add localized app-lock regression coverage with regional fallback checks
- [x] Re-run TypeScript, lint, and full regression tests
- [ ] Validate VoiceOver/TalkBack announcement timing and lock-screen copy on physical devices

## Error-boundary recovery pass

- [x] Add localized error-boundary titles, retry actions, safe fallback messages, and data-preservation hints
- [x] Refactor the boundary to react to the selected app language
- [x] Add assertive accessibility announcement semantics for screen failure details
- [x] Add regional locale regression coverage for error-boundary copy
- [x] Re-run TypeScript, lint, and full regression tests
- [ ] Localize remaining recovery-status and export-feedback component labels

## Recovery surface localization pass

- [x] Localize error-boundary title, safe fallback, retry action, and document-preservation hint
- [x] Add assertive screen-reader semantics to error-boundary failure details
- [x] Localize preview empty state, PDF-ready state, page metadata, share, and new-scan actions
- [x] Add regional locale regression coverage for error-boundary and preview copy
- [x] Re-run TypeScript, lint, and full regression tests
- [ ] Localize remaining recovery-status and export-feedback component labels

## Recovery status and export feedback pass

- [x] Localize recovery-status title, availability, stale-backup warning, and restore/delete/refresh actions
- [x] Localize export progress, cancellation, retry, diagnostics, close, and sanitized-copy actions
- [x] Add accessible headers, live-region progress updates, and button labels
- [x] Add regional locale regression coverage for recovery and export feedback
- [x] Re-run TypeScript, lint, and full regression tests
- [ ] Validate translated recovery and export feedback layout on physical devices

## Utility link recovery pass

- [x] Localize external-link open labels and connection-failure alerts
- [x] Add default accessibility labels for reusable external links
- [x] Add regional locale regression coverage for external-link copy and English fallback
- [x] Re-run TypeScript, lint, and full regression tests
- [ ] Validate external-link alerts and translated accessibility labels on physical devices

## Platform fallback and utility audit

- [x] Audit platform-specific fallback labels and native/web error copy
- [x] Localize remaining fallback and utility messages
- [x] Add regression coverage for platform fallback localization and accessibility labels
- [x] Re-run TypeScript, lint, and full regression tests

## Native camera and PDF-service fallback audit

- [x] Audit native camera and PDF-service fallback labels and error guidance
- [x] Localize remaining native and PDF fallback messages
- [x] Add regression coverage for native/PDF fallback localization and accessibility labels
- [x] Re-run TypeScript, lint, and full regression tests

## Settings and monetization diagnostics audit

- [x] Audit subscription, entitlement, biometric, and backup diagnostic summaries
- [x] Localize remaining diagnostic status and recovery text
- [x] Add regression coverage for localized diagnostic summaries and accessibility labels
- [x] Re-run TypeScript, lint, and full regression tests

## Subscription diagnostic metadata pass

- [x] Audit tier, provider, cache, last-action, and pending-offer metadata labels
- [x] Localize diagnostic metadata summaries and accessibility presentation
- [x] Add regression coverage for localized metadata and English fallback
- [x] Re-run TypeScript, lint, and full regression tests

## Locale provider runtime hardening

- [x] Keep AppLocaleContext mounted during web preference hydration
- [x] Prevent AppErrorBoundary from crashing before locale hydration completes
- [x] Verify the preview renders successfully after the provider fix
- [x] Re-run TypeScript, lint, and full regression tests

## Settings hydration and persistence recovery pass

- [x] Audit concurrent settings hydration and persistence failure paths
- [x] Add deterministic recovery handling and accessible localized feedback
- [x] Add regression coverage for hydration failure and persistence retry behavior
- [x] Re-run TypeScript, lint, and full regression tests

## Recovery-history save transparency pass

- [x] Audit recovery-history UI for save-state visibility
- [x] Add localized last-saved status and retry-safe feedback
- [x] Add regression coverage for save-state labels and fallback
- [x] Re-run TypeScript, lint, and full regression tests

## Recovery-history persistence retry pass

- [x] Audit recovery-history persistence state and retry interaction
- [x] Add localized visible retry action for failed saves
- [x] Add deterministic regression coverage for retry success and failure
- [x] Re-run TypeScript, lint, and full regression tests

## Recovery retry-flow verification pass

- [x] Audit retry-flow testability and persistence-state transitions
- [x] Add deterministic retry helper coverage and localized status feedback
- [x] Add regression coverage for retry success and repeated failure
- [x] Re-run TypeScript, lint, and full regression tests

## Recovery retry regression pass

- [x] Audit the throwing save helper and storage-adapter test seams
- [x] Add deterministic retry success and repeated-failure tests
- [x] Verify localized retry labels and fallback behavior
- [x] Re-run TypeScript, lint, and full regression tests

## Recovery last-saved timestamp pass

- [x] Audit timestamp data and retry-state rendering
- [x] Add localized last-saved timestamp feedback beside retry
- [x] Add regression coverage for timestamp formatting and fallback
- [x] Re-run TypeScript, lint, and full regression tests

## Recovery component coverage pass

- [x] Audit component-level test seams for visible timestamp and retry states
- [x] Add deterministic coverage for rendered recovery status helpers
- [x] Verify localized accessibility labels and fallback behavior
- [x] Re-run TypeScript, lint, and full regression tests

## Settings retry-flow regression pass

- [x] Audit Settings retry-flow test seams
- [x] Add deterministic coverage for retry success and repeated failure
- [x] Verify localized retry labels and last-saved state behavior
- [x] Re-run TypeScript, lint, and full regression tests

## Settings retry accessibility pass

- [x] Audit retry success and repeated failure announcement seams
- [x] Add deterministic localized retry announcement helper
- [x] Add regression coverage for announcement ordering and fallback
- [x] Re-run TypeScript, lint, and full regression tests

## Recovery timestamp preference pass

- [x] Add persisted preference for relative or absolute recovery age display
- [x] Localize timestamp preference labels and relative age formatting
- [x] Wire the preference into Settings and recovery status presentation
- [x] Resolve the remaining Settings hook dependency warning
- [x] Add regression coverage and rerun validation

## Live recovery age refresh pass

- [x] Add a live clock source for relative recovery-age labels
- [x] Refresh RecoveryStatus age text without changing persistence semantics
- [x] Add deterministic coverage for refresh timing and absolute-mode stability
- [x] Re-run TypeScript, lint, and full regression tests

## Foreground-aware recovery timer pass

- [x] Pause relative recovery-age refresh while the app is backgrounded
- [x] Resume and refresh recovery age on foreground
- [x] Add deterministic lifecycle policy coverage
- [x] Re-run TypeScript, lint, and full regression tests

## Recent recovery save copy pass

- [x] Add localized just-now recovery age labels
- [x] Use the just-now state for very recent relative saves
- [x] Add regression coverage for the threshold and fallback behavior
- [x] Re-run TypeScript, lint, and full regression tests

## RecoveryStatus component coverage pass

- [x] Add deterministic component-level test seams for accessible saved-age output
- [x] Cover localized just-now rendering and the 60-second transition
- [x] Re-run TypeScript, lint, and full regression tests

## RecoveryStatus edge-case hardening pass

- [x] Harden missing-save and clock-skew handling
- [x] Verify unsupported-locale fallback and absolute-mode safety
- [x] Add deterministic edge-case regression coverage
- [x] Re-run TypeScript, lint, and full regression tests

## Recovery history normalization pass

- [x] Validate and normalize malformed recovery-history entries on hydration
- [x] Preserve bounded history ordering and safe timestamps during persistence
- [x] Add deterministic malformed-entry regression coverage
- [x] Re-run TypeScript, lint, and full regression tests

## Recovery repair feedback pass

- [x] Report discarded malformed recovery entries during hydration
- [x] Add localized accessible repair notice copy without document details
- [x] Add deterministic repair-summary regression coverage
- [x] Re-run TypeScript, lint, and full regression tests

## Settings hydration dependency cleanup pass

- [x] Include locale dependencies in recovery hydration safely
- [x] Prevent stale repair feedback during language changes
- [x] Add deterministic locale-reactivity regression coverage
- [x] Re-run TypeScript, lint, and full regression tests

## Dismissible recovery repair notice pass

- [x] Add localized dismiss action copy for repair notices
- [x] Render the repair notice with accessible dismissal semantics
- [x] Add deterministic dismissal regression coverage
- [x] Re-run TypeScript, lint, and full regression tests

## One-time recovery repair notice pass

- [x] Persist a repair notice marker after dismissal
- [x] Suppress only previously acknowledged repair summaries
- [x] Add deterministic marker persistence and reset coverage
- [x] Re-run TypeScript, lint, and full regression tests

## Runtime health verification pass

- [x] Restart development services after the latest checkpoint
- [x] Inspect logs and preview health for build or runtime regressions
- [x] Fix any surfaced runtime issue and add targeted coverage
- [x] Re-run validation and save a follow-up checkpoint

## Shadow style compatibility pass

- [x] Audit deprecated shadow style props in scanner UI
- [x] Replace supported targets with boxShadow styling
- [x] Verify preview output and regression behavior
- [x] Re-run TypeScript, lint, and full regression tests

## Expo SDK compatibility audit pass

- [x] Inspect Expo SDK 54 package compatibility warnings
- [x] Determine whether safe patch alignment is needed
- [x] Validate dependency changes or document the safe baseline
- [x] Re-run TypeScript, lint, and full regression tests

## Expo plugin configuration pass

- [x] Confirm required Expo plugins are absent from dynamic app.config.ts
- [x] Add explicit expo-font and expo-web-browser plugin declarations
- [x] Re-run non-destructive dependency audit without unrelated upgrades
- [x] Re-run TypeScript, lint, and full regression tests

## Automated Expo compatibility validation pass

- [x] Add a non-destructive Expo compatibility validation script
- [x] Wire the script into the project validation workflow
- [x] Verify compatibility validation passes with current exclusions
- [x] Re-run TypeScript, lint, and full regression tests

## Expo compatibility checker coverage pass

- [x] Extract checker decision logic into a deterministic test seam
- [x] Cover pass behavior and dependency-drift failure behavior
- [x] Re-run the complete validation workflow
- [x] Save a recoverable checkpoint

## Expo compatibility diagnostics output pass

- [x] Add optional machine-readable compatibility output
- [x] Preserve human-readable checker output and exit semantics
- [x] Add deterministic output regression coverage
- [x] Re-run the complete validation workflow

## Expo compatibility diagnostics integration pass

- [x] Add a sanitized compatibility status view model for Settings
- [x] Surface optional Expo compatibility status in local diagnostics
- [x] Add deterministic diagnostics formatting coverage
- [x] Re-run the complete validation workflow

## Expo compatibility timestamp diagnostics pass

- [x] Add a sanitized compatibility-check timestamp formatter
- [x] Surface localized timestamp text in Settings diagnostics
- [x] Add deterministic timestamp and invalid-time fallback coverage
- [x] Re-run the complete validation workflow

## Expo compatibility refresh action pass

- [x] Add localized refresh action copy and state labels
- [x] Wire a non-destructive compatibility refresh handler into Settings diagnostics
- [x] Add deterministic refresh success and failure coverage
- [x] Re-run the complete validation workflow

## Persisted Expo compatibility timestamp pass

- [x] Add a sanitized local persistence service for the last successful check time
- [x] Hydrate and display the saved timestamp safely in Settings diagnostics
- [x] Persist refresh success without breaking the existing refresh action
- [x] Add persistence failure and recovery regression coverage

## Expo compatibility last-checked age pass

- [x] Add localized age formatting for the persisted compatibility check
- [x] Surface last-checked age beside the absolute timestamp in Settings diagnostics
- [x] Add deterministic age and invalid-time fallback coverage
- [x] Re-run the complete validation workflow

## Live Expo compatibility age pass

- [x] Add a live clock source for the compatibility age label
- [x] Refresh the diagnostics age without rewriting persisted data
- [x] Pause and resume the age timer with app lifecycle state
- [x] Add deterministic timer and lifecycle regression coverage

## Compatibility age accessibility announcement pass

- [x] Add localized threshold announcement copy
- [x] Announce only the first transition out of just-now state
- [x] Preserve lifecycle pause behavior and avoid duplicate announcements
- [x] Add deterministic accessibility threshold regression coverage

## Compatibility timestamp retry pass

- [x] Add localized retry action copy for timestamp persistence failures
- [x] Preserve the latest in-memory compatibility status while persistence is unavailable
- [x] Wire retry success and failure feedback into Settings diagnostics
- [x] Add deterministic persistence retry regression coverage

## Settings lifecycle renderer pass

- [x] Audit Settings AppState subscriptions and compatibility age timer ownership
- [x] Harden lifecycle cleanup or foreground refresh behavior where needed
- [x] Add renderer-level AppState and timer cleanup regression tests
- [x] Re-run validation and save a checkpoint

## Native shadow style cleanup pass

- [x] Audit remaining deprecated shadowColor, shadowOpacity, shadowRadius, shadowOffset, and elevation declarations
- [x] Replace supported native shadow declarations with boxShadow styles
- [x] Validate the affected screens and regression suite
- [x] Save a checkpoint for the styling cleanup

## App configuration hardening pass

- [x] Audit app name, slug, bundle identifiers, schemes, and template placeholders
- [x] Verify branding assets and Expo icon references are consistent
- [x] Fix configuration inconsistencies without changing the stable app slug
- [x] Validate configuration and save a checkpoint

## Export persistence reliability pass

- [x] Audit export cancellation, retry, and persistence state transitions
- [x] Fix the highest-value stale or inconsistent state transition
- [x] Add deterministic regression coverage for the fix
- [x] Re-run validation and save a checkpoint

## Orphaned PDF cleanup pass

- [x] Audit generated PDF ownership when document persistence fails
- [x] Delete generated PDF artifacts safely after persistence failure
- [x] Add deterministic cleanup regression coverage
- [x] Re-run validation and save a checkpoint

## Review export renderer coverage pass

- [x] Audit Review renderer dependencies and available mocks
- [x] Add a renderer-level persistence failure test for export cleanup
- [x] Verify user-facing error state and cleanup invocation
- [x] Re-run validation and save a checkpoint

## Batch Scan export renderer coverage pass

- [x] Audit Batch Scan renderer dependencies and available mocks
- [x] Add a renderer-level persistence failure test for batch export cleanup
- [x] Verify user-facing error state and cleanup invocation
- [x] Re-run validation and save a checkpoint

## Cleanup failure retry guidance pass

- [x] Audit localized cleanup notices and export error surfaces
- [x] Add localized cleanup-failure retry guidance
- [x] Cover cleanup-failure behavior in Review and Batch Scan tests
- [x] Re-run validation and save a checkpoint

## Direct export retry action pass

- [x] Audit current Review and Batch Scan export failure controls
- [x] Add localized direct retry actions for failed exports
- [x] Cover retry action behavior in renderer tests
- [x] Re-run validation and save a checkpoint

## Accessible export retry pass

- [x] Audit Review and Batch Scan retry labels, states, and announcements
- [x] Add accessible retry states and localized success/failure announcements
- [x] Cover retry accessibility behavior in renderer tests
- [x] Re-run validation and save a checkpoint

## Orphan PDF audit pass

- [x] Audit filesystem ownership and storage-audit integration points
- [x] Add a bounded orphan-PDF audit service with safe no-op behavior on unsupported platforms
- [x] Add localized diagnostics for audit results
- [x] Add deterministic audit tests, re-run validation, and save a checkpoint

## Settings orphan PDF audit integration pass

- [x] Audit Settings diagnostics markup and state integration points
- [x] Add an accessible localized temporary-PDF audit action to Settings
- [x] Cover the Settings audit action and notice rendering
- [x] Re-run validation and save a checkpoint

## Monetization reliability improvement pass

- [x] Audit entitlement, credits, purchase, restore, and subscription diagnostics transitions
- [x] Strengthen the highest-value monetization state transition
- [x] Add localized accessibility feedback for monetization outcomes
- [x] Add regression coverage, re-run validation, and save a checkpoint

## Paywall renderer coverage pass

- [x] Audit Paywall dependencies and available renderer mocks
- [x] Add renderer coverage for purchase and restore busy states
- [x] Verify duplicate-action blocking and accessible outcomes
- [x] Re-run validation and save a checkpoint

## Full Paywall renderer flow pass

- [x] Audit Paywall dependency graph and mockable billing boundaries
- [x] Add renderer coverage for purchase success and interruption
- [x] Add renderer coverage for restore and pending-purchase recovery
- [x] Re-run validation and save a checkpoint

## Pending purchase foreground recovery pass

- [x] Audit pending-purchase reconciliation and AppState behavior
- [x] Add lifecycle-safe localized reconciliation feedback
- [x] Add renderer coverage for reconciled and failed foreground recovery
- [x] Re-run validation and save a checkpoint

## Pending purchase recovery card pass

- [x] Audit Paywall pending-purchase presentation and retry seams
- [x] Add a visible localized recovery card with guarded direct retry
- [x] Cover recovery-card rendering and retry behavior
- [x] Re-run validation and save a checkpoint

## Pending purchase retry policy pass

- [x] Audit pending-purchase retry state and existing recovery guidance
- [x] Add a bounded retry policy with localized escalation guidance
- [x] Cover repeated failure and accessibility behavior
- [x] Re-run validation and save a checkpoint

## Capped purchase support action pass

- [x] Audit capped Paywall recovery state and available support actions
- [x] Add a localized support/contact recovery action
- [x] Cover the action’s accessibility and failure behavior
- [x] Re-run validation and save a checkpoint

## Subscription lifecycle guidance pass

- [x] Audit cached entitlement renewal and expiry presentation
- [x] Add localized upcoming-renewal and expired-access guidance
- [x] Surface lifecycle guidance accessibly in the Paywall
- [x] Add deterministic lifecycle and renderer regression coverage
- [x] Re-run validation and save a checkpoint

## Settings billing action hardening pass

- [x] Audit Settings purchase, restore, and refresh concurrency behavior
- [x] Add shared busy-state and duplicate-action protection
- [x] Add localized accessibility feedback for billing action outcomes
- [x] Add deterministic Settings billing-policy regression coverage
- [x] Re-run validation and save a checkpoint

## Offer and entitlement recovery improvement pass

- [x] Audit current offer comparison, selected-offer, and entitlement refresh behavior
- [x] Add restart-safe pending-purchase recovery attempt persistence
- [x] Preserve localized accessibility and billing busy-state semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Monetization management improvement pass

- [x] Audit current plan-management and billing-provider readiness behavior
- [x] Add repeatable localized credit-pack purchasing and Settings presentation
- [x] Preserve localized accessibility and recovery semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Checkout confirmation improvement pass

- [x] Audit current Pro and credit-pack checkout confirmation behavior
- [x] Add a clear pre-purchase confirmation step for consumable and subscription offers
- [x] Preserve localized accessibility, busy-state, and cancellation semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Error handling hardening pass

- [x] Audit current build logs and failure-prone monetization/storage paths
- [x] Fix identified errors and add user-facing recovery handling
- [x] Preserve localized accessibility and busy-state semantics
- [x] Add deterministic regression coverage for failure paths
- [x] Re-run validation and save a checkpoint

## Additional error recovery pass

- [x] Audit latest logs and unhandled async failure paths
- [x] Add targeted fixes and localized recovery feedback
- [x] Preserve accessibility and billing busy-state semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Latest error recovery pass

- [x] Audit latest logs and unhandled async failure paths
- [x] Add targeted fixes and localized recovery feedback
- [x] Preserve accessibility and billing busy-state semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Latest error recovery pass 2

- [x] Audit latest logs and unhandled async failure paths
- [x] Add guarded support navigation with localized recovery feedback
- [x] Preserve accessibility and billing busy-state semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Latest error recovery pass 3

- [x] Audit latest logs and unhandled async failure paths
- [x] Add guarded scanner-to-Settings navigation with localized recovery feedback
- [x] Preserve accessibility and billing busy-state semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Latest error recovery pass 4

- [x] Audit latest logs and unhandled async failure paths
- [x] Add guarded navigation for Settings, advanced scan, and gallery routes
- [x] Preserve accessibility and billing busy-state semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Latest error recovery pass 5

- [x] Audit latest logs and unhandled async failure paths
- [x] Add guarded recent-document navigation with localized recovery feedback
- [x] Preserve accessibility and billing busy-state semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Latest error recovery pass 6

- [x] Audit latest logs and unhandled async failure paths
- [x] Add guarded Paywall dismissal with localized recovery feedback
- [x] Preserve accessibility and billing busy-state semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Latest error recovery pass 7

- [x] Audit latest logs and unhandled async failure paths
- [x] Add guarded gallery document navigation with visible recovery feedback
- [x] Preserve accessibility and billing busy-state semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint

## Latest error recovery pass 8

- [x] Audit latest logs and unhandled async failure paths
- [x] Add tested navigation guard utility and gallery recovery handling
- [x] Preserve accessibility and billing busy-state semantics
- [x] Add deterministic regression coverage
- [x] Re-run validation and save a checkpoint
