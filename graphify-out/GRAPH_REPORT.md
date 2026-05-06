# Graph Report - icon  (2026-05-06)

## Corpus Check
- 26 files · ~755,117 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 94 nodes · 100 edges · 40 communities (8 shown, 32 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `164093e8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Online Pharmacy Logic|Online Pharmacy Logic]]
- [[_COMMUNITY_Platform Entry Points|Platform Entry Points]]
- [[_COMMUNITY_User Authentication|User Authentication]]
- [[_COMMUNITY_Image Generation Tools|Image Generation Tools]]
- [[_COMMUNITY_Placeholder Utilities|Placeholder Utilities]]
- [[_COMMUNITY_Media Downloader Utilities|Media Downloader Utilities]]
- [[_COMMUNITY_Node.js Server Module|Node.js Server Module]]
- [[_COMMUNITY_Diet Planner Logic|Diet Planner Logic]]
- [[_COMMUNITY_UI Slider Component|UI Slider Component]]
- [[_COMMUNITY_Login Handlers|Login Handlers]]
- [[_COMMUNITY_Main UI Logic|Main UI Logic]]
- [[_COMMUNITY_Diet Planner UI|Diet Planner UI]]
- [[_COMMUNITY_Pharmacy UI|Pharmacy UI]]
- [[_COMMUNITY_Fitness & Exercise UI|Fitness & Exercise UI]]
- [[_COMMUNITY_Auth Conceptual System|Auth Conceptual System]]
- [[_COMMUNITY_Media gym2|Media: gym2]]
- [[_COMMUNITY_Media imain|Media: imain]]
- [[_COMMUNITY_Media poster|Media: poster]]
- [[_COMMUNITY_Media trainer1|Media: trainer1]]
- [[_COMMUNITY_Media abrollout|Media: abrollout]]
- [[_COMMUNITY_Media advancegluco|Media: advancegluco]]
- [[_COMMUNITY_Media ai-healthcare-banner|Media: ai-healthcare-banner]]
- [[_COMMUNITY_Media aidoctor|Media: aidoctor]]
- [[_COMMUNITY_Media antacid|Media: antacid]]
- [[_COMMUNITY_Media barbell|Media: barbell]]
- [[_COMMUNITY_Media barbellcurl|Media: barbellcurl]]
- [[_COMMUNITY_Media bcomplex|Media: bcomplex]]
- [[_COMMUNITY_Media bloodgluco|Media: bloodgluco]]
- [[_COMMUNITY_Media bpmnitor|Media: bpmnitor]]
- [[_COMMUNITY_Media cablecrunch|Media: cablecrunch]]
- [[_COMMUNITY_Media cablecurl|Media: cablecurl]]
- [[_COMMUNITY_Media calciumvitamind3|Media: calciumvitamind3]]
- [[_COMMUNITY_Media calf|Media: calf]]
- [[_COMMUNITY_Media cancer-care|Media: cancer-care]]

## God Nodes (most connected - your core abstractions)
1. `updateCartUI()` - 9 edges
2. `saveCart()` - 7 edges
3. `showNotification()` - 7 edges
4. `checkout()` - 6 edges
5. `updateHeaderAddress()` - 5 edges
6. `loadSavedAddresses()` - 5 edges
7. `addToCart()` - 5 edges
8. `deleteAddress()` - 5 edges
9. `decreaseQuantity()` - 4 edges
10. `increaseQuantity()` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Hyperedges (group relationships)
- **Pharmacy Module** —  [INFERRED]
- **Fitness Module** —  [INFERRED]
- **User Management** —  [INFERRED]

## Communities (40 total, 32 thin omitted)

### Community 0 - "Online Pharmacy Logic"
Cohesion: 0.31
Nodes (18): addToCart(), checkout(), decreaseQuantity(), deleteAddress(), increaseQuantity(), initializeAddToCartButtons(), loadCart(), loadSavedAddresses() (+10 more)

### Community 1 - "Platform Entry Points"
Cohesion: 0.29
Nodes (7): admin.html, ai-doctor.html, index.html, auth.js, main.js, server.js, users.json

## Knowledge Gaps
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._