import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">¡Bienvenido a nuestra Escuela!</h1>
      <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="/EscudoEscuelaCerros-removebg-preview.png" class="d-block w-100" alt="10" width="10" />
    </div>
    <div class="carousel-item">
    <img src="/EscudoEscuelaCerros-removebg-preview.png" class="d-block w-100" alt="10" width="10" />
    </div>
    <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="..."/>
    </div>
  </div>
</div>
    </div>
  );
};

export default Home;
