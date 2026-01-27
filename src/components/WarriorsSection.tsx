import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Award, 
  Users, 
  MapPin, 
  Star,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    icon: Award,
    title: "Certified Training",
    description: "Complete gamified first-aid training modules and get certified",
  },
  {
    icon: Users,
    title: "Community Impact",
    description: "Save lives in your locality and build trust within your community",
  },
  {
    icon: MapPin,
    title: "Flexible Service",
    description: "Respond to emergencies near you, on your schedule",
  },
  {
    icon: Star,
    title: "Recognition & Rewards",
    description: "Earn badges, ratings, and incentives for your service",
  },
];

const testimonials = [
  {
    name: "Ravi Kumar",
    location: "Varanasi, UP",
    avatar: "RK",
    rating: 4.9,
    missions: 127,
    quote: "Being a Health Warrior gives me purpose. I've helped save 3 lives in the past month alone.",
  },
  {
    name: "Priya Sharma",
    location: "Indore, MP",
    avatar: "PS",
    rating: 4.8,
    missions: 89,
    quote: "The training was excellent. Now I feel confident responding to emergencies in my village.",
  },
];

const WarriorsSection = () => {
  return (
    <section id="warriors" className="py-10 md:py-16 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-secondary rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-medium mb-4 border border-secondary/30">
              Join the Movement
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Become a <span className="text-secondary">Health Warrior</span>
            </h2>
            <p className="text-base text-primary-foreground/80 mb-6">
              Join 10,000+ certified first-responders across India.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {benefits.slice(0, 2).map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-3 border border-primary-foreground/20"
                >
                  <benefit.icon className="h-6 w-6 text-secondary mb-2" />
                  <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                  <p className="text-xs text-primary-foreground/70 line-clamp-2">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/warrior-registration">
                <Button variant="secondary" size="default" className="gap-2">
                  Register as Warrior
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/warrior-registration?tab=map">
                <Button variant="heroOutline" size="default">
                  Find Warriors Near You
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right - Single Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-5 bg-card text-card-foreground">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-base font-bold text-primary-foreground">
                    {testimonials[0].avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{testimonials[0].name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {testimonials[0].location}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-warning">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-sm font-medium">{testimonials[0].rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic mb-3">
                "{testimonials[0].quote}"
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-success" />
                <span>{testimonials[0].missions} missions completed</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WarriorsSection;
