# Brag Plan: ClaimClear

## What is this app?
ClaimClear is an AI-powered policy-to-patient assistant that ingests dense 60-page insurance PDF contracts, extracts structured coverage rules, answers complex policy questions with exact page-level citations, and algorithmically estimates exact out-of-pocket costs for any medical procedure.

## The angle
Everyone dreads reading their medical insurance policy, and nobody knows what a hospital procedure will cost until the bill arrives. ClaimClear completely flips this: drop in the PDF, type a procedure like "Cataract Surgery", and within seconds see your exact out-of-pocket bill ($1,200) vs what insurance covers ($3,800), backed by verified citations right down to page 18.

## Hook (first 2-3 seconds)
A stark editorial confrontation in high-contrast luxury serif: "60-page insurance policy. 0 idea what it actually pays." The question every patient has asked at a billing desk.

## Key moments (the middle)
- The instant PDF mount and structured vector extraction: Sum Insured, Deductibles, and Waiting Period exclusions extracted instantly into sleek tags.
- The Cost Estimator calculation: "Cataract Surgery · Tier 1 City" instantly calculating "$1,200 Out-of-Pocket" vs "$3,800 Insurance Covers".
- The AI citation verification: "Section 4.2 (Sub-limit cap: $4,000) · Page 18 Citation · 98% Confidence".

## Outro / punchline
"Know what they pay before you reach the hospital desk." Delivered under the bold ClaimClear wordmark.

## User flow worth showing
1. **Entry**: Mount a comprehensive health insurance policy PDF into the engine.
2. **Key Action**: AI extracts constraints and calculates exact procedure coverage for Cataract Surgery.
3. **Result**: Real-time cost breakdown + verified page/section citations.

## Tone
- Preset: `polished`
- Creative direction: "Quiet premium fintech & medical clarity"
- Interpretation: Restrained, elegant editorial typography (`Instrument Serif`), precise pacing, confidence through clean layouts and real UI elements rather than chaotic flashy animations.

## Format: landscape — 1920x1080
## Duration: 20 seconds

## Visual identity (from the project)
- Background: `#111215` (`oklch(0.12 0.01 60)`)
- Accent: `#22c55e` (emerald green for covered amounts) and `#f8f8f6` (crisp cream primary)
- Text: `#f8f8f6` (`oklch(0.985 0.002 90)`)
- Muted Text: `#8e8e93` (`oklch(0.65 0.02 60)`)
- Display font: `Instrument Serif`, Georgia, serif
- Body font: `Instrument Sans`, -apple-system, system-ui, sans-serif
- Mono font: `JetBrains Mono`, monospace
- Strongest visual element: High-contrast dark editorial aesthetic, subtle geometric background grid, glowing glassmorphic cards with monospace metadata.

## Share copy (draft)
Built ClaimClear: Drop in any 50-page health insurance PDF, get verified page citations, and know your exact out-of-pocket hospital bill before you reach the front desk.

## Audio direction
- Role: Warm, modern tech groove with polished restraint
- Music: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3`
- Music treatment: Starts at 0.0s, steady confident rhythmic groove, ducking slightly during data reveals, resolves cleanly on outro
- Music cue guidance:
  - Strong beat at 4.64s for Scene 2 entrance
  - Strong beat at 9.83s for Scene 3 Cost Estimator reveal
  - Beat hit at 15.82s for Scene 4 ClaimClear outro
- Audio-reactive treatment: Subtle ambient glow pulsation matching bass energy
- SFX posture: Sparse, motion-matched, tactile clicks and subtle digital confirm tones
- Restraint rule: No meme sounds, no intrusive high-pitched alerts

---

## Storyboard

### Scene 1 — The Dilemma — 4.5s (0.0s - 4.5s)
- **Visual**: Dark charcoal canvas with subtle grid lines and ambient warm gradient sphere.
- **Eyebrow**: "HACKMATRIX 5.0 · POLICY-TO-PATIENT"
- **Headline**: "60-page insurance policy."
- **Secondary (at 2.0s)**: "0 idea what it actually pays."
- **Transition at 3.8s**: Fades to "Until now."
- **Audio intent**: Clean opening beat drops, gentle sub bass.

### Scene 2 — The Engine Mounts — 5.0s (4.5s - 9.5s)
- **Visual**: Glassmorphic card slides into view with dashed dropzone.
- **Action**: Simulated policy file "Comprehensive_Health_Policy_2026.pdf" locks in.
- **Status tag**: "Llama-3 Extraction Pipeline Active"
- **Three badges reveal sequentially**:
  - `Sum Insured: $500,000`
  - `Deductible: $1,500`
  - `Exclusions: Cosmetic, Pre-existing (24m)`
- **Audio intent**: Tactile mount click, 3 subtle high-tech pop cues aligned to the beat grid.

### Scene 3 — The Precision Cost Breakdown — 6.0s (9.5s - 15.5s)
- **Visual**: Split cost calculation card for "Cataract Surgery · Tier 1 City".
- **Primary highlight**:
  - Out-of-Pocket: **$1,200** (large white serif digits)
  - Insurance Covers: **$3,800** (vivid emerald green)
- **Verification pill pops below**:
  `> Section 4.2 verified: Sub-limit cap $4,000 applied (Page 18) · 98% Confidence`
- **Audio intent**: Soft count-up tick, clean confirm chime.

### Scene 4 — Punchline & Outro — 4.5s (15.5s - 20.0s)
- **Visual**: Minimalist luxury title card.
- **Title**: "ClaimClear" (Large Instrument Serif)
- **Tagline**: "Know what they pay before you reach the hospital desk."
- **Tech Stack badges**: "FastAPI · Next.js · LlamaIndex · PyMuPDF"
- **Audio intent**: Music swell to final resolving beat and graceful fade-out.

**Music mood for this video:** Confident, sleek, rhythmic, polished.
**Audio summary:** A clean, modern beat establishes professional authority while crisp tactile cues punctuate the transformation of dense policy text into transparent dollars.
