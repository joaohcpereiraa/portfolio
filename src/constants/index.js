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
const mappedBlogPosts = mapAssetPaths(blogPosts);
const mappedSocials = mapAssetPaths(socials);
const mappedPhotosLinks = mapAssetPaths(photosLinks);
const mappedGallery = mapAssetPaths(gallery);

export {
  navLinks,
  mappedNavIcons as navIcons,
  dockApps,
  mappedBlogPosts as blogPosts,
  techStack,
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
