import { useState, useMemo, useEffect } from "react";
import "./styles.css";
import { mat, ubludok, weHas } from "/const";

let stressed = false;
export default function App() {
  const [words, setWords] = useState(mat);
  const [items, addItem] = useState([]);
  const [score, setScore] = useState(0);
  const [records, addRecord] = useState([]);
  const [phrase, setPhrase] = useState("");
  const [customWord, setCustomWord] = useState("");
  const synth = window.speechSynthesis;
  const utterThis = useMemo(() => new SpeechSynthesisUtterance(phrase), [
    phrase
  ]);

  useEffect(() => {
    const lboard = JSON.parse(localStorage.getItem("mat_leaderboard"));
    if (Array.isArray(lboard)) {
      addRecord(lboard);
    }
  }, []);
  useEffect(() => {
    if (score > 99 && !stressed) {
      stressed = true;
      synth.cancel();
      synth.speak(
        new SpeechSynthesisUtterance("Ого, сестра, даа это же стресс!")
      );
    }
  }, [score, utterThis, synth]);

  const readThis = () => {
    synth.cancel();
    let content = items.join();

    if (score > 99 && score < 200) {
      synth.speak(new SpeechSynthesisUtterance("Ебаать, да у вас стресс!"));
    }

    if (score > 500 && score < 510) {
      content = weHas;
    }
    if (score === 200) {
      content = ubludok;
    }

    synth.speak(new SpeechSynthesisUtterance(content));
    addRecord((state) => [...state, score]);
    setScore(0);

    localStorage.setItem("mat_phrase", items.join());
    localStorage.setItem("mat_leaderboard", JSON.stringify(records));
  };

  const stopSpeak = () => {
    synth.cancel();
  };

  const filteredArrs = (arr) =>
    [...new Set(arr)].sort((a, b) => b - a).slice(0, 5);

  const leaderboards = useMemo(() => {
    localStorage.setItem(
      "mat_leaderboard",
      JSON.stringify(filteredArrs(records))
    );

    return filteredArrs(records);
  }, [records]);

  const addCustomToAll = (e) => {
    e.preventDefault();
    const item = {
      id: mat.length,
      word: customWord,
      points: Math.round(Math.random() * 20)
    };

    setWords((state) => [...state, item]);
    setCustomWord("");
  };

  return (
    <div className="App">
      <h1>A8TOMAT</h1>
      <p>
        <small>use it when you feel 8c3 3ae6aJLo</small>
      </p>
      <hr />
      {score > 99 && <div className="app__status">Ебать, да у вас стресс!</div>}
      <div className="app__scene">
        {words.map(({ id, word, points }, index) => (
          <div
            key={`${id}-${index}`}
            onClick={() => {
              addItem((state) =>
                score === 0
                  ? [word]
                  : [...state, (state.length ? ", " : "") + word]
              );
              setScore((state) => state + points);
              setPhrase((state) => state + ", " + word);
              synth.cancel();
              synth.speak(new SpeechSynthesisUtterance(word));
            }}
            className="app__item"
          >
            {word}
          </div>
        ))}
      </div>
      <hr />
      <div className="app__phrase">{items}</div>
      <p>Счет: {score}</p>

      <form onSubmit={addCustomToAll}>
        Добавить слово:{" "}
        <input
          value={customWord}
          onChange={(e) => setCustomWord(e.target.value)}
          maxLength={1600}
          type="text"
        />
        <button onClick={addCustomToAll}>+</button>
      </form>
      <div className="app__actions">
        <button onClick={readThis}>go</button>
        <button onClick={() => addItem(() => [])}>clean</button>
        <button onClick={stopSpeak}>shutup</button>
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
