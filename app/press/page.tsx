import type { Metadata } from "next";

export const metadata: Metadata = {
    alternates: { canonical: "https://www.1martianway.com/press" },
    title: "Press | 1 Martian Way",
    description:
        "1 Martian Way has been featured in numerous local and international media.",
};

const pressVideos = [
    {
        title: "Panel Discussion on Drone Terror Strikes",
        subtitle: "India Today TV with Karan Kamdar, CEO, 1 Martian Way",
        videoId: "78wNbYpipKU",
    },
    {
        title: "1 Martian Way - The drone age is here!",
        subtitle: "Feature Coverage",
        videoId: "PuVs4PxGxSo",
    },
    {
        title: "RoboLand Interview @ Comic Con",
        subtitle: "Event Coverage",
        videoId: "Gi9jDC0BlqU",
    },
    {
        title: "CBS News USA - 1MW Chess Robots",
        subtitle: "International Coverage",
        videoId: "vZvZ8Fo9TGc",
    },
    {
        title: "OC Register USA - 1MW Chess Robots",
        subtitle: "International Coverage",
        videoId: "iYxV1vJvKwk",
    },
    {
        title: "The Story of 1 Martian Way",
        subtitle: "Company Profile",
        videoId: "mJ7IckWKwUM",
    },
    {
        title: "DD Sports - IDRL Coverage",
        subtitle: "Sports Coverage",
        videoId: "xtuhu25S6x4",
    },
    {
        title: "NewsMyntra - 1MW Drones & Robots",
        subtitle: "Technology Coverage",
        videoId: "094tVppTG7M",
    },
];

export default function Press() {
    return (
        <>
            <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Press Coverage
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-white/80">
                        1 Martian Way has been featured in leading media outlets
                        across India and internationally. Watch our coverage and
                        learn more about our innovations in drone technology and
                        robotics.
                    </p>
                </div>
                <div className="mx-auto mt-8 grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-2">
                    {pressVideos.map((video, index) => (
                        <div
                            key={video.videoId}
                            className="flex flex-col overflow-hidden rounded-2xl bg-slate-900 shadow-xs ring-1 ring-gray-900/5"
                        >
                            <div className="aspect-video">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${video.videoId}`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-6">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white">
                                        {video.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-white/80">
                                        {video.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
