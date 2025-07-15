import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    // Clear localStorage and reload the page
    localStorage.removeItem('expense-calculator-data');
    window.location.reload();
  };

  handleRetry = () => {
    // Reset error state to try rendering again
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            padding: '30px',
            marginBottom: '20px'
          }}>
            <h1 style={{ color: '#721c24', margin: '0 0 15px 0' }}>
              ¡Oops! Algo salió mal
            </h1>
            <p style={{ color: '#721c24', margin: '0 0 20px 0' }}>
              La aplicación encontró un error inesperado. Esto puede deberse a datos corruptos 
              o un problema temporal.
            </p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={this.handleRetry}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Intentar de nuevo
              </button>
              
              <button 
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Reiniciar aplicación
              </button>
            </div>
          </div>

          {/* Error details for debugging (only in development) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ textAlign: 'left', marginTop: '20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Detalles del error (desarrollo)
              </summary>
              <pre style={{
                backgroundColor: '#f8f9fa',
                padding: '15px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                marginTop: '10px'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
