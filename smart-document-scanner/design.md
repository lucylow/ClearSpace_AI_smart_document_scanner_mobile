# Smart Document Scanner — Mobile Interface Design

## Product direction

Smart Document Scanner is a focused, local-first iOS-style utility for turning paper documents into clean, shareable PDFs. The interface prioritizes one-handed capture, clear feedback, and a calm workspace rather than dense controls. The primary action is always reachable from the lower half of the screen, while advanced tools remain behind secondary actions.

## Screen list

| Screen | Primary content and functionality |
|---|---|
| Scan | Full-screen camera preview, document alignment frame, lighting/quality hint, credit indicator, capture button, permission state, and entry point to advanced scanning. |
| Review | Captured page preview, filter choices, retake action, add-page action, crop/rotate affordances, and export-to-PDF action. |
| Preview / Export Complete | Document title, page count, export status, share PDF action, new scan action, and navigation to document details. |
| Documents | Searchable two-column document grid/list, thumbnail, title, updated date, favorite state, share action, delete action, and empty state. |
| Document Detail | Large page previews, title and metadata, rename/favorite controls, page management, share PDF, and delete/archive actions. |
| Advanced Scan | Automatic-capture status, frame quality diagnostics, brightness hint, capture feedback, and manual evaluation control for testing the scanner pipeline. |
| Pro / Settings | Subscription state, export credits, upgrade packages, restore purchases, rewarded-ad option, privacy explanation, biometric-lock toggle placeholder, and app version. |

## Key user flows

### Capture and export

1. The user opens **Scan** and grants camera permission if required.
2. The user aligns a document inside the frame while the scanner reports lighting and edge quality.
3. The user taps the large capture control; the app provides haptic feedback and opens **Review**.
4. The user selects a filter, retakes the page, or adds another page.
5. The user taps **Export PDF**. If the free credit gate is reached, the app routes to **Pro / Settings** with a clear explanation.
6. On success, the app opens **Preview / Export Complete**, where the user can share the PDF or start a new scan.

### Browse and manage documents

1. The user opens **Documents** from the tab bar.
2. The user searches or scrolls through saved documents.
3. Tapping a card opens **Document Detail**.
4. The user can share, favorite, rename, archive, delete, or review individual pages.

### Upgrade and restore

1. The user opens **Pro / Settings**.
2. Current plan and remaining credits appear in the first card.
3. The user taps an available package to purchase, or taps **Restore purchases**.
4. If not subscribed, the user may watch a rewarded ad to receive additional credits after completion.

## Layout and interaction rules

The app uses portrait orientation and supports thumb-friendly controls. Screens use safe-area-aware containers, 16–20 pt horizontal padding, 12–16 pt corner radii, and a bottom action zone with generous touch targets. Primary actions use filled indigo buttons; destructive actions use restrained red text or outlined controls. Pressed states use a subtle opacity and scale response, while completed capture/export uses success haptics.

## Color choices

| Token | Color | Use |
|---|---|---|
| Ink | `#122033` | Primary text and camera overlay labels |
| Canvas | `#F7F9FC` | App background |
| Surface | `#FFFFFF` | Cards, sheets, and document tiles |
| Indigo | `#4F46E5` | Primary action, active tab, focus states |
| Indigo Dark | `#3730A3` | Pressed/strong primary states |
| Mint | `#13B981` | Successful export and quality-positive feedback |
| Amber | `#F59E0B` | Lighting and quality warnings |
| Coral | `#E25555` | Delete/error states |
| Slate | `#667085` | Secondary labels and metadata |
| Divider | `#E4EAF2` | Borders and separators |

## Typography

Use the platform system font with a clear hierarchy: 28–32 pt screen titles, 18–20 pt section headings, 15–17 pt body copy, and 12–13 pt metadata. Avoid all-caps except for compact status labels.

## Accessibility

Maintain strong contrast, expose camera and export states as readable text, use labels on every icon-only action, and keep touch targets at least 44 pt. Do not communicate scan quality by color alone; pair color with text and iconography.
