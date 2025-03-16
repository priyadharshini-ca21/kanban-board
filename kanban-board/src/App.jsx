import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import KanbanBoard from './components/KanbanBoard';

const GlobalStyle = createGlobalStyle`
    body, html {
        background-color: white;
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        width: 100%;
        
    }
    #root {
        
        background-color: white;
    }
`;

const Header = styled.header`
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    background-color: white;
    
    z-index: 10;
`;


const Icon = styled.span`
    margin: 0 5px;
    color: gray;
    cursor: pointer;
    border-radius: 30%;
    border: 1px solid gray;
    padding: 5px;
    &:hover {
        color: black;
        border-color: black;
    }
`;
const Icons = styled.span`
    margin: 0 3px;
    color: gray;
    cursor: pointer;
    padding: 1px;
    &:hover {
        color: black;
        border-color: black;
    }
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
`;

const SearchBox = styled.div`
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid gray;
    border-radius: 10px;
    padding: 4px;
    margin-left: auto;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    margin-right: 5px;
    background-color: white;
`;

function App() {
    return (
        <>
            <GlobalStyle />
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <Header>
                <IconContainer>
                    <Icon className="material-icons">arrow_back</Icon>
                    <Icon className="material-icons">apple</Icon>
                </IconContainer>
                <SearchBox>
                    <Icons className="material-icons">search</Icons>
                    <SearchInput type="text" placeholder="Search" />
                </SearchBox>
                <Icon className="material-icons">exit_to_app</Icon>
                <Icon className="material-icons">settings</Icon>
            </Header>
            <div className="App" style={{ paddingTop: '80px' }}>
             <KanbanBoard />
            </div>

           
        </>
    );
}

export default App;
