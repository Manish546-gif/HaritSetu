import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, UserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Factory, ShieldCheck } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole>("farmer");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const user = authService.login(email || "demo@example.com", role);
        if (user) {
            if (user.role === "admin") navigate("/admin");
            else if (user.role === "farmer") navigate("/farmer");
            else navigate("/business");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#e8f5e9] p-4">
            <div className="absolute inset-0 -z-10" style={{
                background: "radial-gradient(circle at 0% 0%, #c8e6c9 0%, transparent 50%), radial-gradient(circle at 100% 100%, #8bc34a 0%, transparent 50%)",
                opacity: 0.5
            }} />

            <Card className="w-full max-w-md glass-card border-green-100 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Leaf className="text-green-600 w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-900">Welcome to HaritSetu</CardTitle>
                    <CardDescription className="text-green-700">Select your role to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="farmer" onValueChange={(v) => setRole(v as UserRole)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8 bg-green-50">
                            <TabsTrigger value="farmer" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                                <Leaf className="w-4 h-4 mr-2" />
                                Farmer
                            </TabsTrigger>
                            <TabsTrigger value="business" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                                <Factory className="w-4 h-4 mr-2" />
                                Business
                            </TabsTrigger>
                            <TabsTrigger value="admin" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Admin
                            </TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-green-800">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-green-200 focus:ring-green-500 rounded-xl"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white py-6 rounded-xl font-bold text-lg shadow-lg">
                                Login / Join as {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Button>
                        </form>
                    </Tabs>
                </CardContent>
                <CardFooter className="text-center justify-center text-sm text-green-600/60">
                    Secure Carbon Credits for a Simpler Future
                </CardFooter>
            </Card>
        </div>
    );
}
