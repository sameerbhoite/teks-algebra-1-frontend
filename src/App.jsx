import React, { useEffect, useState } from 'react';

function App() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [quiz, setQuiz] = useState([]);

  // ✅ Fetch topics from backend
  useEffect(() => {
    fetch('https://teks-algebra-1-backend.onrender.com/api/topics')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch topics');
        }
        return res.json();
      })
      .then((data) => {
        setTopics(data.topics);
      })
      .catch((err) => {
        console.error('Error fetching topics:', err);
      });
  }, []);

  // ✅ Fetch quiz for selected topic
  const getQuiz = () => {
    if (!selectedTopic) return;
    fetch(`https://teks-algebra-1-backend.onrender.com/api/generate-quiz?topic_id=${selectedTopic}`)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data.quiz);
      })
      .catch((err) => {
        console.error('Error fetching quiz:', err);
      });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>TEKS Algebra 1 Quiz Generator</h1>

      {/* ✅ Dropdown for topic selection */}
      <label htmlFor="topic-select">Select a Topic:</label>
      <select
        id="topic-select"
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
        style={{ marginLeft: '1rem' }}
      >
        <option value="">-- Choose a topic --</option>
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.title}
          </option>
        ))}
      </select>

      <br /><br />
      <button onClick={getQuiz}>Get Weekly Quiz</button>

      {/* ✅ Display quiz */}
      {quiz.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Quiz</h2>
          <ul>
            {quiz.map((q, idx) => (
              <li key={idx}>
                <strong>Q{idx + 1}:</strong> {q.question}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
