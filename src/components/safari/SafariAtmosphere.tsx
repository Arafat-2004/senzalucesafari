import { NatureTexture } from "./NatureTexture";
import { TopographicPattern } from "./TopographicPattern";
import { WildlifeAccent } from "./WildlifeAccent";

export function SafariAtmosphere() {
  return (
    <div aria-hidden="true" className="safari-atmosphere pointer-events-none absolute inset-0 overflow-hidden">
      <TopographicPattern className="top-0 h-[42rem] opacity-[0.45]" />
      <NatureTexture variant="trail" className="top-[38rem] h-[54rem] opacity-[0.5]" />
      <WildlifeAccent kind="acacia" side="right" opacity="quiet" className="top-[46rem] rotate-[-4deg]" />
      <WildlifeAccent kind="giraffe" side="left" opacity="quiet" className="top-[110rem] rotate-[3deg]" />
      <WildlifeAccent kind="eagle" side="right" opacity="soft" className="top-[172rem] h-48 w-48 rotate-[7deg]" />
      <WildlifeAccent kind="elephant" side="left" opacity="quiet" className="top-[238rem] rotate-[-2deg]" />
      <NatureTexture variant="sand" className="top-[220rem] h-[50rem] opacity-[0.45]" />
    </div>
  );
}
