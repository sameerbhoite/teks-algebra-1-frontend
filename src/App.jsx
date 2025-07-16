import React, { useState } from 'react';
import {
  Container,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
} from '@mui/material';

export default function App() {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchQuiz() {
    setLoading(true);
    try {
      const res = await fetch(
        'https://teks-algebra-1-backend.onrender.com/api/generate-weekly-quiz'
      );
      const data = await res.json();
      setQuiz(data.quiz);
      setAnswers({});
      setResults({});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(i, value) {
    setAnswers((a) => ({ ...a, [i]: value }));
  }

  function checkAnswers() {
    const r = {};
    quiz.forEach((q, i) => {
      const ua = parseFloat(answers[i]);
      r[i] = !isNaN(ua) && Math.abs(ua - q.answer) < 0.01;
    });
    setResults(r);
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" mb={2}>
        TEKS Algebra 1 Quiz
      </Typography>
      <Button variant="contained" onClick={fetchQuiz} disabled={loading}>
        {loading ? 'Loading...' : 'Get Weekly Quiz'}
      </Button>

      {quiz.length > 0 && (
        <Button
          variant="outlined"
          onClick={checkAnswers}
          sx={{ ml: 2 }}
          disabled={loading}
        >
          Check Answers
        </Button>
      )}

      {quiz.map((q, i) => (
        <Card key={i} sx={{ mt: 2 }}>
          <CardContent>
            <Typography>
              {i + 1}. {q.question} ={' '}
              <TextField
                size="small"
                value={answers[i] || ''}
                onChange={(e) => handleChange(i, e.target.value)}
                sx={{ width: 100 }}
              />
            </Typography>
            {results[i] != null && (
              <Typography
                color={results[i] ? 'green' : 'red'}
                sx={{ display: 'inline', ml: 2 }}
              >
                {results[i] ? '✅' : `❌ (correct: ${q.answer})`}
              </Typography>
            )}
            <Typography variant="caption" display="block">
              Difficulty: {q.difficulty}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
