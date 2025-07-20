import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Replace this with your actual Render backend URL
  const BACKEND_URL = 'https://teks-algebra-1-backend.onrender.com';

  // Fetch topics when component mounts
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/topics`)
      .then((res) => res.json())
      .then((data) => setTopics(data.topics))
      .catch((err) => console.error("Error fetching topics:", err));
  }, []);

  // Fetch quiz based on selected topic
  const fetchQuiz = () => {
    if (!selectedTopic) return;

    setLoading(true);
    fetch(`${BACKEND_URL}/api/generate-weekly-quiz?topic=${selectedTopic}`)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data.quiz);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quiz:", err);
        setLoading(false);
      });
  };

  return (
    <div className="App" style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "2rem auto" }}>
      <h1>TEKS Algebra 1 Weekly Quiz</h1>

      <label htmlFor="topic-select">Select a Topic:</label>
      <select
        id="topic-select"
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
        style={{ marginLeft: "10px", padding: "5px" }}
      >
        <option value="">-- Choose a topic --</option>
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "20px" }}>
        <button onClick={fetchQuiz} disabled={!selectedTopic} style={{ padding: "10px 20px" }}>
          Get Weekly Quiz
        </button>
      </div>

      {loading && <p>Loading quiz...</p>}

      {quiz.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Quiz Questions</h2>
          <ol>
            {quiz.map((q, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {q.question}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;
