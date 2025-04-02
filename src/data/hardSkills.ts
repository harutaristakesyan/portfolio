interface HardSkill {
  name: string;
  description: string;
  icon: string;
}

const hardSkills: HardSkill[] = [
  {
    name: "Java",
    description: "My core backend language, powering enterprise microservices and high-performance systems.",
    icon: "java"
  },
  {
    name: "Spring Boot",
    description: "Framework of choice for building scalable, secure RESTful APIs and microservices.",
    icon: "spring"
  },
  {
    name: "Micronaut",
    description: "Used for cold-start, lightweight microservices with native image builds in GCP.",
    icon: "micronaut"
  },
  {
    name: "Node.js",
    description: "Used primarily for serverless backends with AWS Lambda and GCP Functions.",
    icon: "nodejs"
  },
  {
    name: "Hibernate & JPA",
    description: "ORM tools for clean and efficient interaction with relational databases.",
    icon: "hibernate"
  },
  {
    name: "TypeScript",
    description: "My go-to language for modern frontend and backend JavaScript development.",
    icon: "typescript"
  },
  {
    name: "Angular",
    description: "Used for building dynamic and modular frontend applications with RxJS and NgRx.",
    icon: "angular"
  },
  {
    name: "Angular Universal",
    description: "Used to build server-side rendered Angular apps for improved SEO and performance.",
    icon: "angular-universal"
  },
  {
    name: "CI/CD (GitLab CI, GitHub Actions, CircleCI)",
    description: "I build and manage automated pipelines for Java and full-stack apps using GitLab CI, GitHub Actions, and CircleCI.",
    icon: "ci-cd"
  },
  {
    name: "Docker & Kubernetes",
    description: "Used for containerization and orchestration of scalable, cloud-native systems.",
    icon: "kubernetes"
  },
  {
    name: "Portainer",
    description: "Used for managing Docker deployments on dedicated servers via an intuitive UI.",
    icon: "portainer"
  },
  {
    name: "AWS / GCP / Yandex Cloud",
    description: "Cloud-native app deployment and scaling experience across AWS, GCP, and Yandex Cloud.",
    icon: "cloud"
  },
  {
    name: "PostgreSQL, MySQL & MongoDB",
    description: "Experience with relational and NoSQL databases depending on application needs.",
    icon: "database"
  },
  {
    name: "Kafka",
    description: "Used for distributed event streaming and async communication between microservices.",
    icon: "kafka"
  },
  {
    name: "Next.js",
    description: "React framework I use to build SEO-optimized, server-rendered apps with API routes.",
    icon: "nextjs_icon_dark"
  },
  {
    name: "Astro",
    description: "Static site generator I use for personal and client projects — like my portfolio site.",
    icon: "astro_dark"
  },
  {
    name: "React & React Native",
    description: "Frontend and cross-platform mobile development using React, React Native, and Expo.",
    icon: "react"
  },
  {
    name: "Expo",
    description: "Speeds up mobile development with hot-reload and native builds for React Native.",
    icon: "expo"
  },
  {
    name: "Vercel & Netlify",
    description: "I deploy modern web apps to Vercel and Netlify for speed, simplicity, and CI integration.",
    icon: "cloud-upload"
  }
];

export default hardSkills;
