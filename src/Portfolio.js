import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaCode,
  FaEnvelope,
  FaExternalLinkAlt,
  FaLaptopCode,
  FaPhone,
  FaRocket,
} from 'react-icons/fa';
import RealDragonScene from './RealDragonScene';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const skills = [
  'JavaScript',
  'React.js',
  'Node.js',
  'Express.js',
  'MongoDB',
  'MySQL',
  'C++',
  'Bootstrap',
  'REST APIs',
  'Git & GitHub',
];

const experience = [
  {
    role: 'Independent Full Stack Developer',
    company: 'AthletiPath',
    period: 'Jan 2026 - Present',
    points: [
      'Built AthletiPath as a sports-tech platform focused on athlete workflows and team coordination.',
      'Implemented frontend and backend modules using JavaScript and Node.js with iterative product improvements.',
      'Managed architecture, feature planning, deployment readiness, and code quality for continuous releases.',
    ],
    link: 'https://github.com/Sagarwal-bit/athletipath',
  },
  {
    role: 'B.Tech CSE Student Developer',
    company: 'IIIT Manipur',
    period: 'Jun 2023 - Present',
    points: [
      'Built projects in web development and software engineering with C, C++, JavaScript, and modern frontend tools.',
      'Focused on problem-solving, clean implementation, and collaborative development practices.',
    ],
    link: '',
  },
];

const featuredProjects = [
  {
    title: 'AthletiPath',
    description:
      'Sports-focused full stack platform for athlete journey management, team operations, and scalable product features.',
    tech: ['JavaScript', 'React', 'Node.js'],
    url: 'https://github.com/Sagarwal-bit/athletipath',
    thumb: 'https://opengraph.githubassets.com/1/Sagarwal-bit/athletipath',
    kind: 'Flagship',
  },
  {
    title: 'Login Brute Force Detection System',
    description:
      'Cybersecurity-focused project for login protection and suspicious attempt detection with actionable security flows.',
    tech: ['Security', 'Backend', 'JavaScript'],
    url: 'https://github.com/Sagarwal-bit/login-brute-force-detection-system',
    thumb: 'https://opengraph.githubassets.com/1/Sagarwal-bit/login-brute-force-detection-system',
    kind: 'Security',
  },
  {
    title: 'Car Listing App',
    description:
      'Interactive car listing and comparison application using React patterns and API-driven data rendering.',
    tech: ['React', 'Bootstrap', 'APIs'],
    url: 'https://github.com/Sagarwal-bit/car-listing-app',
    thumb: 'https://opengraph.githubassets.com/1/Sagarwal-bit/car-listing-app',
    kind: 'Frontend',
  },
];

