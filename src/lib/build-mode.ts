export function isProductionBuildPhase(): boolean {
    return (process.env.NEXT_PHASE === "phase-production-build" || process.env.npm_lifecycle_event === "build")
           && !process.env.DATABASE_URL;
}
