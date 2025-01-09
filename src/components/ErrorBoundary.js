// ErrorBoundary.js
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 오류가 발생하면 상태를 업데이트하여 UI를 표시합니다.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 오류를 로깅하거나 외부 서비스로 전송할 수 있습니다.
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // 오류 발생 시 표시할 fallback UI
      return <h2>Something went wrong. Please try again later.</h2>;
    }

    // 자식 컴포넌트를 정상적으로 렌더링
    return this.props.children;
  }
}

export default ErrorBoundary;
