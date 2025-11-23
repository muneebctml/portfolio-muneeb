import { Briefcase, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  highlights: string[];
}

interface ExperienceProps {
  data: ExperienceItem[];
}

export const Experience = ({ data }: ExperienceProps) => {
  const formatDate = (date: string | null, current: boolean) => {
    if (current) return "Present";
    if (!date) return "";
    const [year, month] = date.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section id="experience" className="py-20 px-4 bg-section-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Experience</h2>
          <p className="text-muted-foreground text-lg">My professional journey</p>
        </div>

        <div className="space-y-8">
          {data.map((exp, index) => (
            <Card
              key={exp.id}
              className="bg-card border-border hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      {exp.title}
                    </CardTitle>
                    <p className="text-lg text-primary font-semibold">{exp.company}</p>
                    <p className="text-muted-foreground">{exp.location}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(exp.startDate, false)} - {formatDate(exp.endDate, exp.current)}
                    </span>
                    {exp.current && (
                      <Badge className="bg-primary text-primary-foreground">Current</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{exp.description}</p>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">▸</span>
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
