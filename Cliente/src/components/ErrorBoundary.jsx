import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
          }}>⚠️</div>
          <h2 style={{ marginBottom: '0.5rem', color: '#333' }}>
            Algo salió mal
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', maxWidth: '400px' }}>
            Ocurrió un error inesperado. Por favor, intente recargar la página.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#4361ee',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Volver al inicio
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
