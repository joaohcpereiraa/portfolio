import { assetUrl } from "../utils/assetUrl";

const ASSET_KEYS = new Set([
  "img",
  "icon",
  "image",
  "imageUrl",
  "href",
  "file",
]);

const mapAssetPaths = (value, key = "") => {
  if (Array.isArray(value)) {
    return value.map((item) => mapAssetPaths(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        mapAssetPaths(entryValue, entryKey),
      ]),
    );
  }

  if (
    ASSET_KEYS.has(key) &&
    typeof value === "string" &&
    value.startsWith("/")
  ) {
    return assetUrl(value);
  }

  return value;
};

const navLinks = [
  {
    id: 1,
    name: "Projects",
    type: "finder",
  },
  {
    id: 2,
    name: "About Me",
    type: "about-me",
  },
  {
    id: 3,
    name: "Contact",
    type: "contact",
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
  },
];

const navIcons = [
  {
    id: 1,
    img: "/icons/wifi.svg",
  },
  {
    id: 2,
    img: "/icons/search.svg",
  },
  {
    id: 3,
    img: "/icons/user.svg",
  },
  {
    id: 4,
    img: "/icons/mode.svg",
  },
];

const dockApps = [
  {
    id: "finder",
    name: "Portfolio", // was "Finder"
    icon: "finder.png",
    canOpen: true,
  },
  {
    id: "safari",
    name: "Articles", // was "Safari"
    icon: "safari.png",
    canOpen: true,
  },
  {
    id: "photos",
    name: "Gallery", // was "Photos"
    icon: "photos.png",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contact", // or "Get in touch"
    icon: "contact.png",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Skills", // was "Terminal"
    icon: "terminal.png",
    canOpen: true,
  },
  {
    id: "trash",
    name: "Archive", // was "Trash"
    icon: "trash.png",
    canOpen: false,
  },
];

const blogPosts = [
 
];

const techStack = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "Angular", "Vite"],
  },
  {
    category: "Mobile",
    items: ["Flutter"],
  },
  {
    category: "Styling",
    items: ["Tailwind CSS", "CSS"],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express",
      ".NET Core",
      "Serverless Functions",
      "Spring Boot",
    ],
  },
  {
    category: "Database",
    items: ["MongoDB", "PostgreSQL", "MySQL", "SQL Server"],
  },
  {
    category: "Dev Tools",
    items: ["Git", "GitHub", "Docker", "Atlassian Environment"],
  },
  {
    category: "Cloud And Deployment",
    items: ["AWS", "Vercel"],
  },
];

