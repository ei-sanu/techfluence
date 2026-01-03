import Navbar from "@/components/Navbar";
import StoryIntro from "@/components/StoryIntro";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Story = () => {
    const [showStory, setShowStory] = useState(true);
    const navigate = useNavigate();

    const handleStoryComplete = () => {
        setShowStory(false);
        navigate("/");
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            {showStory && <StoryIntro onComplete={handleStoryComplete} />}
        </div>
    );
};

export default Story;
