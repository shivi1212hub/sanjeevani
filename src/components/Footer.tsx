import { Heart, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import sanjeevaniLogo from "@/assets/sanjeevani-logo.jpg";

const Footer = () => {
  const links = {
    product: [
      { label: "Download App", href: "#" },
      { label: "SOS Features", href: "#sos" },
      { label: "Health Profile", href: "#profile" },
      { label: "First Aid Guides", href: "#first-aid" },
    ],
    community: [
      { label: "Become a Warrior", href: "#warriors" },
      { label: "Training Modules", href: "#" },
      { label: "Success Stories", href: "#" },
      { label: "Partner Hospitals", href: "#" },
    ],
    resources: [
      { label: "ABHA Registration", href: "https://abha.abdm.gov.in" },
      { label: "Good Samaritan Law", href: "#" },
      { label: "API Documentation", href: "#" },
      { label: "Research Papers", href: "#" },
    ],
  };

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img 
              src={sanjeevaniLogo} 
              alt="Sanjeevani" 
              className="h-16 w-auto mb-4 bg-white rounded-lg p-2"
            />
            <p className="text-background/70 mb-6 max-w-sm">
              India's first hyper-local emergency response network. 
              Bridging the gap between immediate care and rural communities.
            </p>
            <div className="space-y-3">
              <a href="tel:112" className="flex items-center gap-3 text-secondary hover:text-secondary/80 transition-colors">
                <Phone className="h-5 w-5" />
                <span className="font-medium">Emergency: 112</span>
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

          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Community</h3>
            <ul className="space-y-3">
              {links.community.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-secondary transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    {link.href.startsWith("http") && (
                      <ExternalLink className="h-3 w-3" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/60 text-sm text-center md:text-left">
              © 2026 Sanjeevani - Aatmnirbhar Bharat. An initiative under the National Digital Health Mission.
            </p>
            <div className="flex items-center gap-2 text-sm text-background/60">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-destructive fill-current" />
              <span>for Bharat by Team SvaShakti</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
