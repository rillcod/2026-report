export interface CourseModule {
  id: string
  name: string
  description: string
  topics: string[]
  skills: string[]
  projects: string[]
  assessments: string[]
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  prerequisites: string[]
}

export interface CourseContent {
  id: string
  name: string
  description: string
  icon: string
  color: string
  modules: CourseModule[]
  totalDuration: string
  targetAge: string
  learningOutcomes: string[]
  comments?: {
    beginner: string[]
    intermediate: string[]
    advanced: string[]
  }
  strengths?: {
    beginner: string[]
    intermediate: string[]
    advanced: string[]
  }
  growthAreas?: {
    beginner: string[]
    intermediate: string[]
    advanced: string[]
  }
  progressItems?: {
    beginner: string[]
    intermediate: string[]
    advanced: string[]
  }
}

export type EnhancedCourse = CourseContent

export const enhancedCourseContent: Record<string, CourseContent> = {
  "python-fundamentals": {
    id: "python-fundamentals",
    name: "Python Programming Fundamentals",
    description: "Master Python programming from basics to advanced concepts including data structures, OOP, and real-world applications",
    icon: "🐍",
    color: "bg-green-600",
    totalDuration: "16 weeks",
    targetAge: "12+ years",
    learningOutcomes: [
      "Master Python syntax, data types, and control structures",
      "Implement object-oriented programming principles effectively",
      "Work with files, databases, and external APIs",
      "Build console and GUI applications using modern frameworks",
      "Apply debugging techniques and testing methodologies",
      "Develop algorithmic thinking and problem-solving skills"
    ],
    modules: [
      {
        id: "python-basics",
        name: "Python Fundamentals & Syntax",
        description: "Core Python programming concepts including variables, data types, and basic operations",
        duration: "3 weeks",
        difficulty: "Beginner",
        prerequisites: [],
        topics: [
          "Python installation and development environment setup",
          "Variables, data types (int, float, string, boolean)",
          "Input/output operations and string formatting",
          "Operators (arithmetic, comparison, logical, assignment)",
          "Control structures (if/elif/else statements)",
          "Code organization and commenting best practices"
        ],
        skills: [
          "Write and execute Python programs in IDE/text editor",
          "Declare and manipulate variables of different data types",
          "Implement conditional logic for decision making",
          "Use proper naming conventions and code style",
          "Debug basic syntax and logical errors"
        ],
        projects: [
          "Personal information calculator with user input",
          "Grade calculator with letter grade assignment",
          "Simple decision-making program (quiz or survey)"
        ],
        assessments: [
          "Variable manipulation and data type conversion exercises",
          "Conditional logic implementation for real-world scenarios",
          "Code review focusing on style and best practices"
        ]
      },
      {
        id: "python-loops-functions",
        name: "Loops, Functions & Code Organization", 
        description: "Advanced control flow, function creation, and modular programming principles",
        duration: "3 weeks",
        difficulty: "Beginner",
        prerequisites: ["python-basics"],
        topics: [
          "For loops and while loops with practical applications",
          "Loop control (break, continue) and nested loops",
          "Function definition, parameters, and return values",
          "Local vs global scope and variable lifetime",
          "Lambda functions and higher-order functions",
          "Module creation and import statements"
        ],
        skills: [
          "Design and implement efficient loop structures",
          "Create reusable functions with proper parameters",
          "Understand scope and variable lifetime management",
          "Organize code into logical modules and packages",
          "Apply functional programming concepts where appropriate"
        ],
        projects: [
          "Mathematical sequence generator (Fibonacci, primes)",
          "Text analysis tool with multiple functions",
          "Simple game with modular code structure"
        ],
        assessments: [
          "Function creation and testing with various parameters",
          "Loop optimization and efficiency analysis",
          "Code organization and module structure evaluation"
        ]
      }
    ],
    comments: {
      beginner: [
        "[firstName] has made a solid start in Python programming, showing good understanding of basic syntax and control structures. They demonstrate enthusiasm for learning and are developing foundational programming skills. With continued practice and engagement, [firstName] will build confidence in writing more complex programs.",
        "[firstName] is progressing well in Python fundamentals, grasping key concepts like variables, data types, and conditional statements. Their willingness to ask questions and seek help shows a positive learning attitude. I encourage [firstName] to practice more coding exercises to reinforce their understanding.",
        "[firstName] shows promise in Python programming, understanding the basics of syntax and program structure. While they sometimes need guidance with more complex logic, their determination to learn is commendable. Additional practice with loops and functions will help [firstName] advance to the next level."
      ],
      intermediate: [
        "[firstName] demonstrates strong Python programming skills, effectively using functions, loops, and data structures to solve problems. They show good code organization and are beginning to think algorithmically. [firstName]'s ability to debug code and find solutions independently is impressive.",
        "[firstName] has developed solid Python programming capabilities, creating well-structured programs with proper function design and error handling. Their understanding of data structures and algorithms is growing, and they consistently produce quality work. [firstName] is ready to explore more advanced topics like object-oriented programming.",
        "[firstName] exhibits excellent Python programming proficiency, writing clean, efficient code that demonstrates strong problem-solving abilities. They effectively use advanced features like list comprehensions, dictionaries, and file handling. [firstName]'s code quality and logical thinking show they are ready for advanced Python concepts."
      ],
      advanced: [
        "[firstName] has achieved exceptional mastery of Python programming, demonstrating expert-level skills in object-oriented design, algorithm implementation, and code optimization. They create sophisticated applications with clean architecture and best practices. [firstName]'s ability to mentor peers and contribute to complex projects makes them an outstanding Python developer.",
        "[firstName] represents excellence in Python programming, with advanced skills spanning data structures, design patterns, and software engineering principles. Their code demonstrates professional-level quality, and they consistently tackle challenging problems with innovative solutions. [firstName] is ready for real-world software development projects.",
        "[firstName] has distinguished themselves as an exceptional Python programmer, with expertise in advanced topics including decorators, generators, async programming, and software architecture. Their ability to design scalable solutions and optimize code performance sets them apart. [firstName] shows leadership potential and is ready for professional development opportunities."
      ]
    },
    strengths: {
      beginner: [
        "Strong grasp of Python syntax and basic programming concepts",
        "Good problem-solving approach when tackling coding challenges",
        "Enthusiastic learner who actively participates in class activities",
        "Ability to follow instructions and implement basic programs correctly",
        "Willingness to ask questions and seek clarification when needed"
      ],
      intermediate: [
        "Excellent code organization and structure in Python programs",
        "Strong understanding of functions, loops, and data structures",
        "Effective debugging skills and error resolution capabilities",
        "Ability to break down complex problems into manageable steps",
        "Good coding practices including proper naming conventions and comments"
      ],
      advanced: [
        "Expert-level Python programming with advanced language features",
        "Outstanding problem-solving and algorithmic thinking abilities",
        "Professional code quality with best practices and design patterns",
        "Ability to design and implement complex software solutions",
        "Strong mentoring skills and collaborative development approach"
      ]
    },
    growthAreas: {
      beginner: [
        "Practice more coding exercises to reinforce fundamental concepts",
        "Work on understanding program flow and logic sequencing",
        "Develop better error handling and debugging strategies",
        "Improve code readability and organization",
        "Build confidence in writing programs independently"
      ],
      intermediate: [
        "Explore object-oriented programming concepts more deeply",
        "Practice with more complex data structures and algorithms",
        "Improve code efficiency and optimization techniques",
        "Work on larger projects to develop software design skills",
        "Enhance understanding of Python libraries and frameworks"
      ],
      advanced: [
        "Explore advanced Python topics like async programming and metaprogramming",
        "Work on larger-scale projects with multiple modules and packages",
        "Deepen understanding of software architecture and design patterns",
        "Contribute to open-source projects or collaborative development",
        "Prepare for professional software development roles"
      ]
    }
  },

  "web-development": {
    id: "web-development",
    name: "Full-Stack Web Development",
    description: "Comprehensive web development covering HTML5, CSS3, JavaScript, and modern frameworks for building responsive web applications",
    icon: "🌐",
    color: "bg-blue-600",
    totalDuration: "20 weeks",
    targetAge: "14+ years",
    learningOutcomes: [
      "Build responsive websites using HTML5, CSS3, and JavaScript",
      "Implement modern web design principles and user experience best practices",
      "Develop interactive web applications with frameworks like React or Vue",
      "Understand backend development with Node.js and databases",
      "Deploy and maintain web applications on cloud platforms",
      "Apply version control and collaborative development workflows"
    ],
    modules: [
      {
        id: "html-css-foundations",
        name: "HTML5 & CSS3 Foundations",
        description: "Semantic HTML structure and modern CSS styling techniques",
        duration: "4 weeks", 
        difficulty: "Beginner",
        prerequisites: [],
        topics: [
          "Semantic HTML5 elements and document structure",
          "CSS selectors, properties, and the box model",
          "Flexbox and CSS Grid layout systems",
          "Responsive design with media queries",
          "CSS animations and transitions",
          "Accessibility best practices and WCAG guidelines"
        ],
        skills: [
          "Create well-structured, semantic HTML documents",
          "Style web pages using modern CSS techniques",
          "Build responsive layouts that work on all devices",
          "Implement smooth animations and user interactions",
          "Ensure web accessibility for all users"
        ],
        projects: [
          "Personal portfolio website with responsive design",
          "Business landing page with animations",
          "Blog layout with CSS Grid and Flexbox"
        ],
        assessments: [
          "HTML semantic structure and validation",
          "CSS responsive design implementation",
          "Accessibility compliance testing"
        ]
      }
    ],
    comments: {
      beginner: [
        "[firstName] has made a promising start in web development, showing good understanding of HTML structure and CSS styling basics. They demonstrate creativity in design and are learning to create visually appealing web pages. With continued practice, [firstName] will develop stronger skills in responsive design and interactivity.",
        "[firstName] is progressing well in web development fundamentals, grasping HTML5 semantic elements and CSS properties effectively. Their projects show attention to detail and a growing understanding of web design principles. I encourage [firstName] to practice more with JavaScript to add interactivity to their websites.",
        "[firstName] shows enthusiasm for web development, understanding the basics of HTML and CSS. While they sometimes need guidance with layout and styling, their willingness to experiment and learn is positive. Additional practice with flexbox and grid will help [firstName] create more sophisticated layouts."
      ],
      intermediate: [
        "[firstName] demonstrates strong web development skills, creating responsive websites with modern CSS techniques and JavaScript interactivity. They show good understanding of DOM manipulation and event handling. [firstName]'s ability to debug and troubleshoot web issues is impressive.",
        "[firstName] has developed solid full-stack capabilities, building interactive web applications with frontend frameworks and backend integration. Their understanding of React components and state management is growing. [firstName] consistently produces well-structured, functional web applications.",
        "[firstName] exhibits excellent web development proficiency, creating professional-quality websites with advanced features like API integration and responsive design. They effectively use modern frameworks and tools. [firstName]'s code organization and problem-solving abilities show they are ready for advanced web development projects."
      ],
      advanced: [
        "[firstName] has achieved exceptional mastery of full-stack web development, demonstrating expert-level skills in modern frameworks, API design, and deployment. They create scalable applications with clean architecture and best practices. [firstName]'s ability to mentor peers and lead projects makes them an outstanding web developer.",
        "[firstName] represents excellence in web development, with advanced skills spanning frontend frameworks, backend systems, and DevOps practices. Their applications demonstrate professional-level quality and innovative solutions. [firstName] is ready for senior development roles and complex project leadership.",
        "[firstName] has distinguished themselves as an exceptional full-stack developer, with expertise in advanced topics including microservices, cloud deployment, and performance optimization. Their ability to design scalable solutions and optimize applications sets them apart. [firstName] shows leadership potential and is ready for technical leadership opportunities."
      ]
    },
    strengths: {
      beginner: [
        "Good understanding of HTML structure and semantic elements",
        "Creative approach to CSS styling and design",
        "Enthusiastic about learning web technologies",
        "Ability to follow design patterns and implement layouts",
        "Willingness to experiment with different styling techniques"
      ],
      intermediate: [
        "Strong skills in responsive design and CSS frameworks",
        "Good understanding of JavaScript and DOM manipulation",
        "Effective use of React or other frontend frameworks",
        "Ability to integrate APIs and handle asynchronous operations",
        "Good debugging skills for web applications"
      ],
      advanced: [
        "Expert-level full-stack development capabilities",
        "Outstanding skills in modern frameworks and tools",
        "Professional code quality with best practices",
        "Ability to design and implement scalable web applications",
        "Strong understanding of performance optimization and security"
      ]
    },
    growthAreas: {
      beginner: [
        "Practice more with CSS layout techniques (flexbox, grid)",
        "Work on JavaScript fundamentals and interactivity",
        "Develop better understanding of responsive design principles",
        "Improve code organization and file structure",
        "Build more interactive projects to enhance skills"
      ],
      intermediate: [
        "Explore advanced JavaScript features and ES6+ syntax",
        "Practice with state management in frontend frameworks",
        "Work on backend development and database integration",
        "Improve understanding of web performance optimization",
        "Enhance skills in testing and debugging web applications"
      ],
      advanced: [
        "Explore advanced topics like serverless architecture and microservices",
        "Work on larger-scale applications with complex requirements",
        "Deepen understanding of web security and best practices",
        "Contribute to open-source projects or lead development teams",
        "Prepare for senior developer or technical lead roles"
      ]
    }
  },

  "robotics-engineering": {
    id: "robotics-engineering", 
    name: "Robotics Engineering & Programming",
    description: "Hands-on robotics combining mechanical design, electronics, and programming for autonomous systems",
    icon: "🤖",
    color: "bg-red-600",
    totalDuration: "18 weeks",
    targetAge: "13+ years", 
    learningOutcomes: [
      "Design and build functional robotic systems",
      "Program microcontrollers for sensor integration and control",
      "Understand mechanical engineering principles in robotics",
      "Implement artificial intelligence for autonomous behavior",
      "Work with electronics, circuits, and embedded systems",
      "Apply engineering design process and project management"
    ],
    modules: [
      {
        id: "robotics-fundamentals",
        name: "Robotics Fundamentals & Design Thinking",
        description: "Introduction to robotics concepts, mechanical design, and engineering principles",
        duration: "4 weeks",
        difficulty: "Intermediate", 
        prerequisites: [],
        topics: [
          "History and applications of robotics in industry",
          "Mechanical systems: gears, motors, and actuators",
          "Electronics basics: circuits, voltage, and current",
          "Sensors and their applications in robotics",
          "Design thinking and engineering design process",
          "Safety protocols and workshop best practices"
        ],
        skills: [
          "Analyze robotic systems and identify key components",
          "Design mechanical solutions using engineering principles",
          "Build basic circuits and understand electronics",
          "Select appropriate sensors for specific tasks",
          "Apply design thinking methodology to robotics challenges"
        ],
        projects: [
          "Mechanical hand prototype with articulated fingers",
          "Simple circuit-controlled LED system",
          "Sensor-based proximity detector"
        ],
        assessments: [
          "Mechanical design analysis and optimization",
          "Circuit building and troubleshooting skills",
          "Design process documentation and presentation"
        ]
      }
    ],
    comments: {
      beginner: [
        "[firstName] has made a solid start in robotics engineering, showing good understanding of mechanical design principles and basic electronics. They demonstrate enthusiasm for building and programming robots. With continued practice, [firstName] will develop stronger skills in sensor integration and autonomous control.",
        "[firstName] is progressing well in robotics fundamentals, grasping concepts of motors, sensors, and basic programming. Their projects show creativity and a growing understanding of engineering principles. I encourage [firstName] to practice more with sensor calibration and robot navigation.",
        "[firstName] shows promise in robotics engineering, understanding the basics of robot construction and programming. While they sometimes need guidance with complex systems, their hands-on approach and problem-solving attitude are positive. Additional practice with PID control will help [firstName] advance."
      ],
      intermediate: [
        "[firstName] demonstrates strong robotics engineering skills, effectively designing and building functional robots with sensor integration. They show good understanding of control systems and programming logic. [firstName]'s ability to troubleshoot mechanical and software issues is impressive.",
        "[firstName] has developed solid robotics capabilities, creating autonomous robots with advanced sensor fusion and navigation algorithms. Their understanding of PID control and motor management is growing. [firstName] consistently produces well-engineered robotic solutions.",
        "[firstName] exhibits excellent robotics engineering proficiency, building sophisticated robots with advanced features like computer vision and machine learning integration. They effectively use microcontrollers and sensors. [firstName]'s engineering skills and problem-solving abilities show they are ready for advanced robotics projects."
      ],
      advanced: [
        "[firstName] has achieved exceptional mastery of robotics engineering, demonstrating expert-level skills in mechanical design, control systems, and autonomous navigation. They create innovative robotic solutions with professional engineering quality. [firstName]'s ability to mentor peers and lead complex projects makes them an outstanding robotics engineer.",
        "[firstName] represents excellence in robotics engineering, with advanced skills spanning mechanical design, embedded systems, and AI integration. Their robots demonstrate professional-level functionality and innovative solutions. [firstName] is ready for research projects and professional robotics development.",
        "[firstName] has distinguished themselves as an exceptional robotics engineer, with expertise in advanced topics including swarm robotics, advanced control algorithms, and human-robot interaction. Their ability to design complex systems and optimize robot performance sets them apart. [firstName] shows leadership potential and is ready for engineering leadership roles."
      ]
    },
    strengths: {
      beginner: [
        "Good understanding of mechanical design and robot construction",
        "Enthusiastic about hands-on building and experimentation",
        "Basic programming skills for robot control",
        "Ability to follow engineering design processes",
        "Willingness to learn from mistakes and iterate on designs"
      ],
      intermediate: [
        "Strong skills in sensor integration and data processing",
        "Good understanding of control systems and PID algorithms",
        "Effective problem-solving for mechanical and software issues",
        "Ability to design and build functional autonomous robots",
        "Good documentation and engineering communication skills"
      ],
      advanced: [
        "Expert-level robotics engineering with advanced systems",
        "Outstanding skills in mechanical design and optimization",
        "Professional-level programming for embedded systems",
        "Ability to design and implement complex robotic solutions",
        "Strong leadership in robotics projects and team collaboration"
      ]
    },
    growthAreas: {
      beginner: [
        "Practice more with sensor calibration and data interpretation",
        "Work on understanding control algorithms and feedback loops",
        "Develop better mechanical design and construction techniques",
        "Improve programming skills for robot autonomy",
        "Build more complex robots to enhance engineering skills"
      ],
      intermediate: [
        "Explore advanced control algorithms and optimization techniques",
        "Practice with computer vision and sensor fusion",
        "Work on larger-scale robotics projects with multiple systems",
        "Improve understanding of robot navigation and path planning",
        "Enhance skills in debugging and troubleshooting complex systems"
      ],
      advanced: [
        "Explore advanced topics like swarm robotics and AI integration",
        "Work on research-level projects with cutting-edge technologies",
        "Deepen understanding of advanced control theory and optimization",
        "Contribute to open-source robotics projects or lead engineering teams",
        "Prepare for advanced research or professional engineering roles"
      ]
    }
  },

  scratch: {
    id: "scratch",
    name: "Scratch 3.0 Visual Programming",
    description: "Creative coding through visual programming blocks, perfect for beginners to learn computational thinking",
    icon: "🎮",
    color: "bg-orange-500",
    totalDuration: "12 weeks",
    targetAge: "8-14 years",
    learningOutcomes: [
      "Master visual programming concepts through drag-and-drop interface",
      "Develop computational thinking and problem-solving skills",
      "Create interactive games, animations, and stories",
      "Understand programming fundamentals without syntax complexity",
      "Build confidence in logical thinking and creativity",
    ],
    modules: [
      {
        id: "scratch-basics",
        name: "Scratch Fundamentals",
        description: "Introduction to Scratch interface and basic programming concepts",
        duration: "2 weeks",
        difficulty: "Beginner",
        prerequisites: [],
        topics: [
          "Scratch interface navigation and workspace organization",
          "Understanding sprites, costumes, and backdrops",
          "Basic motion blocks and coordinate system",
          "Looks blocks for visual effects and animations",
          "Sound blocks for audio integration",
        ],
        skills: [
          "Navigate Scratch development environment efficiently",
          "Create and customize sprites with multiple costumes",
          "Implement basic animations using motion and looks blocks",
          "Add sound effects and background music to projects",
          "Understand coordinate system for precise positioning",
        ],
        projects: [
          "Animated greeting card with moving sprites",
          "Simple character animation with costume changes",
          "Interactive pet that responds to clicks",
        ],
        assessments: [
          "Create a 30-second animation showcasing motion and looks blocks",
          "Design an interactive sprite with at least 3 different costumes",
          "Demonstrate understanding of coordinate system through positioning exercises",
        ],
      },
      {
        id: "scratch-events",
        name: "Events and Interaction",
        description: "Creating interactive programs using event-driven programming",
        duration: "2 weeks",
        difficulty: "Beginner",
        prerequisites: ["scratch-basics"],
        topics: [
          "Event blocks and trigger mechanisms",
          "Keyboard and mouse input handling",
          "Sprite interaction and collision detection",
          "Broadcasting messages between sprites",
          "Creating responsive user interfaces",
        ],
        skills: [
          "Implement event-driven programming patterns",
          "Handle user input through keyboard and mouse events",
          "Create interactive sprites that respond to user actions",
          "Use broadcasting for complex sprite communication",
          "Design intuitive user interaction patterns",
        ],
        projects: [
          "Interactive story with user choices",
          "Simple clicking game with score tracking",
          "Virtual instrument with keyboard controls",
        ],
        assessments: [
          "Build an interactive game using at least 5 different event blocks",
          "Create a project demonstrating sprite-to-sprite communication",
          "Design a user interface with multiple interaction methods",
        ],
      },
      {
        id: "scratch-logic",
        name: "Logic and Control Flow",
        description: "Implementing decision-making and repetition in programs",
        duration: "3 weeks",
        difficulty: "Intermediate",
        prerequisites: ["scratch-events"],
        topics: [
          "Conditional statements (if/else) for decision making",
          "Loop structures (repeat, forever, repeat until)",
          "Boolean logic and comparison operators",
          "Nested control structures for complex logic",
          "Random number generation and probability",
        ],
        skills: [
          "Implement conditional logic for program decision-making",
          "Use various loop structures for efficient repetition",
          "Apply boolean logic and comparison operations",
          "Create complex nested control structures",
          "Incorporate randomness for dynamic program behavior",
        ],
        projects: [
          "Quiz game with scoring and feedback",
          "Maze navigation game with collision detection",
          "Random story generator with multiple outcomes",
        ],
        assessments: [
          "Create a game demonstrating all types of loops and conditionals",
          "Build a program using nested control structures",
          "Design a project incorporating random elements effectively",
        ],
      },
      {
        id: "scratch-data",
        name: "Variables and Data Management",
        description: "Managing data with variables and lists for dynamic programs",
        duration: "2 weeks",
        difficulty: "Intermediate",
        prerequisites: ["scratch-logic"],
        topics: [
          "Variable creation and manipulation",
          "Local vs global variable scope",
          "List data structures and operations",
          "Data persistence and storage concepts",
          "Mathematical operations and calculations",
        ],
        skills: [
          "Create and manage variables for data storage",
          "Understand variable scope and appropriate usage",
          "Implement list operations for data collections",
          "Perform mathematical calculations in programs",
          "Design data-driven program behaviors",
        ],
        projects: [
          "High score tracking system for games",
          "Shopping list manager with add/remove functionality",
          "Math quiz with progress tracking",
        ],
        assessments: [
          "Build a program using both variables and lists effectively",
          "Create a data-driven application with persistent information",
          "Demonstrate understanding of variable scope in complex projects",
        ],
      },
      {
        id: "scratch-advanced",
        name: "Advanced Scratch Techniques",
        description: "Custom blocks, cloning, and advanced programming patterns",
        duration: "3 weeks",
        difficulty: "Advanced",
        prerequisites: ["scratch-data"],
        topics: [
          "Custom block creation and parameters",
          "Sprite cloning and clone management",
          "Advanced sensing and collision detection",
          "Optimization techniques for performance",
          "Project organization and code structure",
        ],
        skills: [
          "Create reusable custom blocks with parameters",
          "Implement sprite cloning for dynamic object creation",
          "Use advanced sensing for sophisticated interactions",
          "Optimize projects for smooth performance",
          "Organize complex projects with clear structure",
        ],
        projects: [
          "Multi-level platformer game with cloned enemies",
          "Drawing application with custom tools",
          "Simulation project with multiple interacting elements",
        ],
        assessments: [
          "Create a complex game using custom blocks and cloning",
          "Build a project demonstrating advanced sensing techniques",
          "Design a well-organized project with clear code structure",
        ],
      },
    ],
    comments: {
      beginner: [
        "[firstName] has made an excellent start in Scratch programming, showing great creativity and enthusiasm for visual programming. They demonstrate good understanding of basic blocks and are creating fun, interactive projects. With continued practice, [firstName] will develop stronger skills in logic and program flow.",
        "[firstName] is progressing well in Scratch, grasping key concepts like sprites, events, and basic animations. Their projects show creativity and a growing understanding of programming logic. I encourage [firstName] to experiment more with variables and lists to add complexity to their projects.",
        "[firstName] shows promise in Scratch programming, understanding the basics of block-based coding and creating simple animations. While they sometimes need guidance with more complex logic, their creative approach and willingness to experiment are positive. Additional practice with control structures will help [firstName] advance."
      ],
      intermediate: [
        "[firstName] demonstrates strong Scratch programming skills, effectively using events, variables, and control structures to create interactive games and stories. They show good understanding of program flow and logic. [firstName]'s ability to debug and improve their projects is impressive.",
        "[firstName] has developed solid Scratch capabilities, creating complex projects with multiple sprites, custom blocks, and advanced logic. Their understanding of variables, lists, and cloning is growing. [firstName] consistently produces creative, well-structured Scratch projects.",
        "[firstName] exhibits excellent Scratch programming proficiency, building sophisticated games and simulations with advanced features like data persistence and complex algorithms. They effectively use all Scratch features creatively. [firstName]'s programming skills and logical thinking show they are ready for text-based programming."
      ],
      advanced: [
        "[firstName] has achieved exceptional mastery of Scratch programming, demonstrating expert-level skills in game design, algorithm implementation, and creative problem-solving. They create innovative projects with professional-quality code organization. [firstName]'s ability to mentor peers and teach programming concepts makes them an outstanding Scratch programmer.",
        "[firstName] represents excellence in Scratch programming, with advanced skills spanning game development, simulation design, and computational thinking. Their projects demonstrate professional-level creativity and technical sophistication. [firstName] is ready to transition to text-based programming languages.",
        "[firstName] has distinguished themselves as an exceptional Scratch programmer, with expertise in advanced topics including complex algorithms, data structures, and interactive system design. Their ability to create engaging educational content and teach others sets them apart. [firstName] shows leadership potential and is ready for advanced programming courses."
      ]
    },
    strengths: {
      beginner: [
        "Great creativity and enthusiasm for visual programming",
        "Good understanding of basic Scratch blocks and concepts",
        "Ability to create simple animations and interactive projects",
        "Willingness to experiment and try new features",
        "Positive attitude toward learning programming"
      ],
      intermediate: [
        "Strong skills in using events, variables, and control structures",
        "Good understanding of program flow and logical thinking",
        "Effective use of sprites, costumes, and backdrops",
        "Ability to create interactive games and stories",
        "Good debugging and problem-solving skills"
      ],
      advanced: [
        "Expert-level Scratch programming with advanced features",
        "Outstanding creativity in game and project design",
        "Professional-level code organization and structure",
        "Ability to create complex, multi-sprite projects",
        "Strong teaching and mentoring abilities"
      ]
    },
    growthAreas: {
      beginner: [
        "Practice more with control structures and loops",
        "Work on understanding variables and data storage",
        "Develop better program organization and structure",
        "Experiment with more complex sprite interactions",
        "Build confidence in creating longer, more detailed projects"
      ],
      intermediate: [
        "Explore advanced Scratch features like cloning and custom blocks",
        "Practice with lists and data structures",
        "Work on creating more complex game mechanics",
        "Improve understanding of algorithms and program efficiency",
        "Enhance skills in project planning and organization"
      ],
      advanced: [
        "Explore advanced algorithms and data structures in Scratch",
        "Work on larger, more complex projects with multiple systems",
        "Deepen understanding of computational thinking concepts",
        "Mentor other students and share programming knowledge",
        "Prepare for transition to text-based programming languages"
      ]
    }
  },
  python: {
    id: "python",
    name: "Python Programming Fundamentals",
    description: "Comprehensive introduction to Python programming with practical applications",
    icon: "🐍",
    color: "bg-green-500",
    totalDuration: "16 weeks",
    targetAge: "12+ years",
    learningOutcomes: [
      "Master Python syntax and programming fundamentals",
      "Develop problem-solving skills through algorithmic thinking",
      "Create practical applications and automation scripts",
      "Understand object-oriented programming principles",
      "Build foundation for advanced programming concepts",
    ],
    modules: [
      {
        id: "python-basics",
        name: "Python Fundamentals",
        description: "Core Python concepts including variables, data types, and basic operations",
        duration: "3 weeks",
        difficulty: "Beginner",
        prerequisites: [],
        topics: [
          "Python installation and development environment setup",
          "Variables, naming conventions, and assignment operations",
          "Data types: integers, floats, strings, booleans",
          "Basic input/output operations and user interaction",
          "String manipulation and formatting techniques",
        ],
        skills: [
          "Set up Python development environment effectively",
          "Declare and manipulate variables with proper naming",
          "Work with different data types and type conversion",
          "Create interactive programs with user input/output",
          "Perform string operations and formatting",
        ],
        projects: [
          "Personal information collector and formatter",
          "Simple calculator with multiple operations",
          "Mad Libs story generator",
        ],
        assessments: [
          "Create a program demonstrating all basic data types",
          "Build an interactive application with user input validation",
          "Implement string manipulation in a practical application",
        ],
      },
      {
        id: "python-control",
        name: "Control Structures",
        description: "Decision making and repetition using conditionals and loops",
        duration: "3 weeks",
        difficulty: "Beginner",
        prerequisites: ["python-basics"],
        topics: [
          "Conditional statements (if, elif, else) and logical operators",
          "Comparison operators and boolean expressions",
          "While loops for indefinite repetition",
          "For loops and range function for definite repetition",
          "Nested control structures and complex logic",
        ],
        skills: [
          "Implement conditional logic for program decision-making",
          "Use comparison and logical operators effectively",
          "Create efficient loops for repetitive tasks",
          "Design nested control structures for complex problems",
          "Apply appropriate loop types for different scenarios",
        ],
        projects: [
          "Number guessing game with hints and attempts tracking",
          "Grade calculator with letter grade assignment",
          "Password strength validator with multiple criteria",
        ],
        assessments: [
          "Build a program using all types of conditional statements",
          "Create an application demonstrating both loop types",
          "Design a complex program with nested control structures",
        ],
      },
      {
        id: "python-functions",
        name: "Functions and Modularity",
        description: "Creating reusable code with functions and understanding scope",
        duration: "3 weeks",
        difficulty: "Intermediate",
        prerequisites: ["python-control"],
        topics: [
          "Function definition, parameters, and return values",
          "Local vs global scope and variable accessibility",
          "Default parameters and keyword arguments",
          "Lambda functions and functional programming concepts",
          "Recursion and recursive problem-solving",
        ],
        skills: [
          "Design and implement functions with appropriate parameters",
          "Understand and apply variable scope principles",
          "Use default parameters and keyword arguments effectively",
          "Apply functional programming concepts with lambda functions",
          "Solve problems using recursive approaches",
        ],
        projects: [
          "Library of mathematical utility functions",
          "Text processing toolkit with multiple functions",
          "Recursive art generator using turtle graphics",
        ],
        assessments: [
          "Create a module with at least 5 related functions",
          "Build a program demonstrating proper scope management",
          "Implement a recursive solution to a complex problem",
        ],
      },
      {
        id: "python-data",
        name: "Data Structures",
        description: "Working with lists, tuples, dictionaries, and sets",
        duration: "3 weeks",
        difficulty: "Intermediate",
        prerequisites: ["python-functions"],
        topics: [
          "Lists: creation, indexing, slicing, and methods",
          "Tuples: immutable sequences and use cases",
          "Dictionaries: key-value pairs and data organization",
          "Sets: unique collections and set operations",
          "List comprehensions and generator expressions",
        ],
        skills: [
          "Manipulate lists using indexing, slicing, and methods",
          "Choose appropriate data structures for different scenarios",
          "Organize data efficiently using dictionaries",
          "Perform set operations for data analysis",
          "Write concise code using list comprehensions",
        ],
        projects: [
          "Student grade management system",
          "Inventory tracking application with search functionality",
          "Data analysis tool for survey responses",
        ],
        assessments: [
          "Build an application using all four data structure types",
          "Create a data processing program with list comprehensions",
          "Design a system demonstrating appropriate data structure selection",
        ],
      },
      {
        id: "python-files",
        name: "File Handling and Data Persistence",
        description: "Reading from and writing to files for data storage",
        duration: "2 weeks",
        difficulty: "Intermediate",
        prerequisites: ["python-data"],
        topics: [
          "File opening, reading, and closing operations",
          "Writing data to files and append operations",
          "CSV file processing and data manipulation",
          "JSON data format and serialization",
          "Error handling for file operations",
        ],
        skills: [
          "Read and write files using proper file handling techniques",
          "Process CSV files for data analysis",
          "Work with JSON data for configuration and storage",
          "Implement error handling for robust file operations",
          "Design data persistence strategies for applications",
        ],
        projects: [
          "Personal expense tracker with file storage",
          "Contact management system with CSV export",
          "Configuration manager using JSON files",
        ],
        assessments: [
          "Create an application with complete file-based data persistence",
          "Build a data processing tool for CSV files",
          "Implement robust error handling for file operations",
        ],
      },
      {
        id: "python-oop",
        name: "Object-Oriented Programming",
        description: "Classes, objects, inheritance, and OOP principles",
        duration: "2 weeks",
        difficulty: "Advanced",
        prerequisites: ["python-files"],
        topics: [
          "Class definition and object instantiation",
          "Attributes and methods in class design",
          "Inheritance and method overriding",
          "Encapsulation and data hiding principles",
          "Polymorphism and abstract classes",
        ],
        skills: [
          "Design and implement classes with appropriate attributes and methods",
          "Apply inheritance for code reuse and specialization",
          "Implement encapsulation for data protection",
          "Use polymorphism for flexible code design",
          "Create object-oriented solutions to complex problems",
        ],
        projects: [
          "Bank account management system with different account types",
          "Game character system with inheritance hierarchy",
          "Library management system with multiple entity types",
        ],
        assessments: [
          "Design a class hierarchy demonstrating inheritance",
          "Create an application showcasing all OOP principles",
          "Build a complex system using object-oriented design",
        ],
      },
    ],
    comments: {
      beginner: [
        "[firstName] has made a solid start in Python programming, showing good understanding of basic syntax and control structures. They demonstrate enthusiasm for learning and are developing foundational programming skills. With continued practice and engagement, [firstName] will build confidence in writing more complex programs.",
        "[firstName] is progressing well in Python fundamentals, grasping key concepts like variables, data types, and conditional statements. Their willingness to ask questions and seek help shows a positive learning attitude. I encourage [firstName] to practice more coding exercises to reinforce their understanding.",
        "[firstName] shows promise in Python programming, understanding the basics of syntax and program structure. While they sometimes need guidance with more complex logic, their determination to learn is commendable. Additional practice with loops and functions will help [firstName] advance to the next level."
      ],
      intermediate: [
        "[firstName] demonstrates strong Python programming skills, effectively using functions, loops, and data structures to solve problems. They show good code organization and are beginning to think algorithmically. [firstName]'s ability to debug code and find solutions independently is impressive.",
        "[firstName] has developed solid Python programming capabilities, creating well-structured programs with proper function design and error handling. Their understanding of data structures and algorithms is growing, and they consistently produce quality work. [firstName] is ready to explore more advanced topics like object-oriented programming.",
        "[firstName] exhibits excellent Python programming proficiency, writing clean, efficient code that demonstrates strong problem-solving abilities. They effectively use advanced features like list comprehensions, dictionaries, and file handling. [firstName]'s code quality and logical thinking show they are ready for advanced Python concepts."
      ],
      advanced: [
        "[firstName] has achieved exceptional mastery of Python programming, demonstrating expert-level skills in object-oriented design, algorithm implementation, and code optimization. They create sophisticated applications with clean architecture and best practices. [firstName]'s ability to mentor peers and contribute to complex projects makes them an outstanding Python developer.",
        "[firstName] represents excellence in Python programming, with advanced skills spanning data structures, design patterns, and software engineering principles. Their code demonstrates professional-level quality, and they consistently tackle challenging problems with innovative solutions. [firstName] is ready for real-world software development projects.",
        "[firstName] has distinguished themselves as an exceptional Python programmer, with expertise in advanced topics including decorators, generators, async programming, and software architecture. Their ability to design scalable solutions and optimize code performance sets them apart. [firstName] shows leadership potential and is ready for professional development opportunities."
      ]
    },
    strengths: {
      beginner: [
        "Strong grasp of Python syntax and basic programming concepts",
        "Good problem-solving approach when tackling coding challenges",
        "Enthusiastic learner who actively participates in class activities",
        "Ability to follow instructions and implement basic programs correctly",
        "Willingness to ask questions and seek clarification when needed"
      ],
      intermediate: [
        "Excellent code organization and structure in Python programs",
        "Strong understanding of functions, loops, and data structures",
        "Effective debugging skills and error resolution capabilities",
        "Ability to break down complex problems into manageable steps",
        "Good coding practices including proper naming conventions and comments"
      ],
      advanced: [
        "Expert-level Python programming with advanced language features",
        "Outstanding problem-solving and algorithmic thinking abilities",
        "Professional code quality with best practices and design patterns",
        "Ability to design and implement complex software solutions",
        "Strong mentoring skills and collaborative development approach"
      ]
    },
    growthAreas: {
      beginner: [
        "Practice more coding exercises to reinforce fundamental concepts",
        "Work on understanding program flow and logic sequencing",
        "Develop better error handling and debugging strategies",
        "Improve code readability and organization",
        "Build confidence in writing programs independently"
      ],
      intermediate: [
        "Explore object-oriented programming concepts more deeply",
        "Practice with more complex data structures and algorithms",
        "Improve code efficiency and optimization techniques",
        "Work on larger projects to develop software design skills",
        "Enhance understanding of Python libraries and frameworks"
      ],
      advanced: [
        "Explore advanced Python topics like async programming and metaprogramming",
        "Work on larger-scale projects with multiple modules and packages",
        "Deepen understanding of software architecture and design patterns",
        "Contribute to open-source projects or collaborative development",
        "Prepare for professional software development roles"
      ]
    }
  },
  robotics: {
    id: "robotics",
    name: "Robotics Engineering & Programming",
    description: "Hands-on robotics combining mechanical design, electronics, and programming",
    icon: "🤖",
    color: "bg-red-500",
    totalDuration: "20 weeks",
    targetAge: "10+ years",
    learningOutcomes: [
      "Understand fundamental robotics and mechanical engineering principles",
      "Master microcontroller programming for embedded systems",
      "Integrate sensors and actuators for autonomous behavior",
      "Design and build custom robotic solutions",
      "Apply engineering design process to real-world problems",
    ],
    modules: [
      {
        id: "robotics-intro",
        name: "Introduction to Robotics",
        description: "Fundamental concepts of robotics, mechanics, and basic electronics",
        duration: "3 weeks",
        difficulty: "Beginner",
        prerequisites: [],
        topics: [
          "History and applications of robotics in various industries",
          "Basic mechanical principles: gears, levers, and simple machines",
          "Introduction to electronics: circuits, voltage, current, and resistance",
          "Microcontrollers and embedded systems overview",
          "Safety protocols and best practices in robotics",
        ],
        skills: [
          "Identify different types of robots and their applications",
          "Understand basic mechanical and electrical principles",
          "Follow safety protocols in robotics workshops",
          "Recognize components of robotic systems",
          "Apply engineering design thinking to problem-solving",
        ],
        projects: [
          "Simple mechanical robot using basic materials",
          "LED circuit with switches and basic controls",
          "Robotic timeline research and presentation",
        ],
        assessments: [
          "Build a mechanical robot demonstrating simple machines",
          "Create a basic electronic circuit with multiple components",
          "Present research on robotics applications in chosen industry",
        ],
      },
      {
        id: "robotics-programming",
        name: "Microcontroller Programming",
        description: "Programming Arduino and other microcontrollers for robotic control",
        duration: "4 weeks",
        difficulty: "Beginner",
        prerequisites: ["robotics-intro"],
        topics: [
          "Arduino IDE setup and programming environment",
          "Basic C++ syntax for embedded programming",
          "Digital and analog input/output operations",
          "Serial communication and debugging techniques",
          "Programming patterns for embedded systems",
        ],
        skills: [
          "Set up and use Arduino development environment",
          "Write C++ code for microcontroller applications",
          "Control digital and analog pins effectively",
          "Debug programs using serial communication",
          "Implement timing and control patterns",
        ],
        projects: [
          "LED pattern controller with multiple sequences",
          "Digital thermometer with display output",
          "Simple alarm system with sensors and indicators",
        ],
        assessments: [
          "Program a microcontroller to control multiple outputs",
          "Create a sensor-based monitoring system",
          "Build a project demonstrating serial communication",
        ],
      },
      {
        id: "robotics-sensors",
        name: "Sensors and Data Acquisition",
        description: "Integrating various sensors for environmental awareness",
        duration: "3 weeks",
        difficulty: "Intermediate",
        prerequisites: ["robotics-programming"],
        topics: [
          "Ultrasonic sensors for distance measurement",
          "Light sensors and photoresistors for environmental detection",
          "Temperature and humidity sensors for climate monitoring",
          "Accelerometers and gyroscopes for motion detection",
          "Sensor calibration and data filtering techniques",
        ],
        skills: [
          "Integrate multiple sensor types into robotic systems",
          "Calibrate sensors for accurate measurements",
          "Process and filter sensor data for reliable operation",
          "Implement sensor fusion for enhanced perception",
          "Design sensor-based decision-making systems",
        ],
        projects: [
          "Environmental monitoring station with multiple sensors",
          "Obstacle detection system using ultrasonic sensors",
          "Motion-activated security system",
        ],
        assessments: [
          "Build a multi-sensor data collection system",
          "Create a robot that responds to environmental changes",
          "Implement sensor fusion for improved accuracy",
        ],
      },
      {
        id: "robotics-motors",
        name: "Motors and Actuators",
        description: "Controlling movement with various motor types and actuators",
        duration: "3 weeks",
        difficulty: "Intermediate",
        prerequisites: ["robotics-sensors"],
        topics: [
          "DC motors and speed control using PWM",
          "Servo motors for precise positioning",
          "Stepper motors for accurate movement",
          "Motor drivers and power management",
          "Mechanical transmission systems and gear ratios",
        ],
        skills: [
          "Control different motor types for various applications",
          "Implement precise positioning and speed control",
          "Design mechanical transmission systems",
          "Manage power requirements for motor systems",
          "Integrate motors with sensor feedback",
        ],
        projects: [
          "Robotic arm with servo-controlled joints",
          "Wheeled robot with differential drive system",
          "Automated positioning system using stepper motors",
        ],
        assessments: [
          "Build a robot demonstrating all three motor types",
          "Create a precision positioning system",
          "Design a mechanical system with appropriate gear ratios",
        ],
      },
      {
        id: "robotics-navigation",
        name: "Navigation and Autonomous Behavior",
        description: "Implementing autonomous navigation and decision-making algorithms",
        duration: "4 weeks",
        difficulty: "Advanced",
        prerequisites: ["robotics-motors"],
        topics: [
          "Obstacle avoidance algorithms and implementation",
          "Line following and path tracking systems",
          "Basic pathfinding and navigation strategies",
          "State machines for behavior control",
          "PID control systems for stable operation",
        ],
        skills: [
          "Implement obstacle avoidance algorithms",
          "Create line-following and path-tracking systems",
          "Design state machines for complex behaviors",
          "Apply PID control for stable robot operation",
          "Develop autonomous decision-making systems",
        ],
        projects: [
          "Autonomous maze-solving robot",
          "Line-following robot with speed optimization",
          "Patrol robot with obstacle avoidance",
        ],
        assessments: [
          "Build a fully autonomous navigation robot",
          "Implement a complex state machine for robot behavior",
          "Create a robot using PID control for stability",
        ],
      },
      {
        id: "robotics-advanced",
        name: "Advanced Robotics Applications",
        description: "Computer vision, machine learning, and advanced robotics concepts",
        duration: "3 weeks",
        difficulty: "Advanced",
        prerequisites: ["robotics-navigation"],
        topics: [
          "Computer vision basics and image processing",
          "Machine learning applications in robotics",
          "Wireless communication and robot networks",
          "Advanced sensors: LIDAR, cameras, and IMUs",
          "Integration with cloud services and IoT platforms",
        ],
        skills: [
          "Implement basic computer vision for object recognition",
          "Apply machine learning concepts to robot behavior",
          "Design wireless communication between robots",
          "Integrate advanced sensors for enhanced perception",
          "Connect robots to cloud services and IoT platforms",
        ],
        projects: [
          "Object recognition and sorting robot",
          "Swarm robotics demonstration with multiple robots",
          "IoT-connected monitoring and control system",
        ],
        assessments: [
          "Create a robot with computer vision capabilities",
          "Build a multi-robot collaborative system",
          "Design an IoT-integrated robotics application",
        ],
      },
    ],
    comments: {
      beginner: [
        "[firstName] has made a solid start in robotics, showing good understanding of mechanical design principles and basic electronics. They demonstrate enthusiasm for building and programming robots. With continued practice, [firstName] will develop stronger skills in sensor integration and autonomous control.",
        "[firstName] is progressing well in robotics fundamentals, grasping concepts of motors, sensors, and basic programming. Their projects show creativity and a growing understanding of engineering principles. I encourage [firstName] to practice more with sensor calibration and robot navigation.",
        "[firstName] shows promise in robotics, understanding the basics of robot construction and programming. While they sometimes need guidance with complex systems, their hands-on approach and problem-solving attitude are positive. Additional practice with PID control will help [firstName] advance."
      ],
      intermediate: [
        "[firstName] demonstrates strong robotics skills, effectively designing and building functional robots with sensor integration. They show good understanding of control systems and programming logic. [firstName]'s ability to troubleshoot mechanical and software issues is impressive.",
        "[firstName] has developed solid robotics capabilities, creating autonomous robots with advanced sensor fusion and navigation algorithms. Their understanding of PID control and motor management is growing. [firstName] consistently produces well-engineered robotic solutions.",
        "[firstName] exhibits excellent robotics proficiency, building sophisticated robots with advanced features like computer vision and machine learning integration. They effectively use microcontrollers and sensors. [firstName]'s engineering skills and problem-solving abilities show they are ready for advanced robotics projects."
      ],
      advanced: [
        "[firstName] has achieved exceptional mastery of robotics, demonstrating expert-level skills in mechanical design, control systems, and autonomous navigation. They create innovative robotic solutions with professional engineering quality. [firstName]'s ability to mentor peers and lead complex projects makes them an outstanding robotics engineer.",
        "[firstName] represents excellence in robotics, with advanced skills spanning mechanical design, embedded systems, and AI integration. Their robots demonstrate professional-level functionality and innovative solutions. [firstName] is ready for research projects and professional robotics development.",
        "[firstName] has distinguished themselves as an exceptional robotics engineer, with expertise in advanced topics including swarm robotics, advanced control algorithms, and human-robot interaction. Their ability to design complex systems and optimize robot performance sets them apart. [firstName] shows leadership potential and is ready for engineering leadership roles."
      ]
    },
    strengths: {
      beginner: [
        "Good understanding of mechanical design and robot construction",
        "Enthusiastic about hands-on building and experimentation",
        "Basic programming skills for robot control",
        "Ability to follow engineering design processes",
        "Willingness to learn from mistakes and iterate on designs"
      ],
      intermediate: [
        "Strong skills in sensor integration and data processing",
        "Good understanding of control systems and PID algorithms",
        "Effective problem-solving for mechanical and software issues",
        "Ability to design and build functional autonomous robots",
        "Good documentation and engineering communication skills"
      ],
      advanced: [
        "Expert-level robotics engineering with advanced systems",
        "Outstanding skills in mechanical design and optimization",
        "Professional-level programming for embedded systems",
        "Ability to design and implement complex robotic solutions",
        "Strong leadership in robotics projects and team collaboration"
      ]
    },
    growthAreas: {
      beginner: [
        "Practice more with sensor calibration and data interpretation",
        "Work on understanding control algorithms and feedback loops",
        "Develop better mechanical design and construction techniques",
        "Improve programming skills for robot autonomy",
        "Build more complex robots to enhance engineering skills"
      ],
      intermediate: [
        "Explore advanced control algorithms and optimization techniques",
        "Practice with computer vision and sensor fusion",
        "Work on larger-scale robotics projects with multiple systems",
        "Improve understanding of robot navigation and path planning",
        "Enhance skills in debugging and troubleshooting complex systems"
      ],
      advanced: [
        "Explore advanced topics like swarm robotics and AI integration",
        "Work on research-level projects with cutting-edge technologies",
        "Deepen understanding of advanced control theory and optimization",
        "Contribute to open-source robotics projects or lead engineering teams",
        "Prepare for advanced research or professional engineering roles"
      ]
    }
  },
  web: {
    id: "web",
    name: "Modern Web Development",
    description: "Full-stack web development with modern frameworks and best practices",
    icon: "🌐",
    color: "bg-purple-500",
    totalDuration: "18 weeks",
    targetAge: "14+ years",
    learningOutcomes: [
      "Master HTML5, CSS3, and modern JavaScript",
      "Build responsive, accessible web applications",
      "Understand full-stack development principles",
      "Deploy and maintain web applications",
      "Apply modern development workflows and tools",
    ],
    modules: [
      {
        id: "web-html",
        name: "HTML5 and Semantic Web",
        description: "Modern HTML structure and semantic markup for accessible web content",
        duration: "2 weeks",
        difficulty: "Beginner",
        prerequisites: [],
        topics: [
          "HTML5 document structure and semantic elements",
          "Forms, input types, and validation attributes",
          "Multimedia integration: images, audio, and video",
          "Accessibility principles and ARIA attributes",
          "SEO fundamentals and meta tags",
        ],
        skills: [
          "Create well-structured HTML5 documents",
          "Build accessible and semantic web content",
          "Implement various form types and validation",
          "Integrate multimedia content effectively",
          "Apply SEO best practices in HTML structure",
        ],
        projects: [
          "Personal portfolio website with semantic structure",
          "Contact form with validation and accessibility",
          "Multimedia gallery with proper markup",
        ],
        assessments: [
          "Build a multi-page website with semantic HTML5",
          "Create an accessible form with proper validation",
          "Demonstrate understanding of SEO principles",
        ],
      },
      {
        id: "web-css",
        name: "Advanced CSS and Responsive Design",
        description: "Modern CSS techniques including Flexbox, Grid, and responsive design",
        duration: "3 weeks",
        difficulty: "Beginner",
        prerequisites: ["web-html"],
        topics: [
          "CSS selectors, specificity, and cascade principles",
          "Flexbox for one-dimensional layouts",
          "CSS Grid for two-dimensional layouts",
          "Responsive design with media queries",
          "CSS animations and transitions",
        ],
        skills: [
          "Apply CSS selectors and understand specificity",
          "Create flexible layouts using Flexbox",
          "Design complex layouts with CSS Grid",
          "Implement responsive design across devices",
          "Add animations and transitions for enhanced UX",
        ],
        projects: [
          "Responsive portfolio website with modern layouts",
          "CSS Grid-based magazine layout",
          "Animated landing page with transitions",
        ],
        assessments: [
          "Create a fully responsive website using Flexbox and Grid",
          "Build a complex layout demonstrating CSS mastery",
          "Implement smooth animations and transitions",
        ],
      },
      {
        id: "web-javascript",
        name: "Modern JavaScript and DOM Manipulation",
        description: "ES6+ JavaScript features and dynamic web interactions",
        duration: "4 weeks",
        difficulty: "Intermediate",
        prerequisites: ["web-css"],
        topics: [
          "ES6+ features: arrow functions, destructuring, modules",
          "DOM manipulation and event handling",
          "Asynchronous JavaScript: Promises and async/await",
          "Fetch API for HTTP requests",
          "Local storage and session management",
        ],
        skills: [
          "Use modern JavaScript features effectively",
          "Manipulate DOM elements and handle events",
          "Implement asynchronous operations",
          "Make HTTP requests and handle responses",
          "Manage client-side data storage",
        ],
        projects: [
          "Interactive todo application with local storage",
          "Weather app using external API",
          "Dynamic photo gallery with filtering",
        ],
        assessments: [
          "Build a complex interactive web application",
          "Create an app that consumes external APIs",
          "Demonstrate mastery of asynchronous JavaScript",
        ],
      },
      {
        id: "web-frameworks",
        name: "Frontend Frameworks and Libraries",
        description: "React.js and modern frontend development patterns",
        duration: "4 weeks",
        difficulty: "Intermediate",
        prerequisites: ["web-javascript"],
        topics: [
          "React components and JSX syntax",
          "State management and props",
          "React hooks and lifecycle methods",
          "Routing with React Router",
          "Component libraries and styling solutions",
        ],
        skills: [
          "Build React applications with components",
          "Manage application state effectively",
          "Implement routing for single-page applications",
          "Use React hooks for modern development",
          "Integrate third-party libraries and components",
        ],
        projects: [
          "Multi-page React application with routing",
          "E-commerce product catalog with state management",
          "Social media dashboard with real-time updates",
        ],
        assessments: [
          "Create a complex React application with multiple features",
          "Build an app demonstrating advanced state management",
          "Implement a project with external library integration",
        ],
      },
      {
        id: "web-backend",
        name: "Backend Development and APIs",
        description: "Server-side development with Node.js and database integration",
        duration: "3 weeks",
        difficulty: "Advanced",
        prerequisites: ["web-frameworks"],
        topics: [
          "Node.js and Express.js server development",
          "RESTful API design and implementation",
          "Database integration with MongoDB/PostgreSQL",
          "Authentication and authorization systems",
          "API testing and documentation",
        ],
        skills: [
          "Build server-side applications with Node.js",
          "Design and implement RESTful APIs",
          "Integrate databases for data persistence",
          "Implement secure authentication systems",
          "Test and document API endpoints",
        ],
        projects: [
          "Blog API with user authentication",
          "Task management system with database",
          "Real-time chat application",
        ],
        assessments: [
          "Build a complete backend API with authentication",
          "Create a full-stack application with database integration",
          "Implement real-time features using WebSockets",
        ],
      },
      {
        id: "web-deployment",
        name: "Deployment and DevOps",
        description: "Deploying applications and modern development workflows",
        duration: "2 weeks",
        difficulty: "Advanced",
        prerequisites: ["web-backend"],
        topics: [
          "Version control with Git and GitHub",
          "Continuous integration and deployment (CI/CD)",
          "Cloud hosting platforms and services",
          "Performance optimization and monitoring",
          "Security best practices for web applications",
        ],
        skills: [
          "Use Git for version control and collaboration",
          "Set up CI/CD pipelines for automated deployment",
          "Deploy applications to cloud platforms",
          "Optimize application performance",
          "Implement security best practices",
        ],
        projects: [
          "Deployed full-stack application with CI/CD",
          "Performance-optimized web application",
          "Secure application with proper authentication",
        ],
        assessments: [
          "Deploy a complete application to production",
          "Set up automated deployment pipeline",
          "Demonstrate security and performance optimization",
        ],
      },
    ],
    comments: {
      beginner: [
        "[firstName] has made a promising start in web development, showing good understanding of HTML structure and CSS styling basics. They demonstrate creativity in design and are learning to create visually appealing web pages. With continued practice, [firstName] will develop stronger skills in responsive design and interactivity.",
        "[firstName] is progressing well in web development fundamentals, grasping HTML5 semantic elements and CSS properties effectively. Their projects show attention to detail and a growing understanding of web design principles. I encourage [firstName] to practice more with JavaScript to add interactivity to their websites.",
        "[firstName] shows enthusiasm for web development, understanding the basics of HTML and CSS. While they sometimes need guidance with layout and styling, their willingness to experiment and learn is positive. Additional practice with flexbox and grid will help [firstName] create more sophisticated layouts."
      ],
      intermediate: [
        "[firstName] demonstrates strong web development skills, creating responsive websites with modern CSS techniques and JavaScript interactivity. They show good understanding of DOM manipulation and event handling. [firstName]'s ability to debug and troubleshoot web issues is impressive.",
        "[firstName] has developed solid full-stack capabilities, building interactive web applications with frontend frameworks and backend integration. Their understanding of React components and state management is growing. [firstName] consistently produces well-structured, functional web applications.",
        "[firstName] exhibits excellent web development proficiency, creating professional-quality websites with advanced features like API integration and responsive design. They effectively use modern frameworks and tools. [firstName]'s code organization and problem-solving abilities show they are ready for advanced web development projects."
      ],
      advanced: [
        "[firstName] has achieved exceptional mastery of full-stack web development, demonstrating expert-level skills in modern frameworks, API design, and deployment. They create scalable applications with clean architecture and best practices. [firstName]'s ability to mentor peers and lead projects makes them an outstanding web developer.",
        "[firstName] represents excellence in web development, with advanced skills spanning frontend frameworks, backend systems, and DevOps practices. Their applications demonstrate professional-level quality and innovative solutions. [firstName] is ready for senior development roles and complex project leadership.",
        "[firstName] has distinguished themselves as an exceptional full-stack developer, with expertise in advanced topics including microservices, cloud deployment, and performance optimization. Their ability to design scalable solutions and optimize applications sets them apart. [firstName] shows leadership potential and is ready for technical leadership opportunities."
      ]
    },
    strengths: {
      beginner: [
        "Good understanding of HTML structure and semantic elements",
        "Creative approach to CSS styling and design",
        "Enthusiastic about learning web technologies",
        "Ability to follow design patterns and implement layouts",
        "Willingness to experiment with different styling techniques"
      ],
      intermediate: [
        "Strong skills in responsive design and CSS frameworks",
        "Good understanding of JavaScript and DOM manipulation",
        "Effective use of React or other frontend frameworks",
        "Ability to integrate APIs and handle asynchronous operations",
        "Good debugging skills for web applications"
      ],
      advanced: [
        "Expert-level full-stack development capabilities",
        "Outstanding skills in modern frameworks and tools",
        "Professional code quality with best practices",
        "Ability to design and implement scalable web applications",
        "Strong understanding of performance optimization and security"
      ]
    },
    growthAreas: {
      beginner: [
        "Practice more with CSS layout techniques (flexbox, grid)",
        "Work on JavaScript fundamentals and interactivity",
        "Develop better understanding of responsive design principles",
        "Improve code organization and file structure",
        "Build more interactive projects to enhance skills"
      ],
      intermediate: [
        "Explore advanced JavaScript features and ES6+ syntax",
        "Practice with state management in frontend frameworks",
        "Work on backend development and database integration",
        "Improve understanding of web performance optimization",
        "Enhance skills in testing and debugging web applications"
      ],
      advanced: [
        "Explore advanced topics like serverless architecture and microservices",
        "Work on larger-scale applications with complex requirements",
        "Deepen understanding of web security and best practices",
        "Contribute to open-source projects or lead development teams",
        "Prepare for senior developer or technical lead roles"
      ]
    }
  },
  design: {
    id: "design",
    name: "UI/UX Design and Digital Creativity",
    description: "User-centered design principles and digital design tools mastery",
    icon: "🎨",
    color: "bg-pink-500",
    totalDuration: "14 weeks",
    targetAge: "12+ years",
    learningOutcomes: [
      "Master design principles and visual communication",
      "Understand user experience and human-centered design",
      "Create professional designs using industry tools",
      "Develop design thinking and problem-solving skills",
      "Build a comprehensive design portfolio",
    ],
    modules: [
      {
        id: "design-principles",
        name: "Design Fundamentals",
        description: "Core design principles, color theory, and visual composition",
        duration: "3 weeks",
        difficulty: "Beginner",
        prerequisites: [],
        topics: [
          "Design principles: balance, contrast, hierarchy, alignment",
          "Color theory and psychology in design",
          "Typography fundamentals and font selection",
          "Composition techniques and visual flow",
          "Design history and contemporary trends",
        ],
        skills: [
          "Apply fundamental design principles effectively",
          "Create harmonious color palettes",
          "Select and pair typography appropriately",
          "Compose visually appealing layouts",
          "Analyze and critique design work",
        ],
        projects: [
          "Brand identity design with logo and color palette",
          "Typography poster showcasing font combinations",
          "Visual hierarchy exercise with information design",
        ],
        assessments: [
          "Create a design demonstrating all fundamental principles",
          "Design a comprehensive brand identity system",
          "Analyze and present critique of existing designs",
        ],
      },
      {
        id: "design-tools",
        name: "Digital Design Tools",
        description: "Mastering Figma, Adobe Creative Suite, and design workflows",
        duration: "3 weeks",
        difficulty: "Beginner",
        prerequisites: ["design-principles"],
        topics: [
          "Figma interface and collaborative design features",
          "Vector graphics creation and manipulation",
          "Photo editing and image optimization",
          "Design system creation and component libraries",
          "File organization and version control",
        ],
        skills: [
          "Navigate and use Figma efficiently",
          "Create and edit vector graphics",
          "Process and optimize images for digital use",
          "Build and maintain design systems",
          "Organize design files and collaborate effectively",
        ],
        projects: [
          "Complete brand identity in Figma",
          "Icon set design with consistent style",
          "Design system with reusable components",
        ],
        assessments: [
          "Create a professional design using advanced tool features",
          "Build a comprehensive design system",
          "Demonstrate efficient workflow and organization",
        ],
      },
      {
        id: "design-ux",
        name: "User Experience Design",
        description: "User research, wireframing, and user-centered design process",
        duration: "3 weeks",
        difficulty: "Intermediate",
        prerequisites: ["design-tools"],
        topics: [
          "User research methods and persona development",
          "Information architecture and user journey mapping",
          "Wireframing and low-fidelity prototyping",
          "Usability testing and feedback incorporation",
          "Accessibility principles in UX design",
        ],
        skills: [
          "Conduct user research and create personas",
          "Map user journeys and information architecture",
          "Create wireframes and prototypes",
          "Plan and conduct usability tests",
          "Design accessible user experiences",
        ],
        projects: [
          "Mobile app UX design with user research",
          "Website redesign based on usability testing",
          "Accessibility audit and improvement plan",
        ],
        assessments: [
          "Complete UX project from research to testing",
          "Create user personas based on research data",
          "Design an accessible interface with proper testing",
        ],
      },
      {
        id: "design-ui",
        name: "User Interface Design",
        description: "Visual interface design and interactive prototyping",
        duration: "3 weeks",
        difficulty: "Intermediate",
        prerequisites: ["design-ux"],
        topics: [
          "Visual interface design principles",
          "Interactive prototyping and micro-interactions",
          "Responsive design for multiple devices",
          "Design patterns and UI conventions",
          "Handoff processes for development teams",
        ],
        skills: [
          "Design polished user interfaces",
          "Create interactive prototypes with animations",
          "Adapt designs for different screen sizes",
          "Apply established UI patterns appropriately",
          "Prepare designs for developer handoff",
        ],
        projects: [
          "Mobile app UI with interactive prototype",
          "Responsive web application interface",
          "Design system with interaction specifications",
        ],
        assessments: [
          "Create a complete UI design with interactions",
          "Build a responsive interface for multiple devices",
          "Prepare professional design specifications",
        ],
      },
      {
        id: "design-portfolio",
        name: "Portfolio Development",
        description: "Building a professional design portfolio and presentation skills",
        duration: "2 weeks",
        difficulty: "Advanced",
        prerequisites: ["design-ui"],
        topics: [
          "Portfolio structure and case study development",
          "Design process documentation and storytelling",
          "Personal branding and professional presentation",
          "Online portfolio platforms and optimization",
          "Interview preparation and design critique skills",
        ],
        skills: [
          "Structure and present design work effectively",
          "Document design process and decision-making",
          "Develop personal brand and professional identity",
          "Create and maintain online portfolio presence",
          "Present and defend design decisions confidently",
        ],
        projects: [
          "Complete design portfolio with case studies",
          "Personal brand identity and website",
          "Design presentation for portfolio review",
        ],
        assessments: [
          "Present comprehensive design portfolio",
          "Deliver professional design presentation",
          "Demonstrate ability to critique and iterate on work",
        ],
      },
    ],
    comments: {
      beginner: [
        "[firstName] has made an excellent start in UI/UX design, showing great creativity and an eye for visual aesthetics. They demonstrate good understanding of design principles and are creating visually appealing interfaces. With continued practice, [firstName] will develop stronger skills in user-centered design and interaction patterns.",
        "[firstName] is progressing well in design fundamentals, grasping key concepts like color theory, typography, and layout principles. Their projects show creativity and a growing understanding of design thinking. I encourage [firstName] to practice more with user research and prototyping to enhance their design process.",
        "[firstName] shows promise in UI/UX design, understanding the basics of visual design and creating simple interfaces. While they sometimes need guidance with more complex design systems, their creative approach and willingness to iterate are positive. Additional practice with design tools will help [firstName] advance."
      ],
      intermediate: [
        "[firstName] demonstrates strong design skills, effectively creating user-centered interfaces with good usability principles. They show good understanding of design systems and component libraries. [firstName]'s ability to iterate based on feedback and improve designs is impressive.",
        "[firstName] has developed solid UI/UX capabilities, creating professional-quality designs with advanced features like responsive layouts and interactive prototypes. Their understanding of user research and design thinking is growing. [firstName] consistently produces well-thought-out, user-friendly designs.",
        "[firstName] exhibits excellent design proficiency, building sophisticated interfaces with advanced features like design systems, micro-interactions, and accessibility considerations. They effectively use design tools and prototyping software. [firstName]'s design skills and user empathy show they are ready for advanced design projects."
      ],
      advanced: [
        "[firstName] has achieved exceptional mastery of UI/UX design, demonstrating expert-level skills in user research, design systems, and product design. They create innovative solutions with professional design quality. [firstName]'s ability to mentor peers and lead design projects makes them an outstanding designer.",
        "[firstName] represents excellence in UI/UX design, with advanced skills spanning user research, interaction design, and design leadership. Their designs demonstrate professional-level quality and innovative solutions. [firstName] is ready for senior design roles and complex product design leadership.",
        "[firstName] has distinguished themselves as an exceptional designer, with expertise in advanced topics including design strategy, design systems architecture, and design team leadership. Their ability to create impactful user experiences and lead design initiatives sets them apart. [firstName] shows leadership potential and is ready for design leadership opportunities."
      ]
    },
    strengths: {
      beginner: [
        "Great creativity and visual design sense",
        "Good understanding of basic design principles",
        "Ability to create visually appealing interfaces",
        "Willingness to experiment with different design styles",
        "Positive attitude toward learning design tools and techniques"
      ],
      intermediate: [
        "Strong skills in user-centered design and usability",
        "Good understanding of design systems and components",
        "Effective use of design tools and prototyping software",
        "Ability to create responsive and accessible designs",
        "Good iteration and feedback incorporation skills"
      ],
      advanced: [
        "Expert-level UI/UX design with advanced methodologies",
        "Outstanding skills in user research and design thinking",
        "Professional-level design system creation and management",
        "Ability to design and lead complex product experiences",
        "Strong design leadership and mentoring abilities"
      ]
    },
    growthAreas: {
      beginner: [
        "Practice more with design tools and software",
        "Work on understanding user research and personas",
        "Develop better understanding of layout and composition",
        "Improve typography and color theory knowledge",
        "Build more complex projects to enhance design skills"
      ],
      intermediate: [
        "Explore advanced prototyping and interaction design",
        "Practice with design systems and component libraries",
        "Work on user research and usability testing",
        "Improve understanding of accessibility and inclusive design",
        "Enhance skills in design presentation and communication"
      ],
      advanced: [
        "Explore advanced topics like design strategy and product thinking",
        "Work on larger-scale design projects with complex requirements",
        "Deepen understanding of design leadership and team management",
        "Contribute to design communities or lead design teams",
        "Prepare for senior designer or design lead roles"
      ]
    }
  }
};

export const getEnhancedCourseContent = (courseId: string): EnhancedCourse | undefined => {
  return enhancedCourseContent[courseId];
};