// Skills organized by stack — one orbit ring per stack, switched via tabs.
// Hovering a logo shows a card with the blurb + where the tech was used.
const skillsOrbit = [
  {
    stack: "Frontend",
    items: [
      {
        name: "React",
        icon: "/icons/tech/react.svg",
        blurb: "JavaScript library for building interactive user interfaces.",
        usedAt:
          "Daily at Its Possible Tech and in personal projects, including this portfolio.",
      },
      {
        name: "Next.js",
        icon: "/icons/tech/nextjs.svg",
        blurb: "React framework with server-side rendering and full-stack features.",
        usedAt:
          "Core framework at Its Possible Tech, powering products like Condomind.",
      },
      {
        name: "Angular",
        icon: "/icons/tech/angular.svg",
        blurb: "TypeScript framework for large-scale web applications.",
        usedAt: "Frontend of the Hospital Management platform built at ISEP.",
      },
      {
        name: "Tailwind CSS",
        icon: "/icons/tech/tailwindcss.svg",
        blurb: "Utility-first CSS framework for building custom designs fast.",
        usedAt: "Styling for Condomind, Traveler and this portfolio.",
      },
      {
        name: "Flutter",
        icon: "/icons/tech/flutter.svg",
        blurb: "Google's UI toolkit for cross-platform mobile apps.",
        usedAt: "Cross-platform mobile apps in academic and personal projects.",
      },
      {
        name: "Vite",
        icon: "/icons/tech/vite.svg",
        blurb: "Fast build tool and dev server for modern web projects.",
        usedAt: "Build tooling for React projects — including this very portfolio.",
      },
    ],
  },
  {
    stack: "Backend",
    items: [
      {
        name: "Node.js",
        icon: "/icons/tech/nodejs.svg",
        blurb: "JavaScript runtime for building backend services and APIs.",
        usedAt: "APIs and services at Its Possible Tech and in the Traveler project.",
      },
      {
        name: "Express",
        icon: "/icons/tech/express.svg",
        blurb: "Minimal Node.js framework for building REST APIs.",
        usedAt: "REST APIs for Traveler and services at Its Possible Tech.",
      },
      {
        name: ".NET Core",
        icon: "/icons/tech/dotnet.svg",
        blurb: "Microsoft's framework for building web APIs and services.",
        usedAt: "Backend micro-services of the Hospital Management platform at ISEP.",
      },
      {
        name: "Spring Boot",
        icon: "/icons/tech/springboot.svg",
        blurb: "Java framework for production-ready backend services.",
        usedAt: "Java backends built during my engineering degree at ISEP.",
      },
    ],
  },
  {
    stack: "Databases",
    items: [
      {
        name: "MongoDB",
        icon: "/icons/tech/mongodb.svg",
        blurb: "NoSQL document database for flexible data models.",
        usedAt: "Data layer in product work at Its Possible Tech and side projects.",
      },
      {
        name: "PostgreSQL",
        icon: "/icons/tech/postgresql.svg",
        blurb: "Advanced open-source relational database.",
        usedAt: "Relational database of choice in product work at Its Possible Tech.",
      },
      {
        name: "MySQL",
        icon: "/icons/tech/mysql.svg",
        blurb: "Popular open-source relational database.",
        usedAt: "Relational databases across academic projects at ISEP.",
      },
    ],
  },
  {
    stack: "Cloud",
    items: [
      {
        name: "AWS",
        icon: "/icons/tech/aws.svg",
        blurb: "Amazon's cloud platform — compute, auth, storage and serverless.",
        usedAt:
          "Maintained serverless infra at Its Possible Tech: Lambda, API Gateway, Cognito, EC2, S3.",
      },
      {
        name: "Vercel",
        icon: "/icons/tech/vercel.svg",
        blurb: "Deployment platform for frontend and serverless apps.",
        usedAt: "Deploying Next.js apps and this portfolio.",
      },
    ],
  },
  {
    stack: "Dev Tools",
    items: [
      {
        name: "Git",
        icon: "/icons/tech/git.svg",
        blurb: "Distributed version control system.",
        usedAt: "Version control on every single project I work on.",
      },
      {
        name: "GitHub",
        icon: "/icons/tech/github.svg",
        blurb: "Platform for hosting code, collaboration and reviews.",
        usedAt: "Home of my code — team workflows at work, ISEP and personal repos.",
      },
      {
        name: "Docker",
        icon: "/icons/tech/docker.svg",
        blurb: "Containers for packaging and shipping applications.",
        usedAt: "Containerizing services in academic and side projects.",
      },
    ],
  },
];

const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#181717",
    link: "https://github.com/joaohcpereiraa",
  },
  {
    id: 2,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#0A66C2",
    link: "https://www.linkedin.com/in/jo%C3%A3o-pereira-9a7296280/",
  },
];

// ─── Landing / hero copy ──────────────────────────────
const profile = {
  name: "João Pereira",
  role: "Full-Stack Developer",
  bio: "Software Engineer graduated from ISEP, currently studying for an MSc in Cybersecurity & System Administration.",
  cta: "Enter my pc",
};

// `image` is a real screenshot; projects without one render a styled cover
// using the `accent` gradient. Stack icons are optional (text-only chip when missing).
const landingProjects = [
  {
    id: 1,
    name: "Condomind",
    tagline: "Condo management SaaS",
    description:
      "A web platform that simplifies condominium management with in-app communication, SIBS payments and an AI assistant for residents and admins.",
    stack: [
      { name: "Next.js", icon: "/icons/tech/nextjs.svg" },
      { name: "Tailwind", icon: "/icons/tech/tailwindcss.svg" },
      { name: "Serverless" },
    ],
    image: "/images/condomind_image.png",
    accent: ["#2563eb", "#7c3aed"],
    link: "https://app.condomind.pt/",
    linkLabel: "Live",
  },
  {
    id: 2,
    name: "Traveler",
    tagline: "AI travel recommendations",
    description:
      "Gives travel agencies AI-driven, personalized recommendations for destinations, stays and activities, plus tools to manage their customers.",
    stack: [
      { name: "Next.js", icon: "/icons/tech/nextjs.svg" },
      { name: "Tailwind", icon: "/icons/tech/tailwindcss.svg" },
      { name: "Node.js", icon: "/icons/tech/nodejs.svg" },
      { name: "Express", icon: "/icons/tech/express.svg" },
    ],
    accent: ["#0ea5e9", "#6366f1"],
    link: "/files/traveler_relatory.pdf",
    linkLabel: "Report",
  },
  {
    id: 3,
    name: "Hospital Management",
    tagline: "Healthcare ops + 3D",
    description:
      "Team-built app for patient records, appointment scheduling and 3D visualization of surgical rooms, on a micro-service architecture.",
    stack: [
      { name: "Angular", icon: "/icons/tech/angular.svg" },
      { name: ".NET Core", icon: "/icons/tech/dotnet.svg" },
      { name: "Node.js", icon: "/icons/tech/nodejs.svg" },
      { name: "Three.js", icon: "/icons/tech/threejs.svg" },
    ],
    accent: ["#10b981", "#0ea5e9"],
    link: "https://github.com/vscosousa/LAPR5_3DC_G15",
    linkLabel: "GitHub",
  },
];

