import 'react-tabs/style/react-tabs.css';
import styled from 'styled-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from 'react';

const Page = styled.div`
  background-repeat: repeat;
  background-image: url('https://assets.st-note.com/img/1662338970662-k9LYFtgian.png?width=2000&height=2000&fit=bounds&format=jpg&quality=85');
  background-size: 5%;
  height: 100vh;
`;

const Title = styled.h1`
  margin: 0;
  color: pink;
`;

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: blur(0px);
`;

const Form = styled.div`
  display: inline-block;
  padding: 10px;
  background-color: #FAEAEA;
  width: 45%;
  height: 45%;
`;


const EnterForm = ({
  onSetRoomId = () => {},
  onClickGetRoomIdButton = () => {},
}) => {
  const SetRoomIdForm = () => {
    const [roomId, setRoomId] = useState('');
    return (
      <>
        <h2>部屋番号を入力してください</h2>
        <input
          type="text"
          width='100%'
          onChange={event => setRoomId(event.target.value)}
          onKeyPress={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onSetRoomId(event.target.value);
              }
            }
          }
        />
        <button
          onClick={() => onSetRoomId(roomId)}>OK</button>
      </>
    );
  };

  const GetRoomIdForm = () => (
    <>
      <h2>部屋番号を作成</h2>
      <button onClick={() => onClickGetRoomIdButton()}>作成!!!</button>
    </>
  );

  return (
    <Page>
      <Title>オンラインオセロ対戦 (サンプル)</Title>
      <Wrapper>
        <Form>
          <Tabs>
            <TabList>
              <Tab>部屋を作成</Tab>
              <Tab>部屋に参加</Tab>
            </TabList>

            <TabPanel><GetRoomIdForm /></TabPanel>
            <TabPanel><SetRoomIdForm /></TabPanel>

          </Tabs>
        </Form>
      </Wrapper>
    </Page>
  );
};

export default EnterForm;