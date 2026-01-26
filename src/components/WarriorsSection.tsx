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
    <section id="warriors" className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-medium mb-6 border border-secondary/30">
              Join the Movement
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Become a <span className="text-secondary">Health Warrior</span>
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Join 10,000+ certified first-responders across India. Be the first line of defense 
              in your community during medical emergencies.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20"
                >
                  <benefit.icon className="h-8 w-8 text-secondary mb-3" />
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-primary-foreground/70">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/warrior-registration">
                <Button variant="secondary" size="lg" className="gap-2">
                  Register as Warrior
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/warrior-registration?tab=map">
                <Button variant="heroOutline" size="lg">
                  Find Warriors Near You
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right - Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold mb-2">Our Warriors Speak</h3>
              <p className="text-primary-foreground/70">
                Real stories from real heroes in the field
              </p>
            </div>

            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="p-6 bg-card text-card-foreground">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary-foreground">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-medium">{testimonial.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>{testimonial.missions} missions completed</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WarriorsSection;
