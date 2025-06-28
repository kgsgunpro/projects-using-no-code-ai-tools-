export interface Question {
  id: string
  text: string
  type: 'direct' | 'behavioral' | 'technical'
  correctAnswer?: string
  keyPoints?: string[]
}

export interface JobRole {
  id: string
  title: string
  description: string
  questions: Question[]
}

export const jobRoles: JobRole[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Technical questions for software development roles',
    questions: [
      {
        id: 'se-1',
        text: 'Tell me about yourself and your background in software development.',
        type: 'behavioral',
        keyPoints: [
          'Professional background and experience',
          'Technical skills and expertise',
          'Career goals and motivation',
          'Relevant projects or achievements'
        ]
      },
      {
        id: 'se-2',
        text: 'What is the difference between == and === in JavaScript?',
        type: 'direct',
        correctAnswer: '== performs type coercion and compares values after converting them to the same type, while === performs strict equality comparison without type conversion. For example, "5" == 5 returns true, but "5" === 5 returns false because one is a string and the other is a number.'
      },
      {
        id: 'se-3',
        text: 'Describe a challenging technical problem you solved recently.',
        type: 'behavioral',
        keyPoints: [
          'Clear problem description',
          'Your approach and methodology',
          'Technical solutions implemented',
          'Results and lessons learned'
        ]
      },
      {
        id: 'se-4',
        text: 'What is the time complexity of binary search?',
        type: 'direct',
        correctAnswer: 'The time complexity of binary search is O(log n), where n is the number of elements in the sorted array. This is because with each comparison, we eliminate half of the remaining elements, leading to a logarithmic number of operations.'
      },
      {
        id: 'se-5',
        text: 'How do you approach debugging a complex issue in production?',
        type: 'behavioral',
        keyPoints: [
          'Systematic debugging approach',
          'Use of logging and monitoring tools',
          'Reproduction strategies',
          'Communication with team and stakeholders'
        ]
      },
      {
        id: 'se-6',
        text: 'What is the difference between SQL INNER JOIN and LEFT JOIN?',
        type: 'direct',
        correctAnswer: 'INNER JOIN returns only the rows that have matching values in both tables, while LEFT JOIN returns all rows from the left table and the matched rows from the right table. If there is no match, NULL values are returned for columns from the right table.'
      },
      {
        id: 'se-7',
        text: 'Explain the difference between object-oriented and functional programming.',
        type: 'technical',
        keyPoints: [
          'Core principles of each paradigm',
          'Examples and use cases',
          'Advantages and disadvantages',
          'When to use each approach'
        ]
      },
      {
        id: 'se-8',
        text: 'What is a REST API and what are its principles?',
        type: 'direct',
        correctAnswer: 'REST (Representational State Transfer) is an architectural style for designing web services. Its key principles include: 1) Stateless communication, 2) Client-server architecture, 3) Cacheable responses, 4) Uniform interface using HTTP methods (GET, POST, PUT, DELETE), 5) Layered system, and 6) Code on demand (optional).'
      },
      {
        id: 'se-9',
        text: 'How do you ensure code quality in your projects?',
        type: 'behavioral',
        keyPoints: [
          'Code review processes',
          'Testing strategies (unit, integration, e2e)',
          'Coding standards and linting',
          'Documentation practices'
        ]
      },
      {
        id: 'se-10',
        text: 'What is the difference between synchronous and asynchronous programming?',
        type: 'direct',
        correctAnswer: 'Synchronous programming executes code sequentially, blocking execution until each operation completes. Asynchronous programming allows code to continue executing while waiting for operations to complete, using callbacks, promises, or async/await. Async programming is essential for handling I/O operations without blocking the main thread.'
      }
    ]
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Strategic and leadership questions for product roles',
    questions: [
      {
        id: 'pm-1',
        text: 'How do you prioritize features in a product roadmap?',
        type: 'behavioral',
        keyPoints: [
          'Prioritization frameworks used',
          'Stakeholder input consideration',
          'Data-driven decision making',
          'Business impact assessment'
        ]
      },
      {
        id: 'pm-2',
        text: 'What is the difference between a product manager and a project manager?',
        type: 'direct',
        correctAnswer: 'A product manager focuses on the "what" and "why" - defining product strategy, features, and user needs. They own the product vision and roadmap. A project manager focuses on the "how" and "when" - managing timelines, resources, and execution. Product managers are strategic, while project managers are tactical.'
      },
      {
        id: 'pm-3',
        text: 'Describe a product you launched from conception to market.',
        type: 'behavioral',
        keyPoints: [
          'Market research and validation',
          'Product development process',
          'Go-to-market strategy',
          'Results and metrics achieved'
        ]
      },
      {
        id: 'pm-4',
        text: 'What are the key metrics for measuring product-market fit?',
        type: 'direct',
        correctAnswer: 'Key metrics for product-market fit include: 1) Net Promoter Score (NPS) above 50, 2) High user retention rates (40%+ for consumer products), 3) Strong organic growth and word-of-mouth, 4) Users expressing disappointment if the product disappeared (40%+ threshold), 5) Consistent revenue growth, and 6) Low customer acquisition cost relative to lifetime value.'
      },
      {
        id: 'pm-5',
        text: 'How do you gather and incorporate user feedback?',
        type: 'behavioral',
        keyPoints: [
          'Feedback collection methods',
          'User research techniques',
          'Analysis and prioritization process',
          'Implementation and follow-up'
        ]
      },
      {
        id: 'pm-6',
        text: 'What is an MVP and why is it important?',
        type: 'direct',
        correctAnswer: 'MVP (Minimum Viable Product) is the simplest version of a product that delivers core value to users and allows for learning. It\'s important because it: 1) Validates assumptions with minimal investment, 2) Enables faster time-to-market, 3) Provides early user feedback, 4) Reduces development risk, and 5) Helps iterate based on real user data.'
      },
      {
        id: 'pm-7',
        text: 'Tell me about a time you had to pivot a product strategy.',
        type: 'behavioral',
        keyPoints: [
          'Reasons for the pivot',
          'Data and insights that drove the decision',
          'Stakeholder communication',
          'Execution and results'
        ]
      },
      {
        id: 'pm-8',
        text: 'What is the difference between leading and lagging indicators?',
        type: 'direct',
        correctAnswer: 'Leading indicators are predictive metrics that help forecast future performance (e.g., user engagement, feature adoption, pipeline metrics). Lagging indicators are outcome-based metrics that show results after they\'ve occurred (e.g., revenue, customer satisfaction, market share). Leading indicators help you course-correct, while lagging indicators measure success.'
      },
      {
        id: 'pm-9',
        text: 'How do you work with engineering teams to deliver products?',
        type: 'behavioral',
        keyPoints: [
          'Communication and collaboration methods',
          'Requirements gathering and documentation',
          'Agile/Scrum processes',
          'Conflict resolution and alignment'
        ]
      },
      {
        id: 'pm-10',
        text: 'What frameworks do you use for product decision making?',
        type: 'behavioral',
        keyPoints: [
          'Specific frameworks mentioned (RICE, ICE, Kano, etc.)',
          'How frameworks are applied',
          'Adaptation to different situations',
          'Results and effectiveness'
        ]
      }
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analytics and machine learning focused questions',
    questions: [
      {
        id: 'ds-1',
        text: 'Explain your approach to a new data science project.',
        type: 'behavioral',
        keyPoints: [
          'Problem definition and scoping',
          'Data exploration and understanding',
          'Methodology selection',
          'Validation and deployment strategy'
        ]
      },
      {
        id: 'ds-2',
        text: 'What is the difference between Type I and Type II errors?',
        type: 'direct',
        correctAnswer: 'Type I error (false positive) occurs when we reject a true null hypothesis - concluding there is an effect when there isn\'t one. Type II error (false negative) occurs when we fail to reject a false null hypothesis - missing a real effect. Type I error rate is controlled by the significance level (α), while Type II error rate is β, and power = 1-β.'
      },
      {
        id: 'ds-3',
        text: 'How do you handle missing or inconsistent data?',
        type: 'behavioral',
        keyPoints: [
          'Data quality assessment methods',
          'Missing data handling strategies',
          'Data cleaning and preprocessing',
          'Impact on analysis and modeling'
        ]
      },
      {
        id: 'ds-4',
        text: 'What is the difference between supervised and unsupervised learning?',
        type: 'direct',
        correctAnswer: 'Supervised learning uses labeled training data to learn a mapping from inputs to outputs (e.g., classification, regression). Examples include linear regression, decision trees, and neural networks. Unsupervised learning finds patterns in data without labeled examples (e.g., clustering, dimensionality reduction). Examples include k-means clustering, PCA, and association rules.'
      },
      {
        id: 'ds-5',
        text: 'What statistical methods do you use most frequently?',
        type: 'behavioral',
        keyPoints: [
          'Specific statistical techniques',
          'Use cases and applications',
          'Tools and implementation',
          'Results interpretation'
        ]
      },
      {
        id: 'ds-6',
        text: 'What is overfitting and how do you prevent it?',
        type: 'direct',
        correctAnswer: 'Overfitting occurs when a model learns the training data too well, including noise, leading to poor generalization on new data. Prevention methods include: 1) Cross-validation, 2) Regularization (L1/L2), 3) Early stopping, 4) Dropout in neural networks, 5) Reducing model complexity, 6) Increasing training data, and 7) Feature selection.'
      },
      {
        id: 'ds-7',
        text: 'How do you validate the performance of a machine learning model?',
        type: 'behavioral',
        keyPoints: [
          'Validation techniques used',
          'Metrics selection and interpretation',
          'Cross-validation strategies',
          'Business impact assessment'
        ]
      },
      {
        id: 'ds-8',
        text: 'What is the Central Limit Theorem?',
        type: 'direct',
        correctAnswer: 'The Central Limit Theorem states that the sampling distribution of the sample mean approaches a normal distribution as the sample size increases, regardless of the population\'s distribution shape. This occurs when n ≥ 30 (rule of thumb). The mean of the sampling distribution equals the population mean, and the standard error equals σ/√n.'
      },
      {
        id: 'ds-9',
        text: 'Tell me about a complex analysis you performed recently.',
        type: 'behavioral',
        keyPoints: [
          'Problem complexity and scope',
          'Analytical approach and methods',
          'Challenges and solutions',
          'Impact and insights generated'
        ]
      },
      {
        id: 'ds-10',
        text: 'What is the difference between correlation and causation?',
        type: 'direct',
        correctAnswer: 'Correlation measures the statistical relationship between two variables - they change together but one doesn\'t necessarily cause the other. Causation means one variable directly influences another. Correlation doesn\'t imply causation due to confounding variables, reverse causation, or coincidence. Establishing causation requires controlled experiments, temporal precedence, and ruling out alternative explanations.'
      }
    ]
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    description: 'Strategic marketing and campaign management questions',
    questions: [
      {
        id: 'mm-1',
        text: 'How do you develop a marketing strategy for a new product?',
        type: 'behavioral',
        keyPoints: [
          'Market research and analysis',
          'Target audience identification',
          'Positioning and messaging',
          'Channel selection and budget allocation'
        ]
      },
      {
        id: 'mm-2',
        text: 'What is the difference between B2B and B2C marketing?',
        type: 'direct',
        correctAnswer: 'B2B marketing targets businesses with longer sales cycles, multiple decision-makers, rational purchasing decisions, and relationship-focused approaches. B2C marketing targets individual consumers with shorter sales cycles, emotional purchasing decisions, and broader reach strategies. B2B uses LinkedIn, trade shows, and content marketing, while B2C uses social media, advertising, and influencer marketing.'
      },
      {
        id: 'mm-3',
        text: 'Describe a successful marketing campaign you led.',
        type: 'behavioral',
        keyPoints: [
          'Campaign objectives and strategy',
          'Target audience and messaging',
          'Channels and tactics used',
          'Results and ROI achieved'
        ]
      },
      {
        id: 'mm-4',
        text: 'What are the 4 Ps of marketing?',
        type: 'direct',
        correctAnswer: 'The 4 Ps of marketing are: 1) Product - what you\'re selling (features, benefits, quality), 2) Price - how much you charge (pricing strategy, discounts), 3) Place - where you sell (distribution channels, locations), and 4) Promotion - how you communicate (advertising, PR, sales promotion). These form the marketing mix foundation.'
      },
      {
        id: 'mm-5',
        text: 'How do you measure the ROI of marketing activities?',
        type: 'behavioral',
        keyPoints: [
          'ROI calculation methods',
          'Attribution modeling',
          'Key metrics and KPIs',
          'Tools and tracking systems'
        ]
      },
      {
        id: 'mm-6',
        text: 'What is Customer Lifetime Value (CLV) and why is it important?',
        type: 'direct',
        correctAnswer: 'Customer Lifetime Value (CLV) is the total revenue a business can expect from a customer throughout their relationship. It\'s calculated as: Average Purchase Value × Purchase Frequency × Customer Lifespan. CLV is important because it: 1) Guides customer acquisition spending, 2) Helps prioritize customer segments, 3) Informs retention strategies, and 4) Measures long-term business health.'
      },
      {
        id: 'mm-7',
        text: 'What digital marketing channels do you find most effective?',
        type: 'behavioral',
        keyPoints: [
          'Channel performance analysis',
          'Target audience alignment',
          'Budget allocation rationale',
          'Measurement and optimization'
        ]
      },
      {
        id: 'mm-8',
        text: 'What is the difference between reach and impressions?',
        type: 'direct',
        correctAnswer: 'Reach is the total number of unique people who see your content or advertisement. Impressions are the total number of times your content is displayed, regardless of whether it\'s clicked or not. One person can generate multiple impressions by seeing the same ad several times. Reach measures audience size, while impressions measure exposure frequency.'
      },
      {
        id: 'mm-9',
        text: 'How do you segment and target different customer groups?',
        type: 'behavioral',
        keyPoints: [
          'Segmentation criteria and methods',
          'Data sources and analysis',
          'Targeting strategies',
          'Personalization approaches'
        ]
      },
      {
        id: 'mm-10',
        text: 'Tell me about a marketing campaign that didn\'t perform well.',
        type: 'behavioral',
        keyPoints: [
          'Campaign details and expectations',
          'What went wrong and why',
          'Lessons learned',
          'How you applied learnings to future campaigns'
        ]
      }
    ]
  }
]

export function getRandomQuestion(roleId: string, excludeQuestions: string[] = []): Question {
  const role = jobRoles.find(r => r.id === roleId)
  if (!role) {
    return {
      id: 'default-1',
      text: 'Tell me about yourself.',
      type: 'behavioral',
      keyPoints: ['Professional background', 'Key achievements', 'Career goals', 'Relevant skills']
    }
  }
  
  const availableQuestions = role.questions.filter(q => !excludeQuestions.includes(q.text))
  if (availableQuestions.length === 0) {
    return role.questions[Math.floor(Math.random() * role.questions.length)]
  }
  
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
}