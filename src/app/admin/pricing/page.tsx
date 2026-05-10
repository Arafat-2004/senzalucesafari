import { requireAdmin } from "@/lib/admin-auth"
import { PricingSimulation } from "@/components/admin/pricing-simulation";

export default async function PricingToolPage() {
    await requireAdmin();
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Pricing Simulator</h2>
                <p className="text-muted-foreground">
                    Preview and simulate tour pricing scenarios
                </p>
            </div>
            
            <PricingSimulation initialPrice={1500} />
        </div>
    );
}