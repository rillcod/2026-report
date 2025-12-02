"use client"

import { useState } from "react"

interface UnifiedFeedbackOptionsProps {
  onClose: () => void
  onSelect: (content: string) => void
  type: 'strength' | 'growth' | 'comment'
}

export function UnifiedFeedbackOptions({ onClose, onSelect, type }: UnifiedFeedbackOptionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('general')

  const categories = [
    { id: 'general', name: 'General Programming' },
    { id: 'scratch', name: 'Scratch 3.0' },
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'java', name: 'Java' },
    { id: 'web', name: 'HTML/CSS/Web Development' },
    { id: 'design', name: 'Design Fundamentals' },
    { id: 'uiux', name: 'UI/UX Design' },
    { id: 'mobile', name: 'Mobile Development' },
    { id: 'database', name: 'Database & SQL' },
    { id: 'cybersecurity', name: 'Cybersecurity' },
    { id: 'ai', name: 'AI & Machine Learning' },
    { id: 'gamedev', name: 'Game Development' },
    { id: 'robotics', name: 'Robotics & Arduino' },
  ]

  const contentData = {
    strength: {
      general: [
        "Excellent problem-solving skills and logical thinking",
        "Quick grasp of programming concepts and fundamentals",
        "Strong attention to detail in code structure",
        "Creative approach to solving coding challenges",
        "Excellent collaborative skills in team projects",
        "Persistent in debugging and troubleshooting",
        "Demonstrates strong analytical thinking",
        "Shows excellent time management in projects",
        "Great at breaking down complex problems",
        "Excellent documentation and commenting practices",
      ],
      scratch: [
        "Exceptional creativity in Scratch sprite design and storytelling",
        "Strong understanding of event-based programming concepts",
        "Excellent use of broadcasting for sprite communication",
        "Creative implementation of cloning mechanisms",
        "Impressive mastery of variables and lists management",
        "Excellent application of sensing blocks for interactive projects",
        "Innovative use of custom blocks for code reusability",
        "Strong understanding of loops and conditionals",
        "Creative use of costume and backdrop changes",
        "Excellent game mechanics implementation",
      ],
      python: [
        "Strong understanding of Python syntax and data structures",
        "Excellent implementation of functions and modules",
        "Impressive use of list comprehensions and generators",
        "Strong grasp of object-oriented programming concepts",
        "Effective use of exception handling and error management",
        "Excellent file handling and data processing skills",
        "Strong understanding of Python libraries (NumPy, Pandas, etc.)",
        "Great at implementing algorithms and data structures",
        "Excellent debugging skills with Python debugger",
        "Strong understanding of Python best practices (PEP 8)",
      ],
      javascript: [
        "Strong understanding of JavaScript fundamentals and ES6+ features",
        "Excellent DOM manipulation and event handling skills",
        "Impressive understanding of asynchronous programming (promises, async/await)",
        "Strong grasp of JavaScript frameworks (React, Vue, Angular)",
        "Excellent API integration and AJAX implementation",
        "Strong understanding of JavaScript closures and scope",
        "Great at implementing responsive interactive features",
        "Excellent Node.js backend development skills",
        "Strong understanding of JavaScript testing frameworks",
        "Impressive understanding of modern JavaScript tooling",
      ],
      java: [
        "Strong understanding of Java syntax and object-oriented principles",
        "Excellent implementation of inheritance and polymorphism",
        "Impressive understanding of Java collections framework",
        "Strong grasp of exception handling and error management",
        "Excellent multithreading and concurrency implementation",
        "Strong understanding of Java design patterns",
        "Great at implementing database connectivity (JDBC)",
        "Excellent Spring framework development skills",
        "Strong understanding of Java testing with JUnit",
        "Impressive Android app development capabilities",
      ],
      web: [
        "Excellent HTML semantic structure implementation",
        "Strong CSS styling and advanced layout techniques",
        "Impressive responsive design implementation across devices",
        "Creative use of CSS animations and transitions",
        "Strong understanding of CSS Grid and Flexbox",
        "Excellent attention to cross-browser compatibility",
        "Impressive implementation of accessible web design (WCAG)",
        "Strong understanding of web performance optimization",
        "Excellent integration of CSS frameworks (Bootstrap, Tailwind)",
        "Great at implementing progressive web app features",
      ],
      design: [
        "Strong visual design sensibilities and aesthetic awareness",
        "Excellent understanding of color theory and psychology",
        "Impressive typography and readability considerations",
        "Strong understanding of visual hierarchy and composition",
        "Creative approach to visual problem solving",
        "Excellent wireframing and prototyping skills",
        "Strong attention to design consistency and patterns",
        "Great understanding of design principles (contrast, balance, unity)",
        "Excellent brand identity and logo design capabilities",
        "Strong understanding of print and digital design differences",
      ],
      uiux: [
        "Exceptional user-centered design thinking and empathy",
        "Strong understanding of user research methodologies",
        "Excellent information architecture and user flow design",
        "Impressive interaction design and micro-animation skills",
        "Strong usability testing and iterative design process",
        "Excellent accessibility considerations in design decisions",
        "Great understanding of design systems and component libraries",
        "Strong mobile-first and responsive design approach",
        "Excellent persona development and user journey mapping",
        "Impressive conversion optimization and A/B testing skills",
      ],
      mobile: [
        "Strong understanding of mobile-first design principles",
        "Excellent native app development skills (iOS/Android)",
        "Impressive React Native or Flutter cross-platform development",
        "Strong understanding of mobile UI/UX patterns",
        "Excellent mobile performance optimization techniques",
        "Great at implementing device-specific features (camera, GPS, sensors)",
        "Strong understanding of app store optimization and deployment",
        "Excellent mobile testing across different devices",
        "Great at implementing offline functionality and data sync",
        "Strong understanding of mobile security best practices",
      ],
      database: [
        "Strong understanding of relational database design principles",
        "Excellent SQL query writing and optimization skills",
        "Impressive database normalization and indexing knowledge",
        "Strong understanding of NoSQL databases (MongoDB, Redis)",
        "Excellent data modeling and entity relationship design",
        "Great at implementing database security and access controls",
        "Strong understanding of database transactions and ACID properties",
        "Excellent data migration and backup strategies",
        "Great at implementing database performance tuning",
        "Strong understanding of cloud database services (AWS RDS, MongoDB Atlas)",
      ],
      cybersecurity: [
        "Strong understanding of cybersecurity fundamentals and threats",
        "Excellent implementation of secure coding practices",
        "Impressive understanding of encryption and cryptography",
        "Strong network security and firewall configuration skills",
        "Excellent penetration testing and vulnerability assessment",
        "Great understanding of security frameworks (NIST, ISO 27001)",
        "Strong incident response and forensics capabilities",
        "Excellent understanding of identity and access management",
        "Great at implementing security monitoring and SIEM tools",
        "Strong understanding of compliance requirements (GDPR, HIPAA)",
      ],
      ai: [
        "Strong understanding of machine learning algorithms and concepts",
        "Excellent implementation of neural networks and deep learning",
        "Impressive data preprocessing and feature engineering skills",
        "Strong understanding of Python ML libraries (scikit-learn, TensorFlow, PyTorch)",
        "Excellent model evaluation and hyperparameter tuning",
        "Great understanding of computer vision and image processing",
        "Strong natural language processing and text analysis skills",
        "Excellent understanding of AI ethics and bias considerations",
        "Great at implementing AI model deployment and MLOps",
        "Strong understanding of statistical analysis and data visualization",
      ],
      gamedev: [
        "Strong understanding of game design principles and mechanics",
        "Excellent implementation of game physics and collision detection",
        "Impressive 2D and 3D graphics programming skills",
        "Strong understanding of game engines (Unity, Unreal, Godot)",
        "Excellent game optimization and performance tuning",
        "Great at implementing multiplayer and networking features",
        "Strong understanding of game audio and sound design integration",
        "Excellent level design and gameplay balancing skills",
        "Great at implementing game AI and pathfinding algorithms",
        "Strong understanding of game monetization and analytics",
      ],
      robotics: [
        "Strong understanding of robotics hardware and sensors",
        "Excellent Arduino and microcontroller programming skills",
        "Impressive understanding of robotics kinematics and dynamics",
        "Strong implementation of sensor fusion and data processing",
        "Excellent motor control and actuator programming",
        "Great understanding of robotics communication protocols",
        "Strong implementation of autonomous navigation and mapping",
        "Excellent integration of AI and machine learning in robotics",
        "Great at robotics simulation and testing environments",
        "Strong understanding of robotics safety and fail-safe mechanisms",
      ],
    },
    growth: {
      general: [
        "Could benefit from more practice with programming syntax and fundamentals",
        "Needs to work on code commenting and documentation practices",
        "Should focus on variable naming conventions and code readability",
        "Would benefit from more pseudocode planning before coding",
        "Needs to improve debugging and error handling techniques",
        "Could work on program efficiency and optimization",
        "Should practice more independent problem-solving approaches",
        "Needs to work on time management and project planning",
        "Could benefit from more practice with version control (Git)",
        "Should focus on understanding programming design patterns",
      ],
      scratch: [
        "Could improve Scratch project organization with clear sprite naming",
        "Would benefit from more practice with loops and conditionals",
        "Should explore more complex broadcasting patterns",
        "Needs to work on optimizing scripts for better performance",
        "Could improve use of variables for state management",
        "Would benefit from more practice with custom blocks",
        "Should explore more advanced sensing and interaction techniques",
        "Needs to work on creating more complex game mechanics",
        "Could improve storytelling and narrative structure in projects",
        "Should practice more with list operations and data management",
      ],
      python: [
        "Could benefit from more practice with Python syntax fundamentals",
        "Needs to work on function organization and modularity",
        "Should focus on error handling and debugging techniques",
        "Would benefit from more practice with object-oriented concepts",
        "Could improve code efficiency and algorithmic thinking",
        "Needs to work on Python documentation and commenting",
        "Should explore more Python libraries and frameworks",
        "Could benefit from more practice with data structures",
        "Needs to work on file handling and data processing",
        "Should focus on understanding Python best practices",
      ],
      javascript: [
        "Could benefit from more practice with JavaScript fundamentals",
        "Needs to work on understanding asynchronous programming concepts",
        "Should focus on DOM manipulation and event handling",
        "Would benefit from more practice with JavaScript frameworks",
        "Could improve understanding of JavaScript scope and closures",
        "Needs to work on API integration and AJAX calls",
        "Should explore more modern ES6+ features and syntax",
        "Could benefit from more practice with debugging tools",
        "Needs to work on JavaScript testing and quality assurance",
        "Should focus on understanding browser compatibility issues",
      ],
      java: [
        "Could benefit from more practice with Java syntax and fundamentals",
        "Needs to work on understanding object-oriented programming concepts",
        "Should focus on proper exception handling techniques",
        "Would benefit from more practice with Java collections",
        "Could improve understanding of inheritance and polymorphism",
        "Needs to work on Java design patterns implementation",
        "Should explore more advanced Java features and APIs",
        "Could benefit from more practice with multithreading",
        "Needs to work on database connectivity and JDBC",
        "Should focus on understanding Java best practices and conventions",
      ],
      web: [
        "Could improve HTML semantic structure implementation",
        "Needs to work on CSS selector specificity and organization",
        "Should focus on responsive design principles and mobile-first approach",
        "Would benefit from more practice with CSS layout techniques",
        "Could improve CSS naming conventions and organization",
        "Needs to work on web accessibility implementation (WCAG guidelines)",
        "Should explore more advanced CSS features and animations",
        "Could benefit from more practice with CSS preprocessors",
        "Needs to work on web performance optimization techniques",
        "Should focus on cross-browser compatibility testing",
      ],
      design: [
        "Could improve understanding of design principles and visual hierarchy",
        "Needs to work on color theory application in projects",
        "Should focus on typography and readability considerations",
        "Would benefit from more user-centered design thinking",
        "Could improve visual consistency across design interfaces",
        "Needs to work on design documentation and style guides",
        "Should explore more prototyping and user testing techniques",
        "Could benefit from more practice with design software tools",
        "Needs to work on understanding target audience and user personas",
        "Should focus on iterative design process and feedback incorporation",
      ],
      uiux: [
        "Could improve understanding of user research methodologies",
        "Needs to work on information architecture and user flow design",
        "Should focus on usability testing and user feedback incorporation",
        "Would benefit from more practice with wireframing and prototyping",
        "Could improve accessibility considerations in design decisions",
        "Needs to work on interaction design and micro-animations",
        "Should explore more design systems and component thinking",
        "Could benefit from more practice with user journey mapping",
        "Needs to work on conversion optimization and metrics analysis",
        "Should focus on mobile UX patterns and touch interactions",
      ],
      mobile: [
        "Could improve understanding of mobile design patterns and conventions",
        "Needs to work on mobile performance optimization techniques",
        "Should focus on responsive design for various screen sizes",
        "Would benefit from more practice with native app development",
        "Could improve understanding of mobile user experience patterns",
        "Needs to work on implementing device-specific features",
        "Should explore more cross-platform development frameworks",
        "Could benefit from more practice with mobile testing strategies",
        "Needs to work on app store optimization and deployment processes",
        "Should focus on mobile security and privacy considerations",
      ],
      database: [
        "Could improve understanding of database design principles",
        "Needs to work on SQL query writing and optimization",
        "Should focus on database normalization and relationship design",
        "Would benefit from more practice with NoSQL databases",
        "Could improve understanding of database indexing strategies",
        "Needs to work on data modeling and entity relationships",
        "Should explore more database security and access control",
        "Could benefit from more practice with database performance tuning",
        "Needs to work on data migration and backup strategies",
        "Should focus on understanding ACID properties and transactions",
      ],
      cybersecurity: [
        "Could improve understanding of cybersecurity fundamentals",
        "Needs to work on secure coding practices and vulnerability prevention",
        "Should focus on understanding common security threats and attacks",
        "Would benefit from more practice with encryption and cryptography",
        "Could improve network security configuration and monitoring",
        "Needs to work on incident response and security forensics",
        "Should explore more penetration testing and ethical hacking",
        "Could benefit from more practice with security frameworks",
        "Needs to work on compliance requirements and regulations",
        "Should focus on security awareness and risk assessment",
      ],
      ai: [
        "Could improve understanding of machine learning fundamentals",
        "Needs to work on data preprocessing and feature engineering",
        "Should focus on understanding different ML algorithms and their applications",
        "Would benefit from more practice with Python ML libraries",
        "Could improve model evaluation and validation techniques",
        "Needs to work on understanding neural networks and deep learning",
        "Should explore more natural language processing techniques",
        "Could benefit from more practice with data visualization",
        "Needs to work on understanding AI ethics and bias considerations",
        "Should focus on model deployment and MLOps practices",
      ],
      gamedev: [
        "Could improve understanding of game design principles",
        "Needs to work on game physics and collision detection",
        "Should focus on learning game engine workflows and tools",
        "Would benefit from more practice with 2D and 3D graphics programming",
        "Could improve game optimization and performance techniques",
        "Needs to work on game audio integration and sound design",
        "Should explore more game AI and pathfinding algorithms",
        "Could benefit from more practice with level design principles",
        "Needs to work on multiplayer and networking implementation",
        "Should focus on game testing and quality assurance processes",
      ],
      robotics: [
        "Could improve understanding of robotics hardware and components",
        "Needs to work on microcontroller programming and sensor integration",
        "Should focus on understanding robotics kinematics and control systems",
        "Would benefit from more practice with Arduino and embedded programming",
        "Could improve sensor data processing and fusion techniques",
        "Needs to work on motor control and actuator programming",
        "Should explore more autonomous navigation and mapping algorithms",
        "Could benefit from more practice with robotics simulation tools",
        "Needs to work on robotics communication protocols and networking",
        "Should focus on understanding robotics safety and fail-safe mechanisms",
      ],
    },
    comment: {
      general: [
        "[Student] has shown remarkable progress in understanding programming fundamentals. With continued practice, [they] will master more advanced concepts quickly.",
        "[Student] demonstrates good understanding of core programming concepts. Focusing on [their] areas for growth will help [them] become a more well-rounded programmer.",
        "[Student] is developing solid programming skills. I encourage [them] to practice daily to reinforce the concepts we've covered.",
        "[Student] has excellent problem-solving abilities and approaches challenges with creativity and persistence. [Their] logical thinking skills are particularly strong.",
        "[Student] shows great potential in programming. With more practice in [their] growth areas, [they] will develop into a confident and capable programmer.",
      ],
      scratch: [
        "[Student] has demonstrated impressive creativity and logical thinking in Scratch projects. [Their] ability to use sprites, events, and broadcasting shows a strong foundation in programming concepts. To continue growing, I recommend exploring more complex game mechanics and optimizing scripts for better performance.",
        "[Student] has made good progress with Scratch programming. [They] show particular strength in creating interactive stories and animations. To advance further, [they] should focus on using variables and lists more effectively to track game states and player information.",
        "[Student] is beginning to understand the fundamentals of Scratch programming. [They] can create basic animations and interactions, but would benefit from more practice with loops, conditionals, and event handling to create more sophisticated projects.",
        "[Student] demonstrates excellent creativity in Scratch project design. [Their] storytelling abilities shine through in [their] animations, and [they] show good understanding of sprite interactions and event-driven programming.",
        "[Student] has shown steady improvement in Scratch programming skills. [Their] projects demonstrate good use of programming concepts, and with continued practice on optimization and advanced features, [they] will create even more impressive interactive experiences.",
      ],
      python: [
        "[Student] has demonstrated excellent progress in Python programming. [Their] ability to write clean, well-structured code with appropriate use of functions and data structures is impressive. To continue advancing, [they] should explore more complex libraries and frameworks like Pandas or Flask.",
        "[Student] shows good understanding of Python fundamentals. [They] can write functional programs with variables, conditionals, and loops. To improve, [they] should focus on writing more modular code with functions and classes, and practice more with file handling and error management.",
        "[Student] is developing basic Python skills. [They] understand syntax and simple operations, but need more practice with control structures and functions. I recommend daily coding exercises focusing on these areas to build confidence and fluency.",
        "[Student] has shown impressive growth in Python programming. [Their] understanding of object-oriented programming and data structures has improved significantly, and [they] demonstrate good debugging skills when solving problems.",
        "[Student] demonstrates strong analytical thinking in Python programming. [Their] approach to breaking down complex problems into smaller functions shows excellent programming intuition and will serve [them] well in advanced projects.",
      ],
      javascript: [
        "[Student] has demonstrated excellent progress in JavaScript development. [Their] understanding of modern ES6+ features and asynchronous programming concepts is impressive. To continue advancing, [they] should explore more complex frameworks and backend development with Node.js.",
        "[Student] shows good grasp of JavaScript fundamentals and DOM manipulation. [They] can create interactive web features effectively. To improve further, [they] should focus on understanding promises, async/await, and API integration for more dynamic applications.",
        "[Student] is developing JavaScript skills steadily. [They] understand basic syntax and can create simple interactive features, but would benefit from more practice with functions, objects, and event handling to build more sophisticated web applications.",
        "[Student] demonstrates strong problem-solving skills in JavaScript development. [Their] ability to debug code and implement user interactions shows good programming intuition and attention to user experience.",
        "[Student] has shown excellent growth in full-stack JavaScript development. [Their] understanding of both frontend and backend concepts, along with their API integration skills, positions [them] well for advanced web development projects.",
      ],
      java: [
        "[Student] has demonstrated excellent progress in Java programming. [Their] understanding of object-oriented principles and implementation of inheritance and polymorphism is impressive. To continue advancing, [they] should explore enterprise frameworks like Spring and advanced concurrency concepts.",
        "[Student] shows good understanding of Java fundamentals and object-oriented programming. [They] can create well-structured classes and methods. To improve further, [they] should focus on exception handling, collections framework, and design patterns.",
        "[Student] is developing Java programming skills. [They] understand basic syntax and can create simple programs, but would benefit from more practice with OOP concepts, inheritance, and the Java collections framework.",
        "[Student] demonstrates strong analytical thinking in Java development. [Their] approach to designing classes and implementing algorithms shows excellent programming fundamentals and will serve [them] well in enterprise development.",
        "[Student] has shown impressive growth in Java programming. [Their] understanding of multithreading, database connectivity, and enterprise patterns has improved significantly, making [them] well-prepared for professional Java development.",
      ],
      web: [
        "[Student] has shown excellent progress in web development. [Their] HTML structure is semantic and well-organized, and [their] CSS demonstrates a good understanding of layout and styling principles. To continue improving, [they] should explore more advanced responsive design techniques and CSS animations.",
        "[Student] is developing solid web development skills. [Their] HTML is functional and [they] can apply basic CSS styling. To advance further, [they] should focus on creating more responsive layouts using Flexbox and Grid, and pay more attention to accessibility considerations.",
        "[Student] is beginning to understand HTML and CSS fundamentals. [They] can create simple web pages, but would benefit from more practice with proper HTML structure and CSS selectors. I recommend focusing on these core concepts before moving to more advanced techniques.",
        "[Student] demonstrates excellent attention to detail in web development. [Their] websites are well-structured, accessible, and demonstrate good understanding of user experience principles and cross-browser compatibility.",
        "[Student] has shown impressive growth in modern web development. [Their] understanding of responsive design, CSS Grid, and modern layout techniques, combined with accessibility best practices, creates truly professional web experiences.",
      ],
      design: [
        "[Student] demonstrates impressive design sensibilities in [their] projects. [Their] work shows strong understanding of visual hierarchy, color theory, and typography. To continue developing, [they] should explore more user testing and iterative design processes.",
        "[Student] is developing good design skills. [Their] projects show attention to visual aesthetics and basic design principles. To improve further, [they] should focus more on user experience considerations and consistent design systems across their interfaces.",
        "[Student] is beginning to apply design principles to [their] work. [They] understand basic concepts like alignment and contrast, but would benefit from more practice with typography, color theory, and layout. I recommend studying successful designs and practicing recreating them to build [their] design intuition.",
        "[Student] demonstrates excellent creative problem-solving in design projects. [Their] ability to balance aesthetic appeal with functional requirements shows strong design thinking and attention to user needs.",
        "[Student] has shown remarkable growth in design skills. [Their] understanding of brand consistency, visual storytelling, and design systems has improved significantly, creating cohesive and impactful visual experiences.",
      ],
      uiux: [
        "[Student] demonstrates exceptional user-centered design thinking. [Their] ability to conduct user research, create personas, and design intuitive user flows shows strong UX fundamentals. To continue growing, [they] should explore more advanced prototyping tools and usability testing methodologies.",
        "[Student] is developing solid UI/UX design skills. [Their] wireframes and prototypes show good understanding of user interface patterns and information architecture. To advance further, [they] should focus on accessibility considerations and mobile-first design approaches.",
        "[Student] is beginning to understand UI/UX design principles. [They] can create basic wireframes and understand user flow concepts, but would benefit from more practice with user research methods and iterative design processes.",
        "[Student] demonstrates excellent empathy and user advocacy in design decisions. [Their] ability to balance user needs with business requirements while maintaining design consistency shows strong UX maturity.",
        "[Student] has shown impressive growth in UI/UX design. [Their] understanding of design systems, accessibility principles, and conversion optimization has improved significantly, creating user experiences that are both beautiful and highly functional.",
      ],
      mobile: [
        "[Student] has demonstrated excellent progress in mobile development. [Their] understanding of mobile design patterns and native app development is impressive. To continue advancing, [they] should explore cross-platform frameworks and advanced mobile features like push notifications and offline functionality.",
        "[Student] shows good understanding of mobile development fundamentals. [They] can create functional mobile applications with proper navigation and user interactions. To improve further, [they] should focus on mobile performance optimization and platform-specific design guidelines.",
        "[Student] is developing mobile development skills. [They] understand basic app structure and can implement simple features, but would benefit from more practice with mobile UI patterns, device-specific features, and app store deployment processes.",
        "[Student] demonstrates strong problem-solving skills in mobile development. [Their] attention to mobile user experience and performance optimization shows good understanding of mobile-specific challenges and opportunities.",
        "[Student] has shown impressive growth in mobile development. [Their] ability to create polished, performant mobile applications with excellent user experience across different devices positions [them] well for professional mobile development.",
      ],
      database: [
        "[Student] has demonstrated excellent progress in database design and management. [Their] understanding of relational database principles and SQL optimization is impressive. To continue advancing, [they] should explore NoSQL databases and cloud database services.",
        "[Student] shows good understanding of database fundamentals. [They] can design basic database schemas and write functional SQL queries. To improve further, [they] should focus on database normalization, indexing strategies, and advanced query optimization.",
        "[Student] is developing database skills. [They] understand basic SQL operations but would benefit from more practice with complex queries, database design principles, and understanding of different database types and their use cases.",
        "[Student] demonstrates excellent analytical thinking in database design. [Their] ability to model complex data relationships and optimize query performance shows strong database engineering fundamentals.",
        "[Student] has shown impressive growth in database management. [Their] understanding of database security, backup strategies, and performance tuning has improved significantly, preparing [them] for enterprise database administration.",
      ],
      cybersecurity: [
        "[Student] has demonstrated excellent progress in cybersecurity fundamentals. [Their] understanding of security threats and implementation of defensive measures is impressive. To continue advancing, [they] should explore penetration testing and advanced security frameworks.",
        "[Student] shows good understanding of cybersecurity basics. [They] can identify common vulnerabilities and implement basic security measures. To improve further, [they] should focus on secure coding practices, incident response, and security monitoring tools.",
        "[Student] is developing cybersecurity awareness. [They] understand fundamental security concepts but would benefit from more hands-on practice with security tools, threat analysis, and understanding of compliance requirements.",
        "[Student] demonstrates excellent critical thinking in security analysis. [Their] ability to identify vulnerabilities and design comprehensive security solutions shows strong cybersecurity fundamentals and risk assessment skills.",
        "[Student] has shown impressive growth in cybersecurity expertise. [Their] understanding of advanced threats, security architecture, and compliance frameworks has improved significantly, preparing [them] for cybersecurity leadership roles.",
      ],
      ai: [
        "[Student] has demonstrated excellent progress in AI and machine learning. [Their] understanding of ML algorithms and implementation with Python libraries is impressive. To continue advancing, [they] should explore deep learning frameworks and AI ethics considerations.",
        "[Student] shows good understanding of AI fundamentals. [They] can implement basic machine learning models and understand data preprocessing concepts. To improve further, [they] should focus on advanced algorithms, model evaluation, and real-world deployment strategies.",
        "[Student] is developing AI and machine learning skills. [They] understand basic concepts but would benefit from more practice with data science tools, statistical analysis, and understanding different types of machine learning problems.",
        "[Student] demonstrates excellent analytical thinking in AI development. [Their] ability to select appropriate algorithms and evaluate model performance shows strong data science fundamentals and critical thinking skills.",
        "[Student] has shown impressive growth in AI and machine learning. [Their] understanding of neural networks, natural language processing, and AI ethics has improved significantly, positioning [them] well for advanced AI research and development.",
      ],
      gamedev: [
        "[Student] has demonstrated excellent progress in game development. [Their] understanding of game mechanics and implementation with game engines is impressive. To continue advancing, [they] should explore advanced graphics programming and multiplayer game development.",
        "[Student] shows good understanding of game development fundamentals. [They] can create engaging games with proper game loops and user interactions. To improve further, [they] should focus on game optimization, advanced physics, and level design principles.",
        "[Student] is developing game development skills. [They] understand basic game concepts but would benefit from more practice with game engines, graphics programming, and understanding player psychology and game balance.",
        "[Student] demonstrates excellent creativity and technical skills in game development. [Their] ability to balance engaging gameplay with solid technical implementation shows strong game design fundamentals.",
        "[Student] has shown impressive growth in game development. [Their] understanding of advanced game systems, AI implementation, and performance optimization has improved significantly, creating truly engaging gaming experiences.",
      ],
      robotics: [
        "[Student] has demonstrated excellent progress in robotics and embedded systems. [Their] understanding of hardware integration and sensor programming is impressive. To continue advancing, [they] should explore advanced control systems and autonomous navigation algorithms.",
        "[Student] shows good understanding of robotics fundamentals. [They] can program microcontrollers and integrate basic sensors effectively. To improve further, [they] should focus on advanced sensor fusion, motor control, and understanding robotics kinematics.",
        "[Student] is developing robotics skills. [They] understand basic Arduino programming but would benefit from more practice with complex sensor integration, understanding control theory, and robotics safety considerations.",
        "[Student] demonstrates excellent problem-solving skills in robotics projects. [Their] ability to integrate hardware and software while considering real-world constraints shows strong engineering fundamentals.",
        "[Student] has shown impressive growth in robotics and automation. [Their] understanding of advanced control systems, AI integration, and autonomous behavior has improved significantly, preparing [them] for advanced robotics engineering.",
      ],
    },
  }

  const getTitle = () => {
    switch (type) {
      case 'strength': return 'Select Strength'
      case 'growth': return 'Select Area for Growth'
      case 'comment': return 'Select Comment'
      default: return 'Select Option'
    }
  }

  const currentOptions = contentData[type][selectedCategory as keyof typeof contentData[typeof type]] || []

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-navy dark:text-blue-300">{getTitle()}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Category Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Categories</h4>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-2 rounded text-sm mb-1 transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {categories.find(c => c.id === selectedCategory)?.name} - {getTitle()}
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {currentOptions.map((option, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-sm transition-colors"
                  onClick={() => onSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
            {currentOptions.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No options available for this category yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
