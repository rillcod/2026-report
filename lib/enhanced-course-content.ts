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
    ]
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
    ]
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
    ]
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
  }
};

export const getEnhancedCourseContent = (courseId: string): EnhancedCourse | undefined => {
  return enhancedCourseContent[courseId];
};
