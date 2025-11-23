import { Download, Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  data: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    picture: string;
    summary: string;
    cvUrl: string;
    linkedin: string;
    github: string;
  };
}

export const Hero = ({ data }: HeroProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl w-full animate-fade-in">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="flex justify-center md:justify-end animate-slide-in-left">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-2xl opacity-20"></div>
              <img
                src={data.picture}
                alt={data.name}
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-card shadow-2xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 animate-slide-up">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-2 gradient-text">
                {data.name}
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground">
                {data.title}
              </p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {data.summary}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${data.email}`} className="hover:text-primary transition-colors">
                  {data.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${data.phone}`} className="hover:text-primary transition-colors">
                  {data.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{data.location}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground hover-lift">
                <a href={data.cvUrl} download>
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </a>
              </Button>
              <Button asChild variant="outline" className="hover-lift border-primary/50 hover:border-primary">
                <a href={data.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button asChild variant="outline" className="hover-lift border-primary/50 hover:border-primary">
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
