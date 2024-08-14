import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #000;
  padding: 20px;
  border-radius: 10px;
  width: 420px;
  margin: 20px;
`;

const Button = styled.button`
  margin: 15px 0;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const GameArea = styled.div`
  position: relative;
  border: 2px solid #000;
  width: 100%;
  height: 500px;
  margin-top: 20px;
  overflow: hidden;
`;

const NumberButton = styled(Button)`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ isClicked }) => (isClicked ? 'red' : 'white')};
  color: ${({ isClicked }) => (isClicked ? 'white' : 'black')};
  opacity: ${({ isClicked }) => (isClicked ? 0 : 1)};
  transition: opacity 0.5s ease-out, background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Status = styled.h1`
  color: ${({ status }) => {
    if (status === 'GAME OVER') return 'red';
    if (status === 'ALL CLEARED') return 'green';
    return 'black';
  }};
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 5px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
`;

const Label = styled.label`
  margin-right: 10px;
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
`;

const StyledInput = styled.input`
  margin-right: 10px;
  padding: 5px;
  font-size: 16px;
  flex: 1;
`;

const TimeContainer = styled.div`
  margin-top: 15px;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  text-align: left;
`;

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [status, setStatus] = useState("LET'S PLAY");
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [numberStyles, setNumberStyles] = useState([]);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const initializeGame = () => {
    const numPoints = parseInt(inputValue, 10);

    if (isNaN(numPoints) || numPoints <= 0) {
      alert('Please enter a valid number.');
      return;
    }

    const newNumbers = Array.from({ length: numPoints }, (_, i) => i + 1);
    setNumbers(newNumbers);
    setCurrentNumber(1);
    setClickedNumbers([]);
    setStatus("LET'S PLAY");
    setTime(0);

    if (intervalId) clearInterval(intervalId);
    const id = setInterval(() => setTime(prevTime => prevTime + 10), 10); // Cập nhật mỗi 10 mili giây
    setIntervalId(id);

    const styles = newNumbers.map((_, index) => ({
      top: `${Math.random() * 460}px`,
      left: `${Math.random() * 360}px`,
      zIndex: numPoints - index
    }));
    setNumberStyles(styles);
  };

  const handleNumberClick = (number) => {
    if (number === currentNumber) {
      setClickedNumbers(prev => [...prev, number]);
      setCurrentNumber(prev => prev + 1);
      if (clickedNumbers.length + 1 === numbers.length) {
        setStatus('ALL CLEARED');
        clearInterval(intervalId);
      }
    } else {
      setStatus('GAME OVER');
      clearInterval(intervalId);
    }
  };

  // Tính toán và định dạng thời gian
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const milliSeconds = Math.floor((milliseconds % 1000) / 10); // Lấy 2 chữ số mili giây
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliSeconds).padStart(2, '0')}`;
  };

  return (
    <Container>
      <Status status={status}>{status}</Status>
      <InputContainer>
        <Label>Point:</Label>
        <StyledInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter Points"
        />
      </InputContainer>
      <TimeContainer>Time: {formatTime(time)}</TimeContainer>
      <Button onClick={initializeGame}>Play</Button>
      <GameArea>
        {numbers.map((number, index) => (
          <NumberButton
            key={number}
            onClick={() => handleNumberClick(number)}
            style={numberStyles[index]}
            isClicked={clickedNumbers.includes(number)}
          >
            {number}
          </NumberButton>
        ))}
      </GameArea>
    </Container>
  );
};

export default App;
