import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  gpa?: string;
  highlights: string[];
}

interface EducationProps {
  data: EducationItem[];
}

export const Education = ({ data }: EducationProps) => {
  return (
    <section id="education" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Education</h2>
          <p className="text-muted-foreground text-lg">Academic background</p>
        </div>

        <div className="space-y-6">
          {data.map((edu, index) => (
            <Card
              key={edu.id}
              className="bg-card border-border hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      {edu.degree}
                    </CardTitle>
                    <p className="text-lg text-primary font-semibold">{edu.institution}</p>
                    <p className="text-muted-foreground">{edu.location}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-muted-foreground font-medium">
                      Class of {edu.graduationYear}
                    </span>
                    {edu.gpa && (
                      <span className="text-sm text-muted-foreground">GPA: {edu.gpa}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {edu.highlights.map((highlight, idx) => (
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
