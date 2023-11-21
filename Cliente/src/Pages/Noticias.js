import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap

const Noticias = ({ onUpload }) => {
  const [imageInfo, setImageInfo] = useState({
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    text1: '',
    text2: '',
    text3: '',
  });

  const onDrop = useCallback(async (acceptedFiles, index) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('URL_DE_TU_API', formData);
      setImageInfo((prevImageInfo) => {
        const imageKey = `imageUrl${index}`;
        return {
          ...prevImageInfo,
          [imageKey]: response.data.url,
        };
      });
    } catch (error) {
      console.error('Error al subir la imagen', error);
    }
  }, []);

  const handleTextChange = (event, field) => {
    setImageInfo({
      ...imageInfo,
      [field]: event.target.value,
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 1),
  });

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 2),
  });

  const { getRootProps: getRootProps3, getInputProps: getInputProps3 } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, 3),
  });

  return (
    <div className="container mt-4">
      <div {...getRootProps()} style={dropzoneStyles} className="dropzone text-center">
        <input {...getInputProps()} />
        <p className="mt-2">Arrastra y suelta una imagen aquí, o haz clic para seleccionar una.</p>
      </div>
      <div className="form-group mt-3">
        <label>Texto 1:</label>
        <input
          type="text"
          value={imageInfo.text1}
          onChange={(e) => handleTextChange(e, 'text1')}
          className="form-control"
        />
      </div>
      <div {...getRootProps2()} style={dropzoneStyles} className="dropzone text-center mt-3">
        <input {...getInputProps2()} />
        <p className="mt-2">Arrastra y suelta la segunda imagen aquí.</p>
      </div>
      <div className="form-group mt-3">
        <label>Texto 2:</label>
        <input
          type="text"
          value={imageInfo.text1}
          onChange={(e) => handleTextChange(e, 'text1')}
          className="form-control"
        />
      </div>
      <div {...getRootProps3()} style={dropzoneStyles} className="dropzone text-center mt-3">
        <input {...getInputProps3()} />
        <p className="mt-2">Arrastra y suelta la tercera imagen aquí.</p>
      </div>
      <div className="form-group mt-3">
        <label>Texto 3:</label>
        <input
          type="text"
          value={imageInfo.text1}
          onChange={(e) => handleTextChange(e, 'text1')}
          className="form-control"
        />
      </div>
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default Noticias;
