/** Everything the pages say about Harut, in one place. Keep claims to what the CV supports. */

export const site = {
  name: "Harut Aristakesyan",
  fullName: "Harutyun Aristakesyan",
  title: "Backend engineer — TypeScript on AWS serverless, Java/Spring Boot",
  description:
    "Backend engineer with 7+ years in production systems. TypeScript on AWS serverless (Lambda, API Gateway, Postgres) and Java/Spring Boot services. Integrations that survive bad upstream days.",
  email: "harut.aristakesyan@gmail.com",
  linkedin: "https://www.linkedin.com/in/harutaristakesyan/",
  github: "https://github.com/harutaristakesyan",
  cv: "/resume.pdf",
  location: "Yerevan, Armenia · UTC+4",
} as const;

export const hero = {
  heading: "I build backends and integrations that keep working when something upstream fails.",
  lead: "Backend engineer, 7+ years in production. TypeScript on AWS serverless for the last few years, Java and Spring Boot services before that. Remote, overlapping US and EU working hours.",
} as const;

export const facts = [
  { value: "7+", label: "years in production systems" },
  { value: "2020", label: "working with remote clients since" },
  { value: "UTC+4", label: "overlaps US Eastern and EU hours" },
] as const;

export const principles = [
  {
    title: "Reliability before features",
    text: "Webhooks arrive twice, rate limits change, a refund lands after the report is built. I design for that first: idempotent writes, retries, dead-letter queues and a replay path.",
  },
  {
    title: "Small, reviewable steps",
    text: "Short PRs with tests on the paths that matter, a staging URL before the final payment on each stage, and no surprises in production.",
  },
  {
    title: "Your code, your accounts",
    text: "Everything lives in your repositories and your cloud account from day one. When the work is done, nothing depends on me.",
  },
] as const;

export interface Experience {
  role: string;
  company: string;
  period: string;
  points: string[];
}

export const experience: Experience[] = [
  {
    role: "Lead Software Engineer",
    company: "EPAM Systems",
    period: "Jul 2022 — present",
    points: [
      "Deliver enterprise Java services end to end: architecture, estimation, implementation, production support.",
      "Drive service boundaries, domain modelling and event-driven integration across teams.",
      "Moved a legacy platform onto AWS with serverless and managed services, adding Node.js and React next to the Java core.",
      "Own the CI/CD pipelines, coding and testing standards; review and mentor.",
    ],
  },
  {
    role: "Senior Software Engineer (contract)",
    company: "IUNetworks",
    period: "Aug 2021 — May 2023",
    points: [
      "Owned Spring Boot microservices running core business operations.",
      "Replaced synchronous coupling with messaging over Kafka and ActiveMQ to isolate failures.",
      "Profiling-driven query and algorithm optimisation across SQL and NoSQL stores.",
      "Integration testing with JUnit, Mockito and Testcontainers.",
    ],
  },
  {
    role: "Software Engineer (freelance)",
    company: "Upwork",
    period: "Dec 2020 — present",
    points: [
      "Spring Boot, Micronaut and TypeScript backends for international clients, from requirements to deployment and support.",
      "Long-running relationships and repeat contracts alongside full-time roles.",
    ],
  },
  {
    role: "Java Backend Developer",
    company: "ITHD",
    period: "Jul 2019 — Dec 2020",
    points: [
      "Backend services with Spring Boot, Hibernate and REST APIs.",
      "Automated testing with JUnit and Mockito; feature work with cross-functional teams.",
    ],
  },
];

export const stack = [
  {
    group: "Languages",
    items: ["TypeScript", "Java", "SQL", "Swift"],
  },
  {
    group: "AWS",
    items: [
      "Lambda",
      "API Gateway",
      "DynamoDB",
      "Aurora Serverless",
      "S3",
      "CloudFront",
      "Cognito",
      "SQS / SNS",
      "CDK",
      "SST",
    ],
  },
  {
    group: "Backend",
    items: ["Node.js", "Spring Boot", "Micronaut", "REST", "gRPC", "GraphQL", "Kafka", "ActiveMQ"],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB"],
  },
  {
    group: "Delivery",
    items: ["GitHub Actions", "GitLab CI", "Docker", "Kubernetes", "Testcontainers", "Vitest"],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "Astro", "Angular", "SwiftUI"],
  },
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
