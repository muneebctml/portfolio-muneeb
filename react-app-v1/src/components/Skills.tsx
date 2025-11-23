import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SkillCategory {
  category: string;
  items: string[];
}

interface SkillsProps {
  data: SkillCategory[];
  tools: string[];
}

export const Skills = ({ data, tools }: SkillsProps) => {
  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Skills & Tools</h2>
          <p className="text-muted-foreground text-lg">Technologies I work with</p>
        </div>

        {/* Skills by Category */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data.map((skillGroup, index) => (
            <Card
              key={skillGroup.category}
              className="bg-card border-border hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="text-xl text-primary">{skillGroup.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tools */}
        <Card className="bg-card border-border animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Tools & Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool) => (
                <Badge
                  key={tool}
                  className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 px-4 py-2 text-sm"
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
