export type UserRole = "admin" | "farmer" | "business";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    approved: boolean;
    walletAddress: string;
}

const USERS_KEY = "haritsetu_users";
const CURRENT_USER_KEY = "haritsetu_current_user";

export const authService = {
    getUsers: (): User[] => {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    },

    getCurrentUser: (): User | null => {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    login: (email: string, role: UserRole): User | null => {
        const users = authService.getUsers();
        let user = users.find(u => u.email === email && u.role === role);

        // Auto-create for demo purposes if not exists
        if (!user) {
            user = {
                id: Math.random().toString(36).substr(2, 9),
                name: email.split('@')[0],
                email,
                role,
                approved: true, // Everyone is auto-approved in this mock for better DX
                walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`
            };
            localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
        }

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    approveUser: (userId: string) => {
        const users = authService.getUsers();
        const updatedUsers = users.map(u => u.id === userId ? { ...u, approved: true } : u);
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    }
};
