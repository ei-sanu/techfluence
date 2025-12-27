import React from 'react';

// Images from event images in `public/` (not /loop/)
const eventImages = [
    '/eventimages/2T8A3007.JPG', '/eventimages/AMAN2575.JPG', '/eventimages/IMG_0097.JPG', '/eventimages/IMG_0118.JPG', '/eventimages/IMG_2034.JPG', '/eventimages/IMG_2047.JPG', '/eventimages/IMG_2054.HEIC', '/eventimages/IMG_2061.JPG', '/eventimages/IMG_2064.JPG', '/eventimages/IMG_2065.JPG', '/eventimages/IMG_2066.JPG', '/eventimages/IMG_2067.JPG', '/eventimages/IMG_2068.JPG', '/eventimages/IMG_2093.JPG', '/eventimages/IMG_2118.JPG', '/eventimages/IMG_2128.JPG', '/eventimages/IMG_2161.JPG', '/eventimages/IMG_2162.JPG', '/eventimages/IMG_2171.JPG', '/eventimages/IMG_2207.JPG', '/eventimages/IMG_2219.JPG', '/eventimages/IMG_2229.JPG', '/eventimages/IMG_2231.JPG', '/eventimages/IMG_2242.JPG', '/eventimages/IMG_2257.JPG', '/eventimages/IMG_2266.JPG', '/eventimages/IMG_2268.JPG', '/eventimages/IMG_2275.JPG', '/eventimages/IMG_5401.JPG', '/eventimages/IMG_5404.JPG', '/eventimages/IMG_9765.JPG', '/eventimages/IMG_9972.JPG', '/eventimages/IMG_9976.JPG', '/eventimages/Img1.jpeg', '/eventimages/Img2.jpeg', '/eventimages/Img3.jpeg', '/eventimages/Img4.jpeg', '/eventimages/Img5.jpeg', '/eventimages/Img5c.jpeg', '/eventimages/Img6.jpeg', '/eventimages/Img7.jpeg', '/eventimages/Img7c.jpeg', '/eventimages/S2_.jpeg', '/eventimages/S2_c.jpeg', '/eventimages/image.png', '/eventimages/image1.jpeg', '/eventimages/image10.jpeg', '/eventimages/image11.jpeg', '/eventimages/image2.jpeg', '/eventimages/image3.jpeg', '/eventimages/image4.jpeg', '/eventimages/image5.jpeg', '/eventimages/image6.jpeg', '/eventimages/image7.jpeg', '/eventimages/image8.jpeg', '/eventimages/image9.jpeg', '/eventimages/karan_mv.jpg', '/eventimages/mhd_f.jpg', '/eventimages/nishant_c.jpg', '/eventimages/rad_adi.jpg', '/eventimages/sp1_1.JPG', '/eventimages/sp1_1c.JPG', '/eventimages/sp1_2.JPG', '/eventimages/sp1_2c.JPG', '/eventimages/sp1_3.JPG', '/eventimages/sp1_4.JPG', '/eventimages/sp1_5.jpg', '/eventimages/sp1_6.JPG', '/eventimages/sp1_7.JPG', '/eventimages/sp1_7c.JPG', '/eventimages/sp_1.jpg', '/eventimages/sp_2.jpg', '/eventimages/sp_3.jpg', '/eventimages/sp_4.jpg', '/eventimages/sp_5.jpg', '/eventimages/sp_5c.jpg', '/eventimages/sp_6.jpg', '/eventimages/sp_6c.jpg', '/eventimages/sp_7.jpg', '/eventimages/sp_7c.jpg', '/eventimages/table.png', '/eventimages/tech3.jpeg'
];

// Stable past season images (Season 1, 2, 3)
const pastSeasonImages = ['/sp1_1c.JPG', '/s2.jpg', '/s3_1c.jpeg'];

const GlimpseSection: React.FC = () => {
    return (
        <section className="glimpse-section py-8 md:py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-6">
                    <h3 className="text-sm tracking-widest text-amber-300 mb-1">TECHFLUENCE</h3>
                    <h2 className="text-3xl md:text-4xl font-display tech-text-gradient">GLIMPSE</h2>
                    <div className="glimpse-subtitle">Voice Of Our Attendees</div>
                </div>

                {/* Past seasons — stable cards */}
                <div className="glimpse-stable grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 justify-items-center mb-6">
                    {pastSeasonImages.map((src, i) => (
                        <div key={`past-${i}`} className="stable-card w-72 md:w-80 p-3 rounded-lg bg-card tech-border">
                            <div className="w-full h-36 md:h-44 overflow-hidden rounded-md">
                                <img loading="lazy" src={src} alt={`past-season-${i}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="mt-3 text-center">
                                <p className="text-sm text-muted-foreground">Past Season</p>
                                <p className="font-medium">Season {i + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* All event images as small cards in a responsive grid */}
                <div className="glimpse-gallery grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                    {eventImages.slice(0, 30).map((src, i) => (
                        <div className="glimpse-card small" key={`gallery-${i}`}>
                            <img loading="lazy" src={src} alt={`gallery-${i}`} className="w-full h-full object-cover rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GlimpseSection;
