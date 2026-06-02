import type { ResumeData } from "./types";

export interface ResumeStressDataset {
  id: string;
  label: string;
  description: string;
  data: ResumeData;
}

export const STRESS_RESUME_DATASETS: ResumeStressDataset[] = [
  {
    id: "A",
    label: "Experienced long-form resume",
    description: "Experienced resume with long summary, many experience entries, projects, and custom sections.",
    data: {
      fullName: "Isabella Thompson",
      email: "isabella.thompson@example.com",
      phone: "+44 20 7946 0958",
      role: "Lead Product Design Manager",
      address: "London, United Kingdom",
      summary:
        "Design leader with 12+ years of experience delivering digital products across fintech, healthcare, and enterprise SaaS. Expert at scaling design systems, collaborating with cross-functional teams, and turning product strategy into data-driven customer experiences.",
      careerObjective: "",
      education: [
        {
          degree: "M.Sc. Human-Computer Interaction",
          school: "University College London",
          startYear: "2013",
          endYear: "2014",
          gpa: "Distinction",
        },
        {
          degree: "B.A. Graphic Design",
          school: "Goldsmiths, University of London",
          startYear: "2009",
          endYear: "2012",
          gpa: "First Class Honours",
        },
      ],
      experience: [
        {
          role: "Lead Product Design Manager",
          company: "FinTech Edge",
          startDate: "2021",
          endDate: "Present",
          description:
            "Oversee a team of 14 designers and researchers, delivering omnichannel product experiences for retail banking and wealth management. Introduced a modular design system, improved iteration speed by 45%, and aligned product roadmaps across 5 business units.\n\nLed stakeholder workshops, coached senior designers, and defined UX metrics used across the organisation.",
        },
        {
          role: "Senior UX Designer",
          company: "Healthwave Labs",
          startDate: "2018",
          endDate: "2021",
          description:
            "Designed patient-facing mobile and web applications for chronic care management. Partnered with product, engineering, and clinical teams to deliver HIPAA-compliant interfaces that increased active user retention by 28%.\n\nCreated design research plans, personas, and accessibility guidelines for inclusive care journeys.",
        },
        {
          role: "UX Designer",
          company: "Studio Interactive",
          startDate: "2014",
          endDate: "2018",
          description:
            "Delivered digital product experiences for high-growth startups and global brands. Responsibilities included information architecture, interaction design, prototyping, usability testing, and design system governance.\n\nCollaborated with clients to translate business goals into clear product concepts and visual strategy.",
        },
      ],
      skills: [
        "Design Systems",
        "Product Strategy",
        "UX Research",
        "Accessibility",
        "Figma",
        "Prototyping",
        "Stakeholder Alignment",
        "Agile Collaboration",
        "Service Design",
        "Design Operations",
      ],
      projects: [
        {
          name: "Global Launch Experience",
          description:
            "Led the end-to-end design work for a global product launch, coordinating multi-market localization, legal reviews, and cross-team validation. Resulted in a 24% increase in conversion for international users.",
          technologies: ["Figma", "Miro", "UserTesting"],
          link: "https://example.com/global-launch",
        },
        {
          name: "Design System Transformation",
          description:
            "Developed a scalable component library and design tokens system used by product, engineering, and marketing teams. Reduced duplicate work and design inconsistencies across seven products.",
          technologies: ["Storybook", "CSS", "React"],
          link: "",
        },
      ],
      languages: [
        { language: "English", level: "Native" },
        { language: "French", level: "Fluent" },
        { language: "German", level: "Intermediate" },
      ],
      certifications: [
        { name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", year: "2022" },
        { name: "Nielsen Norman Group UX Certification", issuer: "NNG", year: "2020" },
        { name: "Accessibility Professional Certificate", issuer: "Deque", year: "2021" },
      ],
      socialLinks: [
        { platform: "LinkedIn", url: "linkedin.com/in/isabella-thompson" },
        { platform: "Portfolio", url: "isabellathompson.design" },
      ],
      strengths: [
        "Empathy-driven design",
        "Cross-functional leadership",
        "Data-informed decision making",
        "Design mentorship",
      ],
      hobbies: [
        "Landscape photography",
        "Cycling",
        "Creative writing",
      ],
      achievements: [
        "Delivered 3 major product launches within 18 months.",
        "Reduced design debt by 30% through component reuse.",
      ],
      references: [
        "Available on request",
      ],
      customSections: [
        {
          title: "Selected Thought Leadership",
          description:
            "Published articles on design systems, product culture, and accessibility in leading industry publications. Regular speaker at UX conferences and internal design summits.",
          date: "2024",
          items: [
            "Designing for scale in regulated industries",
            "Building design operations for faster delivery",
          ],
        },
      ],
      candidateType: "experienced",
    },
  },
  {
    id: "B",
    label: "Fresher maxed sections",
    description: "Fresher resume with full education, internships, strengths, hobbies, and long personal details.",
    data: {
      fullName: "Aarav Kumar",
      email: "aarav.kumar@example.com",
      phone: "+91 98765 43210",
      role: "Software Engineer (Fresher)",
      address: "Bengaluru, India",
      summary:
        "Recent engineering graduate with strong foundation in full-stack development, machine learning, and cloud architecture. Seeking an entry-level role to contribute to intelligent systems and collaborative product teams.",
      careerObjective: "",
      education: [
        {
          degree: "B.Tech Computer Science",
          school: "Indian Institute of Technology, Delhi",
          startYear: "2019",
          endYear: "2023",
          gpa: "9.3",
        },
        {
          degree: "Higher Secondary Certificate",
          school: "St. Xavier's High School",
          startYear: "2017",
          endYear: "2019",
          gpa: "95%",
        },
      ],
      experience: [
        {
          role: "Software Engineering Intern",
          company: "DataStream Labs",
          startDate: "May 2022",
          endDate: "Aug 2022",
          description:
            "Built RESTful APIs and improved search performance by 35%. Worked on data modeling, automated unit tests, and DevOps pipelines. Collaborated with senior engineers to deliver production-grade features on schedule.",
        },
        {
          role: "Research Intern",
          company: "AI Research Center",
          startDate: "Jun 2021",
          endDate: "Jul 2021",
          description:
            "Implemented and evaluated neural network models for image classification. Presented research outcomes to faculty and contributed to a technical report.",
        },
      ],
      skills: [
        "Python",
        "JavaScript",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "SQL",
        "Docker",
        "Git",
        "TensorFlow",
      ],
      projects: [
        {
          name: "Smart Attendance System",
          description:
            "Developed a face-recognition based attendance system with real-time analytics and reporting. Integrated REST APIs, web dashboard, and error logging.",
          technologies: ["React", "Node.js", "OpenCV", "MongoDB"],
          link: "github.com/aaravkumar/attendance-system",
        },
        {
          name: "Study Planner App",
          description:
            "Built a study planner application that automatically schedules tasks, tracks progress, and sends reminders. Implemented calendar sync and priority tags.",
          technologies: ["TypeScript", "Next.js", "Firebase"],
        },
      ],
      languages: [
        { language: "English", level: "Fluent" },
        { language: "Hindi", level: "Native" },
        { language: "Japanese", level: "Beginner" },
      ],
      certifications: [
        { name: "Google IT Support Professional Certificate", issuer: "Google", year: "2023" },
        { name: "AWS Cloud Practitioner", issuer: "Amazon", year: "2024" },
      ],
      socialLinks: [
        { platform: "LinkedIn", url: "linkedin.com/in/aaravkumar" },
        { platform: "GitHub", url: "github.com/aaravkumar" },
        { platform: "Portfolio", url: "aaravkumar.dev" },
      ],
      strengths: [
        "Analytical thinking",
        "Problem solving",
        "Team collaboration",
        "Learning agility",
      ],
      hobbies: [
        "Competitive programming",
        "Badminton",
        "Blogging",
        "Open source contributions",
      ],
      achievements: [
        "Placed top 5 in national hackathon.",
        "Published a research poster on computer vision.",
        "Volunteered for community coding workshops.",
      ],
      references: [
        "Available on request",
      ],
      customSections: [
        {
          title: "Technical Certifications",
          description: "Completed multiple technical training courses across cloud computing, machine learning, and web development.",
          date: "2024",
          items: [
            "AWS Certified Cloud Practitioner",
            "Deep Learning Specialization",
            "Frontend Development Bootcamp",
          ],
        },
      ],
      candidateType: "fresher",
    },
  },
  {
    id: "C",
    label: "Reference-heavy experienced resume",
    description: "Experienced resume with many short reference items, long contact and custom notes to test wrapping and sidebar density.",
    data: {
      fullName: "Camila López García",
      email: "camila.lopez@example.com",
      phone: "+34 612 345 678",
      role: "Global Account Director",
      address: "Barcelona, Spain",
      summary:
        "Seasoned account leader with a strong track record in SaaS revenue growth, enterprise partnerships, and international channel expansion. Adept at negotiating complex contracts and operating in cross-cultural environments.",
      careerObjective: "",
      education: [
        {
          degree: "MBA",
          school: "ESADE Business School",
          startYear: "2015",
          endYear: "2017",
        },
        {
          degree: "B.A. International Business",
          school: "Universidad de Barcelona",
          startYear: "2010",
          endYear: "2014",
        },
      ],
      experience: [
        {
          role: "Global Account Director",
          company: "CloudBridge Solutions",
          startDate: "2019",
          endDate: "Present",
          description:
            "Owned strategic accounts across EMEA and LATAM, achieving 120% quota attainment. Negotiated multiple multi-year enterprise agreements and drove customer advocacy programs.",
        },
        {
          role: "Senior Account Manager",
          company: "DigitalWave",
          startDate: "2016",
          endDate: "2019",
          description:
            "Managed complex customer relationships and developed cross-sell motion for marketing automation products. Reduced churn by 18% and improved ACV by 30%.",
        },
      ],
      skills: [
        "Sales Strategy",
        "Enterprise SaaS",
        "Customer Success",
        "Contract Negotiation",
        "Revenue Forecasting",
        "Cross-functional Leadership",
        "Spanish",
        "English",
      ],
      projects: [
        {
          name: "European Channel Scaling",
          description:
            "Led the partner program expansion across 12 countries, onboarding 60 new channel partners and creating enablement materials in three languages.",
          technologies: ["Salesforce", "HubSpot", "G Suite"],
        },
        {
          name: "Customer Advocacy Launch",
          description:
            "Built a customer advocacy and reference program that produced case studies and referenceable customers for sales cycles.",
          technologies: ["Airtable", "Notion", "Zoom"],
        },
      ],
      languages: [
        { language: "Spanish", level: "Native" },
        { language: "English", level: "Fluent" },
        { language: "Portuguese", level: "Intermediate" },
      ],
      certifications: [
        { name: "Strategic Account Management", issuer: "Kellogg Executive Education", year: "2022" },
        { name: "Negotiation and Influence", issuer: "Harvard Business School Online", year: "2021" },
      ],
      socialLinks: [
        { platform: "LinkedIn", url: "linkedin.com/in/camilalopezgarcia" },
      ],
      strengths: [
        "Global business development",
        "Executive-level communication",
        "Customer retention",
      ],
      hobbies: [
        "Travel writing",
        "Yoga",
      ],
      achievements: [
        "Recognized as top performer in 2022 and 2023.",
        "Delivered 40% pipeline growth in one year.",
      ],
      references: [
        "John Smith – VP Sales, CloudBridge Solutions",
        "Ana Pereira – Chief Customer Officer, DigitalWave",
        "Roberto Diaz – Senior Partner, Channel Growth Inc.",
      ],
      customSections: [
        {
          title: "Leadership Highlights",
          description:
            "Facilitated executive offsites, designed partner incentive programs, and led mentoring circuits for high-potential talent.",
          date: "2023",
        },
      ],
      candidateType: "experienced",
    },
  },
  {
    id: "D",
    label: "Custom section + long bullets",
    description: "Resume with long custom sections, lengthy bullet lists, and many small detail fields for pagination and overflow testing.",
    data: {
      fullName: "Nikhil Sharma",
      email: "nikhil.sharma@example.com",
      phone: "+91 99887 77665",
      role: "Data Science Consultant",
      address: "Pune, India",
      summary:
        "Data science consultant with strong expertise in model development, data storytelling, and MLOps. Experienced in building analytics platforms, delivering stakeholder-ready dashboards, and mentoring analytics teams.",
      careerObjective: "",
      education: [
        {
          degree: "M.Sc. Data Science",
          school: "Carnegie Mellon University",
          startYear: "2016",
          endYear: "2018",
          gpa: "3.9",
        },
      ],
      experience: [
        {
          role: "Senior Data Scientist",
          company: "InsightAI",
          startDate: "2020",
          endDate: "Present",
          description:
            "Built production-ready machine learning models for demand forecasting, customer segmentation, and automated anomaly detection. Collaborated with data engineering teams to deploy models using Docker, Kubernetes, and AWS SageMaker.\n\nLed model validation exercises, created feature engineering pipelines, and authored technical documentation for reproducible analytics workflows.",
        },
      ],
      skills: [
        "Python",
        "R",
        "SQL",
        "TensorFlow",
        "PyTorch",
        "AWS SageMaker",
        "Docker",
        "Kubernetes",
        "Tableau",
        "Looker",
      ],
      projects: [
        {
          name: "Supply Chain Forecasting Platform",
          description:
            "Designed and deployed a forecasting platform for inventory planning that aligned demand predictions with procurement workflows. Worked closely with supply chain stakeholders to define model accuracy criteria and update cadence.",
          technologies: ["Python", "AWS", "Looker", "Snowflake"],
        },
        {
          name: "Customer Churn Dashboard",
          description:
            "Created a churn prediction dashboard with actionable segments and retention playbooks. Incorporated business KPIs, customer cohort analysis, and explanation metrics for non-technical stakeholders.",
          technologies: ["Tableau", "SQL", "Python"],
        },
      ],
      languages: [
        { language: "English", level: "Fluent" },
      ],
      certifications: [
        { name: "Certified Data Scientist", issuer: "Data Science Council", year: "2022" },
      ],
      socialLinks: [
        { platform: "GitHub", url: "github.com/nikhilsharma" },
      ],
      strengths: [
        "Data storytelling",
        "Model governance",
        "Cross-team collaboration",
      ],
      hobbies: [
        "Open source machine learning", "Writing technical articles", "Trail running"],
      achievements: [
        "Delivered analytics consulting for 15+ clients.",
        "Published three technical white papers on ML explainability.",
      ],
      references: [
        "Available on request",
      ],
      customSections: [
        {
          title: "Publications & Conference Talks",
          description:
            "Presented technical talks at industry conferences covering data ethics, explainable AI, and MLOps best practices. Contributed articles to analytics blogs and research journals.",
          date: "2023",
          items: [
            "Explainable AI frameworks for enterprise teams",
            "Operationalizing machine learning in regulated industries",
            "Building analytics workflows for rapid decision making",
            "Strategies for reproducible data science",
            "Designing customer-centric dashboards",
          ],
        },
      ],
      candidateType: "experienced",
    },
  },
];
