"use client";

interface StructuredDataProps {
    type: 'Organization' | 'Product' | 'TechArticle' | 'SoftwareApplication';
    data?: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
    const getStructuredData = () => {
        const baseOrganization = {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "1 Martian Way Industries",
            description: "World's leading developer of conscious humanoid robots and advanced robot operating systems",
            url: "https://www.1martianway.com",
            logo: "https://www.1martianway.com/assets/img/1mw-mark-512.png",
            // sameAs must list profiles that actually resolve and are ours.
            // github.com/1martianway is removed until the repos are public — an
            // org page with nothing in it is a weaker signal than no entry.
            // TODO: confirm these two are the real handles before launch.
            sameAs: [
                "https://x.com/1MartianWay",
                "https://www.linkedin.com/company/1martianway"
            ],
            industry: "Robotics Technology",
            // TODO: verify. The chess-robot press coverage predates 2020.
            foundingDate: "2020",
            founder: {
                "@type": "Person",
                name: "Karan Kamdar",
                jobTitle: "CEO"
            },
            address: {
                "@type": "PostalAddress",
                streetAddress: "502 Satya Sadan, Bhimani Street, Matunga East",
                addressLocality: "Mumbai",
                postalCode: "400019",
                addressCountry: "IN"
            },
            contactPoint: {
                "@type": "ContactPoint",
                contactType: "Research Partnerships",
                url: "https://www.1martianway.com/contact"
            },
            makesOffer: [
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Product",
                        name: "Conscious Humanoid Robots",
                        description: "AI-powered sentient humanoid robots with advanced consciousness"
                    }
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "SoftwareApplication",
                        name: "Martian OS",
                        description: "Real-time operating system for conscious humanoid robots",
                        operatingSystem: "Rust-based real-time OS",
                        applicationCategory: "Robot Operating System"
                    }
                }
            ]
        };

        switch (type) {
            case 'Organization':
                return baseOrganization;
            
            case 'Product':
                return {
                    "@context": "https://schema.org",
                    "@type": "Product",
                    name: data?.name || "Conscious Humanoid Robots",
                    description: data?.description || "Advanced AI-powered humanoid robots with true consciousness",
                    brand: {
                        "@type": "Brand",
                        name: "1 Martian Way Industries"
                    },
                    manufacturer: {
                        "@type": "Organization",
                        name: "1 Martian Way Industries",
                        url: "https://www.1martianway.com"
                    },
                    category: "Humanoid Robotics",
                    audience: {
                        "@type": "Audience",
                        audienceType: "Research Institutions, Enterprises"
                    }
                };
            
            case 'SoftwareApplication':
                return {
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "Martian OS",
                    description: "World's first real-time operating system designed specifically for conscious humanoid robots",
                    applicationCategory: "Robot Operating System",
                    operatingSystem: "Rust-based Real-time OS",
                    programmingLanguage: "Rust",
                    creator: {
                        "@type": "Organization",
                        name: "1 Martian Way Industries",
                        url: "https://www.1martianway.com"
                    },
                    // No `offers` block: there is no published price, and the
                    // previous value ("Contact for licensing") is not a number,
                    // which Google's structured-data test rejects outright.
                    featureList: [
                        "Sub-microsecond interrupt latency",
                        "Memory safety guarantees",
                        "Real-time scheduling",
                        "Consciousness integration APIs",
                        "Hardware abstraction layer"
                    ]
                };

            case 'TechArticle':
                return {
                    "@context": "https://schema.org",
                    "@type": "TechArticle",
                    headline: data?.title || "Advances in Conscious Humanoid Robotics",
                    description: data?.description || "Latest developments in AI consciousness and humanoid robotics technology",
                    author: {
                        "@type": "Organization",
                        name: "1 Martian Way Industries",
                        url: "https://www.1martianway.com"
                    },
                    publisher: {
                        "@type": "Organization",
                        name: "1 Martian Way Industries",
                        url: "https://www.1martianway.com",
                        logo: {
                            "@type": "ImageObject",
                            url: "https://www.1martianway.com/assets/img/1mw-mark-512.png"
                        }
                    },
                    dateModified: new Date().toISOString(),
                    mainEntityOfPage: {
                        "@type": "WebPage",
                        "@id": data?.url || "https://www.1martianway.com"
                    }
                };

            default:
                return baseOrganization;
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(getStructuredData(), null, 2)
            }}
        />
    );
} 