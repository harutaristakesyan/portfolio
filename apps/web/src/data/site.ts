/** Everything the pages say about Harut, in one place. Keep claims to what the CV supports. */

export const site = {
  name: "Harut Aristakesyan",
  fullName: "Harutyun Aristakesyan",
  title: "Backend engineer — TypeScript on AWS serverless, Java/Spring Boot",
  description:
    "Backend engineer with 7+ years in production systems. TypeScript on AWS serverless (Lambda, API Gateway, Postgres) and Java/Spring Boot services. Integrations that survive bad upstream days.",
  email: "aristakesyan@harut.dev",
  linkedin: "https://www.linkedin.com/in/harutaristakesyan/",
  github: "https://github.com/harutaristakesyan",
  repo: "https://github.com/harutaristakesyan/portfolio",
  cv: "/resume.pdf",
  location: "Yerevan, Armenia",
  timezone: "Asia/Yerevan",
} as const;

export const hero = {
  /** Two plain sentences: who, and what is on the desk right now. No slogan. */
  who: "Backend engineer. Seven years of production systems; the last few on TypeScript and AWS serverless, before that Java and Spring Boot.",
  now: "Currently building a booking-to-billing integration on Lambda, SQS and Stripe, and taking on one more remote contract from December.",
} as const;

export const status = {
  availability: "available from Dec 2026",
  /** Shown next to the live clocks. */
  overlap: "09:00–15:00 ET daily",
} as const;

/** Working artefacts, shown as they are instead of a list of principles. */
export const artefacts = [
  {
    title: "week 1, every project",
    meta: "plan",
    body: `<b>day 1–2</b>  read the code, trace one
         real request end to end
<b>day 3</b>    written scope: stages,
         acceptance, fixed price each
<b>day 4–5</b>  first PR merged: smallest
         useful change, with tests
<b>friday</b>   update (see right),
         staging URL if there is one`,
  },
  {
    title: "friday update",
    meta: "message · weekly",
    body: `<b>done</b>    3 PRs: idempotent intake,
        DLQ + replay command
<b>next</b>    Stripe invoices from
        confirmed stays
<b>risk</b>    partner B sends updates
        before create; handled in
        queue, nothing needed from you
<b>decide</b>  invoice per stay, or
        monthly roll-up? (thread)`,
  },
  {
    title: "PR description",
    meta: "template",
    body: `<b>what</b>      one sentence
<b>why</b>       the failure this prevents,
          or what it enables
<b>how</b>       the decision, and what
          I chose not to do
<b>test</b>      which path is covered,
          how to run it
<b>rollback</b>  one line`,
  },
] as const;

export interface Experience {
  role: string;
  company: string;
  period: string;
  summary: string;
}

export const experience: Experience[] = [
  {
    role: "Lead Software Engineer",
    company: "EPAM Systems",
    period: "2022 — now",
    summary:
      "Enterprise Java services end to end: architecture, estimation, delivery, production support. Moved a legacy platform onto AWS with serverless and managed services; own the pipelines and the team's testing standards.",
  },
  {
    role: "Senior Software Engineer, contract",
    company: "IUNetworks",
    period: "2021 — 2023",
    summary:
      "Spring Boot microservices for core business operations. Replaced synchronous coupling with Kafka and ActiveMQ; profiling-driven query optimisation; Testcontainers-based integration tests.",
  },
  {
    role: "Software Engineer, freelance",
    company: "Upwork",
    period: "2020 — now",
    summary:
      "Spring Boot, Micronaut and TypeScript backends for remote clients, requirements to deployment and support. Repeat contracts alongside full-time roles.",
  },
  {
    role: "Java Backend Developer",
    company: "ITHD",
    period: "2019 — 2020",
    summary: "Spring Boot, Hibernate and REST APIs; automated testing with JUnit and Mockito.",
  },
];

export const stack = [
  { group: "Languages", items: ["TypeScript", "Java", "SQL", "Swift"] },
  {
    group: "AWS",
    items: [
      "Lambda",
      "API Gateway",
      "SQS / SNS",
      "DynamoDB",
      "Aurora",
      "S3",
      "CloudFront",
      "Cognito",
      "CDK",
      "SST",
    ],
  },
  {
    group: "Backend",
    items: ["Node.js", "Spring Boot", "Micronaut", "REST", "gRPC", "GraphQL", "Kafka", "ActiveMQ"],
  },
  { group: "Data", items: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB"] },
  {
    group: "Delivery",
    items: ["GitHub Actions", "GitLab CI", "Docker", "Kubernetes", "Testcontainers", "Vitest"],
  },
  { group: "Frontend", items: ["React", "Next.js", "Astro", "Angular", "SwiftUI"] },
] as const;

export const ownProducts = [
  {
    title: "Native iOS finance tracker",
    text: "SwiftUI, Core Data and CloudKit, no backend. Designed, built and shipped to the App Store.",
  },
  {
    title: "Portfolio analysis tool",
    text: "Web app that reads a brokerage export and explains concentration and overlap across holdings.",
  },
] as const;
