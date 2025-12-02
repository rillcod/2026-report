"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import QRCode from "qrcode"
import { calculateGrade } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface ReportContentProps {
  formData: any
  settings: any
  printMode?: boolean
  minimalView?: boolean
  tier?: "minimal" | "standard" | "hd"
}

export function ReportContent({ formData, settings, printMode = false, minimalView = false, tier = "standard" }: ReportContentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const reportRef = useRef<HTMLDivElement>(null)

  // Optimized content generation system
  const generateIntelligentContent = useMemo(() => {
    const getStudentLevel = (scores: any) => {
      const avgScore = (scores.theory + scores.practical + scores.attitude) / 3
      if (avgScore >= 85) return "excellent"
      if (avgScore >= 75) return "good"
      if (avgScore >= 65) return "satisfactory"
      return "needs improvement"
    }

    const generateComment = (studentName: string, subject: string, level: string, scores: any) => {
      const firstName = studentName.split(" ")[0] || studentName
      
      const commentTemplates = {
        excellent: [
          `${firstName} has demonstrated exceptional understanding and mastery of ${subject}. Their consistent high performance across theory, practical work, and class participation reflects dedication and strong analytical skills.`,
          `${firstName} shows outstanding progress in ${subject}. Their ability to grasp complex concepts and apply them effectively is commendable. They actively contribute to class discussions and help peers understand difficult topics.`,
          `${firstName} exhibits excellent academic performance in ${subject}. Their work consistently meets and exceeds expectations, showing creativity, critical thinking, and thorough understanding of core concepts.`
        ],
        good: [
          `${firstName} has shown good understanding of ${subject} concepts. With continued effort and practice, they have the potential to achieve excellent results. Their participation in class activities is encouraging.`,
          `${firstName} demonstrates solid grasp of ${subject} fundamentals. They show steady improvement and respond well to feedback. I recommend focusing on advanced problem-solving techniques to reach the next level.`,
          `${firstName} has made good progress in ${subject}. Their consistent effort is evident in their work quality. With additional practice in challenging areas, they can achieve even better results.`
        ],
        satisfactory: [
          `${firstName} shows satisfactory understanding of basic ${subject} concepts. Regular practice and additional support in challenging areas will help improve their performance and build confidence.`,
          `${firstName} has demonstrated adequate grasp of ${subject} fundamentals. I encourage more active participation in class discussions and seeking help when needed to strengthen their understanding.`,
          `${firstName} is making steady progress in ${subject}. With consistent effort and focused study habits, they can improve their performance and achieve better results in future assessments.`
        ],
        "needs improvement": [
          `${firstName} requires additional support to strengthen their understanding of ${subject} concepts. Regular practice, extra help sessions, and focused attention to fundamentals will help improve their performance.`,
          `${firstName} shows potential in ${subject} but needs to develop stronger study habits and seek additional help when needed. With proper guidance and consistent effort, improvement is achievable.`,
          `${firstName} would benefit from additional practice and support in ${subject}. I recommend scheduling extra help sessions and developing a structured study plan to address areas of difficulty.`
        ]
      }

      const templates = commentTemplates[level as keyof typeof commentTemplates] || commentTemplates["satisfactory"]
      return templates[Math.floor(Math.random() * templates.length)]
    }

    return { getStudentLevel, generateComment }
  }, [])

  // Generate QR Code
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const reportData = `Student: ${formData.studentName}\nClass: ${formData.className}\nTerm: ${formData.term}\nSession: ${formData.session}`
        const qrDataUrl = await QRCode.toDataURL(reportData, {
          width: 100,
          margin: 1,
        })
        setQrCodeUrl(qrDataUrl)
      } catch (error) {
        console.error("QR Code generation failed:", error)
      }
    }

    if (formData.studentName) {
      generateQRCode()
    }
  }, [formData.studentName, formData.className, formData.term, formData.session])

  // Calculate grades and comments for subjects
  const getSubjectEvaluation = (subject: any) => {
    if (!subject || typeof subject !== 'object') return null

    const scores = {
      theory: Number(subject.theory) || 0,
      practical: Number(subject.practical) || 0,
      attitude: Number(subject.attitude) || 0
    }

    const total = scores.theory + scores.practical + scores.attitude
    const average = total / 3
    const grade = calculateGrade(average)
    const level = generateIntelligentContent.getStudentLevel(scores)
    const comment = generateIntelligentContent.generateComment(
      formData.studentName || "Student",
      subject.name || "the subject",
      level,
      scores
    )

    return { scores, total, average, grade, comment, level }
  }

  const printStyles = `
    @media print {
      @page {
        margin: 0.5in;
        size: A4;
      }
      body { print-color-adjust: exact; }
      .no-print { display: none !important; }
      .print-break { page-break-before: always; }
    }
  `

  return (
    <>
      <style>{printStyles}</style>
      <div 
        ref={reportRef}
        className={`bg-white ${printMode ? 'print:shadow-none' : 'shadow-lg rounded-lg'} overflow-hidden max-w-4xl mx-auto`}
        style={{ 
          fontFamily: 'Arial, sans-serif',
          fontSize: printMode ? '12px' : '14px',
          lineHeight: '1.5'
        }}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{settings?.schoolName || "SCHOOL NAME"}</h1>
              <p className="text-blue-100">{settings?.schoolAddress || "School Address"}</p>
              <p className="text-blue-100">{settings?.schoolContact || "Contact Information"}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="Report QR Code" className="w-16 h-16 bg-white p-1 rounded" />
              )}
              <div className="text-right">
                <Badge variant="secondary" className="bg-white text-blue-800">
                  {tier?.toUpperCase()} REPORT
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div><span className="font-medium">Name:</span> {formData.studentName}</div>
              <div><span className="font-medium">Student ID:</span> {formData.studentId}</div>
              <div><span className="font-medium">Class:</span> {formData.className}</div>
            </div>
            <div className="space-y-2">
              <div><span className="font-medium">Term:</span> {formData.term}</div>
              <div><span className="font-medium">Session:</span> {formData.session}</div>
              <div><span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}</div>
            </div>
          </div>
        </div>

        {/* Academic Performance */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Academic Performance</h2>
          
          {/* Subjects Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left font-semibold">Subject</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Theory</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Practical</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Attitude</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Total</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Average</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody>
                {formData.subjects?.map((subject: any, index: number) => {
                  const evaluation = getSubjectEvaluation(subject)
                  if (!evaluation) return null

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-medium">{subject.name}</td>
                      <td className="border border-gray-300 p-3 text-center">{evaluation.scores.theory}</td>
                      <td className="border border-gray-300 p-3 text-center">{evaluation.scores.practical}</td>
                      <td className="border border-gray-300 p-3 text-center">{evaluation.scores.attitude}</td>
                      <td className="border border-gray-300 p-3 text-center font-semibold">{evaluation.total}</td>
                      <td className="border border-gray-300 p-3 text-center">{evaluation.average.toFixed(1)}</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge 
                          variant={evaluation.grade === 'A' ? 'default' : evaluation.grade === 'B' ? 'secondary' : 'destructive'}
                          className="font-semibold"
                        >
                          {evaluation.grade}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Teacher Comments */}
          {!minimalView && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Teacher Comments</h3>
              {formData.subjects?.map((subject: any, index: number) => {
                const evaluation = getSubjectEvaluation(subject)
                if (!evaluation) return null

                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">{subject.name}</h4>
                    <p className="text-gray-600 leading-relaxed">{evaluation.comment}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        Performance Level: {evaluation.level.charAt(0).toUpperCase() + evaluation.level.slice(1)}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* HD Tier Additional Content */}
          {tier === "hd" && !minimalView && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Detailed Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Strengths</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Consistent academic performance</li>
                    <li>• Active class participation</li>
                    <li>• Good problem-solving skills</li>
                    <li>• Collaborative learning approach</li>
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">Areas for Growth</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Time management skills</li>
                    <li>• Advanced concept application</li>
                    <li>• Independent research abilities</li>
                    <li>• Leadership development</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Report Type: {tier?.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Class Teacher</p>
              <div className="border-t border-gray-400 mt-2 pt-1 w-32">
                <p className="text-xs text-gray-600">Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
    "Scratch Programming": {
      title: "Scratch 3.0 Visual Programming Fundamentals",
      modules: [
        "Scratch Interface & Workspace", "Sprites & Costumes", "Motion & Sensing Blocks", 
        "Looks & Sound Effects", "Control Structures & Logic", "Variables & Data Management",
        "Custom Blocks & Functions", "Game Development", "Animation & Storytelling", "Project Sharing & Collaboration",
        "Advanced Scratch Techniques", "Creative Problem Solving", "Digital Citizenship", "Portfolio Development"
      ],
      progressItems: {
        beginner: [
          "Scratch Interface Mastery: Successfully navigated Scratch 3.0 workspace, stage, sprite area, and block palette",
          "Basic Motion Control: Implemented sprite movement using motion blocks including move, turn, and glide commands",
          "Costume & Backdrop Management: Created and modified sprites with multiple costumes and designed interactive backdrops",
          "Sound Integration: Added sound effects, music, and voice recordings to enhance project interactivity",
          "Basic Event Handling: Used green flag, key press, and sprite click events to trigger program behaviors",
          "Simple Animation: Created basic animations using costume changes, movement sequences, and timing blocks"
        ],
        intermediate: [
          "Complex Control Structures: Implemented nested loops, conditional statements, and broadcast messaging systems",
          "Variable & List Management: Created variables to store data and used lists for managing multiple items effectively",
          "Interactive Game Elements: Developed games with scoring systems, collision detection, and user input responses",
          "Custom Block Creation: Designed reusable custom blocks with parameters to organize and simplify complex code",
          "Sensor Integration: Utilized webcam, microphone, and extension blocks to create responsive interactive projects",
          "Storytelling & Narrative: Created interactive stories with branching narratives and character development",
          "Mathematical Concepts: Applied mathematical operations, random numbers, and geometric concepts in projects"
        ],
        advanced: [
          "Complex Game Development: Created multi-level games with advanced mechanics, power-ups, and progression systems",
          "Data Visualization: Built interactive charts, surveys, and data collection projects using Scratch capabilities",
          "AI & Machine Learning: Implemented basic artificial intelligence concepts using Scratch extensions and logic",
          "Community Collaboration: Participated in Scratch community, remixed projects, and provided constructive feedback",
          "Cross-Curricular Projects: Integrated Scratch programming with science, math, social studies, and language arts",
          "Teaching & Mentoring: Led peer programming sessions and created tutorial projects for younger students",
          "Portfolio Showcase: Developed comprehensive portfolio demonstrating mastery across multiple programming concepts",
          "Innovation & Creativity: Designed original projects that push Scratch capabilities and inspire other creators"
        ]
      },
      assessmentCriteria: {
        theory: "Understanding of programming concepts, logical thinking, computational problem-solving, design principles",
        practical: "Project implementation, creative problem-solving, debugging skills, user interface design quality",
        participation: "Community engagement, peer collaboration, project sharing, constructive feedback giving and receiving"
      },
      skillsEvaluated: [
        "Computational thinking and algorithm design",
        "Visual programming and block-based coding proficiency",
        "Creative problem-solving and innovative project development",
        "User interface and user experience design principles",
        "Digital storytelling and multimedia integration",
        "Collaborative programming and peer learning",
        "Mathematical reasoning and logical thinking",
        "Project planning and iterative development"
      ],
      industryApplications: [
        "Educational Technology: Creating interactive learning experiences and educational games",
        "Game Design: Prototype development and game mechanics testing",
        "Animation & Media: Creating animated stories and interactive presentations",
        "Problem Solving: Developing logical thinking skills for any technical field",
        "Creative Arts: Digital art creation and interactive installations"
      ]
    },
    "Mobile App Development": {
      title: "Cross-Platform Mobile Application Development",
      modules: [
        "Mobile Development Fundamentals", "iOS Development (Swift)", "Android Development (Kotlin/Java)", 
        "React Native Framework", "Flutter Development", "UI/UX Design for Mobile",
        "Mobile Database & Storage", "API Integration & Networking", "Device Features & Sensors", "App Store Deployment",
        "Mobile Security & Privacy", "Performance Optimization", "Testing & Quality Assurance", "Monetization Strategies"
      ],
      progressItems: {
        beginner: [
          "Mobile Platform Understanding: Gained comprehensive knowledge of iOS and Android ecosystem differences and requirements",
          "Native UI Components: Successfully implemented responsive mobile interfaces using platform-specific UI elements",
          "Navigation Systems: Created intuitive navigation patterns including stack, tab, and drawer navigation",
          "State Management: Applied local state management and context for effective data flow in mobile applications",
          "Platform Guidelines: Followed iOS Human Interface Guidelines and Android Material Design principles",
          "Basic Device Integration: Implemented basic device features like camera access and local notifications"
        ],
        intermediate: [
          "Cross-Platform Development: Built applications using React Native and Flutter for multi-platform deployment",
          "Advanced Device Features: Integrated GPS location services, push notifications, biometric authentication, and sensor data",
          "Data Persistence: Implemented SQLite databases, AsyncStorage, and secure keychain storage for offline functionality",
          "API Integration: Connected mobile apps to RESTful APIs with proper error handling and network state management",
          "Performance Optimization: Applied lazy loading, image optimization, and memory management best practices",
          "Testing & Debugging: Utilized mobile debugging tools, automated testing frameworks, and device testing strategies",
          "User Experience Design: Created smooth animations, transitions, and gestures for enhanced user interaction"
        ],
        advanced: [
          "Native Module Development: Created custom native modules bridging platform-specific functionality with cross-platform code",
          "Advanced Architecture: Implemented clean architecture patterns, dependency injection, and scalable app structures",
          "Enterprise Integration: Built enterprise-grade applications with complex business logic and integration requirements",
          "App Store Optimization: Successfully published applications to App Store and Google Play with proper metadata and screenshots",
          "Analytics & Monitoring: Integrated comprehensive analytics, crash reporting, and performance monitoring systems",
          "Security Implementation: Applied advanced security measures including encryption, secure networking, and data protection",
          "Monetization & Business Logic: Implemented in-app purchases, subscription models, and advertising integration",
          "Leadership & Mentoring: Led mobile development teams and mentored junior developers in mobile best practices"
        ]
      },
      assessmentCriteria: {
        theory: "Mobile platform knowledge, design patterns, performance optimization concepts, security principles",
        practical: "App functionality, UI/UX quality, performance optimization, cross-platform compatibility, store deployment",
        participation: "Code collaboration, design reviews, user testing feedback, community contributions, knowledge sharing"
      },
      skillsEvaluated: [
        "Cross-platform development proficiency across iOS and Android",
        "Mobile UI/UX design principles and implementation",
        "Performance optimization and memory management techniques",
        "API integration and networking best practices",
        "Mobile security implementation and data protection",
        "App store submission and optimization processes",
        "Device feature integration and sensor utilization",
        "Testing strategies for mobile applications"
      ],
      industryApplications: [
        "Consumer Apps: Social media, entertainment, and lifestyle applications",
        "Business Solutions: Enterprise mobility, productivity, and workflow applications",
        "E-commerce: Mobile shopping, payment processing, and customer engagement",
        "Healthcare: Medical apps, patient monitoring, and telehealth solutions",
        "Education: Learning apps, interactive content, and educational games"
      ]
    },
    "Python Programming": {
      title: "Python Programming Fundamentals",
      modules: [
        "Variables & Data Types", "Input/Output Operations", "Conditional Statements", 
        "Loops & Iterations", "Functions & Parameters", "Data Structures (Lists, Tuples, Dictionaries)",
        "File Handling", "Error Handling & Debugging", "Object-Oriented Programming", "Libraries & Modules",
        "Web Scraping & APIs", "Database Integration", "GUI Development", "Testing & Deployment"
      ],
      progressItems: {
        beginner: [
          "Python Environment Setup: Successfully configured Python development environment with IDE and virtual environments",
          "Variables & Data Types: Mastered string, integer, float, boolean data types with proper type conversion and validation",
          "Input/Output Operations: Implemented comprehensive user input validation, error handling, and formatted output display",
          "Basic Syntax: Demonstrated proficiency in Python syntax, indentation rules, and PEP 8 coding standards",
          "Problem Solving: Applied logical thinking and algorithmic approach to solve computational problems step-by-step",
          "Code Documentation: Created clear, professional comments and docstrings for code maintainability and readability"
        ],
        intermediate: [
          "Advanced Conditionals: Implemented complex if-elif-else logic with nested conditions and boolean operators",
          "Loop Mastery: Developed expertise in for loops, while loops, list comprehensions, and nested iteration patterns",
          "Function Design: Created modular, reusable functions with parameters, return values, and proper scope management",
          "Data Structure Proficiency: Effectively utilized lists, tuples, dictionaries, and sets for complex data management",
          "Error Handling Excellence: Implemented comprehensive try-except-finally blocks with custom exception handling",
          "File Operations: Mastered file reading, writing, CSV processing, and JSON data manipulation with error recovery",
          "Algorithm Implementation: Developed sorting algorithms, searching techniques, and data processing workflows"
        ],
        advanced: [
          "Object-Oriented Programming: Designed robust classes with inheritance, polymorphism, encapsulation, and abstraction",
          "Advanced Data Structures: Implemented custom data structures, decorators, generators, and context managers",
          "Database Integration: Connected Python applications to databases using SQLite, PostgreSQL, and ORM frameworks",
          "Web Development: Built web applications using Flask/Django with RESTful APIs and database integration",
          "Library & Framework Mastery: Integrated NumPy, Pandas, Matplotlib, and specialized libraries for data science",
          "Testing & Quality Assurance: Implemented unit testing, integration testing, and code quality analysis tools",
          "Deployment & DevOps: Deployed applications using Docker, cloud platforms, and continuous integration pipelines",
          "Advanced Project Development: Completed full-stack applications with user authentication, security, and scalability"
        ]
      },
      assessmentCriteria: {
        theory: "Conceptual understanding, syntax mastery, algorithm design, software engineering principles",
        practical: "Code implementation quality, debugging proficiency, project completion, performance optimization",
        participation: "Active coding practice, peer collaboration, code reviews, problem-solving discussions, community contributions"
      },
      skillsEvaluated: [
        "Logical thinking and computational problem decomposition",
        "Python syntax mastery and code readability standards",
        "Advanced debugging and error resolution techniques",
        "Algorithm design, optimization, and complexity analysis",
        "Code documentation, testing, and maintenance best practices",
        "Software architecture and design pattern implementation",
        "Database design and integration capabilities",
        "Web development and API creation skills"
      ],
      industryApplications: [
        "Web Development: Backend services, APIs, and full-stack applications",
        "Data Science: Data analysis, machine learning, and statistical modeling",
        "Automation: Script development, task automation, and system administration",
        "Game Development: Game logic, AI systems, and interactive applications",
        "Scientific Computing: Research applications, simulations, and data processing"
      ]
    },
    "Web Development": {
      title: "Full-Stack Web Development",
      modules: [
        "HTML5 Fundamentals", "CSS3 & Responsive Design", "JavaScript ES6+", 
        "React.js Framework", "Node.js & Express", "Database Integration (MongoDB/MySQL)",
        "API Development & Integration", "Version Control (Git)", "Deployment & Hosting", "Web Security Fundamentals",
        "Progressive Web Apps", "Performance Optimization", "Testing & Quality Assurance", "DevOps & CI/CD"
      ],
      progressItems: {
        beginner: [
          "HTML5 Semantic Structure: Created accessible web pages using semantic elements (header, nav, main, section, article, footer)",
          "CSS3 Fundamentals: Applied modern styling techniques including Flexbox, Grid, and responsive design principles",
          "JavaScript Basics: Implemented DOM manipulation, event handling, and interactive user interface components",
          "Web Standards: Demonstrated understanding of accessibility guidelines (WCAG), SEO best practices, and browser compatibility",
          "Development Tools: Proficiently used browser developer tools for debugging, performance analysis, and responsive testing",
          "Project Structure: Organized project files, assets, and code following industry-standard folder structures and naming conventions"
        ],
        intermediate: [
          "React.js Component Development: Built reusable UI components with props, state management, and lifecycle methods",
          "API Integration: Successfully connected frontend applications to RESTful APIs with proper error handling and loading states",
          "Responsive Design Mastery: Developed mobile-first, cross-browser compatible websites using advanced CSS techniques",
          "Version Control Expertise: Mastered Git workflows, branching strategies, pull requests, and collaborative development practices",
          "Database Operations: Implemented CRUD operations with database integration using both SQL and NoSQL databases",
          "Modern JavaScript: Utilized ES6+ features including arrow functions, destructuring, modules, and async/await patterns",
          "Build Tools & Bundlers: Configured webpack, Vite, and npm scripts for efficient development and production builds"
        ],
        advanced: [
          "Full-Stack Architecture: Designed and implemented scalable web applications with microservices and serverless architectures",
          "Performance Optimization: Applied advanced techniques including code splitting, lazy loading, caching strategies, and CDN implementation",
          "Security Implementation: Integrated authentication, authorization, data encryption, and security best practices (OWASP guidelines)",
          "DevOps & Deployment: Configured CI/CD pipelines, containerization with Docker, and cloud deployment on AWS/Azure/GCP",
          "Advanced Frameworks: Utilized Next.js, TypeScript, GraphQL, and modern development tools for enterprise-level applications",
          "Testing Automation: Implemented comprehensive testing strategies including unit tests, integration tests, and end-to-end testing",
          "Web Performance Monitoring: Set up performance monitoring, analytics, and error tracking systems for production applications",
          "Progressive Web Apps: Developed PWAs with service workers, offline functionality, and native app-like experiences"
        ]
      },
      assessmentCriteria: {
        theory: "Web standards knowledge, framework understanding, security principles, performance optimization concepts",
        practical: "Project implementation quality, code organization, responsive design execution, API integration proficiency",
        participation: "Code reviews, collaborative development, problem-solving contributions, community engagement, open-source contributions"
      },
      skillsEvaluated: [
        "Frontend and backend development proficiency across multiple technologies",
        "User experience design and responsive interface development",
        "Database design, optimization, and integration capabilities",
        "RESTful API design, development, and integration expertise",
        "Security implementation and web application protection measures",
        "Performance optimization and scalability planning",
        "DevOps practices and deployment automation",
        "Modern development workflows and collaboration tools"
      ],
      industryApplications: [
        "E-commerce: Online stores, payment processing, and customer management systems",
        "SaaS Applications: Cloud-based software solutions and subscription services",
        "Corporate Websites: Business websites, portfolios, and content management systems",
        "Social Platforms: Community building, social networking, and collaboration tools",
        "Data Dashboards: Analytics platforms, reporting tools, and business intelligence"
      ]
    },
    "Data Science": {
      title: "Data Science & Analytics",
      modules: [
        "Python for Data Science", "Statistics & Probability", "Data Collection & Cleaning", 
        "Exploratory Data Analysis", "Data Visualization", "Machine Learning Fundamentals",
        "Statistical Modeling", "Big Data Technologies", "Business Intelligence", "Data Ethics & Privacy"
      ],
      progressItems: {
        beginner: [
          "Python Data Libraries: Mastered NumPy, Pandas for data manipulation",
          "Statistical Concepts: Understanding of descriptive statistics and distributions",
          "Data Cleaning: Implemented data preprocessing and quality assessment",
          "Basic Visualization: Created informative charts using Matplotlib and Seaborn"
        ],
        intermediate: [
          "Exploratory Data Analysis: Conducted comprehensive data exploration and insights",
          "Machine Learning: Implemented supervised learning algorithms",
          "Advanced Visualization: Developed interactive dashboards and complex visualizations",
          "Statistical Testing: Applied hypothesis testing and confidence intervals",
          "Data Pipeline: Built automated data processing workflows"
        ],
        advanced: [
          "Deep Learning: Implemented neural networks for complex pattern recognition",
          "Big Data Processing: Utilized Spark and distributed computing frameworks",
          "Model Deployment: Deployed ML models to production environments",
          "Advanced Analytics: Developed predictive models and recommendation systems",
          "Research & Publication: Conducted original research with statistical validation"
        ]
      },
      assessmentCriteria: {
        theory: "Statistical knowledge, algorithm understanding, data science principles",
        practical: "Data analysis projects, model implementation, visualization quality",
        participation: "Research discussions, peer review, methodology presentations"
      },
      skillsEvaluated: [
        "Statistical analysis and interpretation",
        "Machine learning model development",
        "Data visualization and storytelling",
        "Critical thinking and hypothesis testing",
        "Business problem solving with data"
      ]
    },
    "MobileAppDevelopment": {
      title: "Cross-Platform Mobile Development",
      modules: [
        "Mobile Development Fundamentals", "React Native Framework", "Flutter Development", 
        "Native iOS Development", "Native Android Development", "UI/UX Design for Mobile",
        "Mobile Database & Storage", "API Integration", "App Store Deployment", "Mobile Security"
      ],
      progressItems: {
        beginner: [
          "Mobile UI Components: Created responsive mobile interfaces with native components",
          "Navigation Systems: Implemented stack and tab navigation patterns",
          "State Management: Applied local state and context for data flow",
          "Platform Guidelines: Followed iOS and Android design principles"
        ],
        intermediate: [
          "Cross-Platform Development: Built apps using React Native and Flutter",
          "Device Features: Integrated camera, GPS, push notifications, and sensors",
          "Data Persistence: Implemented local storage and offline functionality",
          "Performance Optimization: Applied lazy loading and memory management",
          "Testing & Debugging: Utilized debugging tools and automated testing"
        ],
        advanced: [
          "Native Development: Created platform-specific features using native code",
          "Advanced Architecture: Implemented MVVM and clean architecture patterns",
          "App Store Publishing: Successfully deployed apps to App Store and Play Store",
          "Analytics & Monitoring: Integrated crash reporting and user analytics",
          "Enterprise Solutions: Developed enterprise-grade mobile applications"
        ]
      },
      assessmentCriteria: {
        theory: "Mobile platform knowledge, design patterns, development principles",
        practical: "App functionality, UI/UX quality, performance optimization",
        participation: "Code collaboration, design reviews, user testing feedback"
      },
      skillsEvaluated: [
        "Cross-platform development proficiency",
        "Mobile UI/UX design principles",
        "Performance optimization techniques",
        "App store submission process",
        "Mobile security best practices"
      ]
    },
    "Cybersecurity": {
      title: "Cybersecurity & Information Assurance",
      modules: [
        "Security Fundamentals", "Network Security", "Ethical Hacking & Penetration Testing", 
        "Cryptography & Encryption", "Identity & Access Management", "Security Incident Response",
        "Compliance & Risk Management", "Digital Forensics", "Cloud Security", "Security Awareness Training"
      ],
      progressItems: {
        beginner: [
          "Security Fundamentals: Understanding of CIA triad and security principles",
          "Network Basics: Identified common network vulnerabilities and protection methods",
          "Password Security: Implemented strong authentication and access controls",
          "Threat Recognition: Learned to identify phishing, malware, and social engineering"
        ],
        intermediate: [
          "Penetration Testing: Conducted authorized security assessments and vulnerability scans",
          "Cryptography: Applied encryption algorithms and digital signatures",
          "Incident Response: Developed incident handling and forensic analysis skills",
          "Risk Assessment: Performed security risk analysis and mitigation planning",
          "Compliance: Understanding of GDPR, HIPAA, and industry security standards"
        ],
        advanced: [
          "Advanced Threats: Analyzed APTs, zero-day exploits, and advanced malware",
          "Security Architecture: Designed enterprise security frameworks and policies",
          "Digital Forensics: Conducted comprehensive digital investigations",
          "Security Leadership: Led security awareness programs and policy development",
          "Research & Development: Contributed to security research and tool development"
        ]
      },
      assessmentCriteria: {
        theory: "Security principles, threat landscape knowledge, compliance understanding",
        practical: "Security tool usage, incident response, vulnerability assessment",
        participation: "Ethical considerations, security discussions, peer learning"
      },
      skillsEvaluated: [
        "Threat analysis and risk assessment",
        "Security tool proficiency",
        "Incident response capabilities",
        "Ethical hacking techniques",
        "Security policy development"
      ]
    },
    "Digital Marketing": {
      title: "Digital Marketing & Analytics",
      modules: [
        "Digital Marketing Fundamentals", "Search Engine Optimization (SEO)", "Pay-Per-Click Advertising (PPC)", 
        "Social Media Marketing", "Content Marketing Strategy", "Email Marketing Automation",
        "Analytics & Data Interpretation", "Conversion Rate Optimization", "Marketing Technology Stack", "Marketing Psychology"
      ],
      progressItems: {
        beginner: [
          "Digital Marketing Concepts: Understanding of marketing funnels and customer journey",
          "SEO Basics: Implemented on-page optimization and keyword research",
          "Social Media Fundamentals: Created engaging content for various platforms",
          "Analytics Setup: Configured Google Analytics and tracking systems"
        ],
        intermediate: [
          "PPC Campaign Management: Created and optimized Google Ads and social media campaigns",
          "Content Strategy: Developed comprehensive content marketing plans",
          "Email Marketing: Built automated email sequences and segmentation strategies",
          "Data Analysis: Interpreted marketing metrics and performance indicators",
          "A/B Testing: Designed and executed conversion optimization experiments"
        ],
        advanced: [
          "Marketing Automation: Implemented advanced CRM and marketing automation systems",
          "Attribution Modeling: Developed multi-touch attribution and customer lifetime value analysis",
          "Growth Hacking: Applied advanced growth strategies and viral marketing techniques",
          "Marketing Leadership: Led cross-functional marketing teams and strategy development",
          "Emerging Technologies: Utilized AI, chatbots, and personalization technologies"
        ]
      },
      assessmentCriteria: {
        theory: "Marketing principles, consumer psychology, digital trends knowledge",
        practical: "Campaign performance, creative execution, data analysis skills",
        participation: "Strategy discussions, creative brainstorming, peer feedback"
      },
      skillsEvaluated: [
        "Strategic marketing planning",
        "Creative content development",
        "Data-driven decision making",
        "Campaign optimization techniques",
        "Customer behavior analysis"
      ]
    }
  };

  // Helper function to replace placeholders with actual student name
  const replacePlaceholders = (text: string, studentName: string) => {
    // Extract first name for more natural text
    const firstName = studentName.split(" ")[0]

    // Replace various placeholder patterns
    return text
      .replace(/\[Student\]/g, studentName)
      .replace(/\[student\]/g, studentName.toLowerCase())
      .replace(/\[STUDENT\]/g, studentName.toUpperCase())
      .replace(/\[Student Name\]/g, studentName)
      .replace(/\[Their\]/g, "Their")
      .replace(/\[their\]/g, "their")
      .replace(/\[They\]/g, "They")
      .replace(/\[they\]/g, "they")
      .replace(/\[Them\]/g, "Them")
      .replace(/\[them\]/g, "them")
  }
  
  // Course-specific content generation functions
  const getCourseData = (courseName: string) => {
    // Find course data or default to Python Programming
    const course = courseSpecificData[courseName as keyof typeof courseSpecificData] || courseSpecificData["Python Programming"];
    return course;
  };

  const getStudentLevel = (theoryScore: number, practicalScore: number, attendance: number): "beginner" | "intermediate" | "advanced" => {
    const avgScore = (theoryScore + practicalScore + attendance) / 3;
    if (avgScore >= 85) return "advanced";
    if (avgScore >= 70) return "intermediate";
    return "beginner";
  };

  const generateCourseSpecificComments = (courseName: string, studentName: string, level: "beginner" | "intermediate" | "advanced", scores: {theory: number, practical: number, attendance: number}) => {
    const course = getCourseData(courseName);
    const firstName = studentName.split(" ")[0] || "The student";
    
    const commentTemplates = {
      "Python Programming": {
        beginner: [
          `${firstName} has demonstrated a solid foundation in Python programming fundamentals. They show good understanding of basic syntax, variables, and data types. With continued practice on conditional statements and loops, ${firstName} will be well-prepared for intermediate concepts. Their logical thinking approach to problem-solving is commendable and will serve them well in advanced programming challenges.`,
          `${firstName} exhibits strong potential in Python development. They have successfully mastered the core concepts of input/output operations and basic data manipulation. I recommend focusing on debugging techniques and code optimization practices to enhance their programming efficiency. Their consistent class participation reflects genuine interest in software development.`,
          `${firstName} shows excellent progress in understanding Python fundamentals. Their grasp of variables, data types, and basic operations is solid. To advance further, I suggest practicing more complex problem-solving scenarios and exploring Python's built-in functions. Their attention to detail in coding exercises demonstrates good programming discipline.`
        ],
        intermediate: [
          `${firstName} has progressed excellently into intermediate Python concepts. Their implementation of functions, loops, and conditional logic shows maturity in programming thinking. They demonstrate good understanding of data structures and can effectively use lists and dictionaries. I recommend exploring object-oriented programming concepts and working on larger projects to further develop their skills.`,
          `${firstName} exhibits strong competency in intermediate Python development. Their ability to debug code and implement error handling shows professional development practices. They work well with file operations and can create modular, reusable code. Moving forward, I suggest focusing on advanced libraries like NumPy and Pandas to broaden their technical expertise.`,
          `${firstName} demonstrates advanced understanding of Python programming principles. Their code is well-structured, readable, and follows best practices. They show excellent problem-solving skills and can break down complex problems into manageable components. I recommend exploring web frameworks like Django or Flask for full-stack development experience.`
        ],
        advanced: [
          `${firstName} has achieved exceptional proficiency in Python programming. Their mastery of object-oriented programming, advanced data structures, and algorithm implementation is impressive. They consistently write clean, efficient code and demonstrate understanding of software design patterns. I recommend contributing to open-source projects and exploring specialized areas like machine learning or web development.`,
          `${firstName} shows outstanding technical skills in advanced Python development. Their ability to integrate external libraries, handle complex data processing, and implement sophisticated algorithms is remarkable. They demonstrate leadership in group projects and mentor fellow students effectively. I encourage pursuing advanced certifications and considering internship opportunities in software development.`,
          `${firstName} has exceeded expectations in Python programming mastery. Their innovative approach to problem-solving and ability to optimize code performance shows professional-level understanding. They successfully completed complex projects involving GUI development and database integration. I highly recommend advancing to specialized tracks in data science, web development, or software engineering.`
        ]
      },
      "Web Development": {
        beginner: [
          `${firstName} has established a strong foundation in web development fundamentals. Their understanding of HTML5 semantic elements and CSS styling principles is commendable. They show good progress in JavaScript basics and DOM manipulation. I recommend practicing responsive design techniques and exploring CSS frameworks like Bootstrap to enhance their frontend development skills.`,
          `${firstName} demonstrates solid grasp of web development concepts. Their ability to create structured, accessible web pages shows attention to web standards. They're making good progress with JavaScript event handling and basic interactivity. Moving forward, I suggest focusing on version control with Git and beginning React.js fundamentals for modern web development.`,
          `${firstName} exhibits excellent potential in web development. Their semantic HTML and responsive CSS implementations show understanding of modern web practices. They demonstrate good problem-solving skills in JavaScript debugging. I recommend exploring browser developer tools more extensively and practicing with API integration for dynamic web applications.`
        ],
        intermediate: [
          `${firstName} has progressed excellently in full-stack web development. Their React.js component development and state management show solid understanding of modern frontend frameworks. They demonstrate good backend development skills with Node.js and database integration. I recommend focusing on authentication systems and advanced React patterns like hooks and context.`,
          `${firstName} shows strong competency in web development technologies. Their ability to build responsive, interactive web applications using modern frameworks is impressive. They work effectively with RESTful APIs and understand database design principles. Moving forward, I suggest exploring advanced topics like performance optimization and progressive web app development.`,
          `${firstName} demonstrates advanced web development capabilities. Their full-stack applications show good architecture decisions and code organization. They effectively use version control and understand deployment processes. I recommend exploring advanced frameworks like Next.js and focusing on web security best practices for production applications.`
        ],
        advanced: [
          `${firstName} has achieved exceptional proficiency in full-stack web development. Their mastery of modern frameworks, state management, and backend architecture is outstanding. They consistently deliver production-quality applications with excellent user experience. I recommend pursuing advanced specializations in DevOps, microservices architecture, or emerging web technologies.`,
          `${firstName} shows outstanding technical leadership in web development. Their ability to architect scalable applications and mentor team members is remarkable. They demonstrate expertise in performance optimization, security implementation, and modern development workflows. I encourage pursuing senior developer roles and contributing to the web development community.`,
          `${firstName} has exceeded expectations in web development mastery. Their innovative solutions to complex problems and deep understanding of web technologies make them standout developers. They successfully lead project development and implement cutting-edge web solutions. I highly recommend pursuing leadership roles in software development teams.`
        ]
      },
      "Data Science": {
        beginner: [
          `${firstName} has built a solid foundation in data science fundamentals. Their understanding of Python data libraries and basic statistical concepts is developing well. They show good progress in data cleaning and visualization techniques. I recommend practicing more with real-world datasets and exploring exploratory data analysis methodologies.`,
          `${firstName} demonstrates good analytical thinking in data science applications. Their ability to manipulate data using Pandas and create meaningful visualizations shows promise. They're developing statistical reasoning skills effectively. Moving forward, I suggest focusing on hypothesis testing and beginning machine learning concepts with scikit-learn.`,
          `${firstName} exhibits strong potential in data science and analytics. Their approach to data problems is methodical and their visualizations communicate insights clearly. They show good understanding of data preprocessing techniques. I recommend exploring more advanced statistical methods and practicing with diverse data types and sources.`
        ],
        intermediate: [
          `${firstName} has progressed excellently in data science methodologies. Their implementation of machine learning algorithms and statistical modeling shows solid understanding of data science principles. They demonstrate good feature engineering and model evaluation skills. I recommend exploring deep learning frameworks and advanced visualization techniques.`,
          `${firstName} shows strong competency in data analysis and machine learning. Their ability to derive actionable insights from complex datasets is impressive. They work effectively with various data sources and understand model selection principles. Moving forward, I suggest focusing on big data technologies and time series analysis.`,
          `${firstName} demonstrates advanced data science capabilities. Their end-to-end project implementations show good understanding of the data science workflow. They effectively communicate findings and understand business impact of their analyses. I recommend exploring specialized areas like natural language processing or computer vision.`
        ],
        advanced: [
          `${firstName} has achieved exceptional proficiency in advanced data science. Their mastery of machine learning, statistical modeling, and big data technologies is outstanding. They consistently deliver insights that drive business decisions and demonstrate research-level analytical skills. I recommend pursuing specializations in AI research or data science leadership roles.`,
          `${firstName} shows outstanding expertise in data science and machine learning. Their ability to design experiments, validate results, and communicate complex findings is remarkable. They demonstrate thought leadership in applying advanced analytics to solve real-world problems. I encourage pursuing data science leadership positions and publishing research.`,
          `${firstName} has exceeded expectations in data science mastery. Their innovative approach to complex analytical challenges and deep understanding of advanced algorithms make them exceptional data scientists. They successfully mentor others and contribute to the advancement of data science practices. I highly recommend pursuing senior roles in data science or research positions.`
        ]
      },
      "Scratch Programming": {
        beginner: [
          `${firstName} has demonstrated exceptional creativity and logical thinking in Scratch 3.0 programming. They show natural aptitude for visual programming concepts and have successfully mastered the Scratch interface, sprite manipulation, and basic event handling. Their ability to break down problems into smaller, manageable blocks shows promising computational thinking skills. I particularly appreciate their enthusiasm during hands-on coding sessions and their willingness to experiment with different block combinations. ${firstName} consistently creates engaging projects that demonstrate both technical understanding and creative flair.`,
          `${firstName} exhibits outstanding potential in visual programming and creative problem-solving. They have successfully implemented motion controls, costume changes, and basic animation sequences with remarkable attention to detail. Their projects show clear evidence of planning and iterative improvement, which are essential skills for any programmer. ${firstName} actively participates in peer collaboration sessions and often helps classmates understand complex concepts through clear explanations. Their natural curiosity about how different blocks work together will serve them well as they advance to more complex programming challenges.`,
          `${firstName} shows excellent progress in mastering Scratch programming fundamentals. They demonstrate solid understanding of basic programming concepts including sequences, loops, and conditional statements through their creative block-based implementations. Their ability to debug and troubleshoot projects shows developing analytical skills that will benefit them throughout their programming journey. ${firstName} consistently produces projects that meet requirements while adding their own creative touches, showing both technical competency and artistic vision. Their positive attitude and persistence when facing challenges make them a valuable member of our programming community.`
        ],
        intermediate: [
          `${firstName} has progressed remarkably in Scratch programming, demonstrating mastery of complex control structures, custom blocks, and advanced project organization. Their games show sophisticated use of variables, scoring systems, and collision detection that rival projects created by much more experienced programmers. ${firstName} consistently applies best practices in project design, creating clean, well-organized code that is easy to understand and modify. Their ability to integrate multimedia elements including custom graphics, sound effects, and animations creates truly engaging user experiences. I recommend advancing to text-based programming languages to further develop their exceptional programming talents.`,
          `${firstName} demonstrates advanced understanding of Scratch programming concepts and shows readiness for more complex programming challenges. They excel at creating interactive stories and games that incorporate sophisticated branching logic, data management, and user input handling. Their projects consistently demonstrate innovation and creativity while maintaining solid technical foundations. ${firstName} has become a natural mentor for beginning programmers, explaining complex concepts clearly and patiently. Their portfolio of projects shows impressive growth and technical sophistication that positions them well for advanced programming courses.`,
          `${firstName} has achieved impressive mastery of Scratch programming, creating complex projects that demonstrate deep understanding of computational thinking and programming logic. Their ability to design and implement multi-level games with power-ups, obstacles, and progression systems shows exceptional problem-solving skills. ${firstName} consistently goes beyond assignment requirements, adding innovative features and polished user interfaces that enhance the overall user experience. Their collaborative spirit and willingness to share knowledge with peers makes them an invaluable member of our programming community. I strongly recommend continued programming education to develop their outstanding potential.`
        ],
        advanced: [
          `${firstName} has demonstrated exceptional mastery of Scratch programming that exceeds expectations for students at this level. Their projects showcase advanced programming concepts including complex algorithms, data structures simulation, and sophisticated user interface design. They have successfully mentored younger students, created tutorial projects, and contributed meaningfully to our classroom programming community. ${firstName}'s ability to integrate mathematical concepts, scientific principles, and creative storytelling through programming shows remarkable interdisciplinary thinking. Their portfolio demonstrates readiness for advanced programming languages and computer science concepts. I highly recommend accelerated programming pathways to continue developing their extraordinary programming talents.`,
          `${firstName} represents the pinnacle of achievement in Scratch programming education. Their innovative projects push the boundaries of what's possible within the Scratch environment, incorporating advanced extensions, complex data manipulation, and sophisticated game mechanics. They have demonstrated leadership by organizing peer coding sessions, creating educational content for other students, and participating actively in the broader Scratch community. ${firstName}'s ability to think systematically about complex problems and implement elegant solutions shows true computer science aptitude. Their combination of technical excellence, creative vision, and collaborative spirit makes them an ideal candidate for advanced programming studies and potential technology leadership roles.`,
          `${firstName} has achieved remarkable distinction in Scratch programming, demonstrating skills that bridge the gap between visual programming and professional software development concepts. Their projects exhibit sophisticated planning, elegant implementation, and innovative problem-solving that would impress even experienced programmers. They have successfully integrated advanced mathematical concepts, created educational simulations, and developed games that demonstrate both technical proficiency and engaging user experience design. ${firstName}'s natural teaching ability and enthusiasm for sharing knowledge has elevated the learning experience for all students in our program. I strongly recommend immediate advancement to text-based programming languages and consideration for programming competition participation.`
        ]
      },
      "Mobile App Development": {
        beginner: [
          `${firstName} has shown excellent aptitude for mobile application development, demonstrating strong understanding of mobile UI principles and user experience design. They successfully implemented responsive layouts that work well across different screen sizes and have mastered basic navigation patterns. Their attention to platform-specific design guidelines shows professional awareness that will serve them well in mobile development. ${firstName} consistently asks thoughtful questions about best practices and shows genuine interest in creating applications that provide real value to users. Their projects demonstrate both technical competency and user-centered thinking.`,
          `${firstName} exhibits promising potential in mobile development with particular strength in UI/UX design and user interaction patterns. They have successfully integrated device features like camera and location services, showing good understanding of mobile platform capabilities. Their ability to debug issues using mobile development tools demonstrates developing technical troubleshooting skills. ${firstName} actively participates in code reviews and consistently incorporates feedback to improve their applications. Their enthusiasm for mobile technology and commitment to creating polished user experiences positions them well for advanced mobile development studies.`,
          `${firstName} demonstrates solid progress in mobile application development fundamentals. They show good understanding of mobile development workflows, from design through deployment, and have successfully published test applications to development stores. Their code organization and commenting practices show attention to maintainability and professional development standards. ${firstName} works effectively in team environments and contributes positively to group projects. Their growing understanding of mobile security and performance considerations shows developing professional awareness that will benefit their future development work.`
        ],
        intermediate: [
          `${firstName} has made impressive progress in mobile development, demonstrating proficiency across multiple platforms and frameworks. Their cross-platform applications using React Native show sophisticated understanding of component architecture and state management. They excel at integrating external APIs and managing complex data flows in mobile environments. ${firstName} consistently applies performance optimization techniques and follows mobile security best practices. Their ability to balance platform-specific requirements with code reusability shows maturing architectural thinking. I recommend advancing to enterprise mobile development or specialized areas like mobile gaming.`,
          `${firstName} shows advanced mobile development skills with particular excellence in user experience design and technical implementation. Their applications demonstrate sophisticated use of animations, gestures, and mobile-specific interaction patterns that create engaging user experiences. They have successfully implemented complex features including offline functionality, push notifications, and real-time data synchronization. ${firstName} actively contributes to our mobile development community through code sharing and technical discussions. Their portfolio of published applications shows both technical competence and commercial awareness.`,
          `${firstName} demonstrates exceptional growth in mobile application development, creating applications that rival commercial products in both functionality and polish. Their understanding of mobile architecture patterns, performance optimization, and platform-specific best practices shows professional-level competency. They have successfully led team projects, mentored junior developers, and contributed to open-source mobile projects. ${firstName}'s ability to translate business requirements into technical solutions demonstrates valuable product thinking skills. Their work consistently exceeds expectations and shows readiness for professional mobile development roles.`
        ],
        advanced: [
          `${firstName} has achieved outstanding mastery in mobile application development, demonstrating expertise across native and cross-platform development approaches. Their applications showcase advanced architectural patterns, sophisticated state management, and enterprise-level security implementations. They have successfully published applications to both major app stores and demonstrated ability to manage the complete development lifecycle from concept to deployment. ${firstName} shows exceptional leadership in technical discussions and has become a valuable mentor for other students. Their combination of technical excellence and business acumen makes them an ideal candidate for mobile development leadership roles.`,
          `${firstName} represents exceptional achievement in mobile development education, creating applications that demonstrate professional-level quality and innovation. Their deep understanding of mobile platforms, development tools, and industry best practices rivals that of experienced developers. They have successfully integrated advanced features including machine learning, AR/VR capabilities, and IoT connectivity. ${firstName} actively contributes to the broader mobile development community through open-source contributions and technical content creation. Their portfolio demonstrates readiness for senior mobile development positions and potential entrepreneurial opportunities.`,
          `${firstName} has distinguished themselves as an exceptional mobile developer with skills that span the entire mobile development ecosystem. Their applications demonstrate advanced technical implementation, innovative problem-solving, and sophisticated user experience design that sets new standards for student work. They have successfully mentored teams, led complex projects, and contributed to advancing mobile development practices within our program. ${firstName}'s ability to envision and implement cutting-edge mobile solutions shows remarkable technical leadership potential. I highly recommend consideration for advanced internships, development team leadership roles, and specialized mobile technology research opportunities.`
        ]
      },
      "Cybersecurity": {
        beginner: [
          `${firstName} has established a strong foundation in cybersecurity fundamentals, demonstrating solid understanding of security principles, threat landscape awareness, and basic defensive strategies. They show excellent grasp of network security concepts and have successfully implemented basic security protocols. Their ethical approach to security testing and commitment to responsible disclosure principles shows professional maturity. ${firstName} actively engages in security discussions and demonstrates genuine interest in protecting digital assets. Their analytical mindset and attention to detail will serve them well in advanced security specializations.`,
          `${firstName} exhibits promising potential in cybersecurity with particular strength in risk assessment and security policy development. They have successfully identified vulnerabilities in test environments using industry-standard tools and methodologies. Their understanding of compliance frameworks and regulatory requirements shows developing professional awareness. ${firstName} consistently follows ethical hacking guidelines and demonstrates respect for privacy and security boundaries. Their systematic approach to security analysis and commitment to continuous learning positions them well for intermediate cybersecurity studies.`,
          `${firstName} demonstrates solid progress in cybersecurity fundamentals with good understanding of threat modeling, incident response, and security awareness training. They show competency in using security tools for monitoring and analysis while maintaining strict ethical standards. Their ability to communicate security concepts to non-technical audiences shows valuable security advocacy skills. ${firstName} works effectively in team security assessments and contributes positively to security culture development. Their growing expertise in digital forensics and incident handling will benefit their future security career development.`
        ],
        intermediate: [
          `${firstName} has made impressive progress in cybersecurity, demonstrating advanced skills in penetration testing, vulnerability assessment, and security architecture design. Their ethical hacking projects show sophisticated understanding of attack vectors and defensive countermeasures. They excel at security automation and have implemented robust monitoring systems for threat detection. ${firstName} consistently applies industry best practices and stays current with emerging threats and security technologies. Their ability to balance security requirements with business needs shows maturing security leadership thinking. I recommend advancing to specialized areas like digital forensics or security architecture.`,
          `${firstName} shows advanced cybersecurity capabilities with particular excellence in incident response and threat intelligence analysis. Their security assessments demonstrate comprehensive understanding of enterprise security frameworks and compliance requirements. They have successfully led security awareness training sessions and mentored junior security analysts. ${firstName} actively participates in cybersecurity communities and contributes to threat intelligence sharing. Their portfolio of security projects shows both technical depth and strategic security thinking that prepares them for senior security roles.`,
          `${firstName} demonstrates exceptional growth in cybersecurity, creating security solutions that effectively protect against sophisticated threats while maintaining system usability. Their understanding of advanced persistent threats, zero-day vulnerabilities, and defense-in-depth strategies shows professional-level expertise. They have successfully implemented security automation tools and contributed to security policy development. ${firstName}'s ability to translate technical security findings into business risk assessments demonstrates valuable security management skills. Their work consistently exceeds expectations and shows readiness for cybersecurity leadership positions.`
        ],
        advanced: [
          `${firstName} has achieved outstanding mastery in cybersecurity, demonstrating expertise across multiple security domains including network security, application security, and cloud security architecture. Their security research projects showcase innovative approaches to emerging threats and demonstrate deep understanding of security engineering principles. They have successfully published security advisories and contributed to open-source security tools. ${firstName} shows exceptional leadership in security incident response and has become a trusted security advisor for complex security challenges. Their combination of technical excellence and strategic thinking makes them ideal for senior cybersecurity leadership roles.`,
          `${firstName} represents exceptional achievement in cybersecurity education, demonstrating skills that rival experienced security professionals. Their comprehensive understanding of threat landscapes, security frameworks, and emerging technologies positions them as a cybersecurity thought leader. They have successfully led red team exercises, developed custom security tools, and mentored security teams. ${firstName} actively contributes to the broader cybersecurity community through research publications and security conference presentations. Their portfolio demonstrates readiness for principal security engineer positions and cybersecurity consulting opportunities.`,
          `${firstName} has distinguished themselves as an exceptional cybersecurity professional with expertise spanning the entire security lifecycle from risk assessment through incident recovery. Their innovative security solutions demonstrate advanced threat modeling, sophisticated defense mechanisms, and strategic security vision that sets new standards for security excellence. They have successfully established security programs, led cross-functional security initiatives, and influenced organizational security culture. ${firstName}'s ability to anticipate and defend against emerging threats shows remarkable security leadership potential. I highly recommend consideration for CISO track positions, security research roles, and cybersecurity entrepreneurship opportunities.`
        ]
      },
      "Digital Marketing": {
        beginner: [
          `${firstName} has built a solid foundation in digital marketing fundamentals, demonstrating good understanding of marketing principles, customer journey mapping, and basic digital channels. They show excellent progress in content creation and have successfully developed engaging social media campaigns. Their analytical approach to campaign performance and willingness to adapt strategies based on data shows developing marketing acumen. ${firstName} consistently creates content that resonates with target audiences and demonstrates understanding of brand voice and messaging consistency. Their creative thinking and attention to marketing trends will serve them well in advanced digital marketing specializations.`,
          `${firstName} exhibits strong potential in digital marketing with particular aptitude for content strategy and audience engagement. They have successfully implemented SEO best practices and demonstrated understanding of search engine algorithms and content optimization. Their ability to analyze market trends and competitor strategies shows developing competitive intelligence skills. ${firstName} actively participates in marketing strategy discussions and consistently contributes creative campaign ideas. Their enthusiasm for digital platforms and commitment to measuring campaign effectiveness positions them well for intermediate marketing studies.`,
          `${firstName} demonstrates solid progress in digital marketing fundamentals with good grasp of email marketing, social media management, and basic paid advertising principles. They show competency in using marketing automation tools and analytics platforms while maintaining focus on customer experience. Their ability to create cohesive multi-channel campaigns shows understanding of integrated marketing approaches. ${firstName} works effectively in marketing teams and contributes positively to brainstorming sessions and campaign development. Their growing expertise in conversion optimization and customer segmentation will benefit their future marketing career development.`
        ],
        intermediate: [
          `${firstName} has made impressive progress in digital marketing, demonstrating advanced skills in marketing automation, advanced analytics, and strategic campaign development. Their multi-channel campaigns show sophisticated understanding of customer lifecycle marketing and behavioral targeting. They excel at A/B testing and have implemented data-driven optimization strategies that significantly improve campaign performance. ${firstName} consistently applies advanced marketing technologies and stays current with platform updates and algorithm changes. Their ability to balance creativity with data-driven decision making shows maturing marketing leadership thinking. I recommend advancing to specialized areas like growth marketing or marketing technology.`,
          `${firstName} shows advanced digital marketing capabilities with particular excellence in performance marketing and conversion optimization. Their campaigns demonstrate comprehensive understanding of marketing funnels, attribution modeling, and customer lifetime value optimization. They have successfully managed substantial advertising budgets and achieved exceptional ROI across multiple channels. ${firstName} actively mentors junior marketers and contributes to marketing strategy development. Their portfolio of successful campaigns shows both creative excellence and strong analytical foundations that prepare them for senior marketing roles.`,
          `${firstName} demonstrates exceptional growth in digital marketing, creating integrated campaigns that effectively drive business growth while maintaining brand consistency and customer satisfaction. Their understanding of advanced marketing technologies, marketing automation platforms, and customer data platforms shows professional-level expertise. They have successfully led cross-functional marketing initiatives and contributed to marketing technology stack optimization. ${firstName}'s ability to translate business objectives into measurable marketing strategies demonstrates valuable marketing leadership skills. Their work consistently exceeds expectations and shows readiness for marketing management positions.`
        ],
        advanced: [
          `${firstName} has achieved outstanding mastery in digital marketing, demonstrating expertise across all digital channels including emerging platforms and technologies. Their strategic marketing campaigns showcase innovative approaches to customer acquisition and retention while delivering exceptional business results. They have successfully developed marketing technology roadmaps and led digital transformation initiatives. ${firstName} shows exceptional leadership in marketing strategy development and has become a trusted advisor for complex marketing challenges. Their combination of creative vision and analytical rigor makes them ideal for senior marketing leadership roles and marketing consulting opportunities.`,
          `${firstName} represents exceptional achievement in digital marketing education, demonstrating skills that rival experienced marketing professionals. Their comprehensive understanding of marketing technologies, customer behavior analytics, and growth hacking strategies positions them as a marketing thought leader. They have successfully launched products through innovative marketing campaigns and mentored marketing teams across organizations. ${firstName} actively contributes to the broader marketing community through thought leadership content and marketing conference presentations. Their portfolio demonstrates readiness for CMO track positions and marketing agency leadership opportunities.`,
          `${firstName} has distinguished themselves as an exceptional digital marketer with expertise spanning the entire customer lifecycle from awareness through advocacy. Their innovative marketing solutions demonstrate advanced customer segmentation, personalization at scale, and strategic brand positioning that sets new standards for marketing excellence. They have successfully established marketing departments, led organizational growth initiatives, and influenced company-wide customer experience strategies. ${firstName}'s ability to predict and capitalize on marketing trends shows remarkable marketing vision and leadership potential. I highly recommend consideration for executive marketing positions, marketing consulting firms, and marketing technology entrepreneurship opportunities.`
        ]
      }
      // Additional courses can be expanded here
    };

    const courseComments = commentTemplates[courseName as keyof typeof commentTemplates] || commentTemplates["Python Programming"];
    const levelComments = courseComments[level];
    
    // Select comment based on performance
    let selectedComment = levelComments[0]; // Default
    if (scores.theory >= 90 && scores.practical >= 90) {
      selectedComment = levelComments[levelComments.length - 1]; // Highest performing comment
    } else if (scores.theory >= 80 || scores.practical >= 80) {
      selectedComment = levelComments[Math.min(1, levelComments.length - 1)]; // Mid-tier comment
    }
    
    return selectedComment;
  };

  const generateCourseSpecificStrengths = (courseName: string, studentName: string, level: "beginner" | "intermediate" | "advanced", scores: {theory: number, practical: number, attendance: number}) => {
    const course = getCourseData(courseName);
    const firstName = studentName.split(" ")[0] || "The student";
    
    const strengthTemplates = {
      "Python Programming": {
        beginner: [
          "Demonstrates solid understanding of Python syntax and basic programming concepts",
          "Shows excellent logical thinking in problem-solving approaches",
          "Exhibits good attention to detail in code structure and formatting",
          "Displays consistent improvement in debugging and error resolution skills"
        ],
        intermediate: [
          "Excellent grasp of functions, loops, and conditional programming structures",
          "Strong ability to implement data structures effectively in practical applications",
          "Demonstrates good code organization and follows Python best practices",
          "Shows proficiency in error handling and writing robust, maintainable code"
        ],
        advanced: [
          "Outstanding mastery of object-oriented programming principles and design patterns",
          "Exceptional ability to integrate complex libraries and develop sophisticated algorithms",
          "Demonstrates leadership in collaborative coding projects and peer mentoring",
          "Exhibits innovative problem-solving approaches and code optimization techniques"
        ]
      },
      "Web Development": {
        beginner: [
          "Strong foundation in HTML5 semantic structure and accessibility principles",
          "Good understanding of CSS responsive design and modern layout techniques",
          "Shows promising development in JavaScript programming and DOM manipulation",
          "Demonstrates attention to user experience and interface design principles"
        ],
        intermediate: [
          "Excellent proficiency in React.js component development and state management",
          "Strong backend development skills with Node.js and database integration",
          "Demonstrates good understanding of RESTful API design and implementation",
          "Shows effective use of version control and collaborative development practices"
        ],
        advanced: [
          "Outstanding full-stack development capabilities with modern frameworks and tools",
          "Exceptional understanding of application architecture and scalability principles",
          "Demonstrates expertise in performance optimization and security implementation",
          "Exhibits leadership in technical decision-making and development best practices"
        ]
      },
      "Data Science": {
        beginner: [
          "Strong analytical mindset and methodical approach to data problems",
          "Good proficiency with Python data manipulation libraries (Pandas, NumPy)",
          "Demonstrates clear data visualization skills and insight communication",
          "Shows solid understanding of basic statistical concepts and applications"
        ],
        intermediate: [
          "Excellent implementation of machine learning algorithms and model evaluation",
          "Strong feature engineering and data preprocessing capabilities",
          "Demonstrates good understanding of statistical modeling and hypothesis testing",
          "Shows proficiency in advanced data visualization and exploratory analysis"
        ],
        advanced: [
          "Outstanding expertise in advanced machine learning and deep learning techniques",
          "Exceptional ability to design and conduct complex data science experiments",
          "Demonstrates thought leadership in applying analytics to business problems",
          "Exhibits mastery of big data technologies and scalable analytics solutions"
        ]
      },
      "Scratch Programming": {
        beginner: [
          "Demonstrates excellent creative thinking and innovative approach to visual programming",
          "Shows strong understanding of programming logic through intuitive block-based coding",
          "Exhibits natural aptitude for problem decomposition and computational thinking",
          "Displays remarkable enthusiasm and engagement in hands-on programming activities"
        ],
        intermediate: [
          "Excellent mastery of complex control structures and advanced Scratch programming features",
          "Strong ability to create engaging, interactive projects with sophisticated game mechanics",
          "Demonstrates good project planning skills and iterative development practices",
          "Shows natural mentoring abilities and collaborative spirit in programming community"
        ],
        advanced: [
          "Outstanding programming logic and algorithm design capabilities beyond visual programming",
          "Exceptional creativity in pushing the boundaries of Scratch platform capabilities",
          "Demonstrates leadership in teaching and mentoring other students effectively",
          "Exhibits readiness for advanced programming languages and computer science concepts"
        ]
      },
      "Mobile App Development": {
        beginner: [
          "Strong understanding of mobile UI/UX principles and user-centered design thinking",
          "Good grasp of mobile development fundamentals and platform-specific guidelines",
          "Shows excellent attention to detail in creating responsive and accessible interfaces",
          "Demonstrates solid debugging skills and systematic approach to problem-solving"
        ],
        intermediate: [
          "Excellent proficiency in cross-platform development and component architecture",
          "Strong ability to integrate APIs and manage complex data flows in mobile environments",
          "Demonstrates good understanding of mobile performance optimization and security practices",
          "Shows effective collaboration skills and contributes positively to development teams"
        ],
        advanced: [
          "Outstanding mastery of mobile architecture patterns and enterprise-level development",
          "Exceptional ability to create innovative mobile solutions with cutting-edge features",
          "Demonstrates leadership in mobile development community and technical discussions",
          "Exhibits professional-level skills ready for senior mobile development positions"
        ]
      },
      "Cybersecurity": {
        beginner: [
          "Strong ethical foundation and responsible approach to security testing and analysis",
          "Good understanding of security principles and systematic threat assessment methodology",
          "Shows excellent analytical thinking and attention to detail in security investigations",
          "Demonstrates solid grasp of security tools and follows industry best practices consistently"
        ],
        intermediate: [
          "Excellent proficiency in penetration testing and advanced vulnerability assessment techniques",
          "Strong incident response capabilities and effective security monitoring implementations",
          "Demonstrates good understanding of compliance frameworks and regulatory requirements",
          "Shows effective communication skills in translating technical security findings to stakeholders"
        ],
        advanced: [
          "Outstanding expertise across multiple security domains and emerging threat landscapes",
          "Exceptional ability to design comprehensive security architectures and defense strategies",
          "Demonstrates thought leadership in security research and innovative defense mechanisms",
          "Exhibits strategic security thinking ready for cybersecurity leadership and consulting roles"
        ]
      },
      "Digital Marketing": {
        beginner: [
          "Strong creative thinking and natural understanding of audience engagement strategies",
          "Good grasp of digital marketing fundamentals and multi-channel campaign development",
          "Shows excellent analytical mindset and data-driven approach to campaign optimization",
          "Demonstrates solid content creation skills and understanding of brand consistency"
        ],
        intermediate: [
          "Excellent proficiency in marketing automation and advanced analytics implementation",
          "Strong performance marketing capabilities with exceptional ROI achievement across channels",
          "Demonstrates good understanding of customer lifecycle marketing and behavioral targeting",
          "Shows effective leadership in marketing strategy development and cross-functional collaboration"
        ],
        advanced: [
          "Outstanding strategic marketing vision and expertise across all digital channels",
          "Exceptional ability to drive business growth through innovative marketing solutions",
          "Demonstrates thought leadership in marketing technology and growth strategy development",
          "Exhibits executive-level marketing skills ready for senior marketing leadership positions"
        ]
      }
    };

    const courseStrengths = strengthTemplates[courseName as keyof typeof strengthTemplates] || strengthTemplates["Python Programming"];
    const levelStrengths = courseStrengths[level];
    
    // Select 2-3 strengths based on performance
    const selectedStrengths = [];
    if (scores.theory >= 85) {
      selectedStrengths.push(levelStrengths[0]);
    }
    if (scores.practical >= 85) {
      selectedStrengths.push(levelStrengths[1]);
    }
    if (scores.attendance >= 90) {
      selectedStrengths.push(levelStrengths[2]);
    }
    
    // Ensure at least 2 strengths
    if (selectedStrengths.length < 2) {
      selectedStrengths.push(...levelStrengths.slice(0, 2));
    }
    
    return selectedStrengths.slice(0, 3).join("; ");
  };

  const generateCourseSpecificGrowthAreas = (courseName: string, studentName: string, level: "beginner" | "intermediate" | "advanced", scores: {theory: number, practical: number, attendance: number}) => {
    const firstName = studentName.split(" ")[0] || "The student";
    
    const growthTemplates = {
      "Python Programming": {
        beginner: [
          "Continue practicing with more complex conditional statements and nested logic structures",
          "Focus on debugging techniques and understanding error messages for faster problem resolution",
          "Develop stronger algorithm design skills through regular coding challenges and exercises",
          "Improve code documentation and commenting practices for better code readability"
        ],
        intermediate: [
          "Explore advanced Python libraries and frameworks to broaden technical expertise",
          "Practice code optimization techniques and performance analysis for efficient programming",
          "Develop stronger testing methodologies and quality assurance practices",
          "Focus on software design patterns and architectural thinking for scalable applications"
        ],
        advanced: [
          "Pursue specialization in emerging areas like machine learning or cloud computing",
          "Develop leadership skills in technical team management and project coordination",
          "Contribute to open-source projects to gain broader development experience",
          "Focus on industry certifications and continuous learning in evolving technologies"
        ]
      },
      "Web Development": {
        beginner: [
          "Continue practicing responsive design principles and cross-browser compatibility",
          "Strengthen JavaScript fundamentals and explore modern ES6+ features",
          "Develop better understanding of web accessibility and performance optimization",
          "Practice with version control systems and collaborative development workflows"
        ],
        intermediate: [
          "Explore advanced React patterns and state management solutions like Redux",
          "Strengthen backend development skills and database optimization techniques",
          "Focus on web security best practices and authentication implementation",
          "Develop DevOps skills including deployment and continuous integration practices"
        ],
        advanced: [
          "Pursue expertise in emerging web technologies and progressive web applications",
          "Develop architecture and technical leadership skills for large-scale applications",
          "Focus on performance optimization and scalability for high-traffic applications",
          "Contribute to web development community through teaching and mentoring"
        ]
      },
      "Data Science": {
        beginner: [
          "Strengthen statistical foundation and explore more advanced analytical methods",
          "Practice with diverse datasets to improve data cleaning and preprocessing skills",
          "Develop better data storytelling and visualization communication techniques",
          "Focus on understanding business context and practical applications of data insights"
        ],
        intermediate: [
          "Explore deep learning frameworks and neural network implementations",
          "Strengthen big data processing skills with distributed computing technologies",
          "Develop better model validation and statistical significance testing practices",
          "Focus on productionizing models and building scalable analytics pipelines"
        ],
        advanced: [
          "Pursue research opportunities and contribute to academic or industry publications",
          "Develop expertise in specialized domains like NLP, computer vision, or reinforcement learning",
          "Focus on business strategy and data-driven decision making at executive levels",
          "Mentor junior data scientists and contribute to the advancement of the field"
        ]
      },
      "Scratch Programming": {
        beginner: [
          "Continue exploring advanced block combinations and experiment with more complex project designs",
          "Practice breaking down larger problems into smaller, manageable programming components",
          "Develop stronger debugging skills by systematically testing and refining project functionality",
          "Focus on creating more detailed project documentation and sharing work with the community"
        ],
        intermediate: [
          "Explore advanced Scratch extensions and integrate external hardware or sensors",
          "Practice creating tutorial projects to help teach programming concepts to other students",
          "Develop stronger project planning skills with detailed storyboards and feature specifications",
          "Focus on transitioning to text-based programming languages to expand coding capabilities"
        ],
        advanced: [
          "Begin exploring professional programming languages like Python or JavaScript",
          "Develop teaching and mentoring skills by leading programming workshops or clubs",
          "Focus on computer science concepts like algorithms and data structures",
          "Pursue advanced programming challenges and consider participating in coding competitions"
        ]
      },
      "Mobile App Development": {
        beginner: [
          "Continue practicing mobile UI design principles and study platform-specific guidelines",
          "Strengthen debugging skills using mobile development tools and device testing",
          "Develop better understanding of mobile performance optimization and memory management",
          "Focus on learning version control and collaborative development practices for mobile teams"
        ],
        intermediate: [
          "Explore advanced mobile features like push notifications, offline functionality, and real-time sync",
          "Strengthen cross-platform development skills and component architecture patterns",
          "Develop better mobile security practices and data protection implementation",
          "Focus on app store optimization and mobile app marketing strategies"
        ],
        advanced: [
          "Pursue expertise in emerging mobile technologies like AR/VR, IoT integration, or machine learning",
          "Develop mobile architecture and technical leadership skills for enterprise applications",
          "Focus on mobile DevOps, automated testing, and continuous deployment practices",
          "Contribute to mobile development community through open-source projects and technical content"
        ]
      },
      "Cybersecurity": {
        beginner: [
          "Continue building foundational knowledge in network security and system administration",
          "Practice with more advanced security tools and develop systematic vulnerability assessment skills",
          "Strengthen understanding of compliance frameworks and security policy development",
          "Focus on developing clear communication skills for security findings and recommendations"
        ],
        intermediate: [
          "Explore advanced penetration testing techniques and red team methodologies",
          "Strengthen incident response and digital forensics capabilities",
          "Develop better understanding of cloud security and modern infrastructure protection",
          "Focus on security automation and threat intelligence integration"
        ],
        advanced: [
          "Pursue expertise in emerging threats like AI-powered attacks or IoT security challenges",
          "Develop security architecture and technical leadership skills for enterprise environments",
          "Focus on security research and contributing to the broader cybersecurity community",
          "Develop business acumen and strategic security thinking for executive-level positions"
        ]
      },
      "Digital Marketing": {
        beginner: [
          "Continue developing analytical skills and practice with advanced marketing metrics and KPIs",
          "Strengthen content creation capabilities across different digital platforms and formats",
          "Practice with marketing automation tools and develop systematic campaign optimization approaches",
          "Focus on understanding customer psychology and behavioral marketing principles"
        ],
        intermediate: [
          "Explore advanced marketing technologies like AI-powered personalization and predictive analytics",
          "Strengthen growth hacking techniques and experiment with innovative acquisition channels",
          "Develop better understanding of marketing attribution and customer lifetime value optimization",
          "Focus on cross-functional collaboration and marketing-sales alignment strategies"
        ],
        advanced: [
          "Pursue expertise in emerging marketing technologies and platforms",
          "Develop marketing strategy and leadership skills for enterprise-level campaigns",
          "Focus on marketing technology stack optimization and organizational transformation",
          "Contribute to marketing community through thought leadership and industry innovation"
        ]
      }
    };

    const courseGrowth = growthTemplates[courseName as keyof typeof growthTemplates] || growthTemplates["Python Programming"];
    const levelGrowth = courseGrowth[level];
    
    // Select growth areas based on lower scores
    const selectedGrowth = [];
    if (scores.theory < 80) {
      selectedGrowth.push(levelGrowth[0]);
    }
    if (scores.practical < 80) {
      selectedGrowth.push(levelGrowth[1]);
    }
    if (scores.attendance < 85) {
      selectedGrowth.push(levelGrowth[2]);
    }
    
    // Ensure at least 1 growth area
    if (selectedGrowth.length === 0) {
      selectedGrowth.push(levelGrowth[0]);
    }
    
    return selectedGrowth.slice(0, 2).join("; ");
  };

  const qrCodeRef = useRef<HTMLDivElement>(null)
  const qrCodeMinimalRef = useRef<HTMLDivElement>(null)
  const [logoLoaded, setLogoLoaded] = useState(false)
  
  // HD Intelligent Design enhancements
  const isHDPremium = tier === "hd"
  const enhancedMargins = isHDPremium ? "p-8" : "p-4"
  const enhancedSpacing = isHDPremium ? "space-y-8" : "space-y-6"
  const enhancedTextSize = isHDPremium ? "text-base" : "text-sm"

  // Enhanced grade calculation similar to UnifiedReportGenerator
  const calculateAdvancedGrade = (score: number): string => {
    if (score >= 85) return "A"
    if (score >= 70) return "B"
    if (score >= 65) return "C"
    if (score >= 50) return "D"
    return "F"
  }

  const getGradeColorClass = (grade: string): string => {
    switch (grade) {
      case "A":
        return "text-green-800 bg-green-100 border-green-200"
      case "B":
        return "text-blue-800 bg-blue-100 border-blue-200"
      case "C":
        return "text-yellow-800 bg-yellow-100 border-yellow-200"
      case "D":
        return "text-orange-800 bg-orange-100 border-orange-200"
      default:
        return "text-red-800 bg-red-100 border-red-200"
    }
  }

  // Memoize calculated values to prevent unnecessary recalculations
  const {
    formattedDate,
    theoryScore,
    practicalScore,
    attendance,
    theoryGrade,
    practicalGrade,
    attendanceGrade,
    overallGrade,
    processedCertText,
    gradeColor,
    overallScore,
    courseData,
    studentLevel,
    courseSpecificComments,
    courseSpecificStrengths,
    courseSpecificGrowthAreas,
    courseProgressItems,
  } = useMemo(() => {
    // Format date
    const reportDate = formData.reportDate ? new Date(formData.reportDate) : new Date()
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    const formattedDate = reportDate.toLocaleDateString("en-US", options)

    // Calculate scores and grades with robust NaN handling
    const theoryScore = Number.isNaN(Number.parseInt(formData.theoryScore)) ? 0 : Number.parseInt(formData.theoryScore) || 0
    const practicalScore = Number.isNaN(Number.parseInt(formData.practicalScore)) ? 0 : Number.parseInt(formData.practicalScore) || 0
    const attendance = Number.isNaN(Number.parseInt(formData.attendance)) ? 0 : Number.parseInt(formData.attendance) || 0

    const theoryGrade = calculateGrade(theoryScore)
    const practicalGrade = calculateGrade(practicalScore)
    const attendanceGrade = calculateGrade(attendance)
    
    // Ensure overallScore is never NaN
    const calculatedOverallScore = (theoryScore + practicalScore + attendance) / 3
    const overallScore = Number.isNaN(calculatedOverallScore) ? 0 : Math.round(calculatedOverallScore)
    const overallGrade = calculateGrade(overallScore)

    // Get course-specific data
    const courseName = settings.courseName || "Python Programming";
    const courseData = getCourseData(courseName);
    const studentLevel = getStudentLevel(theoryScore, practicalScore, attendance);
    
    // Generate course-specific content
    const scores = { theory: theoryScore, practical: practicalScore, attendance };
    const courseSpecificComments = formData.comments || generateCourseSpecificComments(courseName, formData.studentName || "the student", studentLevel, scores);
    const courseSpecificStrengths = formData.strengths || generateCourseSpecificStrengths(courseName, formData.studentName || "the student", studentLevel, scores);
    const courseSpecificGrowthAreas = formData.growth || generateCourseSpecificGrowthAreas(courseName, formData.studentName || "the student", studentLevel, scores);
    
    // Get course-specific progress items
    const courseProgressItems = formData.progressItems && formData.progressItems.length > 0 
      ? formData.progressItems 
      : courseData.progressItems[studentLevel] || courseData.progressItems.beginner;

    // Process certificate text with course-specific information
    const processedCertText = replacePlaceholders(
      formData.certificateText ||
        `This certifies that [Student Name] has successfully completed the ${courseData.title} course, demonstrating ${studentLevel}-level proficiency in ${courseName} at Rillcod Technologies.`,
      formData.studentName || "[Student Name]",
    )
      .replace(/\[Course Name\]/g, courseName)
      .replace(/\[Course Module\]/g, settings.currentModule || courseData.modules[0] || "[Course Module]")

    // Determine grade color
    const gradeColor = getGradeColor(overallGrade)

    return {
      formattedDate,
      theoryScore,
      practicalScore,
      attendance,
      theoryGrade,
      practicalGrade,
      attendanceGrade,
      overallGrade,
      processedCertText,
      gradeColor,
      overallScore,
      courseData,
      studentLevel,
      courseSpecificComments,
      courseSpecificStrengths,
      courseSpecificGrowthAreas,
      courseProgressItems,
    }
  }, [formData, settings])

  // Function to get color based on grade
  function getGradeColor(grade: string) {
    switch (grade) {
      case "A":
        return {
          outer: "linear-gradient(135deg, #d4af37 0%, #f9f295 50%, #d4af37 100%)",
          inner: "linear-gradient(135deg, #b8860b 0%, #d4af37 50%, #b8860b 100%)",
          border: "#b8860b",
        }
      case "B":
        return {
          outer: "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%)",
          inner: "linear-gradient(135deg, #A9A9A9 0%, #C0C0C0 50%, #A9A9A9 100%)",
          border: "#A9A9A9",
        }
      case "C":
        return {
          outer: "linear-gradient(135deg, #CD7F32 0%, #E6BE8A 50%, #CD7F32 100%)",
          inner: "linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #B87333 100%)",
          border: "#B87333",
        }
      default:
        return {
          outer: "linear-gradient(135deg, #6c757d 0%, #adb5bd 50%, #6c757d 100%)",
          inner: "linear-gradient(135deg, #495057 0%, #6c757d 50%, #495057 100%)",
          border: "#495057",
        }
    }
  }

  // Generate QR code with student grade information (only if enabled)
  useEffect(() => {
    if (settings.showQRCode !== false) {
      const qrData = `STUDENT: ${formData.studentName || "Unknown"}
COURSE: ${settings.courseName || "Unknown"}
MODULE: ${settings.currentModule || "Unknown"}
THEORY: ${theoryScore}/100 (${theoryGrade})
PRACTICAL: ${practicalScore}/100 (${practicalGrade})
ATTENDANCE: ${attendance}% (${attendanceGrade})
OVERALL: ${overallGrade}
DATE: ${new Date().toLocaleDateString()}
ISSUED BY: ${settings.instructorName || "Rillcod Technologies"}`

      // Generate QR code for minimal view
      if (qrCodeMinimalRef.current) {
        const canvas1 = document.createElement("canvas")
        QRCode.toCanvas(
          canvas1,
          qrData,
          { width: 64, margin: 1 },
          (error?: Error | null) => {
            if (error) {
              console.error(error)
              return
            }
            if (qrCodeMinimalRef.current) {
              qrCodeMinimalRef.current.innerHTML = ""
              qrCodeMinimalRef.current.appendChild(canvas1)
            }
          }
        )
      }

      // Generate QR code for full view
      if (qrCodeRef.current) {
        const canvas2 = document.createElement("canvas")
        QRCode.toCanvas(
          canvas2,
          qrData,
          { width: 120, margin: 1 },
          (error?: Error | null) => {
            if (error) {
              console.error(error)
              return
            }
            if (qrCodeRef.current) {
              qrCodeRef.current.innerHTML = ""
              qrCodeRef.current.appendChild(canvas2)
            }
          }
        )
      }
    } else {
      // Clear QR codes if disabled
      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = ""
      }
      if (qrCodeMinimalRef.current) {
        qrCodeMinimalRef.current.innerHTML = ""
      }
    }
  }, [
    formData,
    settings,
    theoryScore,
    practicalScore,
    attendance,
    theoryGrade,
    practicalGrade,
    attendanceGrade,
    overallGrade,
  ])

  // If minimal view, return simplified version using UnifiedReportGenerator layout
  if (minimalView) {
    return (
      <div
        className="w-full max-w-4xl mx-auto bg-white"
        style={{
          minHeight: "297mm",
          maxHeight: "297mm",
          width: "210mm",
          fontSize: "11px",
          lineHeight: "1.3",
          overflow: "hidden",
          padding: "8mm",
        }}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-red-600">
          <div className="flex items-center gap-3">
            <img
              src="/images/rillcod-logo.png"
              alt="Rillcod Technologies"
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
            <div>
              <h1 className="text-lg font-bold" style={{ color: "#1e3a8a" }}>Rillcod Technologies</h1>
              <p className="text-xs text-gray-600">Student Progress Report</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600">
            <div>Report Date: {formattedDate}</div>
            <div>📱 08116600091</div>
            <div>🌐 www.rillcod.com</div>
          </div>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-500">
              <div className="text-xs font-medium text-blue-800">Student Name</div>
              <div className="font-bold text-blue-900">{formData.studentName || "[Name]"}</div>
            </div>
            <div className="bg-green-50 p-2 rounded border-l-4 border-green-500">
              <div className="text-xs font-medium text-green-800">School</div>
              <div className="font-bold text-green-900">{formData.schoolName || settings.schoolName || "Not Specified"}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-purple-50 p-2 rounded border-l-4 border-purple-500">
              <div className="text-xs font-medium text-purple-800">Section/Class</div>
              <div className="font-bold text-purple-900">{formData.studentSection || "Not Specified"}</div>
            </div>
            <div className="bg-orange-50 p-2 rounded border-l-4 border-orange-500">
              <div className="text-xs font-medium text-orange-800">Course</div>
              <div className="font-bold text-orange-900">{settings.courseName || "Python Programming"}</div>
            </div>
          </div>
        </div>






      </div>
    )
  }

  return (
    <div
      className={`page bg-white/90 backdrop-blur-sm text-black ${printMode ? "print-mode" : ""} ${enhancedSpacing}`}
      style={{
        fontSize: isHDPremium ? "14px" : "12px",
        width: printMode ? "100%" : "100%",
        maxWidth: printMode ? "none" : "none",
        minHeight: printMode ? "100vh" : "297mm",
        boxSizing: "border-box",
        overflowX: "hidden",
        padding: isHDPremium ? "24px" : "16px",
        margin: printMode ? "0" : "auto",
        color: "#000000", // Force black text
      }}
    >
      {/* Enhanced Watermark with Intelligent HD Design - Only show if enabled */}
      {(settings.showWatermark !== false) && (
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${isHDPremium ? 'opacity-20' : 'opacity-15'} z-0`}>
          <img
            src="/images/rillcod-logo.png"
            alt=""
            className={`${isHDPremium ? 'w-[800px] h-[800px]' : 'w-[700px] h-[700px]'} object-contain`}
            style={{ 
              transform: "rotate(-30deg)",
              maxWidth: "none",
              maxHeight: "none"
            }}
            crossOrigin="anonymous"
            onError={(e) => {
              // Fallback to placeholder if Rillcod logo fails
              e.currentTarget.src = "/placeholder-logo.png"
            }}
          />
        </div>
      )}

      {/* Enhanced Professional Header with Intelligent HD Design */}
      <div className={`mb-${isHDPremium ? '8' : '6'} relative z-10`}>
        {/* HD: Enhanced Layout with Better Visual Hierarchy - Now used for both Standard and HD */}
        {isHDPremium || tier === "standard" ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {/* Enhanced Header with Modern Design */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="bg-white p-4 rounded-full shadow-xl">
                    <img
                      src="/images/rillcod-logo.png"
                      alt="Rillcod Technologies"
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-wide">RILLCOD TECHNOLOGIES</div>
                    <div className="text-base text-white/90 mt-1">Excellence in Educational Technology</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white tracking-wide">Student Progress Report</div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-blue-800 text-base mb-2">📍 Location</div>
                  <div className="text-gray-700 leading-relaxed">26 Ogiesoba Avenue, Off Airport Road, GRA, Benin City</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-800 text-base mb-2">📞 Contact</div>
                  <div className="text-gray-700">08116600091</div>
                  <div className="text-gray-700">rillcod@gmail.com</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-800 text-base mb-2">🌐 Website</div>
                  <div className="text-gray-700">www.rillcod.com</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Header */
          <div>
            {/* Top Banner with Company Colors - Navy Blue */}
            <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white p-4 rounded-t-lg" style={{ background: "linear-gradient(90deg, #1e3a8a 0%, #1e40af 50%, #1e3a8a 100%)" }}>
              <div className="grid grid-cols-3 gap-4 items-center">
                {/* Left: Company Info */}
                <div className="text-left">
                  <div className="text-sm font-bold mb-1 text-white">RILLCOD TECHNOLOGIES</div>
                  <div className="text-xs opacity-95 text-gray-100">Coding Today, Innovating Tomorrow</div>
                </div>

            {/* Center: Logo */}
            <div className="flex justify-center items-center">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <img
                  src="/images/rillcod-logo.png"
                  alt="Rillcod Logo"
                  crossOrigin="anonymous"
                  style={{ height: "40px", maxWidth: "120px", display: "block", objectFit: "contain" }}
                  onLoad={() => setLogoLoaded(true)}
                  onError={(e) => {
                    // Fallback to placeholder if Rillcod logo fails
                    e.currentTarget.src = "/placeholder-logo.png"
                  }}
                />
              </div>
            </div>

            {/* Right: Contact Info */}
            <div className="text-right text-xs">
              <div className="font-semibold text-white">rillcod@gmail.com</div>
              <div className="opacity-95 text-gray-100">08116600091</div>
            </div>
          </div>
        </div>

        {/* Red Title Banner */}
        <div className="text-white text-center py-3 font-bold text-lg tracking-wide" style={{ background: "linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #dc2626 100%)" }}>
          STUDENT PROGRESS REPORT
        </div>

        {/* Address Bar */}
        <div className="bg-gray-100 text-center py-2 text-xs text-gray-800 border-b-2" style={{ borderColor: "#dc2626" }}>
          📍 26 Ogiesoba Avenue, Off Airport Road, GRA, Benin City • 🌐 {settings.schoolWebsite || "www.rillcod.com"}
        </div>
        </div>
        )}
      </div>

      {/* Enhanced Student Information Card with Navy Blue */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 p-4 mb-6 rounded-r-lg shadow-sm relative z-10" style={{ borderColor: "#1e3a8a" }}>
        <div className="mb-3">
          <h3 className="text-base font-bold border-b pb-1" style={{ color: "#1e3a8a", borderColor: "#1e3a8a" }}>STUDENT INFORMATION</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-semibold w-32" style={{ color: "#1e3a8a" }}>Student Name:</span>
              <span className="text-gray-900 font-medium">{formData.studentName || "[Full Name]"}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32" style={{ color: "#1e3a8a" }}>School:</span>
              <span className="text-gray-900">{formData.schoolName || settings.schoolName || "[School Name]"}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32" style={{ color: "#1e3a8a" }}>Section/Class:</span>
              <span className="text-gray-900">{formData.studentSection || "[Section/Class]"}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32" style={{ color: "#1e3a8a" }}>Course:</span>
              <span className="text-gray-900">{settings.courseName || "Python Programming"}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-semibold w-32" style={{ color: "#1e3a8a" }}>Current Module:</span>
              <span className="text-gray-900">{settings.currentModule || "Variables to Conditionals"}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32" style={{ color: "#1e3a8a" }}>Report Date:</span>
              <span className="text-gray-900">{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32" style={{ color: "#1e3a8a" }}>Instructor:</span>
              <span className="text-gray-900">{settings.instructorName || "Rillcod Instructor"}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-32" style={{ color: "#1e3a8a" }}>Duration:</span>
              <span className="text-gray-900">{settings.duration || "12 weeks"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Course Progress Section */}
      <div className="mb-6 relative z-10">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold tracking-wide">COURSE PROGRESS</h3>
          </div>
          
          <div className="p-6">
            {/* Progress Overview Card */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-semibold text-indigo-900">Learning Milestones</h4>
                <span className="text-sm text-indigo-700 bg-indigo-100 px-2 py-1 rounded">
                  {courseProgressItems?.length || 6} Objectives
                </span>
              </div>
            </div>

            {/* Progress Items - Enhanced List Format */}
            <div className="space-y-3">
              {courseProgressItems && courseProgressItems.length > 0 ? (
                courseProgressItems.map((item: string, index: number) => {
                  const [title, description] = item.split(':')
                  // Determine progress status based on index for variety
                  const progressStatus = index < courseProgressItems.length * 0.7 ? 'completed' : 
                                       index < courseProgressItems.length * 0.9 ? 'in-progress' : 'upcoming'
                  
                  const statusConfig = {
                    completed: {
                      icon: '✓',
                      iconBg: 'bg-green-500',
                      borderColor: 'border-green-500',
                      badge: 'bg-green-100 text-green-800',
                      text: 'Complete'
                    },
                    'in-progress': {
                      icon: '⏳',
                      iconBg: 'bg-yellow-500',
                      borderColor: 'border-yellow-500',
                      badge: 'bg-yellow-100 text-yellow-800',
                      text: 'In Progress'
                    },
                    upcoming: {
                      icon: '⭐',
                      iconBg: 'bg-blue-500',
                      borderColor: 'border-blue-500',
                      badge: 'bg-blue-100 text-blue-800',
                      text: 'Upcoming'
                    }
                  }
                  
                  return (
                    <div key={index} className={`bg-white border-l-4 ${statusConfig[progressStatus].borderColor} p-4 hover:shadow-sm transition-shadow`}>
                      <div className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 ${statusConfig[progressStatus].iconBg} rounded-full flex items-center justify-center`}>
                          <span className="text-white text-sm font-bold">{statusConfig[progressStatus].icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-semibold text-gray-900">{title?.trim()}</h5>
                          {description && (
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description.trim()}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[progressStatus].badge}`}>
                            {statusConfig[progressStatus].text}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <>
                  <div className="bg-white border-l-4 border-green-500 p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-900">Variables & Data Types</h5>
                        <p className="text-sm text-gray-600 mt-1">Understanding different data types and variable declarations</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Complete
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-green-500 p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-900">Input/Output Operations</h5>
                        <p className="text-sm text-gray-600 mt-1">User interaction basics and data handling</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Complete
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-yellow-500 p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⏳</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-900">Conditional Statements</h5>
                        <p className="text-sm text-gray-600 mt-1">If/else logic implementation and decision making</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        In Progress
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border-l-4 border-blue-500 p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⭐</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-semibold text-gray-900">Problem Solving</h5>
                        <p className="text-sm text-gray-600 mt-1">Logical thinking skills and algorithmic approach</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Upcoming
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Course Completion Summary */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">Course: {settings.courseName || "Programming Fundamentals"}</h5>
                  <p className="text-xs text-gray-600">Duration: {settings.duration || "12 weeks"} • Module: {settings.currentModule || "Basic Programming"}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">85%</div>
                    <div className="text-xs text-gray-600">Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Performance Assessment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 relative z-10">
        {/* Performance Metrics Cards */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold tracking-wide">PERFORMANCE METRICS</h3>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Theory Assessment */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-slate-900">Theory Assessment</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  theoryGrade === 'A' ? 'bg-green-100 text-green-800' :
                  theoryGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                  theoryGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  Grade {theoryGrade}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-slate-700">{theoryScore}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${theoryScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Practical Assessment */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-slate-900">Practical Assessment</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  practicalGrade === 'A' ? 'bg-green-100 text-green-800' :
                  practicalGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                  practicalGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  Grade {practicalGrade}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-slate-700">{practicalScore}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${practicalScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-slate-900">Attendance Rate</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  attendanceGrade === 'A' ? 'bg-green-100 text-green-800' :
                  attendanceGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                  attendanceGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  Grade {attendanceGrade}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-slate-700">{attendance}%</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${attendance}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-600">Participation</div>
                <div className="text-lg font-semibold text-slate-700">{formData.participation || "Very Good"}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Project Status</div>
                <div className="text-lg font-semibold text-slate-700">{formData.projectCompletion || "Completed"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Performance Summary */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold tracking-wide">OVERALL PERFORMANCE</h3>
          </div>
          
          <div className="p-6 text-center">
            {/* Grade Circle */}
            <div className="mb-6">
              <div
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg mb-4"
                style={{
                  background: gradeColor.outer,
                  border: `4px solid ${gradeColor.border}`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: gradeColor.inner,
                  }}
                >
                  <div className="text-2xl font-bold text-white">{overallGrade}</div>
                </div>
              </div>
              <div className="text-xl font-semibold text-slate-700">
                {overallGrade === 'A' ? 'Excellent' : 
                 overallGrade === 'B' ? 'Good' : 
                 overallGrade === 'C' ? 'Satisfactory' : 'Needs Improvement'}
              </div>
              <div className="text-sm text-gray-600">Performance Level</div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Performance Summary</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Average Score:</span>
                  <span className="font-medium">{Math.round((theoryScore + practicalScore + attendance) / 3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Theory Performance:</span>
                  <span className="font-medium">{theoryScore >= 80 ? 'Strong' : theoryScore >= 70 ? 'Good' : 'Developing'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Practical Skills:</span>
                  <span className="font-medium">{practicalScore >= 80 ? 'Excellent' : practicalScore >= 70 ? 'Competent' : 'Learning'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Engagement Level:</span>
                  <span className="font-medium">{attendance >= 90 ? 'High' : attendance >= 80 ? 'Good' : 'Needs Improvement'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Instructor Evaluation */}
      <div className="mb-6 relative z-10">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
            <h3 className="text-lg font-semibold tracking-wide">INSTRUCTOR EVALUATION</h3>
          </div>
          <div className="p-6">
            {/* Enhanced Evaluation Categories - List Format */}
            <div className="space-y-4">
              {/* Academic Performance */}
              <div className="bg-white border-l-4 border-blue-500 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📚</span>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">Academic Performance</h4>
                      <p className="text-sm text-gray-600">Understanding of course concepts and theoretical knowledge</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {theoryScore >= 90 ? 'Excellent' : theoryScore >= 80 ? 'Good' : theoryScore >= 70 ? 'Satisfactory' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Practical Skills */}
              <div className="bg-white border-l-4 border-green-500 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🛠️</span>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">Practical Skills</h4>
                      <p className="text-sm text-gray-600">Hands-on application and technical implementation</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {practicalScore >= 90 ? 'Excellent' : practicalScore >= 80 ? 'Good' : practicalScore >= 70 ? 'Satisfactory' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Attitude & Engagement */}
              <div className="bg-white border-l-4 border-purple-500 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">😊</span>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">Attitude & Engagement</h4>
                      <p className="text-sm text-gray-600">Positive learning attitude and active participation</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {formData.attitude || "Excellent"}
                  </span>
                </div>
              </div>

              {/* Professional Behavior */}
              <div className="bg-white border-l-4 border-indigo-500 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">👔</span>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">Professional Behavior</h4>
                      <p className="text-sm text-gray-600">Workplace readiness and professional conduct</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {formData.professionalBehavior || "Good"}
                  </span>
                </div>
              </div>

              {/* Collaboration & Teamwork */}
              <div className="bg-white border-l-4 border-orange-500 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🤝</span>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">Collaboration & Teamwork</h4>
                      <p className="text-sm text-gray-600">Ability to work effectively with peers and instructors</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    {formData.collaboration || "Good"}
                  </span>
                </div>
              </div>

              {/* Problem Solving */}
              <div className="bg-white border-l-4 border-teal-500 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🧠</span>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">Problem Solving</h4>
                      <p className="text-sm text-gray-600">Analytical thinking and creative solution development</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    {formData.problemSolving || "Developing"}
                  </span>
                </div>
              </div>

              {/* Attendance & Punctuality */}
              <div className="bg-white border-l-4 border-cyan-500 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">⏰</span>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">Attendance & Punctuality</h4>
                      <p className="text-sm text-gray-600">Consistent attendance and timely completion of tasks</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                    {attendance >= 95 ? 'Excellent' : attendance >= 85 ? 'Good' : attendance >= 75 ? 'Satisfactory' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Communication Skills */}
              <div className="bg-white border-l-4 border-rose-500 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">💬</span>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">Communication Skills</h4>
                      <p className="text-sm text-gray-600">Verbal and written communication effectiveness</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800">
                    {formData.communication || "Good"}
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Instructor Comments */}
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-5 border border-gray-200">
              <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-bold">💭</span>
                </span>
                Instructor Overall Assessment
              </h4>
              <div className="text-sm text-gray-700 leading-relaxed">
                {formData.instructorComments || "Student demonstrates consistent progress and positive engagement in the learning process. Shows strong dedication to mastering course concepts and actively participates in class activities. Continues to develop both technical skills and professional competencies effectively."}
              </div>
            </div>
          </div>
        </div>
      </div>





      {/* Enhanced Certificate of Completion */}
      <div className="mt-6 relative z-10">
        <div className={`text-center px-${isHDPremium ? '6' : '4'} py-${isHDPremium ? '3' : '2'} rounded-t-lg ${minimalView ? 'bg-gray-100 text-black' : 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white'}`}>
          <h3 className={`${isHDPremium ? 'text-base' : 'text-sm'} font-bold ${minimalView ? 'text-black' : 'text-white'}`}>CERTIFICATE OF COMPLETION</h3>
        </div>
        <div className={`certificate-container bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-500 rounded-b-lg ${isHDPremium ? 'p-8' : 'p-6'} text-center ${isHDPremium ? 'text-base' : 'text-sm'} relative overflow-hidden`}>
          {/* Enhanced Decorative Elements */}
          <div className="absolute inset-0 border-8 border-double border-amber-200 rounded-b-lg pointer-events-none"></div>
          <div className="absolute inset-4 border-2 border-amber-400 rounded pointer-events-none"></div>

          {/* Elegant Corner Decorations */}
          <div className="absolute top-4 left-4 w-12 h-12">
            <div className="w-full h-full border-t-4 border-l-4 border-amber-600 rounded-tl-lg"></div>
            <div className="absolute top-2 left-2 w-4 h-4 bg-amber-300 rounded-full"></div>
          </div>
          <div className="absolute top-4 right-4 w-12 h-12">
            <div className="w-full h-full border-t-4 border-r-4 border-amber-600 rounded-tr-lg"></div>
            <div className="absolute top-2 right-2 w-4 h-4 bg-amber-300 rounded-full"></div>
          </div>
          <div className="absolute bottom-4 left-4 w-12 h-12">
            <div className="w-full h-full border-b-4 border-l-4 border-amber-600 rounded-bl-lg"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 bg-amber-300 rounded-full"></div>
          </div>
          <div className="absolute bottom-4 right-4 w-12 h-12">
            <div className="w-full h-full border-b-4 border-r-4 border-amber-600 rounded-br-lg"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-amber-300 rounded-full"></div>
          </div>

          {/* Certificate Content */}
          <div className={`relative z-10 ${isHDPremium ? 'py-8 px-10' : 'py-6 px-8'}`}>
            <div className={`text-amber-800 font-serif ${isHDPremium ? 'text-xl' : 'text-lg'} mb-6 leading-relaxed`}>
              {processedCertText}
            </div>

            {/* Enhanced Signature and Details Section */}
            <div className="flex justify-between items-end mt-8 pt-6 border-t border-amber-300">
              {/* Signature Section */}
              <div className="w-40 flex flex-col items-center">
                <div className="signature-container mb-4">
                  {settings.digitalSignature ? (
                    <img
                      src={settings.digitalSignature || "/placeholder.svg"}
                      alt="Digital Signature"
                      className="signature-image max-h-16 max-w-32"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error("Error loading signature image")
                        const target = e.currentTarget as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          const fallback = document.createElement("div")
                          fallback.className = "border-t-2 mt-6 mx-auto w-24 border-blue-800"
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  ) : (
                    <div className="border-t-2 mt-6 mx-auto w-24 border-blue-800"></div>
                  )}
                </div>
                <p className="text-xs text-amber-700 font-medium">
                  Instructor's Signature
                </p>
              </div>

              {/* Payment Details (if enabled) */}
              {formData.showPaymentDetails && (
                <div className="text-center flex-1 mx-6">
                  <div className="bg-white bg-opacity-80 p-3 rounded border border-amber-400">
                    <div className="font-bold text-xs text-amber-800 mb-1">
                      NEXT TERM FEE PAYMENT
                    </div>
                    <div className="text-xs text-amber-700">
                      {settings.nextTermFee || "₦15,000"} TO RILLCOD LTD.
                    </div>
                    <div className="text-xs text-amber-600 mt-1">
                      BANK: {settings.bankDetails || "PROVIDUS | ACCOUNT NUMBER: 7901178957"}
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code Section - Only show if enabled */}
              {(settings.showQRCode !== false) && (
                <div className="w-32 flex flex-col items-center">
                  <div ref={qrCodeRef} className="mb-2"></div>
                  <p className="text-xs text-amber-700 font-medium text-center">
                    Verification Code
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
