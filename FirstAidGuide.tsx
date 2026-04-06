import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const guideMap: Record<string, { titleKey: string; stepsKey: string; link: string; image?: string }> = {
  cpr: { titleKey: "firstaidCpr", stepsKey: "firstaidCprSteps", link: "/first-aid-info/cpr", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop" },
  bleeding: { titleKey: "firstaidBleeding", stepsKey: "firstaidBleedingSteps", link: "/first-aid-info/bleeding", image: "https://images.unsplash.com/photo-1631217314997-e6025853a725?w=800&h=450&fit=crop" },
  burns: { titleKey: "firstaidBurns", stepsKey: "firstaidBurnsSteps", link: "/first-aid-info/burns", image: "https://images.unsplash.com/photo-1631217314997-e6025853a725?w=800&h=450&fit=crop" },
  stroke: { titleKey: "firstaidStroke", stepsKey: "firstaidStrokeSteps", link: "/first-aid-info/stroke", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop" },
  choking: { titleKey: "firstaidChoking", stepsKey: "firstaidChokingSteps", link: "/first-aid-info/choking", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop" },
  poisoning: { titleKey: "firstaidPoisoning", stepsKey: "firstaidPoisoningSteps", link: "/first-aid-info/poisoning", image: "https://images.unsplash.com/photo-1631217314997-e6025853a725?w=800&h=450&fit=crop" },
};

const FirstAidGuide = () => {
  const { slug } = useParams();
  const { t } = useLanguage();

  const guide = slug && guideMap[slug];

  useEffect(() => {
    if (slug) trackEvent('firstaid_guide_view', { slug, ts: new Date().toISOString() });
  }, [slug]);

  if (!guide) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <h3 className="font-semibold">Guide not found</h3>
          <p className="text-sm text-muted-foreground">Select a first aid topic from the main page.</p>
          <div className="mt-4">
            <Link to="/">
              <Button variant="ghost">Go home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const steps = t(guide.stepsKey).split("|");

  return (
    <main className="container mx-auto p-6 max-w-3xl">
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t(guide.titleKey)}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t("firstaidSubtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => { trackEvent('firstaid_print', { slug }); window.print(); }} variant="outline">Print</Button>
            <Link to="/">
              <Button variant="ghost">Back</Button>
            </Link>
          </div>
        </div>



        <div className="space-y-3 mt-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center font-medium">{i + 1}</div>
              <div>{s}</div>
            </div>
          ))}
        </div>

        {guide.image && (
          <div className="my-6">
            <img src={guide.image} alt={t(guide.titleKey)} className="w-full rounded-lg shadow-md" />
          </div>
        )}

        <div className="mt-6 flex gap-2 flex-wrap items-center">
+          <a href={guide.link} className="mr-2">
+            <Button variant="outline">More on this topic</Button>
+          </a>
+          <a href="/ministry">
+            <Button variant="ghost">Official Guidance</Button>
+          </a>
         </div>
      </Card>
    </main>
  );
};

export default FirstAidGuide;
