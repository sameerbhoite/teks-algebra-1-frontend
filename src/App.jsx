import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);

  // Replace this with your actual Render backend URL
  const BACKEND_URL = 'https://teks-algebra-1-backend.onrender.com';

  // Fetch topics when the app loads
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/topics`)
      .then((res) => res.json())
      .then((data) => {
        setTopics(data.topics);
      })
      .catch((err) => console.error('Error fetching topics:', err));
  }, []);

  // Fetch quiz when button is clicked
  const handleGetQuiz = () => {
    if (!selectedTopic) return;
    setLoading(true);

    fetch(`${BACKEND_URL}/api/generate-weekly-quiz?topic_id=${selectedTopic}`)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data.quiz);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching quiz:', err);
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <h1>TEKS Algebra 1 Quiz Generator</h1>

      <label htmlFor="topic">Choose a topic:</label>
      <select
        id="topic"
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
      >
        <option value="">-- Select a topic --</option>
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </select>

      <button onClick={handleGetQuiz} disabled={!selectedTopic || loading}>
        {loading ? 'Loading...' : 'Get Weekly Quiz'}
      </button>

      {quiz.length > 0 && (
        <div>
          <h2>Quiz</h2>
          <ol>
            {quiz.map((q, index) => (
              <li key={index}>
                <strong>{q.question}</strong> (Difficulty: {q.difficulty})
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;
