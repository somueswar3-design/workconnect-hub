import { WorkerProfile } from '@/types/profile';
import { countries } from '@/data/countries';

const firstNames = [
  'Tech', 'Code', 'Dev', 'Cloud', 'Data', 'Cyber', 'Net', 'Web', 'App', 'Smart',
  'Pro', 'Elite', 'Swift', 'Rapid', 'Alpha', 'Beta', 'Pixel', 'Logic', 'Byte', 'Stack',
  'Prime', 'Core', 'Neo', 'Quantum', 'Flex', 'Agile', 'Zen', 'Apex', 'Nova', 'Turbo',
];

const lastNames = [
  'Wizard', 'Ninja', 'Guru', 'Master', 'Pro', 'Expert', 'Ace', 'Star', 'Hero', 'Fox',
  'Hawk', 'Wolf', 'Lion', 'Tiger', 'Eagle', 'Coder', 'Builder', 'Maker', 'Solver', 'Mind',
  'Force', 'Edge', 'Spark', 'Blaze', 'Storm', 'Pulse', 'Wave', 'Drift', 'Craft', 'Smith',
];

const companies = [
  'InnovateTech', 'DevSquad', 'CreativeHub', 'SkyTech', 'AnalyticsFirst',
  'CodeCraft', 'PixelPerfect', 'CloudNine', 'DataDriven', 'AgileMinds',
  'TechBridge', 'SmartSolutions', 'DigitalEdge', 'WebWorks', 'AppFactory',
  'ByteForce', 'LogicLabs', 'NexGen', 'CoreSystems', 'SwiftDev',
];

const skillSets = [
  ['React', 'TypeScript', 'Node.js', 'AWS'],
  ['Python', 'Django', 'PostgreSQL', 'Docker'],
  ['UI/UX', 'Figma', 'CSS', 'Tailwind'],
  ['AWS', 'Azure', 'Kubernetes', 'Terraform'],
  ['Python', 'Machine Learning', 'SQL', 'Tableau'],
  ['Java', 'Spring Boot', 'MySQL', 'Redis'],
  ['React Native', 'Flutter', 'iOS', 'Android'],
  ['Angular', 'RxJS', 'NgRx', '.NET'],
  ['Vue.js', 'Nuxt.js', 'GraphQL', 'MongoDB'],
  ['DevOps', 'Jenkins', 'Docker', 'CI/CD'],
  ['Go', 'gRPC', 'Microservices', 'Kafka'],
  ['PHP', 'Laravel', 'MySQL', 'Redis'],
  ['Rust', 'WebAssembly', 'C++', 'Systems'],
  ['Salesforce', 'Apex', 'LWC', 'Integration'],
  ['Shopify', 'WooCommerce', 'Magento', 'E-commerce'],
  ['Blockchain', 'Solidity', 'Web3', 'DeFi'],
  ['AI/ML', 'TensorFlow', 'PyTorch', 'NLP'],
  ['Cybersecurity', 'Pentesting', 'SIEM', 'Compliance'],
  ['Data Engineering', 'Spark', 'Airflow', 'ETL'],
  ['SAP', 'ABAP', 'S/4HANA', 'Fiori'],
];

const countryNames = countries.map(c => c.name);

const experiences = ['1 year', '2 years', '3 years', '4 years', '5 years', '6 years', '7 years', '8 years', '10+ years', '12+ years', '15+ years'];
const availabilities: WorkerProfile['availability'][] = ['available', 'busy', 'offline'];

const bios = [
  'Passionate developer with expertise in modern technologies.',
  'Full-stack engineer focused on scalable solutions.',
  'Creative problem solver with strong communication skills.',
  'Dedicated professional delivering high-quality code.',
  'Experienced architect building enterprise-grade applications.',
  'Results-driven developer with agile methodology expertise.',
  'Innovative thinker specializing in performance optimization.',
  'Team player with extensive remote collaboration experience.',
];

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateMockFreelancers(count: number = 10000): WorkerProfile[] {
  const profiles: WorkerProfile[] = [];

  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(i * 7 + 1);
    const r2 = seededRandom(i * 13 + 2);
    const r3 = seededRandom(i * 19 + 3);
    const r4 = seededRandom(i * 23 + 4);
    const r5 = seededRandom(i * 29 + 5);
    const r6 = seededRandom(i * 31 + 6);
    const r7 = seededRandom(i * 37 + 7);
    const r8 = seededRandom(i * 41 + 8);
    const r9 = seededRandom(i * 43 + 9);

    const firstName = firstNames[Math.floor(r1 * firstNames.length)];
    const lastName = lastNames[Math.floor(r2 * lastNames.length)];
    const alias = `${firstName}${lastName}${i + 1}`;
    const mobileLastTwo = String(10 + Math.floor(r3 * 90));
    const skills = skillSets[Math.floor(r4 * skillSets.length)];
    const avail = availabilities[Math.floor(r5 * 3)];
    const countryName = countryNames[Math.floor(r8 * countryNames.length)];
    const country = countries.find(c => c.name === countryName)!;
    const rateNum = 20 + Math.floor(r9 * 130);

    profiles.push({
      id: String(i + 1),
      aliasName: alias,
      email: '******@****.com',
      mobile: `XXXXXXXX${mobileLastTwo}`,
      companyAlias: companies[Math.floor(r6 * companies.length)],
      skills,
      experience: experiences[Math.floor(r7 * experiences.length)],
      location: countryName,
      availability: avail,
      hourlyRate: `${country.currencySymbol}${rateNum}`,
      bio: bios[Math.floor(r1 * r2 * 100) % bios.length],
      createdAt: new Date(2024, Math.floor(r3 * 12), Math.floor(r4 * 28) + 1),
      lastActive: new Date(Date.now() - Math.floor(r5 * 86400000 * 30)),
    });
  }

  return profiles;
}

