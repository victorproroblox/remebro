// src/pages/Home.js
import React from 'react';

function Home() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Bienvenido, {usuario?.nom_us}</h2>
      <p>Esta es la pantalla de inicio de EduMochila.</p>
    </div>
  );
}

export default Home;
