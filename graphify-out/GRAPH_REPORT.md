# Graph Report - .  (2026-07-22)

## Corpus Check
- Corpus is ~46,810 words - fits in a single context window. You may not need a graph.

## Summary
- 713 nodes · 1023 edges · 107 communities (44 shown, 63 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.83)
- Token cost: 60,776 input · 2,500 output

## Community Hubs (Navigation)
- Site Pages & Visual Effects
- Dev Dependencies & Build Tools
- Contact Form & Form Primitives
- Sidebar & Input Primitives
- TypeScript Config & Path Refs
- Toast Notification System
- Website Design Brief & Docs
- Package Scripts & Metadata
- Command Palette & Dialog
- Menubar Component
- shadcn components.json Config
- Express Server & Routing
- Core Runtime Dependencies
- Button, Calendar & Pagination
- Carousel Component
- Toggle & Overlay Primitives
- Chart Component
- Context Menu Component
- Dropdown Menu Component
- Alert Dialog Component
- Custom Hooks & React Core
- Sheet Component
- Table Component
- Breadcrumb Component
- Drawer Component
- Navigation Menu Component
- Select Component
- Service Card & Badge
- Card Component
- Toggle Group Component
- Query Client & API Request
- Mouse Tracker & Tilt Card
- Theme Provider
- Alert Component
- Input OTP Component
- Accordion Component
- Avatar Component
- Tabs Component
- Page Header Component
- Radio Group Component
- Resizable Panels
- Scroll Area Component
- Image Copy Script
- Build Script
- clsx
- cmdk
- connect-pg-simple
- Debug CWD Script
- drizzle-orm
- drizzle-zod
- embla-carousel-react
- express-session
- framer-motion
- input-otp
- lucide-react
- memorystore
- next-themes
- passport
- pg
- @radix-ui accordion
- @radix-ui alert-dialog
- @radix-ui aspect-ratio
- @radix-ui checkbox
- @radix-ui collapsible
- @radix-ui context-menu
- @radix-ui dialog
- @radix-ui dropdown-menu
- @radix-ui hover-card
- @radix-ui label
- @radix-ui menubar
- @radix-ui navigation-menu
- @radix-ui popover
- @radix-ui progress
- @radix-ui radio-group
- @radix-ui scroll-area
- @radix-ui select
- @radix-ui separator
- @radix-ui slider
- @radix-ui slot
- @radix-ui switch
- @radix-ui tabs
- @radix-ui toast
- @radix-ui toggle
- @radix-ui toggle-group
- @radix-ui tooltip
- react-day-picker
- react-dom
- react-hook-form
- react-icons
- react-resizable-panels
- recharts
- tailwind-merge
- tailwindcss-animate
- tanstack-react-query
- tw-animate-css
- vaul
- ws
- zod
- zod-validation-error
- test-drive-note

