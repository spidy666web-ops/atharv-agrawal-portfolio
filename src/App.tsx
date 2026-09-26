import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Globe,
  ArrowRight,
  ArrowUpRight,
  Linkedin,
  Mail,
  FileText,
  Send,
  CheckCircle2,
  X,
  MapPin,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  Copy,
  User,
  Sparkles,
  Eye,
  AlertCircle,
  Lock,
  Unlock,
  ShieldCheck,
  School,
  Database,
  Inbox,
  Download
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  setLogLevel
} from 'firebase/firestore';

// Environment variable and configuration resolution
declare const __firebase_config: string | undefined;
declare const __app_id: string | undefined;
declare const __initial_auth_token: string | undefined;

let db: any = null;
let auth: any = null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'atharv-portfolio';

// Local storage fallback helpers so leads are never lost offline
const LOCAL_STORAGE_LEADS_KEY = 'atharv_portfolio_leads';

const loadLocalLeads = (): LeadSubmission[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalLeads = (data: LeadSubmission[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(data));
  } catch {}
};

// Safe Firebase Initialization
try {
  let resolvedConfig: any = null;

  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    resolvedConfig = JSON.parse(__firebase_config);
  } else if (
    typeof import.meta !== 'undefined' &&
    (import.meta as any).env?.VITE_FIREBASE_CONFIG
  ) {
    resolvedConfig = JSON.parse((import.meta as any).env.VITE_FIREBASE_CONFIG);
  }

  if (resolvedConfig) {
    setLogLevel('silent');
    const app = initializeApp(resolvedConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch {
  // Graceful offline fallback
}

// Background lead dispatch helper via FormSubmit
async function notifyEmailDirectly(payload: {
  type: string;
  email: string;
  name?: string;
  message?: string;
}) {
  try {
    await fetch('https://formsubmit.co/ajax/agrawalatharv0018@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        _subject: `New Portfolio Lead [${payload.type}] from ${payload.email}`,
        Activity: payload.type,
        Email: payload.email,
        Name: payload.name || 'Anonymous Visitor',
        Details: payload.message || 'No additional note provided',
        Date_Submitted: new Date().toLocaleString()
      })
    });
  } catch (e) {
    // Non-blocking background notification
  }
}

const CANDIDATE_NAME = 'Atharv Agrawal';
const CANDIDATE_PHONE = '+61 413 322 178';
const LINKEDIN_URL = 'https://www.linkedin.com/in/atharv-a-178370370/';
const PROFESSIONAL_EMAIL = 'agrawalatharv0018@gmail.com';
const PROFILE_IMAGE_URL = '/3A21891E-C418-486D-909E-74F4A4E04CB9.jpg';

export interface LeadSubmission {
  id?: string;
  type: 'CV Unlock' | 'Connect Newsletter' | 'Direct Message';
  email: string;
  name?: string;
  message?: string;
  timestamp: string;
  createdAt: number;
}

type ExperienceCategory =
  | 'ALL'
  | 'BUSINESS'
  | 'LEADERSHIP'
  | 'COMMUNICATION'
  | 'GLOBAL / CULTURAL'
  | 'COMMUNITY'
  | 'CREATIVE'
  | 'SUSTAINABILITY'
  | 'PERSONAL DEVELOPMENT'
  | 'UNIVERSITY';

interface ExperienceItem {
  id: string;
  title: string;
  organisation?: string;
  dates: string;
  location: string;
  category: ExperienceCategory;
  categoryLabel: string;
  hook: string;
  description: string;
  skills: string[];
  featured?: boolean;
  highlightStat?: string;
  hasMedia?: boolean;
  mediaNote?: string;
}

interface ProjectEvidence {
  label: string;
  type: 'presentation' | 'report' | 'video' | 'artefact';
  url?: string;
  status: 'Available' | 'Pending Approval / Attachment';
}

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  problemContext: string;
  objective: string;
  myApproach: string[];
  myContribution: string;
  keyFindingsOutcome: string;
  skillsDemonstrated: string[];
  finalArtefact: string;
  reflection: string;
  videoUrl?: string;
  evidenceItems: ProjectEvidence[];
}

interface InsightArticle {
  id: string;
  number: string;
  title: string;
  tag: string;
  status: 'Draft / Outline' | 'Published';
  summary: string;
  outlinePoints: string[];
}

const EXPERIENCES_DATA: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Committee Member — Business Student Association',
    organisation: 'RMIT Business Student Association',
    dates: 'Aug 2026 – Present',
    location: 'Melbourne, Australia',
    category: 'UNIVERSITY',
    categoryLabel: '🏫 UNIVERSITY',
    hook: '🏫 My first step into professional involvement at RMIT.',
    description:
      'I joined the RMIT Business Student Association to become more involved in the university business community and connect with other students who are interested in business. It is giving me an opportunity to develop my communication, collaboration and professional networking skills while contributing to the student community.',
    skills: ['Student Engagement', 'Collaboration', 'Communication', 'Networking'],
    featured: true
  },
  {
    id: 'exp-2',
    title: 'Business Operations Experience — Family Restaurant',
    organisation: 'Mid Flight Garden Restaurant & Cafe',
    dates: 'May 2025 – Jun 2026',
    location: 'Indore, India',
    category: 'BUSINESS',
    categoryLabel: '🏢 BUSINESS',
    hook: '🏢 My first real exposure to a working business.',
    description:
      'While I was still in high school, I worked alongside my family in our restaurant and got to experience what running a business actually looks like day to day. I was involved in areas including customer service, inventory and restaurant operations, and I also contributed ideas around the menu. This experience helped me understand that even small decisions around customers, stock and operations can have a direct impact on a business.',
    skills: ['Customer Service', 'Inventory', 'Operations', 'Problem Solving'],
    featured: true,
    hasMedia: true,
    mediaNote: 'View Detailed Restaurant Case Study'
  },
  {
    id: 'exp-3',
    title: 'Secretary — Forge Model United Nations',
    organisation: 'Forge Model United Nations',
    dates: 'Dec 2025 – Jun 2026',
    location: 'India',
    category: 'LEADERSHIP',
    categoryLabel: '🎓 LEADERSHIP',
    hook: '🚀 I wanted to understand what happens behind the scenes when an idea becomes a real event.',
    description:
      'As Secretary of Forge Model United Nations, I worked behind the scenes with the core team to help turn the idea for the conference into a real event. I contributed to communications, delegate registration, logistics and sponsorship outreach. The experience taught me how much coordination and attention to detail is required before an event is ready for its audience.',
    skills: ['Leadership', 'Coordination', 'Communication', 'Logistics'],
    featured: true
  },
  {
    id: 'exp-4',
    title: 'Peer Advisor — Freax',
    organisation: 'Freax',
    dates: 'Aug 2025 – Jun 2026',
    location: 'Global / Hybrid',
    category: 'COMMUNICATION',
    categoryLabel: '🧠 MENTORING',
    hook: '🧠 One of my first experiences helping other students learn.',
    description:
      'As a Peer Advisor at Freax, I supported fellow students by helping them understand psychology-related concepts and develop their skills. I enjoyed making learning feel more approachable and supporting people as they worked through ideas that initially seemed difficult.',
    skills: ['Mentoring', 'Communication', 'Teaching', 'Empathy'],
    featured: true
  },
  {
    id: 'exp-5',
    title: 'Quiz Club President — Delhi Public School Indore',
    organisation: 'Delhi Public School Indore',
    dates: 'Jun 2025 – Feb 2026',
    location: 'Indore, India',
    category: 'LEADERSHIP',
    categoryLabel: '🎓 LEADERSHIP',
    hook: '🧠 I discovered that leadership can start with something as simple as curiosity.',
    description:
      'As President of the Quiz Club at Delhi Public School Indore, I helped create a stronger culture of curiosity and collaborative learning. I worked on organising quiz activities, encouraging participation and representing the club in inter-school competitions. The role pushed me to become more organised and confident while working with other students.',
    skills: ['Leadership', 'Communication', 'Event Planning', 'Teamwork'],
    featured: true
  },
  {
    id: 'exp-6',
    title: 'Event Host & Quiz Master — Spectacle Spectrum 2025',
    organisation: 'Spectacle Spectrum 2025',
    dates: 'Nov 2025',
    location: 'Phoenix Citadel Mall, Indore',
    category: 'COMMUNICATION',
    categoryLabel: '🎤 COMMUNICATION',
    hook: '🎤 One of my biggest lessons in public speaking came from a live stage.',
    description:
      'I had the opportunity to host and lead the quiz segment of Spectacle Spectrum 2025, a large school cultural event. I worked in a live environment where I had to keep the audience engaged, manage the flow of the quiz and communicate confidently on stage.',
    skills: ['Public Speaking', 'Event Hosting', 'Crowd Engagement', 'Communication'],
    highlightStat: '500+ attendees',
    featured: false
  },
  {
    id: 'exp-7',
    title: 'Game Show Judge & Quiz Host',
    organisation: 'School Showcase Initiative',
    dates: 'Aug 2025 – Sep 2025',
    location: 'Indore, India',
    category: 'COMMUNICATION',
    categoryLabel: '🎯 FACILITATION',
    hook: '🎯 I learned how much preparation goes into making an event feel effortless.',
    description:
      'I hosted and judged a school game-show-style quiz for parents, creating questions and managing the game’s timers, scoring and lifelines. It gave me another opportunity to practise public speaking while learning how to keep an audience engaged and make an event enjoyable.',
    skills: ['Public Speaking', 'Event Facilitation', 'Communication', 'Event Design'],
    featured: false
  },
  {
    id: 'exp-8',
    title: 'Vice Chairperson — DPSiMUN',
    organisation: 'DPSiMUN (DISEC Committee)',
    dates: 'Jul 2025 – Aug 2025',
    location: 'India',
    category: 'LEADERSHIP',
    categoryLabel: '🌍 DIPLOMACY',
    hook: '🌍 This was one of my first experiences managing different perspectives in a high-pressure environment.',
    description:
      'As Vice Chairperson of the DISEC Committee at DPSiMUN, I helped guide delegates through debates and discussions on global security issues. The experience challenged me to stay neutral, manage different perspectives and keep discussions structured while maintaining an engaging environment.',
    skills: ['Diplomacy', 'Public Speaking', 'Leadership', 'Conflict Resolution'],
    featured: true
  },
  {
    id: 'exp-9',
    title: 'Deputy Director — Social Service Club',
    organisation: 'DPS Social Service Club',
    dates: 'Jun 2024 – Aug 2025',
    location: 'India',
    category: 'COMMUNITY',
    categoryLabel: '🤝 COMMUNITY',
    hook: '🤝 An experience that showed me the value of contributing beyond the classroom.',
    description:
      'I worked with the school’s Social Service Club and took part in social service activities. The experience gave me an opportunity to work with others outside the classroom and understand the importance of contributing to the wider community.',
    skills: ['Teamwork', 'Social Service', 'Event Planning', 'Collaboration'],
    featured: false
  },
  {
    id: 'exp-10',
    title: 'Diploma in Guitar Performance & Music Theory',
    organisation: 'Sapt Swar Music and Dance Academy',
    dates: 'Feb 2024 – Feb 2026',
    location: 'Indore, India',
    category: 'PERSONAL DEVELOPMENT',
    categoryLabel: '🎸 PERSONAL DEVELOPMENT',
    hook: '🎸 Two years of music taught me more about discipline than I expected.',
    description:
      'I completed a structured two-year program in guitar performance and music theory. Along the way, I developed my understanding of chords, scales, improvisation and composition while performing both individually and with others. More importantly, it taught me patience, consistency and confidence through long-term practice.',
    skills: ['Discipline', 'Creativity', 'Performance', 'Teamwork'],
    featured: false
  },
  {
    id: 'exp-11',
    title: 'AFS Japanese Language Exchange Program',
    organisation: 'AFS Intercultural Programs India',
    dates: 'Mar 2025 – Dec 2025',
    location: 'Hybrid',
    category: 'GLOBAL / CULTURAL',
    categoryLabel: '🌏 GLOBAL / CULTURAL',
    hook: '🇯🇵 A chance to step outside my own culture and learn how differently people see the world.',
    description:
      'I was selected as one of the top 30 students from the DPS school network for a fully funded AFS Japanese Language Exchange Program. Through the program, I developed my Japanese language skills while learning about Japanese culture and connecting with students from different backgrounds. It strengthened my interest in cross-cultural communication and global perspectives.',
    skills: ['Cross-Cultural Communication', 'Japanese Language', 'Global Perspective', 'Teamwork'],
    highlightStat: 'Top 30 Selection',
    featured: false
  },
  {
    id: 'exp-12',
    title: 'GSP Auditor — Green Schools Programme',
    organisation: 'Centre for Science and Environment',
    dates: 'Oct 2024 – Oct 2025',
    location: 'Indore, India',
    category: 'SUSTAINABILITY',
    categoryLabel: '🌱 SUSTAINABILITY',
    hook: '🌱 One of my earliest experiences looking at how organisations can become more sustainable.',
    description:
      'As a Class 11 student, I participated in the Green Schools Programme and contributed to environmental auditing and resource-efficiency analysis. The experience introduced me to sustainability from a practical perspective and made me more aware of how organisations can evaluate the way they use resources.',
    skills: ['Sustainability', 'Research', 'Analysis', 'Environmental Awareness'],
    featured: false
  },
  {
    id: 'exp-13',
    title: 'Event Coordinator — Halocon',
    organisation: 'Halocon Annual Showcase',
    dates: 'Jun 2025 – Aug 2025',
    location: 'Indore, India',
    category: 'LEADERSHIP',
    categoryLabel: '⚡ COORDINATION',
    hook: '⚡ I got to see how much coordination is required to make a school event run smoothly.',
    description:
      'I coordinated the quiz segment of Halocon, helping manage logistics, participants and the overall flow of the activity. Working with the team taught me how to stay organised while dealing with multiple moving parts during a live event.',
    skills: ['Event Coordination', 'Time Management', 'Teamwork', 'Communication'],
    featured: false
  },
  {
    id: 'exp-14',
    title: 'Adobe Express Video Editing Competition — Winner',
    organisation: 'Adobe',
    dates: 'Jan 2025 – Aug 2025',
    location: 'India / Remote',
    category: 'CREATIVE',
    categoryLabel: '🎨 CREATIVE',
    hook: '🎬 One of my creative projects turned into a competition win.',
    description:
      'I won an Adobe Express video-editing competition, which gave me the opportunity to experiment with visual storytelling, editing and AI-assisted creative tools. The experience strengthened my interest in using digital tools to communicate ideas visually. Winning the competition also earned me a one-year Adobe membership.',
    skills: ['Video Editing', 'Creative Communication', 'Storytelling', 'Digital Tools'],
    highlightStat: 'Competition Winner',
    featured: false
  },
  {
    id: 'exp-15',
    title: 'Monologue Competition — Participant',
    organisation: 'Cultural & Oratory Showcase',
    dates: 'Aug 2025',
    location: 'Indore, India',
    category: 'COMMUNICATION',
    categoryLabel: '🎭 EXPRESSION',
    hook: '🎭 A small stage experience that pushed me to become more comfortable expressing myself.',
    description:
      'I participated in a monologue competition where I performed a character inspired by Dr. B. R. Ambedkar. Preparing for the performance helped me become more confident with storytelling, expression and connecting with an audience.',
    skills: ['Public Speaking', 'Storytelling', 'Performance', 'Confidence'],
    featured: false
  }
];

