import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true,error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          margin: '2rem'
        }}>
          <h2 style={{ color: '#dc3545' }}>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          
          {/* Only show details if we have error information */}
          {(this.state.error || this.state.errorInfo) && (
            <details style={{ 
              marginTop: '1rem', 
              textAlign: 'left', 
              backgroundColor: '#fff',
              padding: '1rem',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details (Click to expand)
              </summary>
              <pre style={{ 
                marginTop: '1rem', 
                fontSize: '0.8rem',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {this.state.error?.toString()}
                {this.state.error && this.state.errorInfo && <br />}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          
          <div style={{ marginTop: '1rem' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '0.5rem'
              }}
            >
              Reload Page
            </button>
            <button 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })} 
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;