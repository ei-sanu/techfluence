import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-full border border-primary/40 hover:border-primary hover:bg-primary/15 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-primary/20"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            <Sun
                className={`h-5 w-5 text-primary transition-all duration-300 absolute drop-shadow-sm ${theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
                    }`}
            />
            <Moon
                className={`h-5 w-5 text-primary transition-all duration-300 absolute drop-shadow-sm ${theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
                    }`}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default ThemeToggle;
