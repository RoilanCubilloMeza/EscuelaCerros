import React from 'react';

const Home = () => {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">¡Bienvenido a nuestra Escuela!</h1>
      <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div className="carousel-item active">
    </div>
    <div className="carousel-item">
    <img src="/EscudoEscuelaCerros-removebg-preview.png" className="d-block w-100" alt="10" width="10" />
    </div>
    <div className="carousel-item">
      <img src="..." className="d-block w-100" alt="..."/>
    </div>
  </div>
</div>
    </div>
  );
};

export default Home;
