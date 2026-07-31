import { Metadata } from "next";
import SupportContent from "./SupportContent";

export const metadata: Metadata = {
    title: "Support - Senza Luce Safari",
    description: "Get help with your safari booking, travel questions, and customer support. We're here to assist you 24/7.",
    alternates: { canonical: '/support' },
    openGraph: { url: '/support' },
};

export default function SupportPage() {
    return <SupportContent />;
}

