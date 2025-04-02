export const isUpworkEnv = import.meta.env.PUBLIC_IS_UPWORK === 'true';

export const SITE = {
    title: "Harut Aristakesyan | Portfolio",
    description: "Harutyun Aristakesyan Sofware Enginner",
    tags: ["portfolio", "Resume cv", "Harutyun", "Aristakesyan", "Harutyun Resume"],
    ogImage: "/logo.png",
    logo: "logo",
    logoText: "H|A Portfolio",
    lang: "en",
    repository: "https://github.com/harutaristakesyan/portfolio.git",
    author: "Harut Aristakesyan",
}

export const ME = {
    name: "Harutyun Aristakesyan",
    profession: "Software Engineer | Full Stack Developer",
    profileImage: "IMG.jpg",
    profileFacts: [
        {
            value: 8,
            description: "Years of Experience"
        },
        {
            value: 16,
            description: "Completed Projects"
        },
        {
            value: 31,
            description: "Satisfied Clients"
        }
    ],
    contactInfo: {
        email: "harut.aristakesyan@gmail.com",
        linkedin: "https://www.linkedin.com/in/harutaristakesyan",
        resumeDoc: "resume.pdf",
    },
    aboutMe: "I’m a Senior Java Software Engineer and Full Stack Developer with nearly 8 years of experience delivering high-performance applications across enterprise, cloud, and mobile platforms. I specialize in Java microservices, Spring Boot, Micronaut, and modern frontend frameworks like Next.js and Angular. I've led teams, architected systems, and even served as a delivery manager. I'm passionate about building scalable solutions, mentoring developers, and constantly pushing the boundaries of performance and clean code. I also love working with cloud-native technologies across AWS, GCP, and Yandex Cloud, and deploying full-stack apps using tools like Docker, Kubernetes, Firebase, and serverless platforms."
}

export const SOCIALS = [
    {
        name: "Twitter",
        url: "https://twitter.com/vicbox.dev",
        icon: "twitter-x-fill",
        show: !isUpworkEnv
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/vicbox.dev",
        icon: "instagram-fill",
        show: !isUpworkEnv
    },
    {
        name: "Youtube",
        url: "https://www.youtube.com/vicbox.dev",
        icon: "youtube-fill",
        show: !isUpworkEnv
    },
    {
        name: "GitHub",
        url: "https://github.com/vicbox.dev",
        icon: "github-fill",
        show: !isUpworkEnv
    }
]
