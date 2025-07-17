import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    // Log error to the console or a service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
          <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-2">An unexpected error occurred in the application.</p>
          {this.state.error && (
            <pre className="bg-gray-800 text-red-400 p-4 rounded mb-2 max-w-xl overflow-x-auto">
              {this.state.error.toString()}
            </pre>
          )}
          {this.state.errorInfo && (
            <details className="bg-gray-800 text-gray-400 p-4 rounded max-w-xl overflow-x-auto">
              {this.state.errorInfo.componentStack}
            </details>
          )}
          <button
            className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
} 