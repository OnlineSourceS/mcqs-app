import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { TABLES } from '../constants/supabase'

 

interface Answer {
  questionId: number
  answer: string
}

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

export function QuestionForm() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(-1)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 2,
    minutes: 0,
    seconds: 0
  })
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)
  const [currentSection, setCurrentSection] = useState<string>('')

  // Questions organized by sections
  const sections = {
    'Section 1: Programming and Problem Solving (20 minutes)': [
      { id: 1, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Write a function that takes an array of integers and returns the pair of integers whose sum is closest to zero. If there are multiple pairs with the same closest sum, return any one of them.
        </div>
        <div class="example-section" style="text-align: left;">
          <h4>Example:</h4>
          <div class="code-block">
            <strong>Input:</strong> [1, 4, -3, -1, 5, 9]<br/>
            <strong>Output:</strong> [1, -1]
          </div>
        </div>
      </div>`, section: 'Section 1: Programming and Problem Solving (20 minutes)', recommendedTime: '20 minutes' },
      { id: 2, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Write a function that checks if two strings are anagrams of each other, ignoring spaces and case sensitivity.
        </div>
        <div class="example-section" style="text-align: left;">
          <h4>Example:</h4>
          <div class="code-block" style="text-align: left;">
            <strong>Input:</strong> "Listen", "Silent"<br/>
            <strong>Output:</strong> true<br/>
            <strong>Input:</strong> "Hello", "World"<br/>
            <strong>Output:</strong> false
          </div>
        </div>
      </div>`, section: 'Section 1: Programming and Problem Solving (20 minutes)', recommendedTime: '20 minutes' }
    ],
    'Section 2: Object-Oriented Programming (15 minutes)': [
      { id: 3, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Design a simple Library Management System using OOP principles. Your system should include the following classes:
          <ul style="text-align: left; padding-left: 20px;">
            <li>Book</li>
            <li>Author</li>
            <li>Library</li>
            <li>User</li>
          </ul>
The system aims to have functionality for:
          <ul style="text-align: left; padding-left: 20px;">
            <li>Adding books to the library</li>
            <li>Checking out books</li>
            <li>Returning books</li>
            <li>Searching for books by title or author</li>
          </ul>
Draw a class diagram to capture the relationships
Write function signatures that would be present for each class. (you do not need to write the whole logic) <br/> <br/>
Ensure proper encapsulation, inheritance (where appropriate), and demonstrate polymorphism.
        </div>
      </div>`, section: 'Section 2: Object-Oriented Programming (15 minutes)', recommendedTime: '15 minutes' },
      { id: 4, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Explain the Singleton design pattern. Discuss one scenario where using a Singleton would be appropriate and one scenario where it should be avoided.
        </div>
      </div>`, section: 'Section 2: Object-Oriented Programming (15 minutes)', recommendedTime: '15 minutes' }
    ],
    'Section 3: Database (20 minutes)': [
      { id: 5, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Given the following database schema:
        </div> <br/>
        <div class="example-section">
          <div class="code-block" style="text-align: left;">
            <strong>Employees</strong>
            <ul style="text-align: left; padding-left: 20px;">
              <li>id (INT, Primary Key)</li>
              <li>name (VARCHAR)</li>
              <li>department_id (INT, Foreign Key)</li>
              <li>salary (DECIMAL)</li>
              <li>hire_date (DATE)</li>
              <li>manager_id (INT, Foreign Key referencing id)</li>
            </ul>
            <strong>Departments</strong>
            <ul style="text-align: left; padding-left: 20px;">
              <li>id (INT, Primary Key)</li>
              <li>name (VARCHAR)</li>
              <li>location (VARCHAR)</li>
              <li>budget (DECIMAL)</li>
            </ul>
            <strong>Projects</strong>
            <ul style="text-align: left; padding-left: 20px;">
              <li>id (INT, Primary Key)</li>
              <li>name (VARCHAR)</li>
              <li>start_date (DATE)</li>
              <li>end_date (DATE)</li>
              <li>department_id (INT, Foreign Key)</li>
            </ul>
            <strong>EmployeeProjects</strong>
            <ul style="text-align: left; padding-left: 20px;">
              <li>employee_id (INT, Foreign Key)</li>
              <li>project_id (INT, Foreign Key)</li>
              <li>hours_worked (INT)</li>
              <li>role (VARCHAR)</li>
            </ul>
          </div>
          <h4 style="text-align: left;">Write SQL queries for:</h4>
          <ol type="a" style="text-align: left; padding-left: 20px;">
            <li>Find all employees in the "Engineering" department sorted by their salary in descending order.</li>
            <li>List all projects along with the total number of employees assigned to each project.</li>
            <li>Find the department with the highest average salary.</li>
          </ol>
        </div>
      </div>`, section: 'Section 3: Database (20 minutes)', recommendedTime: '20 minutes' },
      { id: 6, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Design a database schema for an e-commerce platform with the following requirements:
        </div>
        <div class="example-section">
          <ul style="text-align: left; padding-left: 20px;">
            <li>Users can create accounts and place orders</li>
            <li>Products belong to multiple categories</li>
            <li>Orders contain multiple products with quantities</li>
            <li>Users can leave reviews for products they've purchased</li>
            <li>Products have inventory tracking</li>
          </ul>
            Draw the ER diagram and write the CREATE TABLE statements with proper constraints
        </div>
      </div>`, section: 'Section 3: Database (20 minutes)', recommendedTime: '20 minutes' }
    ],
    'Section 4: Networking and Web (20 minutes)': [
      { id: 7, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Explain the following concepts:
        </div>
        <div class="example-section">
          <ul style="text-align: left; padding-left: 20px;">
            <li>Difference between HTTP methods GET, POST, PUT, and DELETE</li>
            <li>RESTful API design principles</li>
            <li>HTTP status codes and their meanings</li>
            <li>Web cookies and their purpose</li>
          </ul>
        </div>
      </div>`, section: 'Section 4: Networking and Web (20 minutes)', recommendedTime: '20 minutes' },
      { id: 8, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Answer the following questions briefly:
        </div>
        <div class="example-section">
          <ol type="a" style="text-align: left; padding-left: 20px;">
            <li>What are the differences between TCP and UDP protocols? When would you use one over the other?</li>
            <li>Describe the process of DNS resolution from typing a URL in a browser to loading the webpage.</li>
            <li>What is HTTPS? How does it differ from HTTP in terms of security?</li>
          </ol>
        </div>
      </div>`, section: 'Section 4: Networking and Web (20 minutes)', recommendedTime: '20 minutes' }
    ],
    'Section 5: Software Engineering Principles (15 minutes)': [
      { id: 9, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Write unit tests for the following function using any testing framework of your choice:
        </div>
        <div class="example-section">
          <div class="code-block" style="text-align: left;">
            <pre><code>function calculateDiscount(purchaseAmount, membershipLevel) {
  if (membershipLevel === 'gold') {
    return purchaseAmount * 0.15;
  } else if (membershipLevel === 'silver') {
    return purchaseAmount * 0.10;
  } else if (membershipLevel === 'bronze') {
    return purchaseAmount * 0.05;
  } else {
    return 0;
  }
}</code></pre>
            Write test cases that cover all possible scenarios and edge cases. You can write pseudo code.
      </div>`, section: 'Section 5: Software Engineering Principles (15 minutes)', recommendedTime: '15 minutes' },
      { id: 10, text: `<div class="question-container">
        <div class="question-description">
          <ol style="text-align: left; padding-left: 20px;">
            <li>What is a Git branch and how would you use branching in a team development environment?</li>
            <li>What are some DevOps practices that can improve the software development process?</li>
          </ol>
        </div>
      </div>`, section: 'Section 5: Software Engineering Principles (15 minutes)', recommendedTime: '15 minutes' }
    ],
    'Section 6: Practical Implementation (30 minutes)': [
      { id: 11, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Implement a simple task management application with the following features:
        </div>
        <div class="example-section" style="text-align: left;">
          <ul style="text-align: left; padding-left: 20px;">
            <li>Display a list of tasks (title, description, due date, status)</li>
            <li>Add a new task</li>
            <li>Mark a task as complete</li>
            <li>Delete a task</li>
          </ul>
          You can choose any of the following technology stacks:
          <ol style="text-align: left; padding-left: 20px;">
            <li>Frontend: HTML, CSS, JavaScript (vanilla or with a framework) Backend: RESTful API using language of your choice</li>
            <li>Console-based application in your language of choice with file-based storage</li>
          </ol>
          <h4>Data for tasks.json:</h4>
          <div class="code-block" style="text-align: left;">
            <pre><code>[
  {
    "id": 1,
    "title": "Complete project proposal",
    "description": "Draft the proposal for the new client project",
    "dueDate": "2025-05-10",
    "completed": false
  },
  {
    "id": 2,
    "title": "Review pull requests",
    "description": "Review and merge team pull requests",
    "dueDate": "2025-04-30",
    "completed": true
  },
  {
    "id": 3,
    "title": "Update documentation",
    "description": "Update API documentation with new endpoints",
    "dueDate": "2025-05-05",
    "completed": false
  },
  {
    "id": 4,
    "title": "Fix login bug",
    "description": "Address the authentication issue reported by QA",
    "dueDate": "2025-04-29",
    "completed": false
  }
]</code></pre>
          </div>
          Focus on code quality, organization, and proper implementation of software design principles.
        </div>
      </div>`, section: 'Section 6: Practical Implementation (30 minutes)', recommendedTime: '30 minutes' }
    ],
    'Bonus Question (Optional)': [
      { id: 12, text: `<div class="question-container">
        <div class="question-description" style="text-align: left;">
          Explain the concept of memory leaks, how they occur in different programming languages, and strategies to prevent them. Provide a small code example in your preferred language that demonstrates a potential memory leak and how to fix it.
        </div>
      </div>`, section: 'Bonus Question (Optional)', recommendedTime: '20 minutes' }
    ]
  }



  const allQuestions = Object.values(sections).flat()

  // Load answers from localStorage when component mounts
  useEffect(() => {
    const savedAnswers = localStorage.getItem('assessmentAnswers')
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [])

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if(answers.length > 0) {
      localStorage.setItem('assessmentAnswers', JSON.stringify(answers))
    }
  }, [answers])

  // Load current answer from localStorage when question changes
  useEffect(() => {
    if (currentStep >= 0 && currentStep < allQuestions.length) {
      const savedAnswer = answers.find(a => a.questionId === allQuestions[currentStep].id)
      setCurrentAnswer(savedAnswer?.answer || '')
    }
  }, [currentStep, answers])

  useEffect(() => {
    if (timerStarted) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime.seconds > 0) {
            return { ...prevTime, seconds: prevTime.seconds - 1 }
          }
          if (prevTime.minutes > 0) {
            return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 }
          }
          if (prevTime.hours > 0) {
            return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 }
          }
          clearInterval(timer)
          setIsTimeUp(true)
          return prevTime
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timerStarted])

  const handleNext = () => {
    // Save current answer if it exists
    if (currentAnswer.trim()) {
      const existingAnswerIndex = answers.findIndex(a => a.questionId === allQuestions[currentStep].id)
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const updatedAnswers = [...answers]
        updatedAnswers[existingAnswerIndex] = {
          questionId: allQuestions[currentStep].id,
          answer: currentAnswer
        }
        setAnswers(updatedAnswers)
      } else {
        // Add new answer
        setAnswers([...answers, {
          questionId: allQuestions[currentStep].id,
          answer: currentAnswer
        }])
      }
    }
    
    setCurrentStep(currentStep + 1)
    if (currentStep + 1 < allQuestions.length) {
      setCurrentSection(allQuestions[currentStep + 1].section)
    }
  }

  const handlePrevious = () => {
    // Save current answer if it exists
    if (currentAnswer.trim()) {
      const existingAnswerIndex = answers.findIndex(a => a.questionId === allQuestions[currentStep].id)
      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...answers]
        updatedAnswers[existingAnswerIndex] = {
          questionId: allQuestions[currentStep].id,
          answer: currentAnswer
        }
        setAnswers(updatedAnswers)
      } else {
        setAnswers([...answers, {
          questionId: allQuestions[currentStep].id,
          answer: currentAnswer
        }])
      }
    }

    setCurrentStep(currentStep - 1)
    setCurrentSection(allQuestions[currentStep - 1].section)
  }

  const handleSubmit = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from(TABLES.RESULTS)
        .update({
          answers: answers,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error
      // Clear localStorage after successful submission
      localStorage.removeItem('assessmentAnswers')
      
      alert('Form submitted successfully!')
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const formatTime = (time: number) => {
    return time.toString().padStart(2, '0')
  }

  const startTest = async () => {
    if (!user) return
    const { error } = await supabase.from(TABLES.RESULTS).insert({
      user_id: user.id,
      start_at: new Date().toISOString()
    })
    if (error) throw error
    setTimerStarted(true)
    setCurrentStep(0)
    setCurrentSection(allQuestions[0].section)
  }

  if (isTimeUp) {
    return (
      <div className="form-container">
        <h2>Time's Up!</h2>
        <p>Your time has expired. Please contact the administrator if you need more time.</p>
      </div>
    )
  }

  if (currentStep === -1) {
    return (
      <div className="form-container">
        <div className="instructions">
          <h2>Software Developer Technical Assessment</h2>
          <div className="timer-display">
            <span className="timer-value">{formatTime(timeLeft.hours)}</span>
            <span className="timer-separator">:</span>
            <span className="timer-value">{formatTime(timeLeft.minutes)}</span>
            <span className="timer-separator">:</span>
            <span className="timer-value">{formatTime(timeLeft.seconds)}</span>
          </div>
          <div className="instructions-content">
            <h3>Duration: 2 hours</h3>
            <h4>Instructions:</h4>
            <ul>
              <li>Complete as many questions as possible within the allotted time.</li>
              <li>There are 6 sections and 1 Bonus section. You can do them in any order, the recommended time for each section is also listed.</li>
              <li>Questions vary in difficulty and are weighted accordingly.</li>
              <li>When answering questions with code, You may use standard libraries of your preferred programming language, but no external frameworks or libraries unless specified.</li>
            </ul>
            <div className="start-test-button">
              <button onClick={startTest}>Start Test</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep >= allQuestions.length) {
    return (
      <div className="form-container">
        <div className="timer">
          <span className="timer-label">Time Remaining:</span>
          <div className="timer-display">
            <span className="timer-value">{formatTime(timeLeft.hours)}</span>
            <span className="timer-separator">:</span>
            <span className="timer-value">{formatTime(timeLeft.minutes)}</span>
            <span className="timer-separator">:</span>
            <span className="timer-value">{formatTime(timeLeft.seconds)}</span>
          </div>
        </div>
        <div className="question-section">
          <h2>Thank you for taking the test!</h2>
          {/* {answers.map((answer, index) => (
            <div key={index} className="answer-review">
              <h3>Question {index + 1}:</h3>
              <p>{allQuestions[index].text}</p>
              <p>Answer: {answer.answer}</p>
            </div>
          ))} */}
        </div>
        <div className="answer-section">
          <div className="question-navigation">
            <button onClick={() => setCurrentStep(currentStep - 1)}>Back</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="form-container">
      <div className="timer">
        <span className="timer-label">Time Remaining:</span>
        <div className="timer-display">
          <span className="timer-value">{formatTime(timeLeft.hours)}</span>
          <span className="timer-separator">:</span>
          <span className="timer-value">{formatTime(timeLeft.minutes)}</span>
          <span className="timer-separator">:</span>
          <span className="timer-value">{formatTime(timeLeft.seconds)}</span>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',  }}>

      <div className="question-section"  style={{flex: 1}}>
        <div className="section-header">
          <h2>{currentSection}</h2>
          <p className="recommended-time">Recommended Time: {allQuestions[currentStep].recommendedTime}</p>
        </div>
        <div className="question">
          {/* <h3>{allQuestions[currentStep].text}</h3> */}
          <div dangerouslySetInnerHTML={{ __html: allQuestions[currentStep].text }} />
        </div>
      </div> 
      <div className="answer-section" style={{flex: 1}}>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          style={{ width: '90%', height: '100px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}
          placeholder="Type your answer here..."
          />
        <div className="question-navigation">
          <div className="question-progress">
            Question {currentStep + 1} of {allQuestions.length}
          </div>
          <div>
            {currentStep > 0 && (
              <button onClick={handlePrevious}>Previous</button>
            )}
            <button 
              onClick={handleNext}
            >
              {currentStep === allQuestions.length - 1 ? 'Review' : 'Next'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
} 