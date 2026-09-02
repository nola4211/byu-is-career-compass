# CAREERS.md

Source of truth for `data/careers.ts`. Every career object in the codebase must conform to the schema below. Do not invent facts—only use what is listed under each career's **Confirmed (BYU-sourced)** section. Anything under **Gaps** still needs research or an explicit team decision before it ships.

Program-wide data (applies to all BSIS careers, not one specific path):

- Class of 2025 BSIS: 123 graduates, 100 seeking full-time employment, 90% placed within three months.
- Salary: average $72,820, median $74,000.
- Bonus: 22% reporting a bonus, average $13,306, median $6,750.
- Placement by region: West 77%, Southwest 10%, Mid-Atlantic 4%, Midwest 4%, South 4%, International 1%, Northeast 1%.
- Top employers (Class of 2025, partial): Qualtrics, EY, Eide Bailly.
- Source: https://marriott.byu.edu/infosys/careers/placement-profile/bsis/

## Schema

```js
{
  id: string,
  name: string,
  tagline: string,
  description: string,
  orientation: "technical" | "business",
  typicalWork: string[],
  skills: string[],
  technologies: string[],
  traits: {
    technical: number,
    analytical: number,
    people: number,
    building: number
  },
  byuPreparation: string[],
  interviewTopics: string[],
  sources: string[]
}
```

## 1. Software / Application Developer — `softwareEngineering`

**Confirmed (BYU-sourced):**

- Listed under Technical Orientation as "Programmer/Software Engineer" and "Mobile Application Developer."
  (https://marriott.byu.edu/infosys/about/what-is-information-systems/at-a-glance/)
- BYU IS offers a dedicated **Development track** under the MISM program.
  (https://marriott.byu.edu/infosys/mism/tracks/development/)
- BSIS core teaches programming fundamentals, databases, and web development (per IS 201 course description: data security, computing/networks, database design/querying, programming, data visualization, web dev).
  (https://catalog.byu.edu/courses/08962-004)

**Gaps:** Development track page details and specific courses beyond IS 201 still need research.

## 2. Business / Systems Analyst — `businessSystemsAnalyst`

**Confirmed (BYU-sourced):**

- Listed under Business Orientation as "Systems Analyst," "IT Business Analyst," and "Systems Designer."
  (https://marriott.byu.edu/infosys/about/what-is-information-systems/at-a-glance/)
- No dedicated MISM track exists for this path; BYU treats it as a general BSIS outcome.

**Gaps:** Use the BSIS Program Overview for general curriculum framing rather than inventing specifics.
(https://marriott.byu.edu/infosys/bsis/what-will-i-study/program-overview/)

## 3. Data Analyst / Data Scientist — `dataAnalytics`

**Confirmed (BYU-sourced):**

- Listed under Technical Orientation as "Business Analytics."
  (https://marriott.byu.edu/infosys/about/what-is-information-systems/at-a-glance/)
- BYU IS offers a dedicated **Business Analytics and Intelligence track**.
  (https://marriott.byu.edu/infosys/mism/tracks/business-analytics-intelligence/)
- IS 201 confirms undergrad exposure to data visualization/analysis tools and database querying for business insights.
  (https://catalog.byu.edu/courses/08962-004)

**Gaps:** Business Analytics and Intelligence track page details still need research.

## 4. Cybersecurity Analyst — `cybersecurity`

**Confirmed (BYU-sourced):**

- Listed under Technical Orientation as "Security Analyst."
  (https://marriott.byu.edu/infosys/about/what-is-information-systems/at-a-glance/)
- BYU IS offers a dedicated **Security and Forensics track**.
  (https://marriott.byu.edu/infosys/mism/tracks/security-forensics/)
- IS 201 confirms undergrad exposure to data security fundamentals.
  (https://catalog.byu.edu/courses/08962-004)

**Gaps:** Security and Forensics track page details still need research.

## 5. IT Project Manager — `itProjectManager`

**Confirmed (BYU-sourced):**

- Listed under Business Orientation as "Project Manager" and "Program Manager."
  (https://marriott.byu.edu/infosys/about/what-is-information-systems/at-a-glance/)
- No dedicated MISM track or program page exists for this path.

**Gaps:** The team should decide whether to supplement with a clearly labeled non-BYU source.

## 6. UX Designer / Product Manager — `uxProductManager`

**Confirmed (BYU-sourced):**

- Listed under Business Orientation as "User Experience Designer."
  (https://marriott.byu.edu/infosys/about/what-is-information-systems/at-a-glance/)
- BYU IS offers a dedicated **Technical Product Design and Management track**.
  (https://marriott.byu.edu/infosys/mism/tracks/technical-product-design-and-management/)
- BYU Marriott also runs a separate Experience Design undergrad program; it is not an IS track.
  (https://marriott.byu.edu/exdm/)

**Gaps:** Technical Product Design and Management track page details and the ExDM cross-reference decision still need research.

## 7. ERP / Systems Consultant — `erpConsultant`

**Confirmed (BYU-sourced):**

- Not listed by name on the At a Glance chart or in a current MISM track.
- The IS course catalog is the closest current anchor.
  (https://catalog.byu.edu/departments/1517/courses)

**Gaps:** Confirm current ERP/SAP/Salesforce offerings with an IS advisor or the live catalog before adding BYU-preparation content.

## 8. Cloud / Infrastructure Engineer — `cloudInfrastructure`

**Confirmed (BYU-sourced):**

- Listed under Technical Orientation as "Cloud Infrastructure" and "Network Administrator."
  (https://marriott.byu.edu/infosys/about/what-is-information-systems/at-a-glance/)
- No dedicated MISM track exists for this path.

**Gaps:** Use the BSIS Program Overview for general curriculum framing.

## Implementation rules

1. Only paths with a dedicated MISM page receive track-page-sourced `typicalWork` details.
2. Never present BSIS salary or placement statistics as specific to an individual career.
3. Every `sources` array lists the URLs actually used. Unsourced fields must be omitted or clearly team-authored; `traits` are a scoring construct.
4. Add newly verified BYU pages under the relevant Confirmed section before incorporating them into `data/careers.ts`.
