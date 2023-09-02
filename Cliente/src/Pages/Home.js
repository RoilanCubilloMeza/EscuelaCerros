import React from 'react';
import {
  MDBCarousel,
  MDBCarouselItem,
} from 'mdb-react-ui-kit';
const Home = () => {
  return (
    <div className="">
      <MDBCarousel showControls showIndicators>
      <MDBCarouselItem
        className='w-100 d-block'
        itemId={1}
        src='https://mdbootstrap.com/img/new/slides/041.jpg'
        alt='...'
      >
        <h5>Actividades Importantes</h5>
      </MDBCarouselItem>
      <MDBCarouselItem
        className='w-100 d-block'
        itemId={2}
        src='https://mdbootstrap.com/img/new/slides/042.jpg'
        alt='...'
      >
        <h5>Actividades Importantes</h5>
      </MDBCarouselItem>
      <MDBCarouselItem
        className='w-100 d-block'
        itemId={3}
        src='https://mdbootstrap.com/img/new/slides/043.jpg'
        alt='...'
      >
        <h5>Actividades Importantes</h5>
      </MDBCarouselItem>
    </MDBCarousel>
    <div className="mt-5 bg-secondary">
  <div className="row">
    <div className="col-md-6">
      <img
        src="https://scontent.fsyq5-1.fna.fbcdn.net/v/t39.30808-6/250789098_110676661413032_8474741741682996711_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5614bc&_nc_ohc=G0V5xDJwDn0AX-SfGeb&_nc_ht=scontent.fsyq5-1.fna&oh=00_AfDs6_7lPk1FsRosNdDFtIBaywel0ymiVNbT3Lopua9yfQ&oe=64F859A6"
        alt="Imagen de la escuela"
        className="img-fluid"
      />
    </div>
    <div className="col-md-6">
      <h2>Historia de la Escuela</h2>
      <p>
        Aquí puedes agregar información sobre la historia de la escuela.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
        condimentum eros id consectetur. Sed eleifend lectus id ipsum
        vulputate, quis efficitur erat posuere. Nulla facilisi. Praesent vel
        nisi sit amet lorem rhoncus tristique.
      </p>
    </div>
  </div>
</div>

    </div>
    
  );
};

export default Home;
