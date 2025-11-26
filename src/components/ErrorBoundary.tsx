import { Component, ErrorInfo, ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Terjadi Kesalahan
                </h2>
                <p className="text-muted-foreground">
                  Halaman ini mengalami error dan tidak dapat ditampilkan
                </p>
              </div>

              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                  <p className="text-sm font-mono text-red-900 break-words">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Kemungkinan penyebab:
                </p>
                <ul className="text-sm text-left space-y-1 text-muted-foreground">
                  <li>• Backend tidak berjalan (port 5000)</li>
                  <li>• Koneksi database bermasalah</li>
                  <li>• Token login expired</li>
                </ul>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                    window.location.reload();
                  }}
                >
                  Reload Halaman
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/auth';
                  }}
                >
                  Logout & Login Ulang
                </Button>
              </div>

              <details className="text-left">
                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                  Detail Error (untuk debugging)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-48 border">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            </div>
          </div>
        </DashboardLayout>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
