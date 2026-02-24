import { Navigate } from "react-router-dom";
import { authService, UserRole } from "@/lib/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole?: UserRole;
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    if (!user.approved && user.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
                <div className="max-w-md w-full glass-card p-8 rounded-2xl text-center">
                    <h2 className="text-2xl font-bold text-green-900 mb-4">Account Pending Approval</h2>
                    <p className="text-green-700 mb-6">
                        Your account has been registered but is awaiting administrator verification.
                        Please check back soon.
                    </p>
                    <button
                        onClick={() => {
                            authService.logout();
                            window.location.href = "/login";
                        }}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                        Go Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
