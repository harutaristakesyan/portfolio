interface Education {
    title: string;
    startDate: string;
    endDate?: string;
    school: string;
    location: string;
    description: string;
    currentUni: boolean;
}

const education: Education[] = [
    {
        title: "Bachelor of Laws",
        startDate: "2019-09-01",
        endDate: "2023-06-30",
        school: "Yerevan Institute of Forensic Examination and Psychology",
        location: "Yerevan, Armenia",
        description: "Studied legal principles and forensic analysis techniques to complement technical problem-solving and analytical thinking.",
        currentUni: false,
    },
    {
        title: "Programming Degree",
        startDate: "2013-09-01",
        endDate: "2016-06-30",
        school: "Yerevan State College of Informatics",
        location: "Yerevan, Armenia",
        description: "Specialized in core programming concepts, software engineering, and Java-based application development.",
        currentUni: false,
    }
];

export default education;
