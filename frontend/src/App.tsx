import { useState, useEffect } from 'react'
import './App.css'
import { Prompt } from './components/Prompt'
import { GameArea } from './components/GameArea';
import { CurrentPage } from './components/CurrentPage';
import { Score } from './components/Score';
import { Timer } from './components/Timer';
import { AlgorithmDisplay } from './components/AlgorithmDisplay';

function App() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [startPage, setstartPage] = useState<string>("");
  const [targetPage, setTargetPage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [dialAlgTime, setDialAlgTime] = useState<number>(5.565);
  const [dialPath, setDialPath] = useState<string[]>(["Florida", "Dog", "Benjamin Franklin"]);
  const [djikstraAlgTime, setDjikstraAlgTime] = useState<number>(3.124);
  const [djikstraPath, setDjikstraPath] = useState<string[]>(["Cat", "Dog", "Benjamin Franklin", "Kitten"]);
  const [seconds, setSeconds] = useState<number>(0);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [neighbors, setNeighbors] = useState<string[]>([]);
  const [isLoadingGame, setIsLoadingGame] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingInitial(false);
  }, []);

  useEffect(() => {
    if (gameStarted && !gameEnded && currentPage !== "") {
      fetch(`http://localhost:18080/neighbors?page=${encodeURIComponent(currentPage)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.neighbors) {
            setNeighbors(data.neighbors);
          } else {
            setNeighbors([]);
          }
        })
        .catch(err => {
          console.error("Failed to fetch neighbors:", err);
          setNeighbors([]);
        });
    }
  }, [currentPage, gameStarted, gameEnded]);

  useEffect(() => {
    let interval: number | undefined;
    if (gameStarted && !gameEnded && !isLoadingGame) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameEnded, isLoadingGame]);



  const changeCurrentPage = (newMember: string) => {
    setCurrentPage(newMember);
    setScore(score + newMember.length)
    if (newMember == targetPage) {
      setGameEnded(true);
    }
    if (newMember == "THE PLAYER IS GIVING UP") {
      setCurrentPage(targetPage);
      const optimalScore = djikstraPath.reduce((total, page) => total + page.length, 0);
      setScore(optimalScore);
      setGameEnded(true);
    }
  }

  const handleStartGame = async () => {
    setstartPage("");
    setTargetPage("");
    setCurrentPage("");
    setGameStarted(true);
    setIsLoadingGame(true);

    try {
      const response = await fetch('http://localhost:18080/path');
      const data = await response.json();

      setstartPage(data.start);
      setTargetPage(data.end);
      setCurrentPage(data.start);

      if (data.bfs) setDjikstraPath(data.bfs);
      if (data.dijkstra_time) setDjikstraAlgTime(data.dijkstra_time);
      if (data.dial) setDialPath(data.dial);
      if (data.dial_time) setDialAlgTime(data.dial_time);
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    }
    setIsLoadingGame(false);
  }

  return (
    <>
      <div className="wholePage">
        <div className="block">
          <img className="titleSection" src="titleImage.png" />
          <Timer seconds={seconds} />
        </div>

        <div className="block">
          <div className="gridSection">
            <CurrentPage title={currentPage} />
            <Prompt startTitle={startPage} targetTitle={targetPage} />
            <Score num={score} />
          </div>
        </div>

        <div className="block">
          {gameStarted ?
            (
              gameEnded ?
                (
                  <div>
                    <AlgorithmDisplay dialTitles={dialPath} dialTime={dialAlgTime} djikstraTitles={djikstraPath} djikstraTime={djikstraAlgTime} />
                  </div>
                )
                :
                (
                  <div>
                    {isLoadingGame ? (
                      <p>Loading game...</p>
                    ) : (
                      <GameArea titles={neighbors} changeMem={changeCurrentPage} />
                    )}
                  </div>
                )
            )
            :
            (
              <>
                {isLoadingInitial && <p>Loading data...</p>}
                {!isLoadingInitial && (
                  <button className="startGameButton" onClick={handleStartGame}>
                    START
                  </button>
                )}
              </>
            )
          }
        </div>
      </div>
    </>
  )
}
export default App