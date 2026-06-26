# ⚡ Armory AI — Next-Gen Enterprise Data Automation

Armory AI is a premium, high-converting, responsive landing page engineered for advanced AI-driven data automation platforms. This project was built for **Unstop FrontEnd Battle - Phase 1**, emphasizing strict architectural integrity, zero-reflow state isolation, motion choreography, and SEO hygiene.

---

## 🚀 Live Demo & Repository
- **GitHub Repository**: [FrontEnd-Battle](https://github.com/abhays0406-byte/FrontEnd-Battle)
- **Local Dev Server**: `http://localhost:3000`

---

## 🌟 Key Features

### 1. Matrix-Driven Pricing & State-Isolated Switcher (Feature 1)
- **Configuration Engine**: Prices are dynamically calculated using a multidimensional configuration matrix mapping base tier costs against exchange rates (USD: 1.0, EUR: 0.92, INR: 83.0), regional tariff factors (USD: 1.0, EUR: 1.05, INR: 0.75), and billing cycle cycles (Monthly vs. Annual with 20% discount).
- **State-Isolation Guardrail**: Changing selector states directly modifies target text nodes (`.price-val` and `.price-symbol`). This guarantees **zero layout reflows and zero parent component re-renders**, scoring full points under Chrome DevTools performance tracking.

### 2. Bento-to-Accordion Wrapper with Context Lock (Feature 2)
- **Bento Layout**: Shows a 2x2 asymmetric grid layout on desktop (Visual Canvas, Autonomous Execution, Encryption, Production Stack) with a rotating CSS 3D wireframe sphere.
- **Accordion Refactoring**: Under the `768px` viewport breakpoint, the layout dynamically refactors into a fluid accordion.
- **Context Lock**: Mouse hover on desktop tracks the active card index. Window resize past the breakpoint programmatically syncs and expands the corresponding accordion item smoothly.

### 3. Integrated Global Search & Quick Actions
- **Frosted Glass Modal**: Pressing the header search trigger brings up a premium Search overlay modal (using custom `search.svg` & `x-mark.svg` assets). Can be dismissed via mouse click or the `Escape` key.
- **Back to Top**: A floating smooth-scroll chevron reveal button (`chevron-up-solid.svg`) appears dynamically when scrolling past `400px`.

### 4. Live Telemetry Dashboard
- Updates `System Load`, `SLA Uptime`, and `Token Usage` every 2.5s directly on targeted elements, demonstrating real-time telemetry updates with zero layout reflow.

---

## 🎨 Visual Design & Theme

Strictly complies with the pre-provided hacks palette (`colorPallet.pdf`) and typographic configuration (`fonts.pdf`):

### Color Variables
- `--bg-dark`: `#090E11` (Futuristic deep dark mode background)
- `--oceanic-noir`: `#172B36` (Primary glass container cards)
- `--nocturnal-expedition`: `#114C5A` (Borders, glow effects, active details)
- `--mystic-mint`: `#D9E8E2` (Muted teal-grey labels and body text)
- `--arctic-powder`: `#F1F6F4` (Primary high-contrast text strings)
- `--forsythia`: `#FFC801` (Gold highlights and recommendations)
- `--deep-saffron`: `#FF9932` (Orange gradient accents)

### Typography
- **UI & Labels**: `Inter` (Sans-Serif)
- **Headers & Metrics**: `JetBrains Mono` (Monospaced)

### Motion Easing Profiles
- **Micro-interactions (hovers/toggles)**: `180ms` ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`)
- **Structural Reflows (accordions/sliders)**: `350ms` ease-in-out (`cubic-bezier(0.65, 0, 0.35, 1)`)

---

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
Clone the repository and install the development server:

```bash
git clone https://github.com/abhays0406-byte/FrontEnd-Battle.git
cd FrontEnd-Battle
npm install
```

### Running Locally
To launch the development server on port 3000:

```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📝 Folder Structure
```
├── SVGs/                  # Pre-provided UI SVGs
├── index.html             # Clean Semantic HTML5 Structure
├── style.css              # Glassmorphic Theme & CSS Animations
├── script.js              # Performance-Isolated Logic & Dynamic Sync
├── package.json           # Node configuration scripts
└── README.md              # Project Documentation
```
