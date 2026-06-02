/**
 * PHASE 6 & 7: STRESS TEST DATASETS & A4 SAFETY + PDF PARITY VALIDATION
 * 
 * This module creates 4 comprehensive stress-test resume datasets:
 * - Dataset A: Normal resume
 * - Dataset B: Long contact info (stress-test sidebar widths)
 * - Dataset C: Many skills/certifications (stress-test vertical space)
 * - Dataset D: Long experience history (stress-test page breaks)
 */

export const STRESS_TEST_DATASETS = {
  A_Normal: {
    name: "Dataset A: Normal Resume",
    description: "Standard resume with typical content lengths",
    data: {
      candidateType: "experienced",
      fullName: "Alexander Johnson",
      role: "Senior Software Engineer",
      email: "alexander.johnson@example.com",
      phone: "+1 (555) 123-4567",
      address: "San Francisco, CA 94102",
      summary:
        "Experienced full-stack engineer with 8+ years delivering scalable web applications. Expertise in cloud architecture, microservices, and team leadership.",
      socialLinks: [
        { platform: "LinkedIn", url: "linkedin.com/in/alexjohnson" },
        { platform: "GitHub", url: "github.com/alexjohnson" },
      ],
      experience: [
        {
          role: "Senior Software Engineer",
          company: "Tech Solutions Inc.",
          startDate: "Jan 2022",
          endDate: "Present",
          description:
            "Led team of 5 engineers building microservices architecture. Improved API response time by 40%. Mentored junior developers.",
        },
        {
          role: "Full Stack Developer",
          company: "Digital Ventures",
          startDate: "Jun 2019",
          endDate: "Dec 2021",
          description:
            "Developed React frontend and Node.js backend for SaaS platform. Implemented database optimization reducing queries by 60%.",
        },
        {
          role: "Junior Developer",
          company: "StartUp Labs",
          startDate: "Jan 2018",
          endDate: "May 2019",
          description: "Built REST APIs and web components. Maintained codebase with 95% test coverage.",
        },
      ],
      education: [
        {
          institution: "State University",
          degree: "B.S. Computer Science",
          graduationDate: "2017",
        },
      ],
      skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
      certifications: [
        { name: "AWS Solutions Architect", year: "2021" },
        { name: "Google Cloud Associate", year: "2020" },
      ],
      projects: [
        {
          name: "E-Commerce Platform",
          description: "Full-stack marketplace with payment integration. 10k+ monthly users.",
        },
      ],
    },
  },

  B_LongContact: {
    name: "Dataset B: Long Contact Info (Sidebar Stress)",
    description: "Tests sidebar width constraints with extended contact info",
    data: {
      candidateType: "experienced",
      fullName: "Alexander Fitzgerald Hamilton-Johnson-Smith",
      role: "Senior Full-Stack Software Engineer & Technical Lead",
      email: "alexander.fitzgerald.hamilton.johnson@technology-solutions.example.com",
      phone: "+1 (555) 123-4567 ext. 89012",
      address:
        "San Francisco, CA 94102, United States of America",
      summary:
        "Highly experienced full-stack engineer with comprehensive expertise in cloud architecture, microservices patterns, and distributed systems design.",
      socialLinks: [
        { platform: "LinkedIn", url: "linkedin.com/in/alexander-fitzgerald-hamilton-johnson" },
        { platform: "GitHub", url: "github.com/alexander-fitzgerald-hamilton-johnson" },
        { platform: "Portfolio", url: "alexander-fitzgerald.dev" },
        { platform: "Twitter", url: "twitter.com/alexfitz_dev" },
      ],
      experience: [
        {
          role: "Senior Software Engineer & Technical Architect",
          company: "Enterprise Technology Solutions Corporation Inc.",
          startDate: "January 2022",
          endDate: "Present",
          description:
            "Led cross-functional team of 5 senior engineers designing and implementing complex microservices architecture. Achieved 40% improvement in API response time.",
        },
      ],
      education: [
        {
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science in Computer Science",
          graduationDate: "2017",
        },
      ],
      skills: ["JavaScript", "TypeScript", "React", "Vue.js", "Angular"],
      certifications: [
        { name: "AWS Solutions Architect Professional", year: "2021" },
      ],
    },
  },

  C_ManySkills: {
    name: "Dataset C: Many Skills & Certifications (Vertical Stress)",
    description: "Tests vertical space constraints with 20 skills and 10 certifications",
    data: {
      candidateType: "experienced",
      fullName: "Jordan Williams",
      role: "Full Stack Engineer",
      email: "jordan.williams@example.com",
      phone: "+1 (555) 234-5678",
      address: "New York, NY 10001",
      summary:
        "Versatile engineer experienced across multiple tech stacks and platforms.",
      skills: [
        "JavaScript",
        "TypeScript",
        "React",
        "Vue.js",
        "Angular",
        "Node.js",
        "Python",
        "Java",
        "Go",
        "Rust",
        "SQL",
        "MongoDB",
        "PostgreSQL",
        "Redis",
        "GraphQL",
        "REST APIs",
        "AWS",
        "Google Cloud",
        "Docker",
        "Kubernetes",
      ],
      certifications: [
        { name: "AWS Solutions Architect", year: "2021" },
        { name: "AWS Developer Associate", year: "2020" },
        { name: "Google Cloud Associate", year: "2020" },
        { name: "Kubernetes Administrator", year: "2021" },
        { name: "Docker Certified Associate", year: "2020" },
        { name: "HashiCorp Certified: Terraform Associate", year: "2021" },
        { name: "Oracle Java Programmer", year: "2019" },
        { name: "Microsoft Azure Developer", year: "2020" },
        { name: "Scrum Master Certified", year: "2019" },
        { name: "Agile Release Train Engineer", year: "2021" },
      ],
      projects: [
        { name: "Project 1", description: "Description 1" },
        { name: "Project 2", description: "Description 2" },
        { name: "Project 3", description: "Description 3" },
        { name: "Project 4", description: "Description 4" },
        { name: "Project 5", description: "Description 5" },
      ],
      languages: [
        { language: "English", proficiency: "Native" },
        { language: "Spanish", proficiency: "Fluent" },
        { language: "French", proficiency: "Intermediate" },
        { language: "Mandarin", proficiency: "Beginner" },
      ],
      experience: [
        {
          role: "Senior Engineer",
          company: "Company A",
          startDate: "2020",
          endDate: "Present",
          description: "Led platform architecture initiatives",
        },
      ],
      education: [
        {
          institution: "University",
          degree: "B.S. Computer Science",
          graduationDate: "2016",
        },
      ],
    },
  },

  D_LongExperience: {
    name: "Dataset D: 10 Years Experience (Page Break Stress)",
    description: "Tests page break handling with 10 years of detailed work history",
    data: {
      candidateType: "experienced",
      fullName: "Michael Chen",
      role: "Engineering Director",
      email: "michael.chen@example.com",
      phone: "+1 (555) 345-6789",
      address: "Seattle, WA 98101",
      summary:
        "Director-level engineering leader with 15+ years building and scaling technology teams. Deep expertise in startup growth, architectural decisions, and technical mentorship.",
      socialLinks: [
        { platform: "LinkedIn", url: "linkedin.com/in/michaelchen" },
        { platform: "GitHub", url: "github.com/michaelchen" },
      ],
      experience: [
        {
          role: "Engineering Director",
          company: "Cloud Tech Innovations",
          startDate: "Aug 2022",
          endDate: "Present",
          description:
            "Director of 20+ engineers across 3 teams. Responsible for infrastructure, platform services, and DevOps. Reduced deployment time by 70% through CI/CD improvements. Implemented automated testing strategy achieving 85% code coverage.",
        },
        {
          role: "Senior Engineering Manager",
          company: "NextGen Systems",
          startDate: "Jan 2020",
          endDate: "Jul 2022",
          description:
            "Managed 12 engineers across backend and data teams. Architected event-driven microservices processing 1M+ events daily. Mentored 5 engineers promoted to senior positions.",
        },
        {
          role: "Tech Lead, Backend Services",
          company: "Digital Platforms Corp",
          startDate: "Jun 2017",
          endDate: "Dec 2019",
          description:
            "Led 8-person backend team. Designed and implemented service mesh infrastructure. Achieved 99.95% uptime SLA. Reduced database query latency by 50%.",
        },
        {
          role: "Senior Software Engineer",
          company: "StartUp Ventures",
          startDate: "Mar 2015",
          endDate: "May 2017",
          description:
            "Early employee at scaling startup. Built core payment processing system handling $50M+ annual volume. Designed database schema for 10M+ user platform.",
        },
        {
          role: "Software Engineer II",
          company: "Enterprise Tech Solutions",
          startDate: "Sep 2013",
          endDate: "Feb 2015",
          description:
            "Developed distributed caching system serving 100k requests/sec. Implemented monitoring and alerting infrastructure. Reduced production incidents by 60%.",
        },
        {
          role: "Software Engineer",
          company: "Web Services Inc.",
          startDate: "Jun 2012",
          endDate: "Aug 2013",
          description:
            "Built REST APIs and web services. Implemented security best practices. Contributed to open-source projects.",
        },
        {
          role: "Junior Developer",
          company: "Tech Startup A",
          startDate: "Jan 2011",
          endDate: "May 2012",
          description:
            "First professional role. Learned full development lifecycle. Built customer-facing features in Ruby on Rails.",
        },
      ],
      education: [
        {
          institution: "University of Washington",
          degree: "B.S. Computer Science",
          graduationDate: "2010",
        },
      ],
      skills: ["JavaScript", "Node.js", "Python", "Go", "Java", "AWS", "Kubernetes", "PostgreSQL"],
      certifications: [
        { name: "AWS Solutions Architect Professional", year: "2022" },
        { name: "Certified Kubernetes Administrator", year: "2021" },
      ],
      achievements: [
        "Led 15+ engineers at scale",
        "Designed systems handling 1M+ daily events",
        "Mentored 10+ engineers to senior/staff positions",
        "Reduced infrastructure costs by 40%",
      ],
    },
  },
};

