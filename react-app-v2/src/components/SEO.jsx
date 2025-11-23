import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, name, type }) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />

            {/* End standard metadata tags */}

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {/* End Facebook tags */}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {/* End Twitter tags */}
        </Helmet>
    );
};

SEO.defaultProps = {
    title: 'Muneeb Ur Rehman - Portfolio',
    description: 'Portfolio of Muneeb Ur Rehman, a Software Engineer specializing in React and Web Development.',
    keywords: 'Muneeb Ur Rehman, Portfolio, Software Engineer, React, Web Developer, JavaScript',
    name: 'Muneeb Ur Rehman',
    type: 'website'
};

export default SEO;
