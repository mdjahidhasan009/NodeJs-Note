Starting scripts
```shell
pnpm dlx create-turbo@latest

pnpm add -D typescript ts-node ts-node-dev ts-alias tsconfig-paths @types/node --filter @ocmo/restapi
```


# System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         SYSTEM ARCHITECTURE                     │
├──────────────────────────────┬───────────────────────────────────┤
│          PACKAGES            │           APPLICATIONS            │
├──────────────────────────────┼───────────────────────────────────┤
│                              │                                   │
│  ┌─────────────────────────┐ │  ┌─────────────────────────────┐  │
│  │        Core             │ │  │        REST                 │  │
│  │   Main Business Logic   │ │  │   Implementation            │  │
│  └─────────────────────────┘ │  └─────────────────────────────┘  │
│                              │                                   │
│  ┌─────────────────────────┐ │  ┌─────────────────────────────┐  │
│  │      Database           │ │  │       GraphQL               │  │
│  │  Clients and Adapters   │ │  │   Implementation            │  │
│  └─────────────────────────┘ │  └─────────────────────────────┘  │
│                              │                                   │
│  ┌─────────────────────────┐ │  ┌─────────────────────────────┐  │
│  │       Shared            │ │  │        TRPC                 │  │
│  │ All Other Party Packages│ │  │   Implementation            │  │
│  └─────────────────────────┘ │  └─────────────────────────────┘  │
│                              │                                   │
└──────────────────────────────┴───────────────────────────────────┘
```

## Component Breakdown

### Packages Layer
- **Core**: Main Business Logic
- **Database**: Clients and Adapters
- **Shared**: All Other Party Packages

### Applications Layer
- **REST**: Implementation
- **GraphQL**: Implementation
- **TRPC**: Implementation

---
*Architecture follows a clean separation between core packages and application implementations*