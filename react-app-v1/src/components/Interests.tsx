import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

interface InterestsProps {
  data: string[];
}

export const Interests = ({ data }: InterestsProps) => {
  return (
    <section id="interests" className="py-20 px-4 bg-section-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Interests</h2>
          <p className="text-muted-foreground text-lg">What I'm passionate about</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {data.map((interest, index) => (
            <Card
              key={interest}
              className="bg-card border-border p-6 text-center hover-lift cursor-default animate-slide-up group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Heart className="w-8 h-8 mx-auto mb-3 text-primary group-hover:fill-primary transition-all" />
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {interest}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