const careerTimeline = [
  {
    id: 1,
    type: "education",
    period: "Sep 2022 — Jun 2025",
    title: "BSc in Informatics Engineering",
    place: "ISEP — Instituto Superior de Engenharia do Porto",
    description:
      "Bachelor's degree in Informatics Engineering, covering software engineering, algorithms, databases and distributed systems.",
  },
  {
    id: 2,
    type: "work",
    period: "Jun 2024 — Aug 2024",
    title: "Software Engineer · Summer Internship",
    place: "INESC TEC",
    description:
      "Built a VR MVP in Unity for loading, manipulating and inspecting 3D models, letting wind-turbine engineers inspect motors and components virtually.",
  },
  {
    id: 3,
    type: "work",
    period: "Feb 2025 — Jun 2025",
    title: "Junior Full-Stack Engineer · Internship",
    place: "Its Possible Tech",
    description:
      "Developed full-stack apps with React, Next.js, Node.js, Express and TypeScript, built REST APIs and shipped LLM-powered features from implementation to deploy.",
  },
  {
    id: 4,
    type: "work",
    period: "Jul 2025 — Jul 2026",
    title: "Junior Full-Stack Software Engineer",
    place: "Its Possible Tech",
    description:
      "Built products end-to-end with React, Next.js, Node.js and TypeScript, maintained AWS serverless infrastructure and integrated payment gateways and AI solutions.",
  },
  {
    id: 5,
    type: "education",
    period: "2025 — 2027 (expected)",
    title: "MSc in Cybersecurity & System Administration",
    place: "ISEP — Instituto Superior de Engenharia do Porto",
    description:
      "Currently deepening my focus on security, networks and systems administration.",
  },
];

const photosLinks = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Library",
  },
  {
    id: 2,
    icon: "/icons/gicon2.svg",
    title: "Memories",
  },
  {
    id: 3,
    icon: "/icons/file.svg",
    title: "Places",
  },
  {
    id: 4,
    icon: "/icons/gicon4.svg",
    title: "People",
  },
  {
    id: 5,
    icon: "/icons/gicon5.svg",
    title: "Favorites",
  },
];

const gallery = [
  {
    id: 1,
    img: "/images/gal1.png",
  },
  {
    id: 2,
    img: "/images/gal2.png",
  },
  {
    id: 3,
    img: "/images/gal3.png",
  },
  {
    id: 4,
    img: "/images/gal4.png",
  },
];

const mappedNavIcons = mapAssetPaths(navIcons);
const mappedLandingProjects = mapAssetPaths(landingProjects);
const mappedSkillsOrbit = mapAssetPaths(skillsOrbit);
const mappedBlogPosts = mapAssetPaths(blogPosts);
const mappedSocials = mapAssetPaths(socials);
const mappedPhotosLinks = mapAssetPaths(photosLinks);
const mappedGallery = mapAssetPaths(gallery);

