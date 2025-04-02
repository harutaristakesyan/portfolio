interface Language {
    name: string;
    level: string;
    show: boolean;
}

const languages: Language[] = [
    {
        name: "English",
        level: "Proficient",
        show: true
    },
    {
        name: "Russion",
        level: "Fluent",
        show: true
    },
    {
        name: "Armenia",
        level: "Native",
        show: true
    },
];

export default languages;
