# Product Requirements Document
## ClaimClear: Insurance Coverage & Treatment Cost Intelligence Assistant
**Track:** FIN01 — Policy-to-Patient · **Stage:** Hackathon Round 1 · **Status:** Draft v1.0

---

## 1. Summary

ClaimClear is an AI-powered assistant that lets a user upload an insurance policy document and interact with it conversationally. It extracts structured coverage information (limits, exclusions, waiting periods, deductibles, sub-limits), answers eligibility and coverage questions with verified page/section-level citations, and — when a treatment scenario is provided — estimates likely treatment cost, potentially covered amount, and out-of-pocket expense, while explicitly flagging when there isn't enough information for a reliable estimate.

The product's core differentiation is not conversational Q&A over a document — general-purpose LLM products already do this — but three things a generic chat interface does not provide by default: **(1)** a persistent, structured policy profile extracted once and reused deterministically, **(2)** citations that are verified against the source text before being shown rather than generated from model memory, and **(3)** a transparent, auditable cost-estimation engine that fuses the policy profile with structured treatment-cost data and shows its work.

---

## 2. Problem Statement

Insurance policies encode complex, consequential information — coverage limits, exclusions, waiting periods, deductibles, co-payments, sub-limits, room-rent caps, and claim conditions — in dense legal language. Policyholders typically discover what a clause actually means only at claim time, when it's too late to plan around a coverage gap. There is no accessible way for a person to ask "will this specific treatment be covered, and what will it cost me?" and get a trustworthy, sourced answer.

## 3. Goals

1. Let a user upload any health/general insurance policy PDF and receive a structured extraction of its key terms.
2. Let a user ask natural-language coverage and eligibility questions and receive answers grounded in, and cited to, the source document.
3. Let a user describe a treatment scenario and receive an estimate of likely cost, covered amount, and out-of-pocket cost, with the reasoning shown.
4. Ensure the system never presents a guess as a fact — uncertainty and missing information must be surfaced explicitly.
5. Demonstrate that estimates and answers change appropriately as new policy, patient, or treatment information is supplied.

### Non-Goals (Round 1)

- Not a replacement for a licensed insurance advisor or the insurer's official adjudication; outputs are estimates, not binding determinations.
- Not built for real-time integration with insurer claims systems in this round.
- Not optimized for every policy type/jurisdiction in Round 1 — scoped to individual/family health insurance policies as the primary use case, with structure general enough to extend later.
- No user authentication/account system in the prototype — single-session, single-document scope.

## 4. Target Users

| User | Need |
|---|---|
| **Policyholder** | Understand what their plan covers for a treatment they're facing or planning for |
| **Prospective buyer** | Compare what a policy would cover before purchasing |
| **Insurance agent / advisor** | Quickly answer a client's coverage question with a citable source |
| **Hackathon judge / evaluator** | Verify the system reasons correctly and transparently, not just fluently |

## 5. User Stories

- As a policyholder, I want to upload my policy PDF and see its key terms summarized, so I don't have to read 40 pages of legal text myself.
- As a policyholder, I want to ask "is X covered?" and get an answer that tells me exactly where in my policy that comes from, so I can trust and verify it.
- As a policyholder considering a procedure, I want to know roughly what it will cost me out of pocket, so I can plan financially before I commit to treatment.
- As a policyholder, I want to be told clearly when the system isn't sure, rather than getting a confident-sounding wrong answer.
- As a policyholder, I want my estimate to update when I provide more detail (e.g., confirming a pre-existing condition), so I understand what's actually driving the number.

## 6. Functional Requirements

### 6.1 Policy Ingestion & Extraction
- FR1: Accept a policy document upload (PDF as primary format).
- FR2: Parse the document into page- and section-indexed text (preserve layout/location metadata for later citation).
- FR3: Extract a structured policy profile including, at minimum: sum insured, deductible(s), co-payment terms, room-rent limit/conditions, waiting periods (initial, pre-existing-disease, disease-specific), sub-limits by treatment/procedure category, and named exclusions.
- FR4: Display the extracted profile to the user as a distinct, human-readable artifact (not only implicitly inside chat answers).
- FR5: Flag any of the above fields the extractor could not confidently locate, rather than omitting or guessing them silently.

### 6.2 Conversational Coverage Q&A
- FR6: Accept natural-language questions about coverage, eligibility, exclusions, and conditions.
- FR7: Retrieve the specific passage(s) relevant to the question rather than answering from general knowledge.
- FR8: Verify that the cited passage actually supports the generated claim before presenting the answer.
- FR9: Present every substantive answer with its supporting page/section reference and the relevant source excerpt.
- FR10: Assign and display a confidence level per answer (e.g., High / Medium / Low), based on how directly the source text supports the claim.
- FR11: When no supporting passage exists, state this explicitly rather than answering from inference alone.

