import React from 'react';
import Hero from './Hero';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';
import SEO from './SEO';

const Home = ({ data }) => {
    return (
        <>
            <SEO
                title="Muneeb Ur Rehman | Portfolio"
                description="Welcome to the portfolio of Muneeb Ur Rehman. Explore my projects, experience, and skills."
                keywords="Muneeb Ur Rehman, Portfolio, React Developer, Software Engineer"
            />
            <Hero data={data} />
            <Experience data={data.experience} />
            <Projects data={data.projects} />
            <Contact data={data} />
        </>
    );
};

export default Home;
