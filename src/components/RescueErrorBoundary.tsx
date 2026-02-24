import React from "react";
import { Leaf, RefreshCcw, AlertTriangle, Zap } from "lucide-react";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class RescueErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Critical Boot Crash caught by RescueBoundary:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleLiteMode = () => {
        localStorage.setItem("haritsetu-lite-mode", "true");
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <AlertTriangle className="w-10 h-10 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-black text-green-900 mb-4 tracking-tight">HaritSetu Safe Mode</h1>

                    <p className="text-green-800/70 max-w-md mb-8 leading-relaxed">
                        A critical error occurred while loading the 3D engine. This usually happens due to browser incompatibility or memory constraints.
                    </p>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button
                            onClick={this.handleReload}
                            className="flex items-center justify-center gap-2 bg-green-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-800 transition-all shadow-lg"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            Try Again
                        </button>

                        <button
                            onClick={this.handleLiteMode}
                            className="flex items-center justify-center gap-2 bg-white text-green-700 border-2 border-green-200 font-bold py-3 px-6 rounded-xl hover:bg-green-50 transition-all"
                        >
                            <Zap className="w-5 h-5 fill-green-600" />
                            Switch to Lite Mode (2D)
                        </button>
                    </div>

                    <div className="mt-12 flex items-center gap-2 text-green-900/40">
                        <Leaf className="w-4 h-4" />
                        <span className="text-xs font-semibold tracking-widest uppercase">Stability First</span>
                    </div>

                    <pre className="mt-8 p-4 bg-green-100/50 rounded-lg text-[10px] text-green-800/40 max-w-lg overflow-auto text-left border border-green-200">
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}
