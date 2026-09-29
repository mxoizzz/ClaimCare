# Hyperframes Composition Brief: ClaimClear

## Objective
Create a short launch-style brag video for ClaimClear.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20 seconds

## Source Material
- Project root: `d:\HackMatrix 5`
- Primary files read: `README.md`, `client/app/page.tsx`, `client/components/claim-dashboard.tsx`, `client/components/landing/hero-section.tsx`, `client/app/globals.css`
- Product name: ClaimClear
- Tagline / strongest claim: "Know what they pay before you reach the hospital desk."
- Key UI or visual moment to recreate: The ClaimDashboard card showing policy PDF mount, extracted limits (Sum Insured, Deductibles, Exclusions), Cost Estimator breakdown ($1,200 out-of-pocket vs $3,800 covered), and Page Citation box.
- Copy that must appear verbatim:
  - "60-page insurance policy. 0 idea what it actually pays."
  - "Comprehensive_Health_Policy_2026.pdf"
  - "Sum Insured: $500,000"
  - "Your Total Cost: $1,200"
  - "Insurance Covers: $3,800"
  - "Citation: Section 4.2 (Page 18) | Confidence: 98%"

## Creative Direction
- Tone preset: polished
- Creative direction: "Quiet premium fintech & medical clarity"
- Interpretation: Restrained, sophisticated typography, bold serif titles, monospace data labels, seamless smooth transitions, no jitter or meme graphics.
- Angle: Turning an impenetrable 60-page health policy PDF into instant, verified dollar figures before you ever reach the hospital billing desk.
- Hook: "60-page insurance policy. 0 idea what it actually pays."
- Outro / punchline: "Know what they pay before you reach the hospital desk."
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Flashy rainbow gradients or unreadable text

## Visual Identity
- Background: `#111215` (`oklch(0.12 0.01 60)`)
- Text: `#f8f8f6` (`oklch(0.985 0.002 90)`)
- Muted: `#8e8e93`
- Accent: `#22c55e` (Emerald green for covered insurance amounts)
- Display font: 'Instrument Serif', Georgia, serif
- Body font: 'Instrument Sans', system-ui, sans-serif
- Mono font: 'JetBrains Mono', monospace
- Visual references from the project: Grid line backdrop, glassmorphism border card (`border-foreground/10`), rounded badges, minimal clean layout.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. The Dilemma — 4.5s — Hook: "60-page insurance policy. 0 idea what it actually pays." → "Until now."
2. The Engine Mounts — 5.0s — Drag-drop PDF mounted, Llama-3 extraction pipeline tags: Sum Insured $500K, Deductible $1,500, Exclusions.
3. The Precision Cost Breakdown — 6.0s — Procedure: Cataract Surgery. $1,200 Out-of-pocket vs $3,800 Covered + Verified Page 18 Citation.
4. Outro — 4.5s — ClaimClear logo, tagline, and hackathon project metadata.

## Audio
- Audio role: Warm, modern tech groove with polished restraint
- Audio arc: Begins with steady rhythmic beat, layers subtle tactile clicks as cards arrive, chimes on cost breakdown reveal, swells cleanly for outro.
- Music: `assets/music/happy-beats-business-moves-vol-10-by-ende-dot-app.mp3`
- Music treatment: Starts at 0.0s, steady volume, resolves gracefully at 20.0s.
- Music cue guidance: Preset cues at 4.64s (Scene 2 enter), 9.83s (Scene 3 cost numbers reveal), 15.82s (Scene 4 outro).
- Audio-reactive treatment: Subtle ambient glow pulsation.
- Audio-coupled moments:
  - Scene 2: Tactile drop sound when PDF mounts, subtle pop clicks on each tag.
  - Scene 3: Clean numeric reveal tone on $1,200 / $3,800.
- SFX selection guidance: Minimalist interface sounds from `assets/sfx/interface/` and `assets/sfx/ui/`.
- Audio files: Copy chosen music and SFX into `brag-output/composition/assets/`

## Hyperframes Instructions
Use Hyperframes composition structure:
- Index HTML with declarative scenes and CSS animations / transitions.
- High visual craft matching the ClaimClear Next.js UI aesthetic.
- Ensure all text is readable and passes WCAG contrast.
