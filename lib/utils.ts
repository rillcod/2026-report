import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate grade based on score
export function calculateGrade(score: number): string {
  if (score >= 85) return "A"
  if (score >= 70) return "B"
  if (score >= 65) return "C"
  if (score >= 50) return "D"
  return "F"
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

export function replacePlaceholders(
  template: string,
  placeholders: Record<string, string | number>,
): string {
  return template.replace(/\[(\w+)\]/g, (match, key) => {
    return placeholders[key]?.toString() || match
  })
}

// Course content and progress items
export interface CourseModule {
  id: string
  name: string
  description: string
  progressItems: string[]
  skills: string[]
  projects: string[]
}

export interface Course {
  id: string
  name: string
  description: string
  modules: CourseModule[]
  assessmentCriteria: string[]
}

// Enhanced course content with robotics
export const courseContent: Record<string, Course> = {
  scratch: {
    id: "scratch",
    name: "Scratch Programming",
    description: "Visual programming fundamentals for beginners",
    modules: [
      {
        id: "basics",
        name: "Programming Basics",
        description: "Introduction to visual programming concepts",
        progressItems: [
          "Understanding the Scratch interface and workspace navigation",
          "Creating and managing sprites with custom properties",
          "Implementing basic motion commands and coordinate systems",
          "Using sound blocks and multimedia integration effectively",
        ],
        skills: ["Visual programming", "Logic building", "Creative thinking"],
        projects: ["Animated story", "Simple game", "Interactive presentation"],
      },
      {
        id: "control",
        name: "Control Structures",
        description: "Loops, conditions, and program flow",
        progressItems: [
          "Mastering forever loops and repeat structures for automation",
          "Implementing conditional statements with if-then-else logic",
          "Creating interactive programs with user input and responses",
          "Developing complex animations using nested control structures",
        ],
        skills: ["Logical thinking", "Problem decomposition", "Algorithm design"],
        projects: ["Interactive quiz", "Maze game", "Calculator"],
      },
    ],
    assessmentCriteria: [
      "Code organization and structure",
      "Creative problem-solving approach",
      "Understanding of programming concepts",
      "Project presentation and documentation",
    ],
  },
  python: {
    id: "python",
    name: "Python Programming",
    description: "Text-based programming with Python fundamentals",
    modules: [
      {
        id: "fundamentals",
        name: "Python Fundamentals",
        description: "Variables, data types, and basic operations",
        progressItems: [
          "Mastering variable declaration and data type manipulation",
          "Understanding string operations and formatting techniques",
          "Implementing mathematical operations and operator precedence",
          "Working with user input and output formatting effectively",
        ],
        skills: ["Syntax mastery", "Data manipulation", "Problem solving"],
        projects: ["Calculator app", "Text processor", "Number guessing game"],
      },
      {
        id: "structures",
        name: "Data Structures",
        description: "Lists, dictionaries, and data organization",
        progressItems: [
          "Creating and manipulating lists with various methods",
          "Understanding dictionary structures and key-value relationships",
          "Implementing nested data structures for complex information",
          "Mastering iteration techniques for data processing",
        ],
        skills: ["Data organization", "Algorithm implementation", "Efficiency optimization"],
        projects: ["Student database", "Inventory system", "Data analyzer"],
      },
    ],
    assessmentCriteria: [
      "Code quality and readability",
      "Algorithm efficiency",
      "Error handling and debugging",
      "Documentation and comments",
    ],
  },
  robotics: {
    id: "robotics",
    name: "Robotics Engineering",
    description: "Mechanical engineering and embedded programming integration",
    modules: [
      {
        id: "mechanical",
        name: "Mechanical Foundations",
        description: "Robot mechanics, kinematics, and structural design",
        progressItems: [
          "Understanding robot kinematics and degrees of freedom analysis",
          "Designing mechanical linkages and gear ratio calculations",
          "Implementing motor control systems with encoder feedback",
          "Creating stable robot chassis with proper weight distribution",
        ],
        skills: ["Mechanical design", "3D modeling", "Engineering analysis"],
        projects: ["Mobile robot platform", "Robotic arm", "Autonomous vehicle"],
      },
      {
        id: "embedded",
        name: "Embedded Programming",
        description: "Microcontroller programming and sensor integration",
        progressItems: [
          "Programming microcontrollers with C++ and Arduino IDE",
          "Integrating multiple sensors for environmental awareness",
          "Implementing real-time control systems and interrupt handling",
          "Developing wireless communication protocols for robot networks",
        ],
        skills: ["Embedded programming", "System integration", "Real-time processing"],
        projects: ["Sensor array system", "Remote control robot", "Autonomous navigation"],
      },
      {
        id: "ai",
        name: "Robot Intelligence",
        description: "AI algorithms and autonomous behavior programming",
        progressItems: [
          "Implementing path planning algorithms for navigation",
          "Developing machine learning models for object recognition",
          "Creating decision trees for autonomous behavior selection",
          "Integrating computer vision for environmental understanding",
        ],
        skills: ["AI programming", "Computer vision", "Decision systems"],
        projects: ["Smart surveillance robot", "Autonomous delivery system", "Interactive companion robot"],
      },
    ],
    assessmentCriteria: [
      "Mechanical design quality",
      "Programming complexity and efficiency",
      "System integration capabilities",
      "Innovation and problem-solving approach",
    ],
  },
  web: {
    id: "web",
    name: "Web Development",
    description: "Modern web technologies and full-stack development",
    modules: [
      {
        id: "frontend",
        name: "Frontend Development",
        description: "HTML, CSS, JavaScript, and responsive design",
        progressItems: [
          "Creating semantic HTML structures with accessibility considerations",
          "Implementing responsive CSS layouts with modern techniques",
          "Developing interactive JavaScript applications with DOM manipulation",
          "Integrating modern frameworks for component-based development",
        ],
        skills: ["UI/UX design", "Responsive development", "JavaScript programming"],
        projects: ["Portfolio website", "Interactive web app", "E-commerce frontend"],
      },
      {
        id: "backend",
        name: "Backend Development",
        description: "Server-side programming and database integration",
        progressItems: [
          "Building RESTful APIs with proper authentication systems",
          "Implementing database design and optimization strategies",
          "Creating server-side applications with security best practices",
          "Deploying applications with cloud services and DevOps practices",
        ],
        skills: ["Server programming", "Database design", "API development"],
        projects: ["Blog platform", "Social media app", "Business management system"],
      },
    ],
    assessmentCriteria: [
      "Code quality and organization",
      "User experience design",
      "Performance optimization",
      "Security implementation",
    ],
  },
}

// Student performance interfaces
export interface StudentData {
  studentName: string
  theoryScore: number
  practicalScore: number
  attendance: number
  participation: string
}

export interface FormData {
  studentName: string
  schoolName: string
  studentSection: string
  reportDate: string
  theoryScore: string
  practicalScore: string
  attendance: string
  participation: string
  projectCompletion: string
  homeworkCompletion: string
  progressItems: string[]
  strengths: string
  growth: string
  comments: string
  certificateText: string
  showPaymentDetails: boolean
  studentPhoto: File | null
  courseName: string
  currentModule: string
  nextModule: string
  instructorName: string
  duration: string
  nextTermFee: string
  bankDetails: string
  digitalSignature: string | null
}
