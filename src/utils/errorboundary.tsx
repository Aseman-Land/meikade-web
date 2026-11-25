
import { Component, type ErrorInfo, type ReactNode } from "react";

declare global {
    interface Window {
        showFatalError?: (title: string, detail: string) => void;
    }
}

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {

    state: State = {
        hasError: false,
    };

    static getDerivedStateFromError(): State {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {

        console.error("React Error:", error);
        console.error("Component Stack:", info.componentStack);

        const details = [
            error.stack || error.message,
            info.componentStack,
        ]
            .filter(Boolean)
            .join("\n\n");

        window.showFatalError?.(
            "خطایی هنگام نمایش برنامه رخ داد",
            details || "Unknown React rendering error"
        );
    }

    render() {

        if (this.state.hasError) {

            return (
                <div
                    dir="rtl"
                    style={{
                        padding: 24,
                        textAlign: "center",
                    }}
                >
                    مشکلی در نمایش این قسمت از برنامه رخ داده است.
                </div>
            );

        }

        return this.props.children;
    }
}

export default ErrorBoundary;