export {
  navLinks,
  profile,
  mappedLandingProjects as landingProjects,
  careerTimeline,
  mappedNavIcons as navIcons,
  dockApps,
  mappedBlogPosts as blogPosts,
  techStack,
  mappedSkillsOrbit as skillsOrbit,
  mappedSocials as socials,
  mappedPhotosLinks as photosLinks,
  mappedGallery as gallery,
};

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Work",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [
    // ▶ Project 1
    {
      id: 5,
      name: "Condomind Application",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-5", // icon position inside Finder
      windowPosition: "top-[5vh] left-5", // optional: Finder window position
      children: [
        {
          id: 1,
          name: "Condomind_Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "The Condomind is a web app application designed to simplify condo management for residents and administrators alike.",
            "Instead of a simple management tool, it delivers in app communication, payment processing with SIBS, and a Artificial Intelligence assistant to help with common inquiries and tasks.",
            "Think of it like having a personal assistant for your condo management needs.",
            "It's built with Next.js and Tailwind, and the backend is powered by serverless functions.",
          ],
        },
        {
          id: 2,
          name: "condomind.pt",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://app.condomind.pt/",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "condomind.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/condomind_image.png",
        },
      ],
    },

    // ▶ Project 2
    {
      id: 6,
      name: "Traveler Application",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-52 right-80",
      windowPosition: "top-[20vh] left-7",
      children: [
        {
          id: 1,
          name: "Traveler_Application_Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5",
          description: [
            "The Traveler Application is a web app designed to travel agencies to provide personalized travel recommendations to their customers.",
            "Instead of generic travel suggestions, it uses AI to analyze customer preferences and provide tailored recommendations for destinations, accommodations, and activities.",
            "The goal is to personalize the travel planning and at the same time provide efficient tools for the agencies to manage their customers and provide a better service.",
            "It's built with Next.js and Tailwind, and the backend is powered with Node.js/Express.",
          ],
        },
        {
          id: 4,
          name: "traveler-application.png",
          icon: "/images/image.png",
          kind: "file",
          fileType: "img",
          position: "top-36 left-80",
          imageUrl: "/images/traveler_image.png",
        },
        {
          id: 5,
          name: "Relatory.pdf",
          icon: "/images/pdf.png",
          kind: "file",
          fileType: "pdf",
          href: "/files/traveler_relatory.pdf",
          position: "top-60 left-5",
        },
      ],
    },

    // ▶ Project 3
    {
      id: 7,
      name: "Hospital Management App",
      icon: "/images/folder.png",
      kind: "folder",
      position: "top-10 left-80",
      windowPosition: "top-[33vh] left-7",
      children: [
        {
          id: 1,
          name: "Hospital Management App Project.txt",
          icon: "/images/txt.png",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "This project was developed in a team in the context of a university course, where we were tasked with creating a hospital management application.",
            "This application is designed to help hospital staff manage patient information, appointments, and medical records more efficiently.",
            "That includes features like patient registration, appointment scheduling, medical record management, 3D visualization of cirugical rooms etc..",
            "This application was build with Angular for the frontend and the backend was powered with .NET Core, a micro-service with Node.js/Express, and Three.js for the 3D visualization.",
          ],
        },
        {
          id: 2,
          name: "hospital-management-app.com",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://vscosousa.github.io/LAPR5_3DC_G15/",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "Git Repository",
          icon: "/images/safari.png",
          kind: "file",
          fileType: "url",
          href: "https://github.com/vscosousa/LAPR5_3DC_G15",
          position: "top-52 right-80",
        },
      ],
    },
  ],
};

const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "About me",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "me.png",
      icon: "/images/image.png",
      kind: "file",
      fileType: "img",
      position: "top-10 left-5",
      imageUrl: "/images/joao.png",
    },
    {
      id: 4,
      name: "about-me.tfxt",
      icon: "/images/txt.png",
      kind: "file",
      fileType: "txt",
      position: "top-60 left-5",
      subtitle: "Hi, I'm João! 👋",
      image: "/images/joao.png",
      description: [
        "I'm a junior full-stack developer who graduated from the Instituto Superior de Engenharia do Porto (ISEP) with a degree in Computer Engineering.",
        "Over the past year, I've been working at a tech company where I've strengthened my skills in JavaScript, especially TypeScript, and frameworks like Next.js while building modern web applications.",
        "I'm particularly passionate about backend development, but recently I've been exploring more frontend work, focusing on UI/UX and animations, which you can see throughout this portfolio.",
        "Outside of dev work, I enjoy grabbing coffee with friends, spending time with my girlfriend, or relaxing with a good movie or video game.",
      ],
    },
  ],
};

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/images/pdf.png",
      kind: "file",
      fileType: "pdf",
      // you can add `href` if you want to open a hosted resume
      // href: "/your/resume/path.pdf",
    },
  ],
};

const TRASH_LOCATION = {
  id: 4,
  type: "trash",
  name: "Trash",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [],
};

export const locations = mapAssetPaths({
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  trash: TRASH_LOCATION,
});

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
  finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  safari: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  photos: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };
