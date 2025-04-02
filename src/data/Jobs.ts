interface WorkExperience {
    title: string;
    startDate: string;
    endDate?: string;
    company: string;
    location: string;
    description: string;
    goals: string[];
    currentJob: boolean;
}

const workExperience: WorkExperience[] = [
    {
        title: "Senior Java Engineer",
        startDate: "2022-07-01",
        company: "EPAM Systems",
        location: "Yerevan, Armenia",
        description: "Leading the design, development, and deployment of scalable backend systems in an agile enterprise environment.",
        goals: [
            "Built and maintained microservices using Java and Spring Boot handling high-throughput workloads.",
            "Designed RESTful APIs for seamless frontend-backend integration.",
            "Implemented CI/CD pipelines using GitLab CI and CircleCI.",
            "Mentored junior developers and conducted code reviews.",
            "Worked on performance optimizations and cloud-native deployments using Kubernetes, AWS, and GCP."
        ],
        currentJob: true
    },
    {
        title: "Full Stack Developer",
        startDate: "2024-09-01",
        endDate: "2025-05-01",
        company: "RIG",
        location: "Remote",
        description: "Developed and optimized a full-stack web platform using modern frontend and backend technologies.",
        goals: [
            "Built responsive UI with Next.js and Firebase authentication.",
            "Managed backend logic using Micronaut (v4) and MongoDB.",
            "Integrated payment flow using Stripe and messaging via Twilio.",
            "Upgraded Micronaut from v2 to v4 and improved app performance by optimizing MongoDB queries.",
            "Deployed services on GCP and supported the DevOps team with improvements to the cloud infrastructure."
        ],
        currentJob: false
    },
    {
        title: "Java Software Engineer",
        startDate: "2021-08-01",
        endDate: "2023-05-01",
        company: "IUNetworks",
        location: "Yerevan, Armenia",
        description: "Developed microservices for mission-critical systems in a fast-paced agile environment.",
        goals: [
            "Implemented scalable Java-based microservices for business-critical features.",
            "Built database layers using PostgreSQL, MongoDB, and DynamoDB.",
            "Collaborated with DevOps to ensure reliable deployments using Docker and Kubernetes.",
            "Partnered with frontend and QA teams for full end-to-end delivery.",
            "Mentored junior team members and helped with architectural decisions."
        ],
        currentJob: false
    },
    {
        title: "Java Software Engineer (Freelance)",
        startDate: "2020-12-01",
        endDate: "2021-08-01",
        company: "Upwork",
        location: "Remote",
        description: "Delivered custom backend systems and APIs to clients worldwide on a freelance basis.",
        goals: [
            "Built Java Spring Boot applications tailored to client needs.",
            "Created secure REST APIs and integrated third-party services.",
            "Delivered projects under tight deadlines with strong client satisfaction.",
            "Debugged and optimized legacy systems for scalability and performance.",
            "Contributed to design reviews and technical documentation."
        ],
        currentJob: false
    },
    {
        title: "Java Backend Developer",
        startDate: "2019-12-01",
        endDate: "2020-12-01",
        company: "ITHD",
        location: "Yerevan, Armenia",
        description: "Developed backend services using Java Spring Boot and mentored junior team members.",
        goals: [
            "Built reusable Spring Boot modules and improved code quality.",
            "Refactored legacy code for modern REST architecture.",
            "Mentored interns and junior developers in Java fundamentals.",
            "Worked with QA to deliver well-tested releases.",
            "Participated in sprint planning and code reviews."
        ],
        currentJob: false
    },
    {
        title: "Java Core Trainer",
        startDate: "2019-12-01",
        endDate: "2020-09-01",
        company: "IT-Home",
        location: "Yerevan, Armenia",
        description: "Taught Java fundamentals and advanced topics to students of various skill levels.",
        goals: [
            "Delivered structured lessons on OOP, collections, threading, JDBC, and exception handling.",
            "Prepared custom assignments and evaluated student performance.",
            "Helped students build portfolio-ready Java apps.",
            "Conducted one-on-one sessions and mock interviews.",
            "Organized and led Java coding workshops."
        ],
        currentJob: false
    }
];

export default workExperience;
