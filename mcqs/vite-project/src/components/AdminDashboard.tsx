import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TABLES } from '../constants/supabase';
import './AdminDashboard.css';

// Import questions from QuestionForm
import { sections, Question } from './QuestionForm';

interface Result {
  id: string;
  user_id: string;
  start_at: string;
  completed_at: string | null;
  answers: Array<{
    questionId: number;
    answer: string;
  }>;
  user: {
    email: string;
    name: string;
    phone_number: string;
  };
}

export function AdminDashboard() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.RESULTS)
        .select(`*`)
        .order('start_at', { ascending: false });

      if (error) throw error;

      const resultsWithUserData = await Promise.all(
        data.map(async (result) => {
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(result.user_id);
          if (userError) throw userError;
          
          return {
            ...result,
            user: {
              email: userData.user.email,
              name: userData.user.user_metadata.name,
              phone_number: userData.user.user_metadata.phone_number
            }
          };
        })
      );

      setResults(resultsWithUserData);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    // format date to dd/mm/yyyy i want only date not time
    return new Date(dateString).toLocaleDateString();
  };

  const calculateTimeTaken = (start: string, end: string | null) => {
    if (!end) return 'In Progress';
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diff = endTime - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getQuestionById = (id: number): Question | undefined => {
    const allQuestions = Object.values(sections).flat();
    return allQuestions.find(q => q.id === id);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Submissions</h3>
          <p>{results.length}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Tests</h3>
          <p>{results.filter(r => r.completed_at).length}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{results.filter(r => !r.completed_at).length}</p>
        </div>
      </div>

      <div className="results-container">
        <div className="results-list">
          <h2>Student Results</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Time Taken</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.user?.name || 'N/A'}</td>
                    <td>{result.user?.email}</td>
                    <td>{formatDate(result.start_at)}</td>
                    <td>
                      <span className={`status-badge ${result.completed_at ? 'completed' : 'in-progress'}`}>
                        {result.completed_at ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td>{calculateTimeTaken(result.start_at, result.completed_at)}</td>
                    <td>
                      <button 
                        onClick={() => setSelectedResult(result)}
                        className="view-details-btn"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedResult && (
          <div className="result-details">
            <h2>Submission Details</h2>
            <div className="student-info">
              <h3>Student Information</h3>
              <p><strong>Name:</strong> {selectedResult.user?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedResult.user?.email}</p>
              <p><strong>Phone:</strong> {selectedResult.user?.phone_number || 'N/A'}</p>
            </div>
            <div className="test-info">
              <h3>Test Information</h3>
              <p><strong>Start Time:</strong> {formatDate(selectedResult.start_at)}</p>
              <p><strong>Completion Time:</strong> {selectedResult.completed_at ? formatDate(selectedResult.completed_at) : 'In Progress'}</p>
              <p><strong>Time Taken:</strong> {calculateTimeTaken(selectedResult.start_at, selectedResult.completed_at)}</p>
            </div>
            <div className="answers-section">
              <h3>Questions and Answers</h3>
              <div className="qa-container">
                {selectedResult.answers.map((answer, index) => {
                  const question = getQuestionById(answer.questionId);
                  return (
                    <div key={index} className="qa-pair" style={{
                        overflowY: 'scroll',
                        height: '44rem'
                        
                        
                    }}>
                      <div className="question-container">
                        <h4>Question {answer.questionId}:</h4>
                        {question ? (
                          <div dangerouslySetInnerHTML={{ __html: question.text }} />
                        ) : (
                          <p>Question not found</p>
                        )}
                      </div>
                      <div className="answer-container">
                        <h4>Answer:</h4>
                        <pre style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word', textAlign: 'left'}}>{answer.answer}</pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button 
              onClick={() => setSelectedResult(null)}
              className="close-details-btn"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 