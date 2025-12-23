import React, { useEffect, useRef } from "react";

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const root = document.documentElement;
        // set fallback css vars
        root.style.setProperty("--cursor-overlay-color", "hsl(var(--primary) / 0.12)");
        root.style.setProperty("--cursor-color", "hsl(var(--primary) / 0.9)");

        const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isPointerFine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
        if (!isPointerFine || prefersReduced) return; // disable on touch or reduced-motion

        let mouseX = -100;
        let mouseY = -100;
        let rafId: number | null = null;

        // smooth position for interpolation
        let posX = -100;
        let posY = -100;

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // ensure overlay color stays in sync (in case theme toggles)
            // small cost but rare relative to rAF
            root.style.setProperty("--cursor-overlay-color", "hsl(var(--primary) / 0.12)");
            if (!rafId) rafId = requestAnimationFrame(update);
        };

        const onLeave = () => {
            mouseX = -100;
            mouseY = -100;
            if (!rafId) rafId = requestAnimationFrame(update);
        };

        const onDown = () => document.documentElement.classList.add("cursor-pressed");
        const onUp = () => document.documentElement.classList.remove("cursor-pressed");

        function update() {
            rafId = null;
            // interpolate for smoothness
            posX += (mouseX - posX) * 0.18;
            posY += (mouseY - posY) * 0.18;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${posX - 28}px, ${posY - 28}px, 0)`; // center (56px)
            }
            if (overlayRef.current) {
                overlayRef.current.style.transform = `translate3d(${posX - 180}px, ${posY - 180}px, 0)`; // larger overlay
            }

            // continue rAF if mouse not stationary
            if (Math.abs(mouseX - posX) > 0.1 || Math.abs(mouseY - posY) > 0.1) {
                rafId = requestAnimationFrame(update);
            }
        }

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseleave", onLeave);
        window.addEventListener("mousedown", onDown);
        window.addEventListener("mouseup", onUp);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseleave", onLeave);
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    return (
        <>
            <div ref={overlayRef} aria-hidden className="cursor-overlay" />
            <div ref={cursorRef} aria-hidden className="custom-cursor" />
        </>
    );
};

export default CustomCursor;
