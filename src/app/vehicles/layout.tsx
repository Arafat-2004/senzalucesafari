import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Safari Vehicles - Senza Luce Safaris",
    description: "Explore our fleet of modern, comfortable safari vehicles designed for the ultimate Tanzanian wildlife experience. Toyota Land Cruisers, minibuses, and more.",
};

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
