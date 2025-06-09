const fallbackQuestions = {
  'software-engineer': [
    {
      question: "Tell me about yourself and your programming background.",
      hint: "Focus on your technical journey, key projects, and what drives your passion for programming.",
      type: "behavioral"
    },
    {
      question: "What programming languages are you most comfortable with and why?",
      hint: "Discuss 2-3 languages you know well and provide specific examples of projects you've built.",
      type: "technical"
    },
    {
      question: "Describe a challenging technical problem you solved recently.",
      hint: "Use the STAR method: Situation, Task, Action, Result. Be specific about your approach.",
      type: "behavioral"
    },
    {
      question: "How do you approach debugging complex issues in your code?",
      hint: "Mention systematic approaches, tools you use, and how you prevent similar issues.",
      type: "technical"
    },
    {
      question: "Explain the concept of object-oriented programming and its benefits.",
      hint: "Cover encapsulation, inheritance, polymorphism, and provide real-world examples.",
      type: "technical"
    },
    {
      question: "What is your experience with version control systems like Git?",
      hint: "Discuss branching strategies, merge conflicts, and collaborative development workflows.",
      type: "technical"
    },
    {
      question: "How do you stay updated with new technologies and programming trends?",
      hint: "Mention resources you use, communities you're part of, and how you apply new learnings.",
      type: "behavioral"
    }
  ],

  'frontend-developer': [
    {
      question: "Tell me about your experience with modern frontend frameworks.",
      hint: "Discuss React, Angular, or Vue.js experience with specific project examples.",
      type: "technical"
    },
    {
      question: "How do you ensure your web applications are responsive and accessible?",
      hint: "Mention CSS techniques, testing methods, and accessibility standards you follow.",
      type: "technical"
    },
    {
      question: "Describe your process for optimizing web application performance.",
      hint: "Cover loading times, bundle optimization, lazy loading, and performance monitoring.",
      type: "technical"
    },
    {
      question: "How do you handle state management in complex applications?",
      hint: "Discuss Redux, Context API, or other state management solutions you've used.",
      type: "technical"
    },
    {
      question: "Tell me about a challenging UI/UX problem you solved.",
      hint: "Focus on user needs, your design thinking process, and the impact of your solution.",
      type: "behavioral"
    },
    {
      question: "What is your approach to cross-browser compatibility?",
      hint: "Discuss testing strategies, polyfills, and how you handle browser-specific issues.",
      type: "technical"
    },
    {
      question: "How do you implement and maintain design systems?",
      hint: "Talk about component libraries, style guides, and consistency across projects.",
      type: "technical"
    }
  ],

  'backend-developer': [
    {
      question: "Describe your experience with server-side development and APIs.",
      hint: "Discuss frameworks you've used, API design principles, and scalability considerations.",
      type: "technical"
    },
    {
      question: "How do you design and optimize database schemas?",
      hint: "Cover normalization, indexing, query optimization, and database selection criteria.",
      type: "technical"
    },
    {
      question: "Explain your approach to API security and authentication.",
      hint: "Discuss JWT, OAuth, rate limiting, input validation, and security best practices.",
      type: "technical"
    },
    {
      question: "How do you handle error handling and logging in your applications?",
      hint: "Talk about error types, logging strategies, monitoring, and debugging techniques.",
      type: "technical"
    },
    {
      question: "Describe a time when you had to optimize application performance.",
      hint: "Use specific metrics, bottlenecks identified, and solutions implemented.",
      type: "behavioral"
    },
    {
      question: "What is your experience with microservices architecture?",
      hint: "Discuss benefits, challenges, communication patterns, and when to use microservices.",
      type: "technical"
    },
    {
      question: "How do you ensure data consistency in distributed systems?",
      hint: "Cover transactions, ACID properties, eventual consistency, and distributed patterns.",
      type: "technical"
    }
  ],

  'fullstack-developer': [
    {
      question: "How do you approach building a full-stack application from scratch?",
      hint: "Discuss architecture decisions, technology stack selection, and development workflow.",
      type: "technical"
    },
    {
      question: "Describe your experience integrating frontend and backend systems.",
      hint: "Cover API design, data flow, authentication, and communication patterns.",
      type: "technical"
    },
    {
      question: "How do you handle deployment and DevOps in your projects?",
      hint: "Discuss CI/CD pipelines, containerization, cloud services, and monitoring.",
      type: "technical"
    },
    {
      question: "What is your approach to testing across the full stack?",
      hint: "Cover unit testing, integration testing, E2E testing, and testing strategies.",
      type: "technical"
    },
    {
      question: "How do you manage complexity in large full-stack applications?",
      hint: "Discuss code organization, architectural patterns, and maintainability strategies.",
      type: "technical"
    },
    {
      question: "Describe a challenging full-stack project you've worked on.",
      hint: "Focus on technical challenges, solutions implemented, and lessons learned.",
      type: "behavioral"
    },
    {
      question: "How do you balance frontend and backend development priorities?",
      hint: "Discuss time management, skill development, and project planning strategies.",
      type: "behavioral"
    }
  ],

  'mobile-developer': [
    {
      question: "What is your experience with mobile app development frameworks?",
      hint: "Discuss React Native, Flutter, or native development with specific examples.",
      type: "technical"
    },
    {
      question: "How do you handle different screen sizes and device capabilities?",
      hint: "Cover responsive design, device-specific features, and cross-platform considerations.",
      type: "technical"
    },
    {
      question: "Describe your approach to mobile app performance optimization.",
      hint: "Discuss memory management, battery optimization, and smooth user interactions.",
      type: "technical"
    },
    {
      question: "How do you implement offline functionality in mobile apps?",
      hint: "Cover local storage, data synchronization, and offline-first strategies.",
      type: "technical"
    },
    {
      question: "What is your experience with mobile app deployment and distribution?",
      hint: "Discuss app store guidelines, beta testing, and release management.",
      type: "technical"
    },
    {
      question: "How do you handle push notifications and real-time features?",
      hint: "Cover notification services, WebSocket connections, and user engagement strategies.",
      type: "technical"
    },
    {
      question: "Describe a challenging mobile development problem you solved.",
      hint: "Focus on platform-specific challenges and innovative solutions.",
      type: "behavioral"
    }
  ],

  'data-scientist': [
    {
      question: "Walk me through your approach to a typical data science project.",
      hint: "Cover data collection, cleaning, analysis, modeling, and validation steps.",
      type: "technical"
    },
    {
      question: "How do you handle missing or inconsistent data in your datasets?",
      hint: "Discuss various imputation techniques and when to use each approach.",
      type: "technical"
    },
    {
      question: "Explain the difference between supervised and unsupervised learning.",
      hint: "Provide definitions and give specific examples of algorithms for each type.",
      type: "technical"
    },
    {
      question: "How do you evaluate the performance of a machine learning model?",
      hint: "Mention metrics like accuracy, precision, recall, F1-score, and cross-validation.",
      type: "technical"
    },
    {
      question: "Describe a time when your analysis led to a significant business decision.",
      hint: "Use specific metrics and explain the business impact of your findings.",
      type: "behavioral"
    },
    {
      question: "How do you handle overfitting in machine learning models?",
      hint: "Discuss regularization techniques, cross-validation, and model selection strategies.",
      type: "technical"
    },
    {
      question: "What is your experience with big data technologies and frameworks?",
      hint: "Cover tools like Spark, Hadoop, or cloud-based solutions you've used.",
      type: "technical"
    }
  ],

  'data-analyst': [
    {
      question: "Tell me about your experience with data analysis and visualization.",
      hint: "Discuss tools you use, types of analysis performed, and visualization techniques.",
      type: "behavioral"
    },
    {
      question: "How do you approach cleaning and preparing messy datasets?",
      hint: "Cover data quality assessment, cleaning techniques, and validation methods.",
      type: "technical"
    },
    {
      question: "What tools and technologies do you use for data analysis?",
      hint: "Discuss SQL, Python, R, Excel, Tableau, Power BI, and when to use each.",
      type: "technical"
    },
    {
      question: "Describe a time when you found valuable insights from data.",
      hint: "Use specific examples and explain the business impact of your discoveries.",
      type: "behavioral"
    },
    {
      question: "How do you communicate technical findings to non-technical stakeholders?",
      hint: "Discuss visualization strategies, storytelling techniques, and presentation skills.",
      type: "behavioral"
    },
    {
      question: "What is your approach to statistical analysis and hypothesis testing?",
      hint: "Cover statistical methods, significance testing, and interpretation of results.",
      type: "technical"
    },
    {
      question: "How do you ensure data accuracy and reliability in your reports?",
      hint: "Discuss validation techniques, quality checks, and documentation practices.",
      type: "technical"
    }
  ],

  'devops-engineer': [
    {
      question: "Describe your experience with CI/CD pipeline implementation.",
      hint: "Discuss tools used, pipeline stages, and automation strategies.",
      type: "technical"
    },
    {
      question: "How do you approach infrastructure as code (IaC)?",
      hint: "Cover tools like Terraform, Ansible, and version control for infrastructure.",
      type: "technical"
    },
    {
      question: "What is your experience with containerization and orchestration?",
      hint: "Discuss Docker, Kubernetes, container security, and scaling strategies.",
      type: "technical"
    },
    {
      question: "How do you implement monitoring and alerting systems?",
      hint: "Cover monitoring tools, metrics collection, and incident response procedures.",
      type: "technical"
    },
    {
      question: "Describe a time when you resolved a critical production issue.",
      hint: "Use the STAR method and focus on problem-solving and communication.",
      type: "behavioral"
    },
    {
      question: "How do you ensure security in DevOps processes?",
      hint: "Discuss security scanning, compliance, and secure deployment practices.",
      type: "technical"
    },
    {
      question: "What is your approach to capacity planning and scalability?",
      hint: "Cover performance monitoring, resource optimization, and scaling strategies.",
      type: "technical"
    }
  ],

  'cloud-engineer': [
    {
      question: "Compare your experience with different cloud platforms (AWS, Azure, GCP).",
      hint: "Discuss specific services used, strengths of each platform, and migration experiences.",
      type: "technical"
    },
    {
      question: "How do you design scalable and resilient cloud architectures?",
      hint: "Cover high availability, fault tolerance, and auto-scaling strategies.",
      type: "technical"
    },
    {
      question: "What is your approach to cloud cost optimization?",
      hint: "Discuss cost monitoring, resource rightsizing, and optimization strategies.",
      type: "technical"
    },
    {
      question: "How do you implement cloud security best practices?",
      hint: "Cover IAM, encryption, network security, and compliance requirements.",
      type: "technical"
    },
    {
      question: "Describe your experience with cloud migration projects.",
      hint: "Discuss migration strategies, challenges faced, and lessons learned.",
      type: "behavioral"
    },
    {
      question: "How do you handle disaster recovery in cloud environments?",
      hint: "Cover backup strategies, RTO/RPO requirements, and testing procedures.",
      type: "technical"
    },
    {
      question: "What is your experience with serverless computing?",
      hint: "Discuss use cases, benefits, limitations, and specific implementations.",
      type: "technical"
    }
  ],

  'cybersecurity-specialist': [
    {
      question: "Describe your approach to conducting security risk assessments.",
      hint: "Cover methodology, risk identification, impact analysis, and mitigation strategies.",
      type: "technical"
    },
    {
      question: "What is your experience with penetration testing and vulnerability assessments?",
      hint: "Discuss tools used, testing methodologies, and reporting procedures.",
      type: "technical"
    },
    {
      question: "How do you stay updated with the latest cybersecurity threats?",
      hint: "Mention threat intelligence sources, security communities, and continuous learning.",
      type: "behavioral"
    },
    {
      question: "Describe your experience with incident response and forensics.",
      hint: "Cover incident handling procedures, evidence collection, and recovery processes.",
      type: "technical"
    },
    {
      question: "How do you implement security awareness training programs?",
      hint: "Discuss training content, delivery methods, and measuring effectiveness.",
      type: "behavioral"
    },
    {
      question: "What is your approach to network security monitoring?",
      hint: "Cover monitoring tools, log analysis, and threat detection techniques.",
      type: "technical"
    },
    {
      question: "How do you handle compliance and regulatory requirements?",
      hint: "Discuss specific frameworks (SOX, HIPAA, GDPR) and implementation strategies.",
      type: "technical"
    }
  ],

  'qa-engineer': [
    {
      question: "Describe your approach to test planning and strategy development.",
      hint: "Cover test types, risk assessment, and resource allocation strategies.",
      type: "technical"
    },
    {
      question: "What is your experience with test automation frameworks?",
      hint: "Discuss tools like Selenium, Cypress, or mobile testing frameworks.",
      type: "technical"
    },
    {
      question: "How do you handle API testing and integration testing?",
      hint: "Cover testing tools, test data management, and validation strategies.",
      type: "technical"
    },
    {
      question: "Describe your bug tracking and reporting process.",
      hint: "Discuss bug lifecycle, severity classification, and communication with developers.",
      type: "technical"
    },
    {
      question: "How do you ensure quality in agile development environments?",
      hint: "Cover testing in sprints, continuous integration, and collaboration strategies.",
      type: "behavioral"
    },
    {
      question: "What is your approach to performance and load testing?",
      hint: "Discuss testing tools, metrics collection, and performance optimization.",
      type: "technical"
    },
    {
      question: "How do you handle mobile app testing across different devices?",
      hint: "Cover device compatibility, testing strategies, and automation approaches.",
      type: "technical"
    }
  ],

  'product-manager': [
    {
      question: "How do you develop and prioritize product roadmaps?",
      hint: "Discuss prioritization frameworks, stakeholder input, and strategic alignment.",
      type: "behavioral"
    },
    {
      question: "Describe your approach to user research and market analysis.",
      hint: "Cover research methods, data collection, and insights translation.",
      type: "technical"
    },
    {
      question: "How do you handle conflicting requirements from different stakeholders?",
      hint: "Discuss negotiation strategies, decision-making frameworks, and communication.",
      type: "behavioral"
    },
    {
      question: "What metrics do you use to measure product success?",
      hint: "Cover KPIs, user engagement metrics, and business impact measurement.",
      type: "technical"
    },
    {
      question: "Describe a time when you had to pivot a product strategy.",
      hint: "Use the STAR method and focus on decision-making and change management.",
      type: "behavioral"
    },
    {
      question: "How do you work with engineering teams to deliver products?",
      hint: "Discuss collaboration techniques, requirement specification, and project management.",
      type: "behavioral"
    },
    {
      question: "What is your approach to competitive analysis?",
      hint: "Cover analysis frameworks, market positioning, and strategic insights.",
      type: "technical"
    }
  ],

  'ui-ux-designer': [
    {
      question: "Walk me through your design process from research to final product.",
      hint: "Cover user research, ideation, prototyping, testing, and iteration phases.",
      type: "technical"
    },
    {
      question: "How do you conduct user research and usability testing?",
      hint: "Discuss research methods, user interviews, and testing methodologies.",
      type: "technical"
    },
    {
      question: "Describe your experience with design systems and component libraries.",
      hint: "Cover design consistency, documentation, and collaboration with developers.",
      type: "technical"
    },
    {
      question: "How do you handle design feedback and iteration?",
      hint: "Discuss feedback collection, stakeholder management, and design rationale.",
      type: "behavioral"
    },
    {
      question: "What is your approach to accessibility in design?",
      hint: "Cover accessibility guidelines, inclusive design principles, and testing methods.",
      type: "technical"
    },
    {
      question: "How do you balance user needs with business requirements?",
      hint: "Discuss prioritization strategies, trade-off decisions, and stakeholder alignment.",
      type: "behavioral"
    },
    {
      question: "Describe a challenging design problem you solved.",
      hint: "Focus on problem definition, design process, and impact measurement.",
      type: "behavioral"
    }
  ],

  'system-administrator': [
    {
      question: "Describe your experience with server management and maintenance.",
      hint: "Cover server types, maintenance schedules, and troubleshooting approaches.",
      type: "technical"
    },
    {
      question: "How do you approach network configuration and troubleshooting?",
      hint: "Discuss network protocols, diagnostic tools, and problem resolution.",
      type: "technical"
    },
    {
      question: "What is your experience with backup and disaster recovery?",
      hint: "Cover backup strategies, recovery procedures, and business continuity planning.",
      type: "technical"
    },
    {
      question: "How do you handle system security and updates?",
      hint: "Discuss security patches, update procedures, and vulnerability management.",
      type: "technical"
    },
    {
      question: "Describe a time when you resolved a critical system outage.",
      hint: "Use the STAR method and focus on problem-solving under pressure.",
      type: "behavioral"
    },
    {
      question: "What monitoring tools do you use for system health?",
      hint: "Discuss monitoring solutions, alerting systems, and performance optimization.",
      type: "technical"
    },
    {
      question: "How do you document system configurations and procedures?",
      hint: "Cover documentation standards, knowledge sharing, and maintenance procedures.",
      type: "behavioral"
    }
  ],

  'database-administrator': [
    {
      question: "Describe your experience with database design and optimization.",
      hint: "Cover normalization, indexing strategies, and query optimization techniques.",
      type: "technical"
    },
    {
      question: "How do you handle database backup and recovery procedures?",
      hint: "Discuss backup strategies, recovery testing, and disaster recovery planning.",
      type: "technical"
    },
    {
      question: "What is your approach to database performance tuning?",
      hint: "Cover performance monitoring, bottleneck identification, and optimization strategies.",
      type: "technical"
    },
    {
      question: "How do you ensure database security and access control?",
      hint: "Discuss user management, encryption, and security best practices.",
      type: "technical"
    },
    {
      question: "Describe your experience with database migration projects.",
      hint: "Cover migration planning, data validation, and rollback procedures.",
      type: "behavioral"
    },
    {
      question: "How do you handle database scaling and high availability?",
      hint: "Discuss replication, clustering, and load balancing strategies.",
      type: "technical"
    },
    {
      question: "What tools do you use for database monitoring and maintenance?",
      hint: "Cover monitoring solutions, automated maintenance, and alerting systems.",
      type: "technical"
    }
  ],

  'machine-learning-engineer': [
    {
      question: "Describe your approach to deploying machine learning models in production.",
      hint: "Cover model serving, monitoring, and MLOps practices.",
      type: "technical"
    },
    {
      question: "How do you handle model versioning and experiment tracking?",
      hint: "Discuss MLflow, DVC, or other tools for experiment management.",
      type: "technical"
    },
    {
      question: "What is your experience with deep learning frameworks?",
      hint: "Compare TensorFlow, PyTorch, and discuss specific implementations.",
      type: "technical"
    },
    {
      question: "How do you approach feature engineering and selection?",
      hint: "Cover feature extraction, transformation, and selection techniques.",
      type: "technical"
    },
    {
      question: "Describe a challenging ML project you've worked on.",
      hint: "Focus on technical challenges, solutions implemented, and model performance.",
      type: "behavioral"
    },
    {
      question: "How do you handle model drift and continuous learning?",
      hint: "Discuss monitoring strategies, retraining procedures, and model updates.",
      type: "technical"
    },
    {
      question: "What is your approach to ML model interpretability and explainability?",
      hint: "Cover LIME, SHAP, and other explainability techniques.",
      type: "technical"
    }
  ],

  'blockchain-developer': [
    {
      question: "Describe your experience with smart contract development.",
      hint: "Discuss Solidity, contract security, and deployment strategies.",
      type: "technical"
    },
    {
      question: "How do you approach blockchain security and audit practices?",
      hint: "Cover security vulnerabilities, testing methods, and audit procedures.",
      type: "technical"
    },
    {
      question: "What is your experience with different blockchain platforms?",
      hint: "Compare Ethereum, Binance Smart Chain, Polygon, and their use cases.",
      type: "technical"
    },
    {
      question: "How do you handle gas optimization in smart contracts?",
      hint: "Discuss optimization techniques, gas estimation, and cost reduction strategies.",
      type: "technical"
    },
    {
      question: "Describe a DApp (Decentralized Application) you've built.",
      hint: "Cover architecture, user experience, and integration challenges.",
      type: "behavioral"
    },
    {
      question: "What is your approach to blockchain testing and deployment?",
      hint: "Discuss testing frameworks, testnets, and deployment procedures.",
      type: "technical"
    },
    {
      question: "How do you stay updated with blockchain technology trends?",
      hint: "Mention communities, resources, and continuous learning strategies.",
      type: "behavioral"
    }
  ],

  'game-developer': [
    {
      question: "Describe your experience with game engines and development tools.",
      hint: "Discuss Unity, Unreal Engine, or other tools with specific project examples.",
      type: "technical"
    },
    {
      question: "How do you approach game optimization and performance tuning?",
      hint: "Cover frame rate optimization, memory management, and platform-specific considerations.",
      type: "technical"
    },
    {
      question: "What is your experience with game physics and graphics programming?",
      hint: "Discuss physics engines, rendering pipelines, and shader programming.",
      type: "technical"
    },
    {
      question: "How do you handle game testing and quality assurance?",
      hint: "Cover playtesting, bug tracking, and balancing gameplay mechanics.",
      type: "technical"
    },
    {
      question: "Describe a challenging game development problem you solved.",
      hint: "Focus on technical or design challenges and creative solutions.",
      type: "behavioral"
    },
    {
      question: "What is your approach to game design and player experience?",
      hint: "Discuss game mechanics, user engagement, and iterative design processes.",
      type: "behavioral"
    },
    {
      question: "How do you handle multiplayer game development and networking?",
      hint: "Cover networking protocols, synchronization, and server architecture.",
      type: "technical"
    }
  ],

  'embedded-systems-engineer': [
    {
      question: "Describe your experience with microcontroller programming.",
      hint: "Discuss specific MCUs, programming languages, and development tools used.",
      type: "technical"
    },
    {
      question: "How do you approach real-time system design and constraints?",
      hint: "Cover timing requirements, RTOS usage, and system optimization.",
      type: "technical"
    },
    {
      question: "What is your experience with hardware-software integration?",
      hint: "Discuss interface protocols, driver development, and debugging techniques.",
      type: "technical"
    },
    {
      question: "How do you handle power optimization in embedded systems?",
      hint: "Cover low-power design, sleep modes, and energy-efficient programming.",
      type: "technical"
    },
    {
      question: "Describe a complex embedded project you've worked on.",
      hint: "Focus on system requirements, challenges, and innovative solutions.",
      type: "behavioral"
    },
    {
      question: "What is your approach to embedded system testing and validation?",
      hint: "Discuss testing methodologies, simulation tools, and validation procedures.",
      type: "technical"
    },
    {
      question: "How do you handle IoT connectivity and communication protocols?",
      hint: "Cover wireless protocols, data transmission, and security considerations.",
      type: "technical"
    }
  ],

  'network-engineer': [
    {
      question: "Describe your experience with network design and architecture.",
      hint: "Cover network topologies, scalability planning, and design principles.",
      type: "technical"
    },
    {
      question: "How do you approach network troubleshooting and problem resolution?",
      hint: "Discuss diagnostic tools, methodologies, and problem-solving techniques.",
      type: "technical"
    },
    {
      question: "What is your experience with routing protocols and configuration?",
      hint: "Cover OSPF, BGP, EIGRP, and protocol selection criteria.",
      type: "technical"
    },
    {
      question: "How do you implement network security and access control?",
      hint: "Discuss firewalls, VPNs, network segmentation, and security policies.",
      type: "technical"
    },
    {
      question: "Describe a challenging network issue you resolved.",
      hint: "Use the STAR method and focus on problem analysis and resolution.",
      type: "behavioral"
    },
    {
      question: "What is your approach to network monitoring and performance optimization?",
      hint: "Cover monitoring tools, traffic analysis, and optimization strategies.",
      type: "technical"
    },
    {
      question: "How do you handle network capacity planning and scaling?",
      hint: "Discuss growth planning, bandwidth management, and infrastructure scaling.",
      type: "technical"
    }
  ],

  'solutions-architect': [
    {
      question: "Describe your approach to designing scalable system architectures.",
      hint: "Cover architectural patterns, scalability strategies, and technology selection.",
      type: "technical"
    },
    {
      question: "How do you gather and analyze technical requirements?",
      hint: "Discuss stakeholder engagement, requirement documentation, and validation.",
      type: "behavioral"
    },
    {
      question: "What is your experience with microservices vs monolithic architectures?",
      hint: "Compare approaches, discuss trade-offs, and provide decision criteria.",
      type: "technical"
    },
    {
      question: "How do you handle integration challenges in complex systems?",
      hint: "Cover API design, messaging patterns, and integration strategies.",
      type: "technical"
    },
    {
      question: "Describe a complex architecture project you've led.",
      hint: "Focus on challenges, decision-making process, and project outcomes.",
      type: "behavioral"
    },
    {
      question: "What is your approach to technology evaluation and selection?",
      hint: "Discuss evaluation criteria, proof of concepts, and decision frameworks.",
      type: "technical"
    },
    {
      question: "How do you ensure architecture documentation and knowledge transfer?",
      hint: "Cover documentation standards, communication strategies, and team enablement.",
      type: "behavioral"
    }
  ],

  'technical-lead': [
    {
      question: "How do you balance technical work with leadership responsibilities?",
      hint: "Discuss time management, delegation, and staying technically current.",
      type: "behavioral"
    },
    {
      question: "Describe your approach to code reviews and technical mentoring.",
      hint: "Cover review processes, feedback delivery, and team skill development.",
      type: "behavioral"
    },
    {
      question: "How do you handle technical debt and refactoring decisions?",
      hint: "Discuss prioritization, business impact, and technical improvement strategies.",
      type: "technical"
    },
    {
      question: "What is your experience with project planning and delivery?",
      hint: "Cover estimation, milestone planning, and risk management.",
      type: "behavioral"
    },
    {
      question: "How do you resolve technical disagreements within your team?",
      hint: "Discuss conflict resolution, decision-making processes, and team dynamics.",
      type: "behavioral"
    },
    {
      question: "Describe your approach to maintaining code quality and standards.",
      hint: "Cover coding standards, automated testing, and quality gates.",
      type: "technical"
    },
    {
      question: "How do you foster innovation and continuous improvement?",
      hint: "Discuss experimentation, learning culture, and process improvement.",
      type: "behavioral"
    }
  ],

  'software-architect': [
    {
      question: "How do you approach high-level system design and architecture?",
      hint: "Cover design principles, pattern selection, and architectural decision-making.",
      type: "technical"
    },
    {
      question: "Describe your experience with architectural patterns and when to use them.",
      hint: "Discuss MVC, MVP, MVVM, layered architecture, and pattern selection criteria.",
      type: "technical"
    },
    {
      question: "How do you ensure architecture aligns with business requirements?",
      hint: "Cover stakeholder engagement, requirement traceability, and business alignment.",
      type: "behavioral"
    },
    {
      question: "What is your approach to handling non-functional requirements?",
      hint: "Discuss performance, security, scalability, and reliability considerations.",
      type: "technical"
    },
    {
      question: "How do you evaluate and mitigate architectural risks?",
      hint: "Cover risk assessment, mitigation strategies, and contingency planning.",
      type: "technical"
    },
    {
      question: "Describe your experience with legacy system modernization.",
      hint: "Discuss migration strategies, risk management, and incremental improvement.",
      type: "behavioral"
    },
    {
      question: "How do you communicate architectural decisions to different stakeholders?",
      hint: "Cover documentation, presentation techniques, and stakeholder-specific communication.",
      type: "behavioral"
    }
  ],

  'business-analyst': [
    {
      question: "How do you gather and document business requirements?",
      hint: "Discuss stakeholder interviews, requirement elicitation techniques, and documentation standards.",
      type: "behavioral"
    },
    {
      question: "Describe your experience with process modeling and improvement.",
      hint: "Cover process mapping, gap analysis, and optimization strategies.",
      type: "technical"
    },
    {
      question: "How do you handle conflicting requirements from different stakeholders?",
      hint: "Discuss prioritization frameworks, negotiation skills, and consensus building.",
      type: "behavioral"
    },
    {
      question: "What tools do you use for business analysis and project management?",
      hint: "Cover requirements management tools, modeling software, and collaboration platforms.",
      type: "technical"
    },
    {
      question: "How do you ensure requirements traceability throughout a project?",
      hint: "Discuss traceability matrices, change management, and version control.",
      type: "technical"
    },
    {
      question: "Describe a time when you identified a significant business improvement opportunity.",
      hint: "Use the STAR method and focus on business impact and implementation.",
      type: "behavioral"
    },
    {
      question: "How do you validate that delivered solutions meet business needs?",
      hint: "Cover acceptance criteria, testing involvement, and stakeholder validation.",
      type: "technical"
    }
  ],

  'project-manager': [
    {
      question: "How do you approach project planning and scope management?",
      hint: "Discuss work breakdown structures, scope definition, and change control.",
      type: "behavioral"
    },
    {
      question: "Describe your experience with different project management methodologies.",
      hint: "Compare Agile, Waterfall, hybrid approaches, and when to use each.",
      type: "technical"
    },
    {
      question: "How do you handle project risks and issues?",
      hint: "Cover risk identification, mitigation strategies, and issue escalation.",
      type: "technical"
    },
    {
      question: "What is your approach to team management and motivation?",
      hint: "Discuss leadership styles, team dynamics, and performance management.",
      type: "behavioral"
    },
    {
      question: "How do you manage project stakeholders and communication?",
      hint: "Cover stakeholder analysis, communication plans, and meeting management.",
      type: "behavioral"
    },
    {
      question: "Describe a challenging project you successfully delivered.",
      hint: "Use the STAR method and focus on challenges, solutions, and outcomes.",
      type: "behavioral"
    },
    {
      question: "How do you track project progress and ensure timely delivery?",
      hint: "Discuss project metrics, reporting tools, and performance monitoring.",
      type: "technical"
    }
  ],

  'scrum-master': [
    {
      question: "How do you facilitate effective Scrum ceremonies?",
      hint: "Discuss daily standups, sprint planning, reviews, and retrospectives.",
      type: "behavioral"
    },
    {
      question: "Describe your approach to removing impediments for the team.",
      hint: "Cover impediment identification, escalation strategies, and problem-solving.",
      type: "behavioral"
    },
    {
      question: "How do you coach teams new to Agile practices?",
      hint: "Discuss training approaches, change management, and cultural transformation.",
      type: "behavioral"
    },
    {
      question: "What metrics do you use to track team performance and improvement?",
      hint: "Cover velocity, burn-down charts, cycle time, and other Agile metrics.",
      type: "technical"
    },
    {
      question: "How do you handle conflicts within the development team?",
      hint: "Discuss conflict resolution techniques and team dynamics.",
      type: "behavioral"
    },
    {
      question: "Describe your experience with scaling Agile in larger organizations.",
      hint: "Cover frameworks like SAFe, LeSS, or custom scaling approaches.",
      type: "technical"
    },
    {
      question: "How do you ensure continuous improvement in your teams?",
      hint: "Discuss retrospective techniques, action item tracking, and culture building.",
      type: "behavioral"
    }
  ],

  'digital-marketing-specialist': [
    {
      question: "How do you develop and execute digital marketing campaigns?",
      hint: "Cover campaign planning, channel selection, and execution strategies.",
      type: "behavioral"
    },
    {
      question: "Describe your experience with SEO and content marketing.",
      hint: "Discuss keyword research, content strategy, and organic growth techniques.",
      type: "technical"
    },
    {
      question: "How do you measure and optimize marketing campaign performance?",
      hint: "Cover KPIs, analytics tools, and optimization strategies.",
      type: "technical"
    },
    {
      question: "What is your approach to social media marketing?",
      hint: "Discuss platform strategies, content creation, and community engagement.",
      type: "technical"
    },
    {
      question: "How do you handle marketing automation and lead nurturing?",
      hint: "Cover automation tools, funnel optimization, and customer journey mapping.",
      type: "technical"
    },
    {
      question: "Describe a successful marketing campaign you've managed.",
      hint: "Use specific metrics and explain the campaign's business impact.",
      type: "behavioral"
    },
    {
      question: "How do you stay updated with digital marketing trends?",
      hint: "Mention resources, experimentation, and continuous learning strategies.",
      type: "behavioral"
    }
  ],

  'sales-representative': [
    {
      question: "How do you approach prospecting and lead generation?",
      hint: "Discuss research techniques, outreach strategies, and qualification methods.",
      type: "behavioral"
    },
    {
      question: "Describe your sales process from initial contact to closing.",
      hint: "Cover discovery, presentation, objection handling, and closing techniques.",
      type: "behavioral"
    },
    {
      question: "How do you handle customer objections and rejections?",
      hint: "Discuss objection handling techniques and maintaining positive relationships.",
      type: "behavioral"
    },
    {
      question: "What CRM tools and sales technologies do you use?",
      hint: "Cover CRM usage, sales automation, and performance tracking tools.",
      type: "technical"
    },
    {
      question: "How do you maintain long-term customer relationships?",
      hint: "Discuss follow-up strategies, customer success, and account management.",
      type: "behavioral"
    },
    {
      question: "Describe your most challenging sale and how you closed it.",
      hint: "Use the STAR method and focus on problem-solving and persistence.",
      type: "behavioral"
    },
    {
      question: "How do you stay motivated and manage your sales pipeline?",
      hint: "Discuss goal setting, time management, and performance tracking.",
      type: "behavioral"
    }
  ],

  'customer-success-manager': [
    {
      question: "How do you onboard new customers for long-term success?",
      hint: "Cover onboarding processes, expectation setting, and success metrics.",
      type: "behavioral"
    },
    {
      question: "Describe your approach to identifying and preventing customer churn.",
      hint: "Discuss churn indicators, proactive outreach, and retention strategies.",
      type: "technical"
    },
    {
      question: "How do you measure customer satisfaction and success?",
      hint: "Cover NPS, CSAT, usage metrics, and success milestones.",
      type: "technical"
    },
    {
      question: "What is your process for handling customer escalations?",
      hint: "Discuss escalation procedures, communication, and resolution strategies.",
      type: "behavioral"
    },
    {
      question: "How do you identify upselling and expansion opportunities?",
      hint: "Cover usage analysis, customer needs assessment, and growth strategies.",
      type: "behavioral"
    },
    {
      question: "Describe a time when you turned around a dissatisfied customer.",
      hint: "Use the STAR method and focus on problem-solving and relationship building.",
      type: "behavioral"
    },
    {
      question: "How do you collaborate with sales and product teams?",
      hint: "Discuss cross-functional collaboration and customer advocacy.",
      type: "behavioral"
    }
  ],

  'hr-generalist': [
    {
      question: "How do you approach talent acquisition and recruitment?",
      hint: "Cover sourcing strategies, interview processes, and candidate evaluation.",
      type: "behavioral"
    },
    {
      question: "Describe your experience with employee onboarding and development.",
      hint: "Discuss onboarding programs, training initiatives, and career development.",
      type: "behavioral"
    },
    {
      question: "How do you handle employee relations and conflict resolution?",
      hint: "Cover mediation techniques, policy enforcement, and workplace culture.",
      type: "behavioral"
    },
    {
      question: "What is your approach to performance management?",
      hint: "Discuss performance reviews, goal setting, and improvement plans.",
      type: "technical"
    },
    {
      question: "How do you ensure compliance with employment laws and regulations?",
      hint: "Cover legal requirements, policy development, and risk management.",
      type: "technical"
    },
    {
      question: "Describe your experience with compensation and benefits administration.",
      hint: "Discuss salary benchmarking, benefits programs, and equity considerations.",
      type: "technical"
    },
    {
      question: "How do you promote diversity, equity, and inclusion in the workplace?",
      hint: "Cover DEI initiatives, bias training, and inclusive hiring practices.",
      type: "behavioral"
    }
  ],

  'financial-analyst': [
    {
      question: "How do you approach financial modeling and analysis?",
      hint: "Cover modeling techniques, assumption validation, and scenario analysis.",
      type: "technical"
    },
    {
      question: "Describe your experience with budgeting and forecasting.",
      hint: "Discuss budgeting processes, variance analysis, and forecast accuracy.",
      type: "technical"
    },
    {
      question: "How do you evaluate investment opportunities and business cases?",
      hint: "Cover DCF analysis, ROI calculations, and risk assessment.",
      type: "technical"
    },
    {
      question: "What financial tools and software do you use?",
      hint: "Discuss Excel, financial software, and data analysis tools.",
      type: "technical"
    },
    {
      question: "How do you communicate financial insights to non-financial stakeholders?",
      hint: "Cover data visualization, storytelling, and presentation techniques.",
      type: "behavioral"
    },
    {
      question: "Describe a time when your analysis influenced a major business decision.",
      hint: "Use the STAR method and focus on business impact.",
      type: "behavioral"
    },
    {
      question: "How do you ensure accuracy and reliability in your financial reports?",
      hint: "Discuss validation techniques, quality checks, and documentation.",
      type: "technical"
    }
  ],

  'operations-manager': [
    {
      question: "How do you approach process optimization and efficiency improvement?",
      hint: "Cover process mapping, bottleneck analysis, and improvement methodologies.",
      type: "technical"
    },
    {
      question: "Describe your experience with supply chain and vendor management.",
      hint: "Discuss supplier relationships, contract negotiation, and performance monitoring.",
      type: "behavioral"
    },
    {
      question: "How do you manage operational budgets and cost control?",
      hint: "Cover budget planning, expense tracking, and cost reduction strategies.",
      type: "technical"
    },
    {
      question: "What is your approach to quality management and continuous improvement?",
      hint: "Discuss quality standards, process improvement, and team training.",
      type: "technical"
    },
    {
      question: "How do you handle operational crises and business continuity?",
      hint: "Cover crisis management, contingency planning, and recovery procedures.",
      type: "behavioral"
    },
    {
      question: "Describe your experience with team management and performance optimization.",
      hint: "Discuss leadership style, team development, and performance metrics.",
      type: "behavioral"
    },
    {
      question: "How do you implement new systems and processes?",
      hint: "Cover change management, training programs, and implementation strategies.",
      type: "behavioral"
    }
  ]
};

export default fallbackQuestions;