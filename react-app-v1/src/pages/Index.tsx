import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Interests } from "@/components/Interests";
import { Footer } from "@/components/Footer";

interface PortfolioData {
  personalInfo: {
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
  experience: any[];
  education: any[];
  skills: any[];
  tools: string[];
  projects: any[];
  interests: string[];
}

const Index = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load portfolio data from JSON
    fetch("/data/portfolio.json")
      .then((response) => response.json())
      .then((data) => {
        setPortfolioData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading portfolio data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg">Failed to load portfolio data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero data={portfolioData.personalInfo} />
      <Experience data={portfolioData.experience} />
      <Skills data={portfolioData.skills} tools={portfolioData.tools} />
      <Projects data={portfolioData.projects} />
      <Education data={portfolioData.education} />
      <Interests data={portfolioData.interests} />
      <Footer data={portfolioData.personalInfo} />
    </div>
  );
};

export default Index;
