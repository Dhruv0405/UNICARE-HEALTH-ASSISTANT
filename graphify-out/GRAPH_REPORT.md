# Graph Report - icon  (2026-05-06)

## Corpus Check
- 28 files · ~757,821 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 122 nodes · 132 edges · 48 communities (17 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e11675e8`
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
- [[_COMMUNITY_Fitness & Exercise UI|Fitness & Exercise UI]]
- [[_COMMUNITY_Exercise Utils|Exercise Utils]]
- [[_COMMUNITY_jQuery Library|jQuery Library]]
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
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]

## God Nodes (most connected - your core abstractions)
1. `updateCartUI()` - 9 edges
2. `saveCart()` - 7 edges
3. `showNotification()` - 7 edges
4. `checkout()` - 6 edges
5. `calculateBMI()` - 5 edges
6. `generateDietPlan()` - 5 edges
7. `updateHeaderAddress()` - 5 edges
8. `loadSavedAddresses()` - 5 edges
9. `addToCart()` - 5 edges
10. `deleteAddress()` - 5 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Hyperedges (group relationships)
- **Pharmacy Module** —  [INFERRED]
- **Fitness Module** —  [INFERRED]
- **User Management** —  [INFERRED]

## Communities (48 total, 31 thin omitted)

### Community 0 - "Online Pharmacy Logic"
Cohesion: 0.29
Nodes (18): addToCart(), checkout(), decreaseQuantity(), deleteAddress(), increaseQuantity(), initializeAddToCartButtons(), loadCart(), loadSavedAddresses() (+10 more)

### Community 1 - "Platform Entry Points"
Cohesion: 0.48
Nodes (3): handleLogin(), handleLogout(), handleSignup()

### Community 2 - "User Authentication"
Cohesion: 0.29
Nodes (7): admin.html, ai-doctor.html, index.html, auth.js, main.js, server.js, users.json

## Knowledge Gaps
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._