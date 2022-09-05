
import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import EnterForm from './components/EnterForm';
import ErrorPage from './components/ErrorPage';
import Osero from './components/Osero.jsx';

const baseURL = process.env.BASE_URL || 'https://dolkmd-osero.glitch.me' || 'http://localhost:3000';
const baseWsURL = process.env.WS_BASE_URL || 'wss://dolkmd-osero.glitch.me'|| 'ws://localhost:3000';
const Box = styled.div`
  display: flex;
  justify-content: space-around;
`;
const InfoBox = styled.div`
  background-color: pink;
  width: 300px;
  padding: 50px;
`;
function App() {
  const [gameInfo, setGameInfo] = useState({ roomId : '', userId : '', black : 2, white : 2 });
  const [board, setBoard] = useState([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [color, setColor] = useState('無');
  const subscribeWsSocket = (roomId, userId) => {
    const ws = new WebSocket(`${baseWsURL}/rooms/id/${roomId}`);
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setGameInfo({ roomId, userId, black: response.black, white: response.white });
      setColor(response.blackPlayer === userId ? '黒' : '白');
      setIsMyTurn(response.turn === userId);
      setBoard(response.board);
    };
  };

  const onClickGetRoomIdButton = () => {
    axios.get(`${baseURL}/rooms/id`).then(axiosResponse => {
      const { id, userId, board, black, white } = axiosResponse.data;
      setGameInfo({ roomId : id, userId : userId, black, white });
      setBoard(board);
      subscribeWsSocket(id, userId);
      setIsMyTurn(axiosResponse.data.turn === userId);
      setColor(axiosResponse.data.blackPlayer === userId ? '黒' : '白');
    }).catch(e => setHasError(true));
  };

  const onSetRoomId = (roomId) => {
    axios.get(`${baseURL}/rooms/id/`+roomId).then(axiosResponse => {
      const { id, userId, board, black, white } = axiosResponse.data;
      setGameInfo({ roomId : id, userId : userId,  black, white });
      setBoard(board);
      subscribeWsSocket(id, userId);
      setIsMyTurn(axiosResponse.data.turn === userId);
      setColor(axiosResponse.data.blackPlayer === userId ? '黒' : '白');
    }).catch(e => setHasError(true));
  };

  const putStone = (x, y) => {
    x--;
    y--;
    axios.post(`${baseURL}/rooms/id/${gameInfo.roomId}/users/${gameInfo.userId}`, { x, y }).then(axiosResponse => {
    }).catch(e => setHasError(true));
  };

  if (hasError) {
    return <ErrorPage />
  }

  return (
    <>
      {gameInfo.roomId && gameInfo.userId
      ? (
          <Box>
            <Osero board={board} clickSquare={putStone} />
            <span>
              <InfoBox>
                <h1>部屋番号は「{gameInfo.roomId}」</h1>
                <h2>{isMyTurn ? 'あなたのターンですよ？' : '相手のターンです（ ;  ; ）'}</h2>
                <h3>あなたの色は「{color}」</h3>
                <h3>黒: {gameInfo.black}, 白: {gameInfo.white}</h3>
              </InfoBox>
            </span>
          </Box>
        )
      : <EnterForm
          onClickGetRoomIdButton={onClickGetRoomIdButton}
          onSetRoomId={onSetRoomId}
        />}
    </>
  );
}

export default App;