const PROJECTS_DATA: CaseStudy[] = [
  {
    id: 'ibm-skillsbuild',
    title: 'IBM SkillsBuild Industry Project',
    category: 'Industry Project | Business Research | Human-Centred Problem Solving',
    shortDescription:
      'An industry-based university project focused on understanding barriers affecting adult learner participation and credential completion and developing ideas to improve engagement with digital learning.',
    problemContext:
      'Adult learners frequently face structural time constraints, unclear career translation pathways, and motivational drop-offs when engaging with non-linear digital credential platforms.',
    objective:
      'Investigate the root causes of adult learner drop-off and ideate practical, learner-centric recommendations to improve digital learning participation and credential completion.',
    myApproach: [
      'Target learner group identification',
      'Stakeholder analysis & empathy mapping',
      'Primary/secondary research interviews',
      'Framing "How Might We" challenge statements',
      'Ideation & solution refinement'
    ],
    myContribution:
      'Participated in team research synthesis, helped map learner personas, conducted stakeholder interviews, and assisted in assembling the final group recommendation report and presentation.',
    keyFindingsOutcome:
      'Developed and evaluated ideas designed to address barriers affecting adult learner participation and credential completion, focusing on cohort-based peer support and modular milestone incentives.',
    skillsDemonstrated: [
      'Business Research',
      'Human-Centred Problem Solving',
      'Stakeholder Analysis',
      'Teamwork & Collaboration',
      'Presentation Skills'
    ],
    finalArtefact:
      'Group Recommendation Presentation & Synthesis Report (IBM SkillsBuild brief).',
    reflection:
      'This project taught me that textbook business ideas must accommodate real organizational constraints and user habits. Developing practical, achievable solutions requires listening carefully to target learners before proposing features.',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
    evidenceItems: [
      { label: 'View Project Deck', type: 'presentation', status: 'Pending Approval / Attachment' },
      { label: 'View Project Summary', type: 'report', status: 'Pending Approval / Attachment' }
    ]
  },
  {
    id: 'zipline-tech',
    title: 'Emerging Technology Analysis — Zipline',
    category: 'University Project | Emerging Technology | Business Analysis',
    shortDescription:
      'An analysis of Zipline as an emerging technology and its potential business and industry implications.',
    problemContext:
      'Last-mile logistics for critical medical and commercial deliveries in remote terrains face physical infrastructure deficits, severe weather delays, and high cost-per-delivery using conventional ground transport.',
    objective:
      'Assess Zipline’s autonomous logistics model using structured business frameworks to evaluate its commercial viability, regulatory landscape, and industry implications.',
    myApproach: [
      'PESTLE Analysis (Political, Economic, Social, Technological, Legal, Environmental)',
      'SWOT Synthesis (Strengths, Weaknesses, Opportunities, Threats)',
      'Porter’s Five Forces industry examination',
      'Opportunity Mapping / 2x2 Matrix'
    ],
    myContribution:
      'Researched aviation regulatory constraints, conducted the PESTLE and SWOT evaluations, and synthesized operational cost considerations into our academic presentation deck.',
    keyFindingsOutcome:
      'Identified that while drone delivery solves critical logistical bottlenecks in remote healthcare, broader commercial scaling relies heavily on regulatory approvals, local infrastructure hubs, and specialized battery management.',
    skillsDemonstrated: [
      'Strategic Analysis',
      'PESTLE & SWOT',
      'Business Research',
      'Critical Thinking',
      'Written & Visual Communication'
    ],
    finalArtefact:
      'University Research Report & Accompanying Presentation Slides on Autonomous Last-Mile Systems.',
    reflection:
      'Evaluating emerging technology demonstrated that technological novelty alone does not guarantee commercial success; regulatory alignment and operational cost structures are the real deciding factors.',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
    evidenceItems: [
      { label: 'Watch Presentation', type: 'video', status: 'Pending Approval / Attachment' },
      { label: 'View Analysis Slide Deck', type: 'presentation', status: 'Pending Approval / Attachment' }
    ]
  },
  {
    id: 'csr-coca-cola',
    title: 'Business & Society — Corporate Social Responsibility',
    category: 'University Project | Business Ethics | Research',
    shortDescription:
      'An academic analysis of whether a business’s social responsibility should focus primarily on shareholder returns or broader stakeholder interests.',
    problemContext:
      'Multinational corporations operating in resource-constrained regions encounter severe ethical dilemmas when local resource consumption impacts communities and tests the boundaries of corporate accountability.',
    objective:
      'Critically analyze shareholder primacy versus stakeholder theory using the historical Coca-Cola India groundwater case study.',
    myApproach: [
      'Milton Friedman Shareholder Theory evaluation',
      'Edward Freeman Stakeholder Theory contrast',
      'Coca-Cola India case study analysis',
      'Academic literature review and critical synthesis',
      'Structured argument development'
    ],
    myContribution:
      'Authored an academic research paper comparing shareholder-first versus stakeholder-first governance models and analyzed how community and regulatory pressures reshape corporate CSR strategies.',
    keyFindingsOutcome:
      'Concluded that long-term shareholder value cannot be separated from stakeholder trust; neglecting local community well-being leads to legal friction, loss of social license, and operational disruptions.',
    skillsDemonstrated: [
      'Academic Research',
      'Critical Thinking',
      'Academic Writing',
      'Stakeholder Analysis',
      'Argument Development'
    ],
    finalArtefact:
      'Individual Academic Research Essay & Structured Case Argument.',
    reflection:
      'This academic inquiry highlighted that ethical decision-making is not just a public relations exercise—it directly influences regulatory sustainability and corporate viability in global operations.',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4',
    evidenceItems: [
      { label: 'View Research Paper Outline', type: 'report', status: 'Pending Approval / Attachment' }
    ]
  },
  {
    id: 'quick-commerce-au',
    title: 'Australian Quick-Commerce Market Concept',
    category: 'Independent Project | Entrepreneurship | Market Research',
    shortDescription:
      'An independent exploration of how an ultra-fast grocery delivery model could potentially be adapted to the Australian market through retail partnerships.',
    problemContext:
      'Rapid delivery start-ups globally and locally struggled with the capital expense of owning and operating stand-alone dark-store networks in low-density suburban geographies.',
    objective:
      'Explore the theoretical feasibility of an asset-lighter on-demand grocery delivery concept built on partnerships with established supermarket retailers rather than standalone dark stores.',
    myApproach: [
      'Review of Australian grocery and rapid-delivery landscape',
      'Analysis of supermarket partnership models',
      'Evaluation of on-demand dispatch operations',
      'Identification of operational hurdles (suburban density & award wages)',
      'Outlining questions for future validation'
    ],
    myContribution:
      'Conducted independent secondary research on the Australian delivery sector, conceptualized a retailer-partnered fulfillment model, and mapped logistical and margin challenges.',
    keyFindingsOutcome:
      'Identified that partnering with existing supermarkets avoids dark-store lease overheads, but requires solving inventory synchronization, in-store picking congestion, and courier dispatch economics.',
    skillsDemonstrated: [
      'Market Research',
      'Business Concept Development',
      'Strategic Thinking',
      'Logistics Fundamentals',
      'Critical Evaluation'
    ],
    finalArtefact:
      'Independent Concept Brief & Operational Consideration Framework (Work in Progress).',
    reflection:
      'Investigating this concept demonstrated how vital local geography and labor dynamics are to business viability. What works in high-density European cities requires substantial rethinking in the Australian urban landscape.',
    videoUrl:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4',
    evidenceItems: [
      { label: 'View Concept Outline', type: 'artefact', status: 'Pending Approval / Attachment' }
    ]
  }
];

