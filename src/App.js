import { useState, useMemo, useEffect } from "react";
import "./styles.css";
import Linear from "/src/Linear";
import { Add } from "@material-ui/icons";
import { WordPad } from "/src/WordPad";
import Header from "/src/Header";
import {
  TextField,
  Typography,
  Tooltip,
  Fab,
  Paper,
  Button,
  Chip,
  Avatar
} from "@material-ui/core";
import { mat, ubludok, weHas } from "/const";

let stressed = false;
const filteredArrs = (arr) =>
  [...new Set(arr)].sort((a, b) => b - a).slice(0, 5);

const progressPoints = {
  first: 100,
  second: 200,
  third: 500,
  forth: 1000
};

const synth = window.speechSynthesis;
const say = (msg, isWaiting) => {
  if (!isWaiting) {
    synth.cancel();
  }

  synth.speak(new SpeechSynthesisUtterance(msg));
};
const stopSpeak = () => {
  synth.cancel();
};

const setRec = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return;
  }

  localStorage.setItem("mat_leaderboard", JSON.stringify(arr));
};
const getRec = () => JSON.parse(localStorage.getItem("mat_leaderboard"));
// const cleanRec = () => localStorage.removeItem("mat_leaderboard");

export default function App() {
  const [words, setWords] = useState(mat);
  const [diagnos, setDiagnos] = useState("");
  const [items, addItem] = useState([]);
  const [score, setScore] = useState(0);
  const [records, addRecord] = useState(getRec() || []);
  const [customWord, setCustomWord] = useState("");

  useEffect(() => {
    if (score > 99 && !stressed) {
      stressed = true;
      say("Ого, даа это же стресс!");
    }
  }, [score]);

  const readThis = () => {
    if (score === progressPoints.second) {
      say(ubludok, true);
    }

    if (score === progressPoints.forth) {
      say(weHas, true);
    }

    if (
      score !== progressPoints.second &&
      score !== progressPoints.third &&
      score !== progressPoints.forth
    ) {
      say(items.join(), true);
    }

    setDiagnos(() => {
      const dia =
        score === 0
          ? ""
          : score < 50
          ? " Ну-ну, иди поработай еще, даже считай и не устал"
          : score < 100
          ? "Вам бы отдохнуть, выходных без работы должно хватить"
          : score < 200
          ? "Ебать, да у вас стресс! Нужен отпуск (не дома)"
          : score < 500
          ? "Пожалуйста, отложите все и отдохните, лучше прямо сейчас. Я серьезно!"
          : "Вам уже ничего не поможет. Вы выгорели. Нужно кардинально менять деятельность (так говорят)";

      score &&
        say(
          (score >= 50 ? "А теперь мы узнаем ваш диагноз..." : "") + dia,
          true
        );

      return dia;
    });

    addRecord((state) => [...state, score]);
    setScore(0);
    localStorage.setItem("mat_phrase", items.join());
    setRec(records);
  };

  const leaderboards = useMemo(() => {
    setRec(filteredArrs(records));
    return filteredArrs(records);
  }, [records]);

  const addCustomToAll = (e) => {
    e.preventDefault();
    if (customWord && customWord.trim()) {
      const item = {
        id: mat.length,
        word: customWord,
        points: Math.round(Math.random() * 20)
      };

      setWords((state) => [...state, item]);
      localStorage.setItem("mat_words", JSON.stringify(words));
    }
    setCustomWord("");
  };

  return (
    <div className="App">
      <Header />

      {score > 99 && <div className="app__status">Ебать, да у вас стресс!</div>}
      <div className="app__scene">
        {words.map(({ id, word, points }, index) => (
          <WordPad
            key={`${id}-${index}`}
            id={id}
            onClick={() => {
              addItem((state) =>
                score === 0
                  ? [word]
                  : [...state, (state.length ? ", " : "") + word]
              );
              setScore((state) => state + points);

              say(word);
            }}
            onRemove={(e) => {
              e.preventDefault();
              setWords((state) => state.filter((i) => i.id !== id));
            }}
            points={points}
            name={word}
          />
        ))}
      </div>
      <Paper>
        <Typography variant="h5" color="inherit" style={{ marginLeft: "16px" }}>
          {items}
        </Typography>
      </Paper>

      {diagnos && (
        <p>
          <Chip
            label={diagnos}
            avatar={<Avatar>D</Avatar>}
            clickable
            color="primary"
            onClick={() => setDiagnos(null)}
            variant="outlined"
          />
        </p>
      )}

      <p>
        <Fab variant="extended" onClick={readThis}>
          Выругаться
        </Fab>
      </p>
      <Linear value={score} />
      <p>Счет: {score}</p>

      <form onSubmit={addCustomToAll}>
        <div>
          <TextField
            id="word"
            label="Добавь слово"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            maxLength={1600}
            variant="outlined"
            type="text"
          />
        </div>
        <Tooltip title="Добавить слово" aria-label="add">
          <Fab color="primary" onClick={addCustomToAll}>
            <Add />
          </Fab>
        </Tooltip>
      </form>
      <p>
        <small>
          Hint: You can delete words with the <strong>right click</strong>
        </small>
      </p>
      <p>
        <small>
          Hint: What if you'll reach <strong>200</strong> or{" "}
          <strong>500</strong> points? No one knows...
        </small>
      </p>
      <div className="app__actions">
        {items.length > 0 ? (
          <p>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => addItem(() => [])}
            >
              Убрать за собой
            </Button>
          </p>
        ) : null}
        <p>
          <Button variant="contained" color="primary" onClick={stopSpeak}>
            Замолчать
          </Button>
        </p>
      </div>
      <div>
        <h2>Рекорд</h2>
        {leaderboards.map((i) => (
          <div key={i}>{i}</div>
        ))}
      </div>
    </div>
  );
}