### 6.3 Treatment Scenario & Cost Estimation
- FR12: Accept a treatment scenario input (procedure/condition, and relevant patient/context details such as city, hospital tier, time elapsed on policy, pre-existing-condition status).
- FR13: Look up or estimate the likely treatment cost range using a structured treatment-cost dataset.
- FR14: Cross-reference the treatment against the extracted policy profile to determine applicable waiting periods, sub-limits, deductible, and co-payment.
- FR15: Compute and display: estimated total treatment cost, potentially covered amount, and estimated out-of-pocket cost.
- FR16: Show the specific factors driving the estimate (e.g., "24-month specific-illness waiting period not yet satisfied," "sub-limit cap of ₹3,50,000 applied").
- FR17: When a required input is missing or ambiguous (e.g., pre-existing-condition status unknown) and it materially changes the outcome, withhold a single confident number and instead state what is missing and why it matters.
- FR18: Recompute and visibly update the estimate when the user supplies additional or corrected information.

### 6.4 Trust, Evidence & Uncertainty
- FR19: Every coverage-related claim in the product must be traceable to either (a) an extracted policy field with its source location, or (b) an explicit statement of insufficient information.
- FR20: Confidence indicators must be present on every answer and every cost estimate, not only on flagged edge cases.

## 7. Non-Functional Requirements

- **Explainability:** All reasoning steps (retrieval → claim → citation; policy term → cost calculation) must be inspectable by the user, not hidden inside a single generated response.
- **Reliability of citation:** Citations must reference real, verifiable locations in the uploaded document; fabricated or unverified citations are treated as a critical defect.
- **Performance:** Policy extraction should complete within a time frame reasonable for an interactive demo (target: under ~30 seconds for a typical policy document in Round 1 scope).
- **Data privacy:** Uploaded policy documents may contain personal information; documents and extracted data should not persist beyond the session in the prototype stage.
- **Extensibility:** The structured policy-profile schema should be general enough to extend to additional policy types without a redesign.

## 8. System Overview

```
Upload → Parse (page/section-indexed) → Extract structured profile
       → Index for retrieval
                    │
        ┌───────────┴────────────┐
        ▼                        ▼
  Conversational Q&A      Treatment scenario input
  (retrieve → verify →          │
   cite → answer)               ▼
                        Cost lookup (structured dataset)
                        + policy-profile cross-reference
                        → coverage calculation
                        → confidence & gap detection
                                 │
                                 ▼
                    Estimate + explanation + citations
```

**Key components:**
1. **Document parser** — converts PDF to page/section-indexed text.
2. **Structured extractor** — pulls defined policy fields into a schema-conformant profile.
3. **Retrieval & citation verifier** — finds and validates the passage(s) backing each answer.
4. **Treatment-cost dataset** — structured (synthetic or historical) reference data by procedure, city/hospital tier.
5. **Coverage calculation engine** — deterministic logic combining policy profile + cost data + scenario inputs.
6. **Confidence/gap layer** — evaluates completeness of inputs and directness of evidentiary support before finalizing any output.

## 9. Success Metrics

| Metric | Definition | Round 1 Target |
|---|---|---|
| Citation accuracy | % of citations that genuinely support the stated claim | Manually verified on test set; qualitative pass in Round 1 |
| Extraction completeness | % of defined policy-profile fields correctly populated or correctly flagged as unavailable | Demonstrated on 1–2 sample policies |
| Answer groundedness | % of coverage answers backed by a real citation (no unsupported claims) | 100% on demo scenarios |
| Appropriate uncertainty | % of ambiguous/missing-info test cases correctly flagged rather than answered confidently | 100% on labeled test set |
| Estimate sensitivity | Estimate visibly changes when a materially relevant input changes | Demonstrated live |

## 10. Testing & Validation Plan

The system will be tested against three categories of scenario, per treatment/coverage question:

1. **Clear coverage** — treatment is unambiguously covered; system should answer confidently with citation.
2. **Clear exclusion / not yet eligible** — treatment is excluded or blocked by an unmet waiting period; system should state this clearly with citation.
3. **Borderline / missing information** — the policy is silent, ambiguous, or a required input (e.g., pre-existing-condition status) is unknown; system should decline to give a single confident number and state what's missing.

Round 1 deliverable: a small labeled scenario set (minimum 3 per category) run against the prototype, manually reviewed for correctness. Round 2 deliverable: measured accuracy and false-confidence rate across a larger scenario set.

## 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Perceived as "just an LLM chat wrapper" | Make the structured profile, citation verification, and cost-calculation logic visible, inspectable product surfaces — not hidden inside conversational text |
| Fabricated or imprecise citations | Verify cited passages against source text programmatically before display; treat unverifiable citations as "no citation" |
| Extraction errors on atypical policy formats | Explicitly flag low-confidence or missing extracted fields rather than presenting incomplete data as complete |
| Cost dataset lacks a close match for a given procedure/location | State the mismatch and either provide a wider range with lower confidence or decline to estimate |
| Over-trust in estimates for high-stakes financial decisions | Clearly label all outputs as estimates, not adjudicated determinations; surface confidence level on every output |