const INSIGHTS_DATA: InsightArticle[] = [
  {
    id: 'topic-1',
    number: '01',
    title: 'What I Learned From an Industry-Based Business Project',
    tag: 'Academic Practice',
    status: 'Draft / Outline',
    summary:
      'Reflections from working with real client requirements: why listening to stakeholder incentives matters as much as the analysis itself.',
    outlinePoints: [
      'The difference between classroom case studies and open-ended industry briefs',
      'How to structure collaborative team problem solving under project milestones',
      'Prioritizing realistic recommendations over overly theoretical proposals'
    ]
  },
  {
    id: 'topic-2',
    number: '02',
    title: 'Can Ultra-Fast Grocery Delivery Work in Australia?',
    tag: 'Market Concept',
    status: 'Draft / Outline',
    summary:
      'An exploration of suburban density, labor awards, and why supermarket partnerships may offer a more viable path than dark stores.',
    outlinePoints: [
      'Reviewing early market exits in Australian quick delivery',
      'Evaluating the economics of existing supermarket footprints vs. dedicated dark stores',
      'Key logistics questions remaining around picking times and order thresholds'
    ]
  },
  {
    id: 'topic-3',
    number: '03',
    title: 'What an Emerging Technology Project Taught Me About Business',
    tag: 'Technology Analysis',
    status: 'Draft / Outline',
    summary:
      'Why analyzing autonomous delivery systems requires looking closely at regulation, local infrastructure, and unit costs rather than novelty.',
    outlinePoints: [
      'Applying PESTLE and SWOT to autonomous systems (Zipline)',
      'Understanding the heavy influence of aviation authorities and safety regulations',
      'Why technological breakthroughs require supportive business models to scale'
    ]
  },
  {
    id: 'topic-4',
    number: '04',
    title: 'What University Projects Are Teaching Me About Business',
    tag: 'University Experience',
    status: 'Draft / Outline',
    summary:
      'Lessons in team coordination, resolving differing analytical opinions, and communicating ideas clearly under submission deadlines.',
    outlinePoints: [
      'Managing diverse work styles in student teams',
      'Structuring academic research into clear executive-style slides',
      'Developing confidence in defending ideas during question-and-answer sessions'
    ]
  },
  {
    id: 'topic-5',
    number: '05',
    title: 'My Experience Working at Mid Flight Garden Restaurant & Cafe',
    tag: 'Practical Operations',
    status: 'Draft / Outline',
    summary:
      'Practical exposure to customer service, daily operations, supplier coordination, and the operational realities of running a restaurant and cafe.',
    outlinePoints: [
      'Balancing high school study while supporting day-to-day operations (May 2025–Jun 2026)',
      'Observing inventory turnover, supplier deliveries, and daily customer demand',
      'How hands-on experience sparked my lasting interest in business'
    ]
  },
  {
    id: 'topic-6',
    number: '06',
    title: 'Understanding Global Supply Chains as a Business Student',
    tag: 'Global Business',
    status: 'Draft / Outline',
    summary:
      'Introductory observations on why modern international commerce depends heavily on cross-border logistics resilience.',
    outlinePoints: [
      'Initial impressions of international trade corridors and shipping networks',
      'The balance between just-in-time efficiency and supply chain risk management',
      'Topics I am eager to explore deeper during my business degree at RMIT'
    ]
  }
];

interface NavbarProps {
  onOpenAbout: () => void;
  onOpenCV: () => void;
  onOpenContact: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAbout, onOpenCV, onOpenContact }) => {
  return (
    <nav className="relative z-30 px-4 md:px-8 py-5 w-full">
      <div className="liquid-glass rounded-full max-w-6xl mx-auto px-5 md:px-7 py-3 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <a href="#hero" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:border-white/50 transition-colors">
              <Globe className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-white font-semibold text-base tracking-tight leading-none">
                {CANDIDATE_NAME}
              </span>
              <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider">
                RMIT • Melbourne
              </span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-6 ml-8">
            <button
              onClick={onOpenAbout}
              className="text-white/70 hover:text-white text-xs uppercase font-medium tracking-wider transition-colors cursor-pointer"
            >
              About
            </button>
            <a
              href="#projects"
              className="text-white/70 hover:text-white text-xs uppercase font-medium tracking-wider transition-colors"
            >
              Selected Work
            </a>
            <a
              href="#experience"
              className="text-white/70 hover:text-white text-xs uppercase font-medium tracking-wider transition-colors"
            >
              Experience
            </a>
            <a
              href="#education"
              className="text-white/70 hover:text-white text-xs uppercase font-medium tracking-wider transition-colors"
            >
              Education
            </a>
            <a
              href="#focus"
              className="text-white/70 hover:text-white text-xs uppercase font-medium tracking-wider transition-colors"
            >
              Focus
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white text-xs font-medium tracking-wider uppercase transition-colors hidden sm:inline-flex items-center gap-1.5"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>
          <button
            onClick={onOpenCV}
            className="liquid-glass rounded-full px-4 py-1.5 text-white text-xs uppercase font-medium tracking-wider hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-white/80" />
            <span>CV</span>
          </button>
          <button
            onClick={onOpenContact}
            className="bg-white text-black rounded-full px-5 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

interface HeroSectionProps {
  onExploreWork: () => void;
  onOpenCV: () => void;
  onOpenContact: () => void;
  onRecordLead: (lead: Omit<LeadSubmission, 'id' | 'createdAt'>) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreWork,
  onOpenCV,
  onOpenContact,
  onRecordLead
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [email, setEmail] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fadeAnimId: number | null = null;
    let isFadingOut = false;

    const animateOpacity = (
      from: number,
      to: number,
      duration: number,
      onComplete?: () => void
    ) => {
      if (fadeAnimId) cancelAnimationFrame(fadeAnimId);
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentOpacity = from + (to - from) * progress;
        if (video) {
          video.style.opacity = currentOpacity.toString();
        }
        if (progress < 1) {
          fadeAnimId = requestAnimationFrame(step);
        } else {
          fadeAnimId = null;
          if (onComplete) onComplete();
        }
      };

      fadeAnimId = requestAnimationFrame(step);
    };

    const handleCanPlay = () => {
      video.play().catch(() => {});
      animateOpacity(0, 1, 500);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && !isFadingOut) {
        isFadingOut = true;
        const currentOp = parseFloat(video.style.opacity || '1');
        animateOpacity(currentOp, 0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video
          .play()
          .then(() => {
            isFadingOut = false;
            animateOpacity(0, 1, 500);
          })
          .catch(() => {});
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (fadeAnimId) cancelAnimationFrame(fadeAnimId);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setFeedbackMsg('Please enter a valid email address.');
      setTimeout(() => setFeedbackMsg(''), 3000);
      return;
    }
    const submittedEmail = email.trim();

    onRecordLead({
      type: 'Connect Newsletter',
      email: submittedEmail,
      timestamp: new Date().toLocaleString(),
      message: 'Visitor requested to connect via hero banner.'
    });

    notifyEmailDirectly({
      type: 'Connect Newsletter',
      email: submittedEmail,
      message: 'Visitor connected via Hero newsletter box.'
    });

    setFeedbackMsg('Thank you. Details received! Direct inquiries are welcomed at ' + PROFESSIONAL_EMAIL);
    setTimeout(() => {
      setEmail('');
      setFeedbackMsg('');
    }, 4500);
  };

  return (
    <section
      id="hero"
      className="min-h-screen overflow-hidden relative flex flex-col justify-between bg-black select-none"
    >
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
        className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
        muted
        autoPlay
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

      <Navbar
        onOpenAbout={() => {
          const el = document.getElementById('about');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCV={onOpenCV}
        onOpenContact={onOpenContact}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10 text-center -translate-y-[6%] md:-translate-y-[8%]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="liquid-glass rounded-full px-4 py-1.5 mb-5 text-white/80 text-xs font-mono tracking-wider inline-flex items-center gap-2 border border-white/10"
        >
          <GraduationCap className="w-3.5 h-3.5 text-white/90" />
          <span>RMIT University | Melbourne</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap font-instrument"
        >
          Atharv <em className="italic text-white/80">Agrawal</em>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-white/60 text-xs sm:text-sm uppercase font-mono tracking-widest mt-2"
        >
          Business Student | Global Business | International Markets
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-white/90 text-base md:text-xl font-light max-w-2xl mt-4 leading-relaxed font-instrument italic"
        >
          “Building practical business skills through industry projects, research, entrepreneurship and real-world problem solving.”
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <button
            onClick={onExploreWork}
            className="bg-white text-black font-semibold rounded-full px-8 py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer shadow-lg flex items-center gap-2"
          >
            <span>View Selected Work</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenCV}
            className="liquid-glass rounded-full px-8 py-3 text-white text-xs md:text-sm uppercase tracking-wider font-medium hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-white/80" />
            <span>Curriculum Vitae</span>
          </button>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          onSubmit={handleSubscribe}
          className="mt-8 max-w-md w-full"
        >
          <div className="liquid-glass rounded-full pl-5 pr-2 py-2 flex items-center gap-3 w-full shadow-2xl transition-all focus-within:ring-1 focus-within:ring-white/40">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Leave your email to connect"
              className="bg-transparent border-none outline-none text-white placeholder:text-white/40 text-xs md:text-sm flex-1 min-w-0"
            />
            <button
              type="submit"
              className="bg-white rounded-full p-2.5 text-black hover:bg-neutral-200 active:scale-90 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              title="Connect"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {feedbackMsg && (
            <p className="mt-2 text-xs font-mono text-white/80 animate-fade-in">
              {feedbackMsg}
            </p>
          )}
        </motion.form>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className="relative z-10 flex flex-wrap items-center justify-center gap-4 pb-8"
      >
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="liquid-glass rounded-full p-3.5 text-white/80 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
        >
          <Linkedin className="w-4 h-4" />
        </a>
        <button
          onClick={onOpenContact}
          aria-label="Email"
          className="liquid-glass rounded-full p-3.5 text-white/80 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Mail className="w-4 h-4" />
        </button>
        <div className="liquid-glass rounded-full px-4 py-2 text-white/70 text-xs font-mono flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Melbourne, Victoria, Australia</span>
        </div>
      </motion.div>
    </section>
  );
};

interface AboutSectionProps {
  onOpenAboutModal: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ onOpenAboutModal }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-black pt-28 md:pt-40 pb-20 md:pb-28 px-6 overflow-hidden relative border-t border-white/5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-white/40 text-xs tracking-widest uppercase font-mono font-semibold"
          >
            About Me
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-7xl text-white leading-[1.15] tracking-tight font-instrument max-w-5xl"
        >
          Building practical business skills through{' '}
          <em className="italic text-white/60">industry projects</em>, research, and{' '}
          <em className="italic text-white/60">real-world problem solving.</em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-10"
        >
          <motion.button
            onClick={onOpenAboutModal}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="liquid-glass rounded-full px-8 py-3.5 text-sm md:text-base text-white hover:text-white hover:bg-white/10 transition-all inline-flex items-center gap-3 cursor-pointer font-sans-clean font-medium border border-white/20 shadow-2xl group"
          >
            <User className="w-4 h-4 text-white/90 group-hover:scale-110 transition-transform" />
            <span>Profile Summary</span>
            <ArrowUpRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

const PhilosophySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const areasOfFocus = [
    { number: '01', title: 'Global Business', desc: 'Understanding international trade flows, cross-border business environments, and multinational operations.' },
    { number: '02', title: 'International Markets', desc: 'Examining regional market dynamics, trade agreements, and cross-cultural commercial considerations.' },
    { number: '03', title: 'Supply Chain & Logistics', desc: 'Exploring physical distribution, last-mile efficiency, and inventory resilience in changing markets.' },
    { number: '04', title: 'Private Equity', desc: 'Exploring direct investment frameworks, capital allocation models, value creation in private enterprises, and portfolio growth strategies.' },
    { number: '05', title: 'Financial Planning', desc: 'Understanding capital budgeting, long-term wealth structuring, cash flow forecasting, and risk-adjusted financial decision making.' },
    { number: '06', title: 'Business Strategy', desc: 'Applying structured frameworks (PESTLE, SWOT, Five Forces) to evaluate commercial and operational challenges.' },
    { number: '07', title: 'Entrepreneurship', desc: 'Exploring independent business concepts, retailer partnership models, and practical customer value.' },
    { number: '08', title: 'Business Research', desc: 'Synthesizing stakeholder viewpoints, academic literature, and qualitative research into clear arguments.' }
  ];

  return (
    <section
      id="focus"
      ref={sectionRef}
      className="bg-black py-24 md:py-36 px-6 overflow-hidden relative border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <span className="text-white/40 text-xs uppercase font-mono tracking-widest block mb-2">
            Academic &amp; Professional Interests
          </span>
          <h2 className="text-4xl md:text-6xl text-white tracking-tight font-instrument">
            Areas of Focus
          </h2>
          <p className="text-white/50 text-xs sm:text-sm font-mono mt-2 max-w-xl">
            *These represent primary areas of study, curiosity, and skill development throughout my university degree, rather than claims of senior professional expertise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {areasOfFocus.map((focus, idx) => (
            <motion.div
              key={focus.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between hover:border-white/20 transition-all group"
            >
              <div>
                <span className="text-white/40 text-xs font-mono block mb-2 group-hover:text-white/70 transition-colors">
                  {focus.number}
                </span>
                <h3 className="text-white text-xl font-instrument mb-2">
                  {focus.title}
                </h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  {focus.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface ProjectsSectionProps {
  onOpenCaseStudy: (study: CaseStudy) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenCaseStudy }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="bg-black py-24 md:py-36 px-6 overflow-hidden relative border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4"
        >
          <div>
            <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-2">
              University &amp; Independent Work
            </span>
            <h2 className="text-4xl md:text-6xl text-white tracking-tight font-instrument">
              Projects
            </h2>
          </div>
          <span className="text-white/50 text-xs sm:text-sm max-w-md font-light">
            Genuine academic assignments, industry project coursework, and independent business concept explorations. Free of exaggerated metrics.
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {PROJECTS_DATA.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              onClick={() => onOpenCaseStudy(project)}
              className="liquid-glass rounded-3xl overflow-hidden group cursor-pointer border border-white/5 transition-all duration-300 hover:border-white/30 flex flex-col justify-between"
            >
              <div className="aspect-video relative overflow-hidden">
                <video
                  src={project.videoUrl}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="liquid-glass rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/90">
                    {project.category.split('|')[0].trim()}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/40 text-xs uppercase tracking-widest font-mono">
                      Project 0{idx + 1}
                    </span>
                    <div className="liquid-glass rounded-full p-2 text-white/80 group-hover:text-white group-hover:rotate-12 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-white text-xl md:text-2xl mb-2 tracking-tight font-instrument">
                    {project.title}
                  </h3>
                  <p className="text-white/65 text-xs sm:text-sm leading-relaxed mb-4">
                    {project.shortDescription}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                    {project.skillsDemonstrated.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[11px] text-white/60 bg-white/5 px-2.5 py-0.5 rounded-full font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface ExperienceSectionProps {
  onOpenRestaurantModal: () => void;
  onOpenExperienceDetail: (item: ExperienceItem) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  onOpenRestaurantModal,
  onOpenExperienceDetail
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [showSecondaryActivities, setShowSecondaryActivities] = useState(false);

  const coreExperienceIds = ['exp-1', 'exp-2', 'exp-3', 'exp-4', 'exp-5', 'exp-8'];
  const curatedExperiences = EXPERIENCES_DATA.filter((item) => coreExperienceIds.includes(item.id));
  const secondaryExperiences = EXPERIENCES_DATA.filter((item) => !coreExperienceIds.includes(item.id));

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="bg-black py-24 md:py-36 px-6 overflow-hidden relative border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-2">
              Curated Professional &amp; Practical Roles
            </span>
            <h2 className="text-4xl md:text-6xl text-white tracking-tight font-instrument">
              My Journey &amp; Experience
            </h2>
          </div>
          <p className="text-white/60 text-xs sm:text-sm max-w-md font-light leading-relaxed">
            A selective overview of hands-on business operations, university student leadership at RMIT, conference coordination, and peer advisory roles.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6 }}
          className="liquid-glass rounded-2xl p-4 mb-10 border border-white/10 overflow-x-auto scrollbar-none"
        >
          <div className="flex items-center gap-2 min-w-max text-[11px] font-mono text-white/50">
            <span className="text-white/80 font-medium">Trajectory:</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-white/70">High School Leadership &amp; Quiz Club</span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-white/70">Family Restaurant Operations (Indore)</span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-white/70">Conference Secretariat &amp; Peer Advisory</span>
            <span>&rarr;</span>
            <span className="px-2 py-0.5 rounded bg-white/15 text-white font-medium">RMIT University (Melbourne, Present)</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curatedExperiences.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              onClick={() => {
                if (item.id === 'exp-2') {
                  onOpenRestaurantModal();
                } else {
                  onOpenExperienceDetail(item);
                }
              }}
              className="liquid-glass rounded-3xl p-6 md:p-7 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="liquid-glass px-2.5 py-0.5 rounded-full text-[10px] font-mono text-white/80 border border-white/10">
                    {item.categoryLabel}
                  </span>
                  <span className="text-[11px] text-white/40 font-mono">
                    {item.dates}
                  </span>
                </div>

                <h3 className="text-white text-lg md:text-xl font-instrument leading-snug group-hover:text-white/95 transition-colors mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-white/45 text-xs font-mono mb-3.5">
                  {item.organisation && <span>{item.organisation}</span>}
                  {item.organisation && <span>•</span>}
                  <span>{item.location}</span>
                </div>

                <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 mb-3.5">
                  <p className="text-white/90 text-xs md:text-[13px] font-medium font-sans-clean leading-snug">
                    {item.hook}
                  </p>
                </div>

                <p className="text-white/70 text-xs leading-relaxed mb-5">
                  {item.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1 pt-3 border-t border-white/10 mb-3.5">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] text-white/60 bg-white/5 px-2 py-0.5 rounded-full font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-white/70 group-hover:text-white pt-1">
                  <span className="flex items-center gap-1 text-[11px]">
                    {item.id === 'exp-2' ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Operations Case Study</span>
                      </>
                    ) : (
                      <>
                        <span>Read Reflections</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="liquid-glass rounded-full p-1.5">
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center">
          <button
            onClick={() => setShowSecondaryActivities(!showSecondaryActivities)}
            className="liquid-glass rounded-full px-5 py-2 text-xs font-mono text-white/60 hover:text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <span>
              {showSecondaryActivities
                ? 'Hide Secondary School Milestones'
                : `View Earlier School & Creative Milestones (${secondaryExperiences.length})`}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSecondaryActivities ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showSecondaryActivities && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full mt-6 overflow-hidden"
              >
                <div className="p-4 rounded-2xl liquid-glass border border-white/5 mb-4 text-xs font-mono text-white/40">
                  Preserved secondary school co-curriculars, cultural exchanges, and creative achievements:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {secondaryExperiences.map((sec) => (
                    <div
                      key={sec.id}
                      onClick={() => onOpenExperienceDetail(sec)}
                      className="liquid-glass rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-1">
                        <span>{sec.categoryLabel}</span>
                        <span>{sec.dates}</span>
                      </div>
                      <h4 className="text-white text-xs font-medium font-sans-clean mb-1 group-hover:text-white/90">
                        {sec.title}
                      </h4>
                      <p className="text-white/50 text-[11px] line-clamp-2">
                        {sec.hook}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const EducationSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const educationEntries = [
    {
      institution: 'RMIT University',
      credential: 'Bachelor of Business Professional Practice',
      dates: '2026 – 2030',
      location: 'Melbourne, Australia',
      status: 'Current Degree Candidate',
      icon: GraduationCap,
      description:
        'Building a broad foundation in business with an interest in global business, international markets, supply chains and entrepreneurship, while developing practical skills through university projects, industry-based learning and professional experiences.',
      focusPills: ['Global Business', 'International Markets', 'Supply Chain', 'Business Strategy', 'Entrepreneurship']
    },
    {
      institution: 'Delhi Public School Indore',
      credential: 'Senior Secondary / High School',
      dates: 'Completed 2026',
      location: 'Indore, India',
      status: 'Completed',
      icon: School,
      description:
        'Completed senior secondary education with a focus on Commerce and Mathematics, developing an early foundation in business, analytical thinking and quantitative skills.',
      focusPills: ['Commerce', 'Mathematics', 'Economics', 'Business Studies', 'Analytical Foundations']
    }
  ];

  return (
    <section
      id="education"
      ref={sectionRef}
      className="bg-black py-24 md:py-32 px-6 overflow-hidden relative border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-2">
              Academic Background &amp; Qualifications
            </span>
            <h2 className="text-4xl md:text-6xl text-white tracking-tight font-instrument">
              Education
            </h2>
          </div>
          <p className="text-white/50 text-xs sm:text-sm max-w-md font-light leading-relaxed">
            Formal tertiary study at RMIT University and foundational senior secondary commerce education.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {educationEntries.map((edu, idx) => {
            const IconComponent = edu.icon;
            return (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, y: 35 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="liquid-glass rounded-3xl p-7 md:p-9 border border-white/10 flex flex-col justify-between hover:border-white/25 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl liquid-glass flex items-center justify-center border border-white/15 text-white/90">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-white/40 text-[11px] font-mono uppercase tracking-wider block">
                          {edu.status}
                        </span>
                        <h4 className="text-white text-lg font-instrument leading-snug">
                          {edu.institution}
                        </h4>
                      </div>
                    </div>

                    <div className="liquid-glass px-3 py-1 rounded-full text-xs font-mono text-white/70 border border-white/10 shrink-0">
                      {edu.dates}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-white text-xl md:text-2xl font-instrument leading-tight mb-1">
                      {edu.credential}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white/45 text-xs font-mono">
                      <MapPin className="w-3.5 h-3.5 text-white/60" />
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  <p className="text-white/75 text-xs md:text-sm leading-relaxed mb-6 font-light">
                    {edu.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">
                    Key Subject Areas &amp; Foundations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.focusPills.map((pill) => (
                      <span
                        key={pill}
                        className="text-[11px] font-mono text-white/70 bg-white/5 px-2.5 py-1 rounded-full"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
}

const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ study, onClose }) => {
  if (!study) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="liquid-glass w-full max-w-4xl max-h-[90vh] rounded-3xl p-6 md:p-10 flex flex-col border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6 shrink-0">
            <div>
              <span className="text-white/40 text-xs uppercase font-mono tracking-widest block mb-1">
                {study.category}
              </span>
              <h3 className="text-white font-instrument text-2xl md:text-3xl">
                {study.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="liquid-glass rounded-full p-2.5 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto pr-2 space-y-6 text-left">
            <div className="p-4 rounded-xl liquid-glass border border-white/10">
              <span className="text-white/40 text-[11px] font-mono uppercase tracking-widest block mb-1">
                Project Overview
              </span>
              <p className="text-white/90 text-sm md:text-base font-light italic">
                “{study.shortDescription}”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="liquid-glass rounded-2xl p-5 border border-white/5">
                <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/70">
                  Problem / Context
                </h4>
                <p className="text-white/75 text-sm leading-relaxed">
                  {study.problemContext}
                </p>
              </div>

              <div className="liquid-glass rounded-2xl p-5 border border-white/5">
                <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/70">
                  Objective
                </h4>
                <p className="text-white/75 text-sm leading-relaxed">
                  {study.objective}
                </p>
              </div>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-3 text-white/70">
                My Approach
              </h4>
              <div className="flex flex-wrap gap-2">
                {study.myApproach.map((item, idx) => (
                  <span
                    key={idx}
                    className="liquid-glass px-3 py-1.5 rounded-full text-xs text-white/80 font-mono"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/70">
                My Contribution
              </h4>
              <p className="text-white/75 text-sm leading-relaxed">
                {study.myContribution}
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/10 bg-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/90">
                Key Findings / Outcome
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {study.keyFindingsOutcome}
              </p>
            </div>

            <div>
              <h4 className="text-white text-xs font-mono uppercase tracking-widest mb-3 text-white/40">
                Skills Demonstrated
              </h4>
              <div className="flex flex-wrap gap-2">
                {study.skillsDemonstrated.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/10 text-white px-3 py-1 rounded-full font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/70">
                Final Artefact
              </h4>
              <p className="text-white/80 text-sm font-mono">
                {study.finalArtefact}
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/70">
                Reflection
              </h4>
              <p className="text-white/75 text-sm leading-relaxed italic">
                “{study.reflection}”
              </p>
            </div>

            <div className="p-5 rounded-2xl liquid-glass border border-white/10">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-3 text-white/90 flex items-center gap-2">
                <FileText className="w-4 h-4 text-white/70" />
                <span>Project Evidence &amp; Attachments</span>
              </h4>
              <div className="flex flex-wrap gap-3">
                {study.evidenceItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="liquid-glass rounded-xl px-4 py-2.5 flex items-center gap-3 border border-white/10"
                  >
                    <span className="text-xs font-medium text-white">{item.label}</span>
                    <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface RestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RestaurantCaseStudyModal: React.FC<RestaurantModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="liquid-glass w-full max-w-3xl max-h-[90vh] rounded-3xl p-6 md:p-10 flex flex-col border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6 shrink-0">
            <div>
              <span className="text-white/40 text-xs uppercase font-mono tracking-widest block mb-1">
                Real-World Business Operations Case Study
              </span>
              <h3 className="text-white font-instrument text-2xl md:text-3xl">
                Mid Flight Garden Restaurant &amp; Cafe
              </h3>
            </div>
            <button
              onClick={onClose}
              className="liquid-glass rounded-full p-2.5 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto pr-2 space-y-6 text-left">
            <div className="liquid-glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/70">
                1. Business Context
              </h4>
              <p className="text-white/75 text-sm leading-relaxed">
                Mid Flight Garden Restaurant &amp; Cafe in Indore, India. A vibrant food service and cafe environment where customer satisfaction hinges on synchronized kitchen timing and front-of-house hospitality.
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/70">
                2. My Role
              </h4>
              <p className="text-white/75 text-sm leading-relaxed">
                While completing high school (May 2025 – Jun 2026), I worked alongside my family to assist in the daily operations of the restaurant.
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/70">
                3. Responsibilities
              </h4>
              <ul className="text-white/75 text-sm space-y-1.5 list-disc list-inside">
                <li>Engaging directly with customers to take orders and ensure quality hospitality.</li>
                <li>Monitoring stock levels and tracking inventory turnover for fresh items.</li>
                <li>Contributing ideas around menu offerings based on customer preferences.</li>
                <li>Helping oversee restaurant maintenance, cleanliness, and front-of-house readiness.</li>
              </ul>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/70">
                4. Challenges
              </h4>
              <p className="text-white/75 text-sm leading-relaxed">
                Balancing academic high school commitments while adapting to unpredictable customer rushes, coordinating stock intake under tight deadlines, and maintaining patience during peak shifts.
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/5 bg-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/90">
                5. What I Learned
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                I learned firsthand that a successful business relies on the compounding effect of small decisions: inventory controls, attentiveness to diners, and calm coordination behind the scenes.
              </p>
            </div>

            <div className="liquid-glass rounded-2xl p-5 border border-white/5">
              <h4 className="text-white text-xs font-mono uppercase tracking-wider mb-2 text-white/70">
                6. Influence on My Business Path
              </h4>
              <p className="text-white/75 text-sm leading-relaxed">
                Seeing how cash flow, supply deliveries, and guest satisfaction intertwine sparked my genuine interest in commercial operations, motivating me to study Global Business and Supply Chain at RMIT University.
              </p>
            </div>

            <div>
              <h4 className="text-white text-xs font-mono uppercase tracking-widest mb-3 text-white/40">
                7. Skills Developed
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Customer Service',
                  'Day-to-day Operations',
                  'Inventory & Stock Awareness',
                  'Menu Ideation',
                  'Teamwork',
                  'Problem Solving'
                ].map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-white/10 text-white px-3 py-1 rounded-full font-mono"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface ExperienceDetailModalProps {
  item: ExperienceItem | null;
  onClose: () => void;
}

const ExperienceDetailModal: React.FC<ExperienceDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="liquid-glass w-full max-w-2xl max-h-[85vh] rounded-3xl p-6 md:p-8 flex flex-col border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
            <div>
              <span className="text-white/40 text-xs uppercase font-mono tracking-widest block">
                {item.categoryLabel}
              </span>
              <h3 className="text-white font-instrument text-2xl md:text-3xl leading-snug">
                {item.title}
              </h3>
              <p className="text-white/50 text-xs font-mono mt-1">
                {item.organisation ? `${item.organisation} • ` : ''}
                {item.location} ({item.dates})
              </p>
            </div>
            <button
              onClick={onClose}
              className="liquid-glass rounded-full p-2 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto pr-2 space-y-5 text-left">
            <div className="liquid-glass rounded-2xl p-4 border border-white/10 bg-white/[0.02]">
              <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest block mb-1">
                Core Takeaway
              </span>
              <p className="text-white text-base font-medium font-sans-clean leading-snug">
                {item.hook}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-white/40 text-xs font-mono uppercase tracking-wider block">
                Personal Reflection &amp; Contributions
              </span>
              <p className="text-white/80 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>

            <div>
              <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-2">
                Demonstrated Competencies
              </span>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="liquid-glass px-3 py-1 rounded-full text-xs text-white/80 font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {item.highlightStat && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs font-mono text-emerald-300">
                Verified Recognition: {item.highlightStat}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCV: () => void;
  onOpenContact: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenCV,
  onOpenContact
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('atharv_profile_photo');
      if (saved) return saved;
    }
    return PROFILE_IMAGE_URL;
  });
  const [imgError, setImgError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleProcessFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImgSrc(dataUrl);
        setImgError(false);
        try {
          localStorage.setItem('atharv_profile_photo', dataUrl);
        } catch {
          // Local storage quota fallback
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleUpdateImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      const url = customUrlInput.trim();
      setImgSrc(url);
      setImgError(false);
      setShowUrlInput(false);
      try {
        localStorage.setItem('atharv_profile_photo', url);
      } catch {
        // quota ignore
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="liquid-glass w-full max-w-5xl max-h-[92vh] rounded-3xl p-6 md:p-10 flex flex-col border border-white/15 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white/40 text-xs uppercase font-mono tracking-widest block">
                  Candidate Profile
                </span>
                <h3 className="text-white font-instrument text-2xl md:text-3xl leading-none">
                  About {CANDIDATE_NAME}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="liquid-glass rounded-full p-2.5 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto pr-2 space-y-6 text-left">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start liquid-glass rounded-3xl p-6 md:p-8 border border-white/10">
              <div className="flex flex-col items-center shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`w-44 h-56 md:w-52 md:h-68 rounded-2xl overflow-hidden border shadow-2xl bg-neutral-950 relative group flex items-center justify-center transition-all ${
                    isDragging ? 'border-white ring-2 ring-white/50 scale-102' : 'border-white/20'
                  }`}
                >
                  {!imgError ? (
                    <>
                      <img
                        src={imgSrc}
                        alt={CANDIDATE_NAME}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover object-top"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 text-center cursor-pointer backdrop-blur-[2px]"
                      >
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </div>
                        <span className="text-white text-xs font-medium font-sans-clean">Change Photo</span>
                        <span className="text-white/50 text-[10px] font-mono">Click or drop file</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-neutral-900 to-black text-white/80">
                      <div className="w-14 h-14 rounded-full liquid-glass border border-white/20 flex items-center justify-center text-xl font-instrument mb-2 text-white">
                        AA
                      </div>
                      <span className="text-xs font-semibold text-white mb-0.5">{CANDIDATE_NAME}</span>
                      <span className="text-[10px] font-mono text-white/40 mb-3">Portrait Photo</span>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-black font-semibold text-[11px] rounded-full px-3.5 py-1.5 hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg mb-2"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Choose Photo</span>
                      </button>

                      <p className="text-[9px] font-mono text-white/40 leading-tight">
                        Select portrait file or drag &amp; drop
                      </p>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="mt-2 text-[9px] font-mono text-white/50 hover:text-white underline cursor-pointer"
                      >
                        or paste image URL
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    title="Change Photo Link"
                    className="absolute bottom-2 right-2 liquid-glass rounded-full p-1.5 text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>

                {showUrlInput && (
                  <form onSubmit={handleUpdateImageUrl} className="mt-2.5 w-44 md:w-52 space-y-1.5 animate-fade-in">
                    <input
                      type="url"
                      placeholder="Paste image link..."
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="w-full text-[11px] liquid-glass rounded-lg px-2.5 py-1.5 text-white placeholder:text-white/30 outline-none border border-white/20"
                    />
                    <div className="flex gap-1">
                      <button
                        type="submit"
                        className="flex-1 bg-white text-black text-[10px] py-1 rounded font-medium cursor-pointer"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(false)}
                        className="px-2 bg-white/10 text-white text-[10px] py-1 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex items-center gap-1 mt-2 text-[10px] font-mono text-white/40">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Melbourne, VIC, Australia</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-mono">
                  <GraduationCap className="w-3.5 h-3.5 text-white" />
                  <span>Bachelor of Business Professional Practice (2026–2030)</span>
                </div>
                <h4 className="text-white font-instrument text-3xl md:text-4xl">
                  {CANDIDATE_NAME}
                </h4>
                <p className="text-white/60 text-xs font-mono uppercase tracking-wider">
                  RMIT University • Melbourne, Victoria, Australia
                </p>

                <div className="space-y-3 pt-2 text-white/80 text-sm md:text-base leading-relaxed font-light">
                  <p>
                    I am a <strong className="text-white font-medium">Bachelor of Business Professional Practice</strong> student at <strong className="text-white font-medium">RMIT University in Melbourne</strong>, focusing on global business, international markets, supply chains, and entrepreneurship.
                  </p>
                  <p>
                    My background combines hands-on operational experience from working in our family business (Mid Flight Garden Restaurant & Cafe) with structured university research, student leadership, and industry project collaboration through initiatives like the IBM SkillsBuild program.
                  </p>
                  <p>
                    I am driven by understanding how complex business problems operate in practice, analyzing strategic trade-offs, and building durable commercial solutions across global and local markets.
                  </p>
                </div>
              </div>
            </div>

            <div className="liquid-glass rounded-2xl p-4 border border-white/10 text-xs font-mono text-white/70 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-white/60 shrink-0 mt-0.5" />
              <span>
                Note for Recruiters: This portfolio represents genuine university projects, coursework research, family restaurant operations, and student leadership.
              </span>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass rounded-full px-5 py-2.5 text-white text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn Profile</span>
                </a>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCV();
                  }}
                  className="liquid-glass rounded-full px-5 py-2.5 text-white text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Curriculum Vitae</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                className="bg-white text-black font-semibold rounded-full px-7 py-2.5 text-xs uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Contact Direct</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface ArticleModalProps {
  article: InsightArticle | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="liquid-glass w-full max-w-2xl max-h-[85vh] rounded-3xl p-6 md:p-10 flex flex-col border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2 text-white/50 text-xs font-mono uppercase tracking-widest">
              <span>Insight {article.number}</span>
              <span>•</span>
              <span>{article.tag}</span>
              <span>•</span>
              <span className="text-white/80">{article.status}</span>
            </div>
            <button
              onClick={onClose}
              className="liquid-glass rounded-full p-2 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto pr-2 space-y-4 text-left">
            <h3 className="text-white font-instrument text-2xl md:text-3xl leading-tight">
              {article.title}
            </h3>

            <p className="text-white/70 text-sm leading-relaxed border-l-2 border-white/20 pl-4 py-1">
              {article.summary}
            </p>

            <div className="pt-2">
              <span className="text-white/40 text-xs font-mono uppercase tracking-widest block mb-2">
                Planned Topic Breakdown / Key Themes:
              </span>
              <ul className="space-y-2 text-sm text-white/80">
                {article.outlinePoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-white/40 font-mono text-xs mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl liquid-glass border border-white/10 text-xs font-mono text-white/50 mt-4">
              *Full analytical reflection is currently in preparation as coursework and project research progress.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordLead: (lead: Omit<LeadSubmission, 'id' | 'createdAt'>) => void;
}

const CVModal: React.FC<CVModalProps> = ({ isOpen, onClose, onRecordLead }) => {
  const [copied, setCopied] = useState(false);
  const [visitorEmail, setVisitorEmail] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorEmail || !visitorEmail.includes('@') || !visitorEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address to unlock.');
      return;
    }
    setErrorMessage('');
    setIsProcessing(true);
    const cleanEmail = visitorEmail.trim();

    onRecordLead({
      type: 'CV Unlock',
      email: cleanEmail,
      timestamp: new Date().toLocaleString(),
      message: 'Visitor unlocked and viewed full CV.'
    });

    notifyEmailDirectly({
      type: 'CV Unlock Request',
      email: cleanEmail,
      message: `Visitor unlocked CV on ${new Date().toLocaleString()}`
    });

    setIsProcessing(false);
    setIsUnlocked(true);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="liquid-glass w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 sm:p-7 md:p-10 flex flex-col overflow-hidden border border-white/10 shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                {isUnlocked ? (
                  <FileText className="w-5 h-5 text-white/80" />
                ) : (
                  <Lock className="w-4 h-4 text-white/80" />
                )}
              </div>
              <div>
                <h3 className="text-white font-instrument text-2xl leading-none">
                  Curriculum Vitae — {CANDIDATE_NAME}
                </h3>
                <span className="text-white/40 text-xs font-mono">
                  {isUnlocked
                    ? 'Verified Candidate Profile • ATS-Optimised Format'
                    : 'Email verification required to view'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isUnlocked && (
                <button
                  onClick={handleCopy}
                  className="liquid-glass rounded-full px-4 py-2 text-white text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="liquid-glass rounded-full p-2 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isUnlocked ? (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
              <div className="w-14 h-14 rounded-full liquid-glass flex items-center justify-center mb-5 border border-white/20">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-instrument text-3xl mb-2">
                Unlock Curriculum Vitae
              </h4>
              <p className="text-white/70 text-sm leading-relaxed mb-6 font-light">
                Please enter your email to view Atharv’s complete verified CV, academic history, and project evidence. Access is provided for view-only verification.
              </p>

              <form onSubmit={handleUnlock} className="w-full space-y-4">
                <div className="liquid-glass rounded-2xl p-1 border border-white/15 focus-within:border-white/40 transition-all">
                  <input
                    type="email"
                    required
                    value={visitorEmail}
                    onChange={(e) => {
                      setVisitorEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent px-4 py-3 text-white placeholder:text-white/40 text-sm outline-none font-mono"
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-400 text-xs font-mono">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-white text-black font-semibold rounded-full py-3 text-xs uppercase tracking-wider hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{isProcessing ? 'Verifying...' : 'Unlock & View Complete CV'}</span>
                </button>
              </form>

              <div className="flex items-center gap-2 mt-6 text-white/40 text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-white/60" />
                <span>Protected view • Direct downloads disabled</span>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto py-6 pr-2 space-y-8 text-left select-text">
              {/* Access status bar */}
              <div className="liquid-glass rounded-xl px-4 py-2.5 border border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Access verified for: <strong className="text-white font-medium">{visitorEmail}</strong></span>
                </div>
                <span className="text-[11px] text-white/40 uppercase tracking-wider">ATS Standard Document</span>
              </div>

              {/* CV Document Container */}
              <div className="liquid-glass rounded-3xl p-6 sm:p-8 md:p-10 border border-white/15 space-y-8 bg-black/40">
                
                {/* Header */}
                <div className="border-b border-white/15 pb-6 text-center md:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-instrument text-white tracking-tight">
                    ATHARV AGRAWAL
                  </h1>
                  <p className="text-white/60 text-xs sm:text-sm font-mono mt-1.5 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                    <span>Melbourne, VIC, Australia</span>
                    <span>•</span>
                    <a href={`tel:${CANDIDATE_PHONE}`} className="hover:text-white transition-colors">{CANDIDATE_PHONE}</a>
                    <span>•</span>
                    <a href={`mailto:${PROFESSIONAL_EMAIL}`} className="hover:text-white transition-colors">{PROFESSIONAL_EMAIL}</a>
                  </p>
                  <div className="mt-3 inline-block liquid-glass rounded-full px-4 py-1 text-xs font-mono text-white/90 border border-white/15">
                    Business Student | Global Business, International Markets &amp; Operations
                  </div>
                </div>

                {/* Profile */}
                <div>
                  <h2 className="text-xs uppercase font-mono tracking-widest text-white/40 mb-2 border-b border-white/10 pb-1">
                    PROFILE
                  </h2>
                  <p className="text-white/80 text-sm leading-relaxed font-light">
                    Bachelor of Business Professional Practice student at RMIT University with hands-on exposure to small business operations, industry-client project work, and student leadership. Combines practical customer-facing and inventory experience from a family restaurant with structured academic research in market entry, emerging technology, and business ethics. Seeking to contribute strong analytical, stakeholder communication, and research skills to early-career internship and project roles across business operations, supply chain, and international commerce.
                  </p>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-xs uppercase font-mono tracking-widest text-white/40 mb-3 border-b border-white/10 pb-1">
                    EDUCATION
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-base">RMIT University — Melbourne, VIC, Australia</h3>
                        <span className="text-white/40 text-xs font-mono font-normal">2026 – 2030</span>
                      </div>
                      <p className="text-white/70 text-xs font-mono italic mb-1.5">Bachelor of Business Professional Practice</p>
                      <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
                        <li><strong className="text-white font-medium">Key Study Areas:</strong> Global Business, International Trade, Supply Chain &amp; Logistics, Business Strategy, Business Decision Making.</li>
                        <li><strong className="text-white font-medium">Active Involvement:</strong> Committee Member, RMIT Business Student Association (BSA).</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-base">Delhi Public School Indore — Indore, India</h3>
                        <span className="text-white/40 text-xs font-mono font-normal">Completed 2026</span>
                      </div>
                      <p className="text-white/70 text-xs font-mono italic mb-1.5">Senior Secondary School Certificate (CBSE) — Commerce &amp; Mathematics</p>
                      <p className="text-white/70 text-xs"><strong className="text-white font-medium">Foundations:</strong> Business Studies, Economics, Accountancy, Applied Mathematics.</p>
                    </div>
                  </div>
                </div>

                {/* Professional & Operational Experience */}
                <div>
                  <h2 className="text-xs uppercase font-mono tracking-widest text-white/40 mb-3 border-b border-white/10 pb-1">
                    PROFESSIONAL &amp; OPERATIONAL EXPERIENCE
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-base">MID FLIGHT GARDEN RESTAURANT &amp; CAFE — Indore, India</h3>
                        <span className="text-white/40 text-xs font-mono">May 2025 – Jun 2026</span>
                      </div>
                      <p className="text-white/70 text-xs font-mono italic mb-2">Business Operations Support</p>
                      <ul className="text-white/75 text-xs space-y-1.5 list-disc list-inside">
                        <li>Supported day-to-day front-of-house and back-of-house operations alongside family management in a high-turnover dining environment.</li>
                        <li>Monitored daily perishable inventory levels, tracked stock usage patterns, and assisted with supplier intake checks to minimise ingredient waste and stockouts.</li>
                        <li>Delivered direct customer service to patrons, managing order accuracy, table turnover timing, and real-time customer feedback during peak service hours.</li>
                        <li>Contributed consumer-driven menu modification ideas based on direct customer ordering preferences and seasonal ingredient availability.</li>
                        <li>Maintained strict cleanliness, food handling, and dining room presentation standards to ensure regulatory compliance and consistent service quality.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-base">RMIT BUSINESS STUDENT ASSOCIATION (BSA) — Melbourne, VIC, Australia</h3>
                        <span className="text-white/40 text-xs font-mono">Aug 2026 – Present</span>
                      </div>
                      <p className="text-white/70 text-xs font-mono italic mb-2">Committee Member</p>
                      <ul className="text-white/75 text-xs space-y-1.5 list-disc list-inside">
                        <li>Collaborate with student executive teams to support professional networking events, business student engagement, and industry speaker initiatives.</li>
                        <li>Liaise with peers across different business degree disciplines to understand member needs and promote participation in co-curricular professional workshops.</li>
                        <li>Develop communication assets and practical outreach approaches to strengthen community connection across the university business cohort.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Selected Business & Industry Projects */}
                <div>
                  <h2 className="text-xs uppercase font-mono tracking-widest text-white/40 mb-3 border-b border-white/10 pb-1">
                    SELECTED BUSINESS &amp; INDUSTRY PROJECTS
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-sm">IBM SkillsBuild Industry-Based Project — <span className="font-light italic text-white/60">RMIT University</span></h3>
                        <span className="text-white/40 text-xs font-mono">2026</span>
                      </div>
                      <p className="text-white/60 text-xs font-mono mb-1.5">Human-Centred Problem Solving &amp; Business Research</p>
                      <ul className="text-white/75 text-xs space-y-1 list-disc list-inside">
                        <li>Collaborated in a student team on an industry brief to investigate systemic barriers affecting adult learner participation and digital credential completion.</li>
                        <li>Conducted primary and secondary stakeholder analysis, synthesizing user feedback into empathy maps and target learner personas.</li>
                        <li>Formulated "How Might We" problem statements to reframe engagement bottlenecks into actionable intervention concepts.</li>
                        <li>Ideated and evaluated structured modular learning incentives and peer support touchpoints designed to increase course completion rates.</li>
                        <li>Co-developed and presented final synthesis report and slide deck recommendations directly evaluated against industry project rubrics.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-sm">Emerging Technology Analysis: Zipline Autonomous Logistics — <span className="font-light italic text-white/60">RMIT University</span></h3>
                        <span className="text-white/40 text-xs font-mono">2026</span>
                      </div>
                      <p className="text-white/60 text-xs font-mono mb-1.5">Strategic Business &amp; Market Analysis</p>
                      <ul className="text-white/75 text-xs space-y-1 list-disc list-inside">
                        <li>Investigated the commercial feasibility and supply chain implications of Zipline’s autonomous drone delivery system across remote healthcare corridors.</li>
                        <li>Applied strategic evaluation frameworks including PESTLE, SWOT, and Porter’s Five Forces to assess operational barriers, regulatory friction, and infrastructure costs.</li>
                        <li>Researched aviation safety regulations and civil aviation framework requirements governing autonomous commercial flight paths.</li>
                        <li>Synthesised cost-per-delivery trade-offs into an academic presentation deck highlighting commercial scalability constraints in low-density geographies.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-sm">Australian Quick-Commerce Market Concept — <span className="font-light italic text-white/60">Independent Commercial Exploration</span></h3>
                        <span className="text-white/40 text-xs font-mono">2026</span>
                      </div>
                      <p className="text-white/60 text-xs font-mono mb-1.5">Market Research &amp; Concept Development</p>
                      <ul className="text-white/75 text-xs space-y-1 list-disc list-inside">
                        <li>Researched the Australian rapid-delivery sector to explore whether an on-demand grocery model could function sustainably without capital-heavy dark stores.</li>
                        <li>Evaluated existing grocery supply chain dynamics, identifying operational integration points between independent couriers and established brick-and-mortar supermarkets.</li>
                        <li>Analysed the structural hurdles of Australian suburban sprawl, inventory synchronisation challenges, in-store picking congestion, and retail award wages.</li>
                        <li>Drafted a commercial concept brief detailing operational risks, dispatch economics, and critical validation milestones required for partnership-based delivery.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-sm">Business &amp; Society: Corporate Social Responsibility Analysis — <span className="font-light italic text-white/60">RMIT University</span></h3>
                        <span className="text-white/40 text-xs font-mono">2026</span>
                      </div>
                      <p className="text-white/60 text-xs font-mono mb-1.5">Business Ethics &amp; Stakeholder Research</p>
                      <ul className="text-white/75 text-xs space-y-1 list-disc list-inside">
                        <li>Conducted an academic investigation evaluating shareholder primacy (Milton Friedman) versus stakeholder governance theory (R. Edward Freeman).</li>
                        <li>Analysed the Coca-Cola India groundwater extraction controversy to assess the legal, social, and long-term financial consequences of ignoring community externalities.</li>
                        <li>Synthesised academic literature into a structured, evidence-backed research essay demonstrating how social license directly influences commercial risk and corporate continuity.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Leadership & Co-Curricular Experience */}
                <div>
                  <h2 className="text-xs uppercase font-mono tracking-widest text-white/40 mb-3 border-b border-white/10 pb-1">
                    LEADERSHIP &amp; CO-CURRICULAR EXPERIENCE
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-sm">Forge Model United Nations — <span className="font-light italic text-white/60">India</span></h3>
                        <span className="text-white/40 text-xs font-mono">Dec 2025 – Jun 2026</span>
                      </div>
                      <p className="text-white/60 text-xs font-mono mb-1">Secretary (Core Organizing Secretariat)</p>
                      <ul className="text-white/75 text-xs space-y-1 list-disc list-inside">
                        <li>Coordinated delegate registration administration, event logistics, and pre-conference briefing materials across a multi-member organizing committee.</li>
                        <li>Managed formal written communications with registered delegates, prospective partners, and venue stakeholders to ensure milestone schedule adherence.</li>
                        <li>Supported sponsorship outreach efforts by assembling professional event prospectuses and standardising partnership inquiry tracking.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-sm">DPSiMUN — <span className="font-light italic text-white/60">India</span></h3>
                        <span className="text-white/40 text-xs font-mono">Jul 2025 – Aug 2025</span>
                      </div>
                      <p className="text-white/60 text-xs font-mono mb-1">Vice Chairperson — DISEC Committee</p>
                      <ul className="text-white/75 text-xs space-y-1 list-disc list-inside">
                        <li>Co-moderated formal debates on international disarmament and security topics, managing conflicting viewpoints with strict procedural neutrality.</li>
                        <li>Guided delegates through resolution drafting, consensus building, and formal caucus sessions under parliamentary procedure rules.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-sm">Delhi Public School Indore Quiz Club — <span className="font-light italic text-white/60">Indore, India</span></h3>
                        <span className="text-white/40 text-xs font-mono">Jun 2025 – Feb 2026</span>
                      </div>
                      <p className="text-white/60 text-xs font-mono mb-1">President</p>
                      <ul className="text-white/75 text-xs space-y-1 list-disc list-inside">
                        <li>Organised regular inter-class trivia, business current affairs sessions, and selection trials to build active knowledge-sharing habits among peers.</li>
                        <li>Represented the institution in inter-school academic quiz circuits, coordinating practice schedules and team delegate preparation.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-sm">Spectacle Spectrum 2025 — <span className="font-light italic text-white/60">Phoenix Citadel Mall, Indore, India</span></h3>
                        <span className="text-white/40 text-xs font-mono">Nov 2025</span>
                      </div>
                      <p className="text-white/60 text-xs font-mono mb-1">Event Host &amp; Quiz Master</p>
                      <ul className="text-white/75 text-xs space-y-1 list-disc list-inside">
                        <li>Hosted and moderated the live stage quiz segment of a major cultural showcase before an audience of <strong className="text-white font-medium">500+ registered attendees</strong>.</li>
                        <li>Managed stage timing, score tabulation coordination, and live crowd engagement in a fast-paced public venue setting.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-sm">Freax — <span className="font-light italic text-white/60">Global / Remote</span></h3>
                        <span className="text-white/40 text-xs font-mono">Aug 2025 – Jun 2026</span>
                      </div>
                      <p className="text-white/60 text-xs font-mono mb-1">Peer Advisor</p>
                      <ul className="text-white/75 text-xs space-y-1 list-disc list-inside">
                        <li>Facilitated one-on-one and small group peer advisory sessions, breaking down complex behavioral and psychology-related concepts into clear study frameworks.</li>
                        <li>Developed active listening and mentoring methods to help fellow students build learning confidence and independent study strategies.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-white font-medium text-sm">Centre for Science and Environment — Green Schools Programme — <span className="font-light italic text-white/60">India</span></h3>
                        <span className="text-white/40 text-xs font-mono">Oct 2024 – Oct 2025</span>
                      </div>
                      <p className="text-white/60 text-xs font-mono mb-1">Student Environmental Auditor</p>
                      <ul className="text-white/75 text-xs space-y-1 list-disc list-inside">
                        <li>Participated in school-wide environmental audit surveys, assessing baseline resource consumption, waste handling, and operational energy efficiency.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h2 className="text-xs uppercase font-mono tracking-widest text-white/40 mb-3 border-b border-white/10 pb-1">
                    SKILLS
                  </h2>
                  <div className="space-y-2 text-xs text-white/80">
                    <p><strong className="text-white font-medium">Business &amp; Strategic Analysis:</strong> Strategic Frameworks (PESTLE, SWOT, Porter's Five Forces), Stakeholder Analysis, Business Model Ideation, Market Opportunity Assessment, Business Ethics Evaluation, Secondary Research.</p>
                    <p><strong className="text-white font-medium">Operations &amp; Supply Chain Foundations:</strong> Inventory Tracking, Supplier Intake Coordination, Last-Mile Logistics Concepts, Retail Store Operations, Process Mapping, Quality Assurance Awareness.</p>
                    <p><strong className="text-white font-medium">Communication &amp; Stakeholder Management:</strong> Executive Presentation, Report Writing, Public Speaking &amp; Emceeing, Cross-Cultural Communication, Committee Collaboration, Conflict Resolution, Event Facilitation.</p>
                    <p><strong className="text-white font-medium">Tools &amp; Digital Platforms:</strong> Microsoft 365 (Excel, PowerPoint, Word), Google Workspace, Adobe Creative Tools (Video Editing / Express), Virtual Collaboration Tools (Miro, Zoom, Teams).</p>
                  </div>
                </div>

                {/* Achievements, Certifications & Intercultural Credentials */}
                <div>
                  <h2 className="text-xs uppercase font-mono tracking-widest text-white/40 mb-3 border-b border-white/10 pb-1">
                    ACHIEVEMENTS, CERTIFICATIONS &amp; INTERCULTURAL CREDENTIALS
                  </h2>
                  <ul className="text-white/75 text-xs space-y-1.5 list-disc list-inside">
                    <li><strong className="text-white font-medium">AFS Intercultural Programs India:</strong> Selected as one of the <strong className="text-white font-medium">Top 30 students</strong> across the national DPS school network for a fully funded Japanese Language and Cultural Exchange Program (Mar 2025 – Dec 2025).</li>
                    <li><strong className="text-white font-medium">Adobe Express National Video Editing Challenge:</strong> Winner — Visual Storytelling &amp; Digital Media Content (2025). Awarded 1-Year Adobe Creative Membership.</li>
                    <li><strong className="text-white font-medium">Sapt Swar Music &amp; Dance Academy:</strong> Completed a structured 2-Year Diploma in Guitar Performance &amp; Music Theory (Feb 2024 – Feb 2026).</li>
                    <li><strong className="text-white font-medium">DPS Social Service Club:</strong> Deputy Director — Coordinated student community service drives and peer engagement initiatives (Jun 2024 – Aug 2025).</li>
                  </ul>
                </div>

                {/* Document footer notice */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-white/40 text-[11px] font-mono">
                  <span>Verified Candidate Document • RMIT University</span>
                  <span>ATS-Optimised Layout</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordLead: (lead: Omit<LeadSubmission, 'id' | 'createdAt'>) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onRecordLead }) => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  if (!isOpen) return null;

  const copyEmailToClipboard = () => {
    navigator.clipboard?.writeText(PROFESSIONAL_EMAIL);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMsg.trim() || !formEmail.trim()) return;

    const contactEmail = formEmail.trim();
    const contactName = formName.trim();
    const contactMessage = formMsg.trim();

    onRecordLead({
      type: 'Direct Message',
      email: contactEmail,
      name: contactName,
      message: contactMessage,
      timestamp: new Date().toLocaleString()
    });

    notifyEmailDirectly({
      type: 'Direct Message / Inquiry',
      email: contactEmail,
      name: contactName,
      message: contactMessage
    });

    const subject = encodeURIComponent(`Inquiry from ${contactName} regarding Portfolio`);
    const body = encodeURIComponent(`Hi ${CANDIDATE_NAME},\n\n${contactMessage}\n\nFrom: ${contactName} (${contactEmail})`);
    window.open(`mailto:${PROFESSIONAL_EMAIL}?subject=${subject}&body=${body}`, '_blank');

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormName('');
      setFormEmail('');
      setFormMsg('');
      onClose();
    }, 2800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="liquid-glass w-full max-w-lg rounded-3xl p-6 md:p-8 flex flex-col border border-white/10 shadow-2xl relative"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div>
              <h3 className="text-white font-instrument text-2xl">
                Let’s Connect
              </h3>
              <p className="text-white/40 text-xs font-mono mt-0.5">
                {CANDIDATE_NAME} • RMIT University, Melbourne
              </p>
            </div>
            <button
              onClick={onClose}
              className="liquid-glass rounded-full p-2 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="liquid-glass rounded-2xl p-4 mb-4 border border-white/10 bg-white/[0.02]">
            <p className="text-white/90 text-sm leading-relaxed font-instrument italic">
              “Thank you for visiting! I truly appreciate that you'd like to take things forward. Whether you have an industry opportunity, a project to collaborate on, or simply want to exchange ideas—I'd be glad to hear from you.”
            </p>
          </div>

          <div className="liquid-glass rounded-2xl p-4 mb-5 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider block">
                  Professional Email
                </span>
                <a
                  href={`mailto:${PROFESSIONAL_EMAIL}`}
                  className="text-white text-xs md:text-sm font-medium hover:underline truncate block"
                >
                  {PROFESSIONAL_EMAIL}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={copyEmailToClipboard}
                className="liquid-glass rounded-full px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 cursor-pointer font-mono"
              >
                {emailCopied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {sent ? (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
              <h4 className="text-white text-lg font-medium">Opening Your Mail Client</h4>
              <p className="text-white/70 text-sm mt-1 max-w-xs leading-relaxed">
                Appreciate you reaching out to move forward! Your draft email has been prepared for {PROFESSIONAL_EMAIL}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest font-mono mb-2">
                  Name / Organization
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Recruiter, Industry Mentor, Peer"
                  className="liquid-glass w-full rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>

              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest font-mono mb-2">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="liquid-glass w-full rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>

              <div>
                <label className="block text-white/40 text-xs uppercase tracking-widest font-mono mb-2">
                  Message / Inquiry
                </label>
                <textarea
                  required
                  rows={4}
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  placeholder="Inquire regarding academic projects, student internships, or general connection..."
                  className="liquid-glass w-full rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none focus:ring-1 focus:ring-white/40 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </a>

                <button
                  type="submit"
                  className="bg-white text-black rounded-full px-6 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-neutral-200 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface FooterProps {
  onOpenAbout: () => void;
  onOpenCV: () => void;
  onOpenContact: () => void;
  onOpenPortal: () => void;
  leadsCount: number;
}

const Footer: React.FC<FooterProps> = ({ onOpenAbout, onOpenCV, onOpenContact, onOpenPortal, leadsCount }) => {
  return (
    <footer className="bg-black border-t border-white/10 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row md:items-center gap-3 text-center md:text-left">
          <div className="flex items-center justify-center gap-2">
            <Globe className="w-4 h-4 text-white/70" />
            <span className="text-white font-semibold tracking-tight text-base">
              {CANDIDATE_NAME}
            </span>
          </div>
          <span className="text-white/40 text-xs font-mono">
            Bachelor of Business Professional Practice • RMIT University
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/70 font-mono uppercase tracking-wider">
          <button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer">
            About
          </button>
          <a href="#projects" className="hover:text-white transition-colors">
            Selected Work
          </a>
          <a href="#experience" className="hover:text-white transition-colors">
            Experience
          </a>
          <a href="#education" className="hover:text-white transition-colors">
            Education
          </a>
          <a href="#focus" className="hover:text-white transition-colors">
            Focus
          </a>
          <button onClick={onOpenCV} className="hover:text-white transition-colors cursor-pointer">
            CV
          </button>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Linkedin className="w-3 h-3" />
            <span>LinkedIn</span>
          </a>
          <button
            onClick={onOpenContact}
            className="liquid-glass px-4 py-1.5 rounded-full text-white text-xs hover:bg-white/10 transition-colors cursor-pointer"
          >
            Contact
          </button>
          <button
            onClick={onOpenPortal}
            title="Owner Portal"
            className="liquid-glass px-3.5 py-1.5 rounded-full text-white/80 hover:text-white text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer bg-white/5"
          >
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Web Portal ({leadsCount})</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

interface WebPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadSubmission[];
}

const WebPortalModal: React.FC<WebPortalModalProps> = ({ isOpen, onClose, leads }) => {
  const [filter, setFilter] = useState<'ALL' | 'CV Unlock' | 'Direct Message' | 'Connect Newsletter'>('ALL');
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const filteredLeads = leads.filter(l => filter === 'ALL' || l.type === filter);

  const handleCopyEmails = () => {
    const emails = Array.from(new Set(leads.map(l => l.email))).join(', ');
    navigator.clipboard?.writeText(emails);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = 'Type,Email,Name,Message,Timestamp\n';
    const rows = leads.map(l => 
      `"${l.type}","${l.email}","${l.name || ''}","${(l.message || '').replace(/"/g, '""')}","${l.timestamp}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Atharv_Portfolio_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="liquid-glass w-full max-w-4xl max-h-[88vh] rounded-3xl p-6 md:p-8 flex flex-col border border-white/15 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                <Inbox className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-instrument text-2xl">Owner Web Portal</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Live Data ({leads.length})
                  </span>
                </div>
                <p className="text-white/40 text-xs font-mono">
                  All visitor CV unlocks, contact requests, and newsletter submissions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyEmails}
                disabled={leads.length === 0}
                className="liquid-glass rounded-full px-3.5 py-1.5 text-xs text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-mono border border-white/10"
              >
                {copiedAll ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Copied' : 'Copy All Emails'}</span>
              </button>
              <button
                onClick={handleExportCSV}
                disabled={leads.length === 0}
                className="bg-white text-black rounded-full px-3.5 py-1.5 text-xs font-semibold hover:bg-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer font-mono"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={onClose}
                className="liquid-glass rounded-full p-2 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 shrink-0 overflow-x-auto pb-1 text-xs font-mono">
            {(['ALL', 'CV Unlock', 'Direct Message', 'Connect Newsletter'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  filter === f ? 'bg-white text-black font-semibold' : 'liquid-glass text-white/60 hover:text-white border border-white/5'
                }`}
              >
                {f} {f === 'ALL' ? `(${leads.length})` : `(${leads.filter(l => l.type === f).length})`}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto pr-2 space-y-3 text-left flex-1">
            {filteredLeads.length === 0 ? (
              <div className="py-16 text-center text-white/40 font-mono text-xs">
                No submissions recorded under this filter yet.
              </div>
            ) : (
              filteredLeads.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="liquid-glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        item.type === 'CV Unlock'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : item.type === 'Direct Message'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.type}
                      </span>
                      <strong className="text-white text-sm font-medium font-mono">{item.email}</strong>
                      {item.name && <span className="text-white/60 text-xs font-mono">({item.name})</span>}
                    </div>
                    <span className="text-[11px] font-mono text-white/40">{item.timestamp}</span>
                  </div>

                  {item.message && (
                    <p className="text-white/80 text-xs leading-relaxed font-sans-clean bg-white/[0.02] p-2.5 rounded-xl border border-white/5 mt-1">
                      {item.message}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[11px] font-mono text-white/40 shrink-0">
            <span>Direct forwarding configured to: {PROFESSIONAL_EMAIL}</span>
            <span>Real-time persistence active</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function App() {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null);
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  const [leads, setLeads] = useState<LeadSubmission[]>(() => loadLocalLeads());
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch {
        // Fallback offline mode
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !currentUser) return;
    try {
      const inquiriesRef = collection(db, 'artifacts', appId, 'public', 'data', 'inquiries');
      const unsubscribe = onSnapshot(
        inquiriesRef,
        (snapshot) => {
          const fetched = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as LeadSubmission[];

          setLeads((prev) => {
            const mergedMap = new Map<string, LeadSubmission>();
            prev.forEach((item) => {
              mergedMap.set(item.id || `${item.email}-${item.createdAt}`, item);
            });
            fetched.forEach((item) => {
              mergedMap.set(item.id || `${item.email}-${item.createdAt}`, item);
            });
            const merged = Array.from(mergedMap.values()).sort(
              (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
            );
            saveLocalLeads(merged);
            return merged;
          });
        },
        () => {
          // Offline handling
        }
      );
      return () => unsubscribe();
    } catch {
      // Quiet fallback
    }
  }, [currentUser]);

  const handleRecordLead = async (leadData: Omit<LeadSubmission, 'id' | 'createdAt'>) => {
    const newEntry: LeadSubmission = {
      ...leadData,
      id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now()
    };

    setLeads((prev) => {
      const updated = [newEntry, ...prev];
      saveLocalLeads(updated);
      return updated;
    });

    if (db && currentUser) {
      try {
        const inquiriesRef = collection(db, 'artifacts', appId, 'public', 'data', 'inquiries');
        await addDoc(inquiriesRef, newEntry);
      } catch {
        // Handled via local storage
      }
    }
  };

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans-clean selection:bg-white selection:text-black">
      {/* Hero Section */}
      <HeroSection
        onExploreWork={scrollToProjects}
        onOpenCV={() => setIsCVModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onRecordLead={handleRecordLead}
      />

      {/* About Me Section */}
      <AboutSection onOpenAboutModal={() => setIsAboutModalOpen(true)} />

      {/* Selected Work (Projects) */}
      <ProjectsSection
        onOpenCaseStudy={(study) => setSelectedCaseStudy(study)}
      />

      {/* Curated Experience Section */}
      <ExperienceSection
        onOpenRestaurantModal={() => setIsRestaurantModalOpen(true)}
        onOpenExperienceDetail={(item) => setSelectedExperience(item)}
      />

      {/* Dedicated Education Section */}
      <EducationSection />

      {/* Areas of Focus */}
      <PhilosophySection />

      {/* Footer with Web Portal Access */}
      <Footer
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenCV={() => setIsCVModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenPortal={() => setIsPortalModalOpen(true)}
        leadsCount={leads.length}
      />

      {/* Case Study Modal */}
      <CaseStudyModal
        study={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />

      {/* Restaurant Experience Deep-Dive Modal */}
      <RestaurantCaseStudyModal
        isOpen={isRestaurantModalOpen}
        onClose={() => setIsRestaurantModalOpen(false)}
      />

      {/* Experience Milestone Modal */}
      <ExperienceDetailModal
        item={selectedExperience}
        onClose={() => setSelectedExperience(null)}
      />

      {/* About Candidate Profile Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenCV={() => setIsCVModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
      />

      {/* Insights Outline Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Gated Curriculum Vitae / Resume Modal */}
      <CVModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        onRecordLead={handleRecordLead}
      />

      {/* Contact Direct Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onRecordLead={handleRecordLead}
      />

      {/* Owner Web Portal Modal */}
      <WebPortalModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        leads={leads}
      />
    </div>
  );
}