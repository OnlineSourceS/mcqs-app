import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { TABLES } from '../constants/supabase'

interface Question {
  id: number
  text: string
  section: string
  recommendedTime: string
}

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
      { id: 1, text: `<p>Write a function that takes an array of integers and returns the pair of integers whose sum is closest to zero. If there are multiple pairs with the same closest sum, return any one of them.</p>

        - Example:
Input: [1, 4, -3, -1, 5, 9],
Output: [1, -1]
</p>`, section: 'Section 1: Programming and Problem Solving (20 minutes)', recommendedTime: '20 minutes' },


      { id: 2, text: `<p>Write a function that checks if two strings are anagrams of each other, ignoring spaces and case sensitivity.
Example:
Input: "Listen", "Silent"
Output: true

Input: "Hello", "World"
Output: false
</p>`, section: 'Section 2: Object-Oriented Programming (15 minutes)', recommendedTime: '15 minutes' },

      { id: 3, text: `<p>Design a simple Library Management System using OOP principles. Your system should include the following classes:
Book
Author
Library
User
The system aims to have functionality for:
Adding books to the library
Checking out books
Returning books
Searching for books by title or author
Draw a class diagram to capture the relationships, write function signatures that would be present for each class. (you do not need to write the whole logic)
Ensure proper encapsulation, inheritance (where appropriate), and demonstrate polymorphism.
</p>`, section: 'Section 2: Object-Oriented Programming (15 minutes)', recommendedTime: '15 minutes' }
    ],
    'Networking': [
      { id: 4, text: 'Compare and contrast TCP and UDP protocols. When would you choose one over the other?', section: 'Networking', recommendedTime: '10 minutes' },
      { id: 5, text: 'Explain the OSI model and its layers. How does it relate to modern networking?', section: 'Networking', recommendedTime: '10 minutes' }
    ],
    'Programming Languages': [
      { id: 6, text: 'What is the difference between a compiler and an interpreter? Discuss the advantages and disadvantages of each.', section: 'Programming Languages', recommendedTime: '10 minutes' },
      { id: 7, text: 'Explain the concept of garbage collection in programming languages. How does it work in your preferred language?', section: 'Programming Languages', recommendedTime: '10 minutes' }
    ],
    'Object-Oriented Programming': [
      { id: 8, text: 'Explain the four main principles of Object-Oriented Programming with examples.', section: 'Object-Oriented Programming', recommendedTime: '15 minutes' },
      { id: 9, text: 'What is the difference between abstraction and encapsulation? Provide code examples.', section: 'Object-Oriented Programming', recommendedTime: '15 minutes' }
    ],
    'Databases': [
      { id: 10, text: 'Explain database normalization and its benefits. Provide examples of different normal forms.', section: 'Databases', recommendedTime: '15 minutes' },
      { id: 11, text: 'Compare SQL and NoSQL databases. When would you choose one over the other?', section: 'Databases', recommendedTime: '15 minutes' }
    ],
    'Software Development': [
      { id: 12, text: 'Explain the concept of version control and its importance in software development.', section: 'Software Development', recommendedTime: '10 minutes' },
      { id: 13, text: 'What is the difference between synchronous and asynchronous programming? Provide examples.', section: 'Software Development', recommendedTime: '10 minutes' }
    ],
    'Bonus': [
      { id: 14, text: 'Design a scalable system architecture for a social media platform. Consider aspects like data storage, caching, and load balancing.', section: 'Bonus', recommendedTime: '20 minutes' }
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
      <div className="question-section">
        <div className="section-header">
          <h2>{currentSection}</h2>
          <p className="recommended-time">Recommended Time: {allQuestions[currentStep].recommendedTime}</p>
        </div>
        <div className="question">
          {/* <h3>{allQuestions[currentStep].text}</h3> */}
          <div dangerouslySetInnerHTML={{ __html: allQuestions[currentStep].text }} />
        </div>
      </div>
      <div className="answer-section">
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
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
  )
} 