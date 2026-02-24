import React from "react";

interface Props {
    children: React.ReactNode;
    fallback: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export class ThreeErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Three.js/R3F Error caught by Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}
