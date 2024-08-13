import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AuthorTable } from './components/data-table/Author';
import 'primeicons/primeicons.css';
//import 'primereact/resources/themes/saga-blue/theme.css'; // o el tema que prefieras
import 'primereact/resources/themes/lara-dark-indigo/theme.css'
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Libro } from './components/Libro';
import { Inicio } from './components/Inicio';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/libro' element={<Libro />} />
        <Route path='/autor' element={<AuthorTable />} />
      </Routes>
    </Router>

  );
}

export default App;
