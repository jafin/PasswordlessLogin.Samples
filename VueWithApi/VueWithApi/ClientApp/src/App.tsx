import React from 'react';
import './App.css';
import { DataApi } from './api/generated/api';
import axios from 'axios';

function App() {

  const AxiosInstance = axios.create();
  const api = new DataApi(null,'https://localhost:5001',AxiosInstance)

  api.apiAppInfoGet().then((response)=> {
    console.log('response:',response);
  });


  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