## God Nodes (most connected - your core abstractions)
1. `cn()` - 92 edges
2. `Button` - 16 edges
3. `compilerOptions` - 15 edges
4. `AdvancedCursor()` - 13 edges
5. `PageTransition()` - 13 edges
6. `Footer()` - 12 edges
7. `Navbar()` - 12 edges
8. `react` - 10 edges
9. `Website UI/UX Upgrade Brief` - 8 edges
10. `useToast()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `CubicTech Logo Mark (favicon)` --conceptually_related_to--> `Cubic Technologies Business Website`  [INFERRED]
  client/public/favicon.png → replit.md
- `Scroll Animations` --semantically_similar_to--> `Frontend Architecture (React/Wouter/TanStack/Tailwind)`  [INFERRED] [semantically similar]
  attached_assets/Pasted-I-already-have-a-complete-multi-page-business-website-f_1769630918099.txt → replit.md
- `Image Placeholder Directory Note` --conceptually_related_to--> `Frontend Architecture (React/Wouter/TanStack/Tailwind)`  [AMBIGUOUS]
  client/public/images/placeholder.txt → replit.md
- `framer-motion Package Requirement` --references--> `Frontend Architecture (React/Wouter/TanStack/Tailwind)`  [INFERRED]
  client/requirements.md → replit.md
- `useCarousel()` --references--> `react`  [EXTRACTED]
  client/src/components/ui/carousel.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Premium Website Upgrade Program** — attached_assets_pasted_i_already_have_a_complete_multi_page_business_website_f_1769630918099_hero_section, attached_assets_pasted_i_already_have_a_complete_multi_page_business_website_f_1769630918099_navbar, attached_assets_pasted_i_already_have_a_complete_multi_page_business_website_f_1769630918099_services_cards, attached_assets_pasted_i_already_have_a_complete_multi_page_business_website_f_1769630918099_scroll_animations, attached_assets_pasted_i_already_have_a_complete_multi_page_business_website_f_1769630918099_proof_trust, attached_assets_pasted_i_already_have_a_complete_multi_page_business_website_f_1769630918099_dark_mode, attached_assets_pasted_i_already_have_a_complete_multi_page_business_website_f_1769630918099_contact_form [INFERRED 0.75]
- **Contact Submission Data Flow** — replit_frontend_architecture, replit_shared_routes_pattern, replit_backend_architecture, replit_consultation_requests [INFERRED 0.85]

## Communities (107 total, 63 thin omitted)

### Community 0 - "Site Pages & Visual Effects"
Cohesion: 0.06
Nodes (34): AdvancedCursor(), CursorMode, Footer(), links, Navbar(), PageTransition(), variants, Particle (+26 more)

### Community 1 - "Dev Dependencies & Build Tools"
Cohesion: 0.04
Nodes (47): autoprefixer, drizzle-kit, esbuild, devDependencies, autoprefixer, drizzle-kit, esbuild, postcss (+39 more)

### Community 2 - "Contact Form & Form Primitives"
Cohesion: 0.10
Nodes (24): ContactForm(), FormControl, FormDescription, FormField(), FormFieldContext, FormFieldContextValue, FormItem, FormItemContext (+16 more)

### Community 3 - "Sidebar & Input Primitives"
Cohesion: 0.12
Nodes (30): Input, Separator, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+22 more)

### Community 4 - "TypeScript Config & Path Refs"
Cohesion: 0.07
Nodes (30): build, client/src/**/*, dist, dom, dom.iterable, esnext, node, node_modules (+22 more)

### Community 5 - "Toast Notification System"
Cohesion: 0.12
Nodes (24): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+16 more)

### Community 6 - "Website Design Brief & Docs"
Cohesion: 0.15
Nodes (19): Enhanced Contact Form, Dark/Light Theme Toggle, Animated Hero Section, Sticky Blur Navbar, Proof & Trust Section, Scroll Animations, Interactive Services Cards, Website UI/UX Upgrade Brief (+11 more)

### Community 7 - "Package Scripts & Metadata"
Cohesion: 0.12
Nodes (16): bufferutil, @esbuild-kit/esm-loader, license, name, optionalDependencies, bufferutil, overrides, drizzle-kit (+8 more)

### Community 8 - "Command Palette & Dialog"
Cohesion: 0.12
Nodes (14): Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut() (+6 more)

### Community 9 - "Menubar Component"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 10 - "shadcn components.json Config"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 11 - "Express Server & Routing"
Cohesion: 0.15
Nodes (11): express, express, app, http, httpServer, IncomingMessage, appendToCSV(), registerRoutes() (+3 more)

### Community 12 - "Core Runtime Dependencies"
Cohesion: 0.13
Nodes (15): class-variance-authority, date-fns, @hookform/resolvers, @jridgewell/trace-mapping, dependencies, class-variance-authority, date-fns, @hookform/resolvers (+7 more)

### Community 13 - "Button, Calendar & Pagination"
Cohesion: 0.16
Nodes (12): ButtonProps, buttonVariants, Calendar(), CalendarProps, Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem (+4 more)

### Community 14 - "Carousel Component"
Cohesion: 0.15
Nodes (12): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+4 more)

### Community 15 - "Toggle & Overlay Primitives"
Cohesion: 0.15
Nodes (6): Checkbox, HoverCardContent, PopoverContent, Progress, Slider, Switch

### Community 16 - "Chart Component"
Cohesion: 0.20
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 17 - "Context Menu Component"
Cohesion: 0.20
Nodes (9): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+1 more)

### Community 18 - "Dropdown Menu Component"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 19 - "Alert Dialog Component"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 20 - "Custom Hooks & React Core"
Cohesion: 0.25
Nodes (8): useCarousel(), useChart(), useFormField(), SidebarMenuSkeleton(), SidebarProvider(), useIsMobile(), react, react

### Community 21 - "Sheet Component"
Cohesion: 0.22
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 22 - "Table Component"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 23 - "Breadcrumb Component"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 24 - "Drawer Component"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 25 - "Navigation Menu Component"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 26 - "Select Component"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 27 - "Service Card & Badge"
Cohesion: 0.38
Nodes (4): ServiceCardProps, Badge(), BadgeProps, badgeVariants

### Community 28 - "Card Component"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 29 - "Toggle Group Component"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 30 - "Query Client & API Request"
Cohesion: 0.47
Nodes (5): apiRequest(), getQueryFn(), queryClient, throwIfResNotOk(), UnauthorizedBehavior

### Community 31 - "Mouse Tracker & Tilt Card"
Cohesion: 0.50
Nodes (4): TiltCard(), TiltCardProps, TiltState, useTilt()

### Community 33 - "Alert Component"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 34 - "Input OTP Component"
Cohesion: 0.40
Nodes (4): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 35 - "Accordion Component"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 36 - "Avatar Component"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 37 - "Tabs Component"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

## Ambiguous Edges - Review These
- `Image Placeholder Directory Note` → `Frontend Architecture (React/Wouter/TanStack/Tailwind)`  [AMBIGUOUS]
  client/public/images/placeholder.txt · relation: conceptually_related_to

## Knowledge Gaps
- **339 isolated node(s):** `CursorMode`, `TiltState`, `TiltCardProps`, `links`, `PageHeaderProps` (+334 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **63 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Image Placeholder Directory Note` and `Frontend Architecture (React/Wouter/TanStack/Tailwind)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `dependencies` connect `Core Runtime Dependencies` to `Package Scripts & Metadata`, `Express Server & Routing`, `Custom Hooks & React Core`, `clsx`, `cmdk`, `connect-pg-simple`, `drizzle-orm`, `drizzle-zod`, `embla-carousel-react`, `express-session`, `framer-motion`, `input-otp`, `lucide-react`, `memorystore`, `next-themes`, `passport`, `pg`, `@radix-ui accordion`, `@radix-ui alert-dialog`, `@radix-ui aspect-ratio`, `@radix-ui checkbox`, `@radix-ui collapsible`, `@radix-ui context-menu`, `@radix-ui dialog`, `@radix-ui dropdown-menu`, `@radix-ui hover-card`, `@radix-ui label`, `@radix-ui menubar`, `@radix-ui navigation-menu`, `@radix-ui popover`, `@radix-ui progress`, `@radix-ui radio-group`, `@radix-ui scroll-area`, `@radix-ui select`, `@radix-ui separator`, `@radix-ui slider`, `@radix-ui slot`, `@radix-ui switch`, `@radix-ui tabs`, `@radix-ui toast`, `@radix-ui toggle`, `@radix-ui toggle-group`, `@radix-ui tooltip`, `react-day-picker`, `react-dom`, `react-hook-form`, `react-icons`, `react-resizable-panels`, `recharts`, `tailwind-merge`, `tailwindcss-animate`, `tanstack-react-query`, `tw-animate-css`, `vaul`, `ws`, `zod`, `zod-validation-error`?**
  _High betweenness centrality (0.388) - this node is a cross-community bridge._
- **Why does `cn()` connect `Sidebar & Input Primitives` to `Site Pages & Visual Effects`, `Contact Form & Form Primitives`, `Toast Notification System`, `Command Palette & Dialog`, `Menubar Component`, `Button, Calendar & Pagination`, `Carousel Component`, `Toggle & Overlay Primitives`, `Chart Component`, `Context Menu Component`, `Dropdown Menu Component`, `Alert Dialog Component`, `Custom Hooks & React Core`, `Sheet Component`, `Table Component`, `Breadcrumb Component`, `Drawer Component`, `Navigation Menu Component`, `Select Component`, `Service Card & Badge`, `Card Component`, `Toggle Group Component`, `Alert Component`, `Input OTP Component`, `Accordion Component`, `Avatar Component`, `Tabs Component`, `Radio Group Component`, `Resizable Panels`, `Scroll Area Component`?**
  _High betweenness centrality (0.320) - this node is a cross-community bridge._
- **Why does `react` connect `Custom Hooks & React Core` to `Sidebar & Input Primitives`, `Core Runtime Dependencies`, `Toast Notification System`?**
  _High betweenness centrality (0.312) - this node is a cross-community bridge._
- **What connects `CursorMode`, `TiltState`, `TiltCardProps` to the rest of the system?**
  _339 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Site Pages & Visual Effects` be split into smaller, more focused modules?**
  _Cohesion score 0.058416139716952725 - nodes in this community are weakly interconnected._
- **Should `Dev Dependencies & Build Tools` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._