/**
 * A4 SAFETY CONSTRAINTS
 */
export const A4_CONSTRAINTS = {
  width: 794, // pixels
  height: 1123, // pixels
  minMargin: 18, // pixels
  safeWidth: 794 - 18 * 2, // 758px
  safeHeight: 1123 - 18 * 2, // 1087px
};

/**
 * VALIDATION RULES FOR A4 SAFETY
 */
export const VALIDATION_RULES = {
  NO_CLIPPING: "Content must not extend beyond page width",
  NO_OVERFLOW: "No scrollable content should exist",
  NO_HIDDEN_CONTENT: "All content must be visible (no display: none or visibility: hidden during render)",
  NO_OVERLAPPING: "No text or elements should overlap",
  NO_UNEXPECTED_BREAKS: "Page breaks should occur only at section boundaries",
  A4_COMPLIANT: "All content must fit within 794x1123px dimensions",
  SIDEBAR_MIN_WIDTH: "Sidebar width must be >= 220px",
};

/**
 * TEMPLATE CLASSIFICATIONS FOR TARGETED TESTING
 */
export const TEMPLATE_CLASSIFICATIONS = {
  SIDEBAR_TEMPLATES: [2, 4, 5, 6, 11, 15],
  TWO_COLUMN_HEADERS: [3, 12],
  SINGLE_COLUMN: [1, 7, 8, 9, 10, 13, 14],
};
