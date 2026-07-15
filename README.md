# AEON Bank — Transactions Mobile App

A React Native (Expo) app for viewing a list of recent transactions and
drilling into a single transaction's details, with the ability to share the
detail view externally. Built for the AEON Bank Mobile Engineer take-home
assessment.

## Tech stack

- **Expo** (SDK 57) + **Expo Router** (file-based routing) + **TypeScript**
- **Zustand** for state management
- **date-fns** for date formatting
- **Jest** (`jest-expo` preset) + **React Native Testing Library** for
  unit/component tests
- **Detox** for end-to-end tests

## Getting started

### Prerequisites

- Node.js 18+
- Xcode (for iOS) and/or Android Studio (for Android)
- [applesimutils](https://github.com/wix/AppleSimulatorUtils) if running iOS
  Detox tests: `brew tap wix/brew && brew install applesimutils`

### Install

```bash
npm install
```

### Run the app

```bash
npx expo start
```

Press `i` for iOS, `a` for Android, or scan the QR code with Expo Go.

The app fetches transactions from a mock API (`src/api/transactions.ts`)
that returns sample data after a simulated ~400ms delay — no backend
required to try it out.

## Project structure

```
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── transaction/
│       └── [refId].tsx
│
├── screens/
│   ├── TransactionListScreen/
│   └── TransactionDetailScreen/
│
├── store/
│   └── useTransactionStore.ts
│
├── api/
│   ├── types.ts
│   └── transactions.ts
│
├── components/
│   ├── TransactionListItem/
│   ├── EmptyState/
│   └── ErrorState/
│
├── utils/
│   ├── formatCurrency.ts
│   └── formatDate.ts
│
└── theme/
    ├── colors.ts
    └── spacing.ts

e2e/
├── init.ts
├── jest.config.js
└── transactionFlow.e2e.ts
```

Routes in `src/app/` are thin — each just renders a screen component from
`src/screens/`, keeping navigation wiring separate from screen logic so
screens stay easy to unit test in isolation. The dependency direction only
ever flows one way: **routes → screens → store → api**.

## Features

- **Transaction list** — displays transfer name, date, and amount (with
  negative amounts styled distinctly for refunds/outgoing transfers)
- **Transaction detail** — reference ID, date, recipient, amount
- **Share** — share transaction details via the device's native share sheet
- Loading, error (with retry), and empty states handled explicitly

## Testing

### Unit & component tests

```bash
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

Covers:

- `formatCurrency` / `formatDate` pure-function unit tests
- `TransactionListItem` rendering + press behavior
- `useTransactionStore` fetch success/error and lookup-by-refId
- `TransactionListScreen` loading / success / error / empty states, and
  navigation on item tap
- `TransactionDetailScreen` rendering and the native `Share` call

### End-to-end tests (Detox)

Expo doesn't ship native `ios`/`android` folders by default — generate them
once with:

```bash
npx expo prebuild
```

Then build and run:

```bash
# iOS
npm run e2e:build:ios
npm run e2e:test:ios

# Android
npm run e2e:build:android
npm run e2e:test:android
```

The e2e suite (`e2e/transactionFlow.e2e.ts`) covers the happy path: list
loads → tap a transaction → detail screen shows the correct data → share
button is present and tappable → native back navigation returns to the list.

**Note:** the native OS share sheet isn't driven end-to-end in this suite —
it's outside the RN view hierarchy and doesn't have a stable,
version-independent way to interact with it across iOS versions/simulators
in Detox. The test verifies the share trigger is present and ready rather
than completing the native share flow.

## Design notes

- The detail screen looks up the transaction from the store by `refId`
  (read from the route param) rather than passing the full object through
  navigation, keeping the store as the single source of truth.
- `TransactionListItem` is a pure presentational component, easy to unit
  test in isolation from data-fetching concerns.
- The mock API layer (`fetchTransactions`) is isolated behind a single
  function so it can be swapped for a real network call without touching
  the store or UI.
- The transaction detail screen's back button is a custom component with an
  explicit `testID`, styled to match iOS's native back button appearance —
  this keeps it reliably targetable in Detox regardless of OS version or
  locale, rather than relying on matching rendered label text.

## Known limitations / next steps

- No persistence/caching layer — a pull-to-refresh or cache-then-revalidate
  strategy would be a natural next step for a real backend.
- No pagination — the sample data set is small; a real transaction list
  would need it.
- `formatDateTime` renders in the device's local timezone rather than UTC;
  worth revisiting if the bank needs UTC-consistent timestamps across
  devices.
- E2E coverage for the native share sheet itself is intentionally out of
  scope (see Testing section above).
