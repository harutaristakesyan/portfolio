import {Button} from "../ui/button";
import {isUpworkEnv} from "@/config.ts";

const CvDownloadButton = () => {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = isUpworkEnv ? "/upwork_resume.pdf" : "/resume.pdf";
        link.download = "Harutyun_Aristakesyan_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button size="lg" onClick={handleDownload}
                className="[&_svg]:size-8 px-4 md:px-8 h-14 cv-btn flex-1 text-n700 bg-primary-light dark:bg-primary-dark hover:bg-primary-hover-light dark:hover:bg-primary-hover-dark">
            Download CV
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
                <path fill="#0A0A30"
                      d="M12.75 6.432a.75.75 0 00-1.5 0h1.5zm-1.5 6a.75.75 0 001.5 0h-1.5zm-1.22-2.53a.75.75 0 10-1.06 1.06l1.06-1.06zm1.97 3.03l-.53.53a.75.75 0 001.06 0l-.53-.53zm3.03-1.97a.75.75 0 00-1.06-1.06l1.06 1.06zm-3.78-4.53v6h1.5v-6h-1.5zm-2.28 4.53l2.5 2.5 1.06-1.06-2.5-2.5-1.06 1.06zm3.56 2.5l2.5-2.5-1.06-1.06-2.5 2.5 1.06 1.06z"
                      className="animate-slide-right"/>
                <path stroke="#0A0A30" d="M8 17.274h8"/>
            </svg>
        </Button>
    );
};

export default CvDownloadButton;
