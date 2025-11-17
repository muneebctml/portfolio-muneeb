import { Github, Linkedin, Mail } from "lucide-react";

interface FooterProps {
  data: {
    name: string;
    email: string;
    github: string;
    linkedin: string;
  };
}

export const Footer = ({ data }: FooterProps) => {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold gradient-text">{data.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={`mailto:${data.email}`}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
