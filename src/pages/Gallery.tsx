import React from "react";

const eventImages = [
    '/eventimages/2T8A3007.JPG', '/eventimages/AMAN2575.JPG', '/eventimages/IMG_0097.JPG', '/eventimages/IMG_0118.JPG', '/eventimages/IMG_2034.JPG', '/eventimages/IMG_2047.JPG', '/eventimages/IMG_2054.HEIC', '/eventimages/IMG_2061.JPG', '/eventimages/IMG_2064.JPG', '/eventimages/IMG_2065.JPG', '/eventimages/IMG_2066.JPG', '/eventimages/IMG_2067.JPG', '/eventimages/IMG_2068.JPG', '/eventimages/IMG_2093.JPG', '/eventimages/IMG_2118.JPG', '/eventimages/IMG_2128.JPG', '/eventimages/IMG_2161.JPG', '/eventimages/IMG_2162.JPG', '/eventimages/IMG_2171.JPG', '/eventimages/IMG_2207.JPG', '/eventimages/IMG_2219.JPG', '/eventimages/IMG_2229.JPG', '/eventimages/IMG_2231.JPG', '/eventimages/IMG_2242.JPG', '/eventimages/IMG_2257.JPG', '/eventimages/IMG_2266.JPG', '/eventimages/IMG_2268.JPG', '/eventimages/IMG_2275.JPG', '/eventimages/IMG_5401.JPG', '/eventimages/IMG_5404.JPG'
];

const Gallery: React.FC = () => {
    return (
        <section className="py-10 md:py-16 min-h-[60vh]">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-4xl font-display tech-text-gradient text-center mb-2">Event Gallery</h1>
                <p className="text-center text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Relive the vibrant moments of TECH FLUENCE through our curated gallery. Each photo captures the energy, innovation, and community spirit that define our event. Dive in and experience the highlights!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                    {eventImages.map((src, i) => (
                        <div className="glimpse-card small" key={`gallery-${i}`}>
                            <img loading="lazy" src={src} alt={`gallery-${i}`} className="w-full h-full object-cover rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
