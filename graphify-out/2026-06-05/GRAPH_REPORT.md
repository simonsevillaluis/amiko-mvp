# Graph Report - .  (2026-06-04)

## Corpus Check
- Corpus is ~35,784 words - fits in a single context window. You may not need a graph.

## Summary
- 90 nodes · 74 edges · 35 communities (11 shown, 24 thin omitted)
- Extraction: 68% EXTRACTED · 32% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.87)
- Token cost: 8,500 input · 1,800 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Shell & Design System|UI Shell & Design System]]
- [[_COMMUNITY_Core Product Concepts|Core Product Concepts]]
- [[_COMMUNITY_Progress & Adapted Tasks|Progress & Adapted Tasks]]
- [[_COMMUNITY_Auth Screens|Auth Screens]]
- [[_COMMUNITY_Secondary App Pages|Secondary App Pages]]
- [[_COMMUNITY_Wellness & Daily Agenda|Wellness & Daily Agenda]]
- [[_COMMUNITY_Color Tokens|Color Tokens]]
- [[_COMMUNITY_Chat IA Flow|Chat IA Flow]]
- [[_COMMUNITY_Student Registration|Student Registration]]
- [[_COMMUNITY_Community Features|Community Features]]
- [[_COMMUNITY_Login & Root|Login & Root]]
- [[_COMMUNITY_Dashboard|Dashboard]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Not Found (component)|Not Found (component)]]
- [[_COMMUNITY_Not Found Page|Not Found Page]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Register Page|Register Page]]
- [[_COMMUNITY_Students Page|Students Page]]
- [[_COMMUNITY_Teacher Page|Teacher Page]]
- [[_COMMUNITY_ButtonLink UI|ButtonLink UI]]
- [[_COMMUNITY_FieldLabel UI|FieldLabel UI]]
- [[_COMMUNITY_PageHeader UI|PageHeader UI]]
- [[_COMMUNITY_Dashboard Page (AST)|Dashboard Page (AST)]]
- [[_COMMUNITY_Child Mode Page (AST)|Child Mode Page (AST)]]
- [[_COMMUNITY_Task Result Page (AST)|Task Result Page (AST)]]
- [[_COMMUNITY_AdaptedStep Mock|AdaptedStep Mock]]
- [[_COMMUNITY_ProgressEvent Mock|ProgressEvent Mock]]
- [[_COMMUNITY_Recent Tasks Mock|Recent Tasks Mock]]
- [[_COMMUNITY_Login Page (AST)|Login Page (AST)]]
- [[_COMMUNITY_Mi Dia Page (AST)|Mi Dia Page (AST)]]
- [[_COMMUNITY_Register Page (AST)|Register Page (AST)]]
- [[_COMMUNITY_Students Page (AST)|Students Page (AST)]]
- [[_COMMUNITY_Teacher Page (AST)|Teacher Page (AST)]]

## God Nodes (most connected - your core abstractions)
1. `AppShell` - 7 edges
2. `Child Mode Learning` - 6 edges
3. `Task Adaptation` - 5 edges
4. `Progress Tracking` - 5 edges
5. `LoginScreen` - 5 edges
6. `RegisterScreen` - 5 edges
7. `Supabase integration (planned)` - 5 edges
8. `DetailShell` - 5 edges
9. `OpenAI API integration (planned)` - 4 edges
10. `Amiko design system brand tokens` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Supabase integration (planned)` --conceptually_related_to--> `Progress Tracking`  [INFERRED]
  AGENTS.md → app/progress/page.tsx
- `TEA pedagogical support concept` --conceptually_related_to--> `Child Mode Learning`  [INFERRED]
  AGENTS.md → app/child-mode/[id]/page.tsx
- `LoginScreen` --conceptually_related_to--> `Supabase integration (planned)`  [INFERRED]
  components/auth-screen.tsx → AGENTS.md
- `DemoNotice` --references--> `Supabase integration (planned)`  [INFERRED]
  components/ui.tsx → AGENTS.md
- `Task Adaptation` --conceptually_related_to--> `OpenAI API integration (planned)`  [INFERRED]
  app/adapt-task/page.tsx → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Main Navigation Pages** — app_dashboard_dashboardpage, app_adapt_task_adapttaskpage, app_comunidad_comunidadpage, app_bienestar_bienestarpage [EXTRACTED 0.95]
- **DetailShell Layout Consumers** — app_acompanamiento_acompanamientopage, app_alerts_alertspage, app_historial_historypage, app_professionals_professionalscomingsoonpage, app_settings_settingspage [EXTRACTED 0.95]

## Communities (35 total, 24 thin omitted)

### Community 0 - "UI Shell & Design System"
Cohesion: 0.17
Nodes (12): AmikoIcon, AmikoIconName, AmikoLogo, AppShell, isNavItemActive, navItems, StudentProfileCard, Card (+4 more)

### Community 1 - "Core Product Concepts"
Cohesion: 0.39
Nodes (7): ChildModePage, DemoNotice, Child Mode Learning, OpenAI API integration (planned), Supabase integration (planned), Task Adaptation, TEA pedagogical support concept

### Community 2 - "Progress & Adapted Tasks"
Cohesion: 0.22
Nodes (9): ProgressPage, ChildModeClient, ProgressSummary, Progress Tracking, AdaptedStep, AdaptedTask, AdaptedTask, ProgressEvent (+1 more)

### Community 3 - "Auth Screens"
Cohesion: 0.38
Nodes (7): AuthError, AuthInput, GoogleButton, LoginScreen, RegisterScreen, Role, User roles (caregiver, parent, teacher)

### Community 4 - "Secondary App Pages"
Cohesion: 0.33
Nodes (6): AcompanamientoPage, AlertsPage, HistoryPage, ProfessionalsComingSoonPage, SettingsPage, DetailShell

### Community 5 - "Wellness & Daily Agenda"
Cohesion: 0.33
Nodes (6): BienestarPage, MiDiaPage, TaskDetailPage, AdaptedTaskResult, Daily Agenda, Emotional Wellness

### Community 6 - "Color Tokens"
Cohesion: 0.50
Nodes (4): amiko.blue #0F5AD1, amiko.green #8EC733, amiko.navy #09367C, Amiko Design Tokens

### Community 7 - "Chat IA Flow"
Cohesion: 1.00
Nodes (3): AdaptTaskPage, ChatPage, IA Pedagogical Assistant

### Community 8 - "Student Registration"
Cohesion: 0.67
Nodes (3): ConversationPage, StudentOnboardingPage, StudentProfile

## Knowledge Gaps
- **49 isolated node(s):** `ChildModePage`, `DashboardPage`, `RootLayout`, `LoginPage`, `MyDayPage` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppShell` connect `UI Shell & Design System` to `Core Product Concepts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `Task Adaptation` connect `Core Product Concepts` to `Progress & Adapted Tasks`, `Chat IA Flow`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `AppShell` (e.g. with `Amiko design system brand tokens` and `AGENTS.md`) actually correct?**
  _`AppShell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Child Mode Learning` (e.g. with `ChildModeClient` and `Task Adaptation`) actually correct?**
  _`Child Mode Learning` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Task Adaptation` (e.g. with `Child Mode Learning` and `OpenAI API integration (planned)`) actually correct?**
  _`Task Adaptation` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Progress Tracking` (e.g. with `ChildModeClient` and `ProgressSummary`) actually correct?**
  _`Progress Tracking` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `LoginScreen` (e.g. with `Supabase integration (planned)` and `AGENTS.md`) actually correct?**
  _`LoginScreen` has 2 INFERRED edges - model-reasoned connections that need verification._