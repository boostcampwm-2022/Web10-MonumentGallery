import React from "react";

export default class ErrorBoundary extends React.Component {
  state: React.ComponentState;
  declare props: React.PropsWithChildren & { fallback?: React.ReactNode };

  constructor(props: React.PropsWithChildren & { fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    return;
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
