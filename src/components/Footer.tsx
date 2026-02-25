import { Heart, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import sanjeevaniLogo from "@/assets/sanjeevani-logo.jpg";

const Footer = () => {
  const { t } = useLanguage();

  const links = {
    product: [
      { labelKey: "footer.downloadApp", href: "#" },
      { labelKey: "footer.sosFeatures", href: "#sos" },
      { labelKey: "footer.healthProfile", href: "#profile" },
      { labelKey: "footer.firstAidGuides", href: "#first-aid" },
    ],
    community: [
      { labelKey: "footer.becomeWarrior", href: "#warriors" },
      { labelKey: "footer.trainingModules", href: "#" },
      { labelKey: "footer.successStories", href: "#" },
      { labelKey: "footer.partnerHospitals", href: "#" },
    ],
    resources: [
      { labelKey: "footer.abhaReg", href: "https://abha.abdm.gov.in" },
      { labelKey: "footer.goodSamaritan", href: "#" },
      { labelKey: "footer.apiDocs", href: "#" },
      { labelKey: "footer.research", href: "#" },
    ],
  };

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <img src={sanjeevaniLogo} alt="Sanjeevani" className="h-16 w-auto mb-4 bg-white rounded-lg p-2" />
            <p className="text-background/70 mb-6 max-w-sm">{t("footer.description")}</p>
            <div className="space-y-3">
              <a href="tel:112" className="flex items-center gap-3 text-secondary hover:text-secondary/80 transition-colors">
                <Phone className="h-5 w-5" />
                <span className="font-medium">{t("footer.emergency")}</span>
              </a>
              <a href="mailto:support@sanjeevani.gov.in" className="flex items-center gap-3 text-background/70 hover:text-background transition-colors">
                <Mail className="h-5 w-5" />
                <span>support@sanjeevani.gov.in</span>
              </a>
              <div className="flex items-center gap-3 text-background/70">
                <MapPin className="h-5 w-5" />
                <span>Ministry of Health, New Delhi</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t("footer.product")}</h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.labelKey}>
                  <a href={link.href} className="text-background/70 hover:text-secondary transition-colors">{t(link.labelKey)}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t("footer.community")}</h3>
            <ul className="space-y-3">
              {links.community.map((link) => (
                <li key={link.labelKey}>
                  <a href={link.href} className="text-background/70 hover:text-secondary transition-colors">{t(link.labelKey)}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t("footer.resources")}</h3>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.labelKey}>
                  <a href={link.href} className="text-background/70 hover:text-secondary transition-colors inline-flex items-center gap-1">
                    {t(link.labelKey)}
                    {link.href.startsWith("http") && <ExternalLink className="h-3 w-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/60 text-sm text-center md:text-left">{t("footer.copyright")}</p>
            <div className="flex items-center gap-2 text-sm text-background/60">
              <span>{t("footer.madeWith")}</span>
              <Heart className="h-4 w-4 text-destructive fill-current" />
              <span>{t("footer.forBharat")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
