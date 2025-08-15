import React from 'react';

class SimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Error caught by SimpleErrorBoundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            border: '2px solid #dc3545',
            borderRadius: '8px',
            margin: '2rem auto',
            maxWidth: '600px'
          }}>
            <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>
              ��️ Application Error
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
              Something went wrong. Please try refreshing the page.
            </p>
            <div>
              <button 
                onClick={() => window.location.reload()} 
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  marginRight: '0.5rem'
                }}
              >
                🔄 Reload Page
              </button>
              <button 
                onClick={() => this.setState({ hasError: false })} 
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                ↩️ Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SimpleErrorBoundary;