// Pre-generate and cache
let cachedProfiles: WorkerProfile[] | null = null;

export function getMockFreelancers(): WorkerProfile[] {
  if (!cachedProfiles) {
    cachedProfiles = generateMockFreelancers(10000);
  }
  return cachedProfiles;
}

// Get all unique skills from the dataset
export function getAllSkills(): string[] {
  const profiles = getMockFreelancers();
  return [...new Set(profiles.flatMap(p => p.skills))].sort();
}

export interface FreelancerFilters {
  query?: string;
  skill?: string;
  minRate?: number;
  maxRate?: number;
  employmentTypes?: string[]; // 'full-time' | 'part-time' | 'hourly' | 'project'
  availability?: string[]; // 'available' | 'busy' | 'offline'
  experienceLevels?: string[]; // 'entry' | 'intermediate' | 'expert'
  countries?: string[];
  page: number;
  pageSize: number;
}

function parseRate(s: string): number {
  const m = s.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function parseExpYears(s: string): number {
  const m = s.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function expLevel(years: number): 'entry' | 'intermediate' | 'expert' {
  if (years <= 2) return 'entry';
  if (years <= 5) return 'intermediate';
  return 'expert';
}

// Deterministic employment type based on id
function employmentTypeFor(id: string): 'full-time' | 'part-time' | 'hourly' | 'project' {
  const types: ('full-time' | 'part-time' | 'hourly' | 'project')[] = ['full-time', 'part-time', 'hourly', 'project'];
  return types[parseInt(id, 10) % 4];
}

// Deterministic rating
function ratingFor(id: string): { rating: number; reviews: number } {
  const n = parseInt(id, 10);
  const rating = 4 + ((n * 7) % 11) / 10; // 4.0 - 5.0
  const reviews = 20 + (n * 13) % 280;
  return { rating: Math.round(rating * 10) / 10, reviews };
}

export function getEmploymentType(id: string) { return employmentTypeFor(id); }
export function getRating(id: string) { return ratingFor(id); }
export function getExperienceLevel(exp: string) { return expLevel(parseExpYears(exp)); }

// Search and filter with pagination
export function searchFreelancers(params: FreelancerFilters): { profiles: WorkerProfile[]; total: number; totalPages: number } {
  let results = getMockFreelancers();

  if (params.query?.trim()) {
    const q = params.query.toLowerCase();
    results = results.filter(p =>
      p.aliasName.toLowerCase().includes(q) ||
      p.skills.some(s => s.toLowerCase().includes(q)) ||
      p.location.toLowerCase().includes(q) ||
      p.companyAlias.toLowerCase().includes(q)
    );
  }

  if (params.skill && params.skill !== 'all') {
    results = results.filter(p =>
      p.skills.some(s => s.toLowerCase() === params.skill!.toLowerCase())
    );
  }

  if (params.minRate !== undefined || params.maxRate !== undefined) {
    const min = params.minRate ?? 0;
    const max = params.maxRate ?? Infinity;
    results = results.filter(p => {
      const r = parseRate(p.hourlyRate);
      return r >= min && r <= max;
    });
  }

  if (params.employmentTypes && params.employmentTypes.length > 0) {
    results = results.filter(p => params.employmentTypes!.includes(employmentTypeFor(p.id)));
  }

  if (params.availability && params.availability.length > 0) {
    results = results.filter(p => params.availability!.includes(p.availability));
  }

  if (params.experienceLevels && params.experienceLevels.length > 0) {
    results = results.filter(p => params.experienceLevels!.includes(expLevel(parseExpYears(p.experience))));
  }

  if (params.countries && params.countries.length > 0) {
    results = results.filter(p => params.countries!.includes(p.location));
  }

  const total = results.length;
  const totalPages = Math.ceil(total / params.pageSize);
  const start = (params.page - 1) * params.pageSize;
  const paged = results.slice(start, start + params.pageSize);

  return { profiles: paged, total, totalPages };
}