export default function Portfolio() {
  const [githubRepos, setGithubRepos] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadGithubRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Sagarwal-bit/repos?per_page=100');
        if (!response.ok) return;

        const data = await response.json();

        const picked = data
          .filter(repo => !repo.fork)
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, 6)
          .map(repo => ({
            name: repo.name,
            url: repo.html_url,
            fullName: repo.full_name,
            language: repo.language || 'Code',
            stars: repo.stargazers_count,
            updated: repo.pushed_at,
            description: repo.description || 'Repository from my GitHub profile.',
          }));

        if (mounted) setGithubRepos(picked);
      } catch (err) {
        // Silent fallback: keep static content available.
      }
    };

    loadGithubRepos();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="portfolio-root">
      <div className="bg-orb bg-orb-a" />
      <div className="bg-orb bg-orb-b" />

      <motion.nav
        className="top-nav"
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <a href="#home" className="brand">
          <span>Vivek</span> Sagarwal
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#github">GitHub</a>
          <a href="#contact">Contact</a>
        </div>
      </motion.nav>

      <main>
        <section id="home" className="fantasy-hero">
          <RealDragonScene className="real-dragon-layer hero-scene" />
          <motion.div
            className="hero-overlay"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="hero-title" variants={fadeUp}>
              Vivek Sagarwal - Full Stack Developer
            </motion.h1>
            <motion.p className="hero-subtitle" variants={fadeUp}>
              Building intelligent web experiences
            </motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <a className="btn btn-solid" href="#projects">
                View Projects <FaArrowRight />
              </a>
            </motion.div>
          </motion.div>
        </section>

        <div className="content-wrap">
        <motion.section
          id="about"
          className="content-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <h2>About Me</h2>
          <p>
            Motivated and enthusiastic B.Tech Computer Science student at IIIT Manipur (2023-2027)
            with a strong foundation in software development and web technologies. Skilled in C,
            C++, JavaScript, HTML/CSS, React.js, and Node.js with a clear focus on practical,
            high-quality implementation.
          </p>
          <motion.div
            className="skills-wrap"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {skills.map(skill => (
              <motion.span key={skill} className="skill-pill" variants={fadeUp}>
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          id="experience"
          className="content-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Work Experience</h2>
          <div className="timeline">
            {experience.map(item => (
              <motion.article
                key={`${item.company}-${item.period}`}
                className="timeline-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
              >
                <div className="timeline-head">
                  <div>
                    <h3>{item.role}</h3>
                    <p>{item.company}</p>
                  </div>
                  <span>{item.period}</span>
                </div>
                <ul>
                  {item.points.map(point => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="inline-link">
                    View Project <FaExternalLinkAlt />
                  </a>
                ) : null}
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="projects"
          className="content-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Featured Projects</h2>
          <div className="project-grid">
            {featuredProjects.map(project => (
              <motion.article
                key={project.title}
                className="project-card"
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 210, damping: 16 }}
              >
                <img
                  src={project.thumb}
                  alt={`${project.title} project preview`}
                  className="project-thumb"
                  loading="lazy"
                />
                <span className="project-kind">{project.kind}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tech.map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <a href={project.url} target="_blank" rel="noreferrer" className="inline-link">
                  Open Repository <FaExternalLinkAlt />
                </a>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="github"
          className="content-section"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <h2>GitHub Highlights</h2>
          <p>
            Latest repositories from{' '}
            <a href="https://github.com/Sagarwal-bit" target="_blank" rel="noreferrer" className="inline-link">
              github.com/Sagarwal-bit <FaExternalLinkAlt />
            </a>
          </p>
          <div className="repo-grid">
            {(githubRepos.length ? githubRepos : featuredProjects.map(item => ({
              name: item.title,
              description: item.description,
              url: item.url,
              language: item.tech[0],
              fullName: item.url.replace('https://github.com/', ''),
              stars: 0,
              updated: new Date().toISOString(),
            }))).map(repo => (
              <motion.article
                key={repo.name}
                className="repo-card"
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              >
                <img
                  src={`https://opengraph.githubassets.com/1/${repo.fullName || repo.url.replace('https://github.com/', '')}`}
                  alt={`${repo.name} repository preview`}
                  className="project-thumb"
                  loading="lazy"
                />
                <h3>{repo.name}</h3>
                <p>{repo.description}</p>
                <div className="repo-meta">
                  <span><FaCode /> {repo.language}</span>
                  <span><FaRocket /> {repo.stars} stars</span>
                </div>
                <a href={repo.url} target="_blank" rel="noreferrer" className="inline-link">
                  View on GitHub <FaExternalLinkAlt />
                </a>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="contact"
          className="content-section contact-panel"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Let&apos;s Build Something Strong</h2>
          <p>Open to software engineering roles, collaboration opportunities, and product work.</p>
          <div className="contact-links">
            <a href="mailto:viveksagarwal22919@gmail.com">
              <FaEnvelope /> viveksagarwal22919@gmail.com
            </a>
            <a href="tel:+919026009103">
              <FaPhone /> +91 9026009103
            </a>
            <a href="https://github.com/Sagarwal-bit" target="_blank" rel="noreferrer">
              <FaLaptopCode /> GitHub Profile
            </a>
          </div>
        </motion.section>
        </div>
      </main>
    </div>
  );
}