## 12. Roadmap

**Round 1 (current scope):**
- Single-policy upload, structured extraction, cited Q&A
- One treatment-scenario cost estimation flow with visible calculation
- Confidence/missing-information flagging
- Demonstrated sensitivity to new information (live re-estimation)

**Round 2 (proposed):**
- Multi-policy comparison for the same treatment scenario
- Measured citation precision and cost-estimate accuracy against a labeled test set
- Expanded treatment-cost dataset coverage (more procedures, cities, hospital tiers)
- Support for additional policy types beyond individual/family health insurance

## 13. Hackathon Compliance — Do's and Don'ts (HackMatrix 5.0, Round 1)

This section translates the official HackMatrix 5.0 Round 1 rules into concrete build and submission actions for this team. It exists so that a technically strong submission doesn't lose points — or get disqualified — over a process rule.

### Do

| Area | Action |
|---|---|
| **PPT** | Use the organizers' official PPT template only. Fill in the sections it provides — do not design a custom deck from scratch. |
| **Prototype scope** | Implement and be able to demonstrate at least 30–40% of the proposed solution — this is a stated minimum, not a suggestion. |
| **Video** | Record one video, maximum 3 minutes, covering both the PPT walkthrough and a live prototype demo. |
| **GitHub repo ownership** | Have the team leader create the repository; add every other team member as a collaborator. |
| **GitHub visibility** | Keep the repo private during development; make it public before the submission deadline (29 Sept 2026, 11:00 AM) so evaluators can access it. |
| **GitHub commits** | Ensure commits are logical, meaningful, and distributed across multiple team members — not authored entirely by one person. |
| **Drive folder** | Create a Google Drive folder named `TeamName_PSid` (e.g. `PolicyToPatient_FIN01`) containing: the PPT, the combined PPT+prototype video, and the GitHub link. |
| **Submission** | Only the team leader submits the Drive link, and only on the platform the team registered on (Unstop or the HackMatrix website — not both, not the other one). |
| **Access** | Double-check the Drive link and repo are actually accessible to an external evaluator before submitting (test in an incognito window or with another account). |
| **AI/ML relevance** | Make sure the solution's AI/ML component is explicit and scalable — it's both a submission requirement and a scored criterion. |
| **Team presence** | Confirm all 3–4 team members are available for the offline final round if selected — attendance is mandatory, not optional. |

### Don't

| Area | Avoid |
|---|---|
| **PPT** | Don't add slides beyond the official template — extra slides violate the rules outright, regardless of content quality. |
| **GitHub hygiene** | Don't commit `.zip` files, compiled/binary output (`.exe`, `.jar`, `.dll`), or large media files — link large files (e.g. the demo video) via Drive/Dropbox instead. |
| **GitHub commits** | Don't make trivial or filler commits just to inflate commit count, and don't let a single member commit all the changes — both are explicitly flagged as negatively affecting evaluation. |
| **Team composition** | Don't change team membership after registration, and don't let any member appear on more than one team. |
| **Submission platform** | Don't submit via a platform your team didn't register on. |
| **Repo visibility** | Don't leave the repository private past the submission deadline — it must be public before the Drive link is submitted. |
| **Video length** | Don't exceed 3 minutes — trim to the essentials (team/problem intro is brief; prioritize the working demo). |
| **Content padding** | Don't pad the PPT or repo documentation with content that doesn't directly serve the given problem statement — the rules explicitly call out unnecessary content as something to avoid. |

### Round 1 Scoring Weights (100 pts total) — build priorities accordingly

| Criteria | Points | Criteria | Points |
|---|---|---|---|
| GitHub Maintenance | 20 | UI/UX | 15 |
| Tech Stack | 15 | Innovativeness | 10 |
| Problem Understanding & Solution Fit | 10 | Presentation | 10 |
| Documentation | 10 | Social Impact | 10 |

Notably, **GitHub Maintenance (20 pts) is the single highest-weighted criterion** — higher than innovativeness or presentation. This means commit hygiene, collaborator activity, and repo structure/documentation deserve real attention, not just the demo itself. **UI/UX (15 pts) and Documentation (10 pts)** are also concretely achievable wins independent of core AI logic — worth budgeting explicit time for both, even under time pressure.

## 14. Open Questions

- What treatment-cost data source will be used for Round 2 (public health-cost datasets vs. synthetic data calibrated to public benchmarks)?
- Should the system support multiple insurer policy formats explicitly, or rely on general-purpose extraction robust to format variation?
- What is the acceptable false-confidence rate for a production version, and how should it be measured beyond the hackathon scenario set?

---
*Prepared for FIN01 — Policy-to-Patient, Hackathon Round 1 submission.*
