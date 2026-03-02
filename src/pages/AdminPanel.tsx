import { useState, useEffect } from "react";
import { PanelLayout } from "@/components/PanelLayout";
import { authService, User } from "@/lib/auth";
import { ledgerService, Transaction } from "@/lib/ledger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Activity, CreditCard, Users, Check, X, Map as MapIcon, Eye, Image as ImageIcon, Camera } from "lucide-react";
import { toast } from "sonner";
import { fieldService, Field, CROP_DATA } from "@/lib/fieldService";
import { web3Service } from "@/lib/web3";
import FieldMap from "@/components/map/FieldMap";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminPanel() {
    const [users, setUsers] = useState<User[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pendingFields, setPendingFields] = useState<Field[]>([]);
    const [isApproving, setIsApproving] = useState<string | null>(null);

    useEffect(() => {
        setUsers(authService.getUsers());
        setTransactions(ledgerService.getTransactions());
        setPendingFields(fieldService.getFields().filter(f => f.status === "PENDING"));
    }, []);

    const handleApprove = (userId: string) => {
        authService.approveUser(userId);
        setUsers(authService.getUsers());
        toast.success("User approved successfully");
    };

    const handleApproveField = async (field: Field) => {
        setIsApproving(field.id);
        try {
            const credits = fieldService.calculatePotentialCredits(field.area, field.cropType);
            const farmer = users.find(u => u.id === field.farmerId);

            if (!farmer) throw new Error("Farmer not found");

            // Mint credits on-chain
            const { hash } = await web3Service.mintCredits(credits, farmer.walletAddress);

            // Update field status
            fieldService.updateFieldStatus(field.id, "APPROVED");

            setPendingFields(fieldService.getFields().filter(f => f.status === "PENDING"));
            setTransactions(ledgerService.getTransactions());

            toast.success(`Field approved! ${credits} credits minted to ${farmer.name}`, {
                description: `Tx: ${hash.slice(0, 10)}...`
            });
        } catch (error) {
            toast.error("Verification failed");
        } finally {
            setIsApproving(null);
        }
    };

    return (
        <PanelLayout role="admin" title="Admin Overview">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Total Users" value={users.length.toString()} />
                <StatCard icon={<Activity className="w-5 h-5 text-green-600" />} label="System Ledger" value={transactions.length.toString()} />
                <StatCard icon={<CreditCard className="w-5 h-5 text-orange-600" />} label="Active Credits" value="45.2K" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* User Management */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>User Verification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.filter(u => u.role !== "admin").map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="capitalize">{user.role}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.approved ? "default" : "secondary"} className={user.approved ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                                                {user.approved ? "Verified" : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {!user.approved && (
                                                <Button size="sm" onClick={() => handleApprove(user.id)} className="bg-green-600 hover:bg-green-700">
                                                    <UserCheck className="w-4 h-4 mr-1" /> Approve
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Global Ledger History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">No transactions yet</TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.slice(0, 5).map(tx => (
                                        <TableRow key={tx.id}>
                                            <TableCell><Badge variant="outline">{tx.type}</Badge></TableCell>
                                            <TableCell className="font-bold text-green-700">{tx.amount} Cr</TableCell>
                                            <TableCell className="text-xs">{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
                {/* Global Insight */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-900">
                            <Activity className="w-5 h-5 text-green-600" />
                            Platform Integrity Monitor
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Node Sync Status</p>
                                <p className="text-sm font-bold text-green-900">100% Operational</p>
                            </div>
                            <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Platform Utilization</span>
                                <span>78%</span>
                            </div>
                            <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-600 w-[78%]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* System Audit */}
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-900">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            System Audit Trail
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <AuditLogItem type="SYS" msg="Protocol upgrade to v2.4 initialized" time="2m ago" />
                            <AuditLogItem type="USER" msg="Batch approval (12 accounts) completed" time="1h ago" />
                            <AuditLogItem type="SEC" msg="Abnormal credit minting attempt blocked" time="4h ago" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapIcon className="w-5 h-5 text-green-600" />
                            Field Verification Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Field Nickname</TableHead>
                                    <TableHead>Farmer</TableHead>
                                    <TableHead>Area (ha)</TableHead>
                                    <TableHead>Crop</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead>Map</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingFields.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground italic">
                                            No pending verifications
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pendingFields.map(field => {
                                        const farmer = users.find(u => u.id === field.farmerId);
                                        return (
                                            <TableRow key={field.id}>
                                                <TableCell className="font-bold">{field.nickname}</TableCell>
                                                <TableCell>{farmer?.name || "Unknown"}</TableCell>
                                                <TableCell>{field.area}</TableCell>
                                                <TableCell><Badge variant="outline">{field.cropType}</Badge></TableCell>
                                                <TableCell className="font-bold text-green-600">
                                                    {fieldService.calculatePotentialCredits(field.area, field.cropType)}
                                                </TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" variant="ghost">
                                                                <Eye className="w-4 h-4 mr-1" /> View
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-2xl font-black text-green-900">Verification Details: {field.nickname}</DialogTitle>
                                                            </DialogHeader>

                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                                                                <div className="space-y-4">
                                                                    <h4 className="font-bold text-green-800 flex items-center gap-2">
                                                                        <MapIcon className="w-4 h-4" />
                                                                        Field Boundary
                                                                    </h4>
                                                                    <div className="h-[300px] rounded-2xl overflow-hidden border-2 border-green-100 shadow-inner">
                                                                        <FieldMap readOnly initialPolygon={field.polygon} />
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <h4 className="font-bold text-green-800 flex items-center gap-2">
                                                                        <Camera className="w-4 h-4" />
                                                                        Field Photos
                                                                    </h4>
                                                                    {field.images && field.images.length > 0 ? (
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            {field.images.map((img, idx) => (
                                                                                <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-green-50 shadow-sm">
                                                                                    <img src={img} className="w-full h-full object-cover" alt={`Field ${idx + 1}`} />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="aspect-video flex flex-col items-center justify-center bg-green-50 rounded-2xl border-2 border-dashed border-green-100 text-green-600/50">
                                                                            <ImageIcon className="w-12 h-12 mb-2" />
                                                                            <p className="text-sm font-medium">No photos provided</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-bold text-green-600/60">Area</p>
                                                                    <p className="text-lg font-black text-green-900">{field.area.toFixed(2)} ha</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-bold text-green-600/60">Crop</p>
                                                                    <p className="text-lg font-black text-green-900">{field.cropType}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-bold text-green-600/60">Potential Credits</p>
                                                                    <p className="text-lg font-black text-green-600">{fieldService.calculatePotentialCredits(field.area, field.cropType)} CR</p>
                                                                </div>
                                                                <div className="flex items-end justify-end">
                                                                    <Button
                                                                        onClick={() => handleApproveField(field)}
                                                                        disabled={isApproving === field.id}
                                                                        className="bg-green-600 hover:bg-green-700 font-bold"
                                                                    >
                                                                        {isApproving === field.id ? "Approving..." : "Approve Field"}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 h-8 font-bold"
                                                            onClick={() => handleApproveField(field)}
                                                            disabled={isApproving === field.id}
                                                        >
                                                            {isApproving === field.id ? "..." : <Check className="w-4 h-4" />}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-8 font-bold"
                                                            onClick={() => {
                                                                fieldService.updateFieldStatus(field.id, "REJECTED");
                                                                setPendingFields(fieldService.getFields().filter(f => f.status === "PENDING"));
                                                                toast.error("Field rejected");
                                                            }}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </PanelLayout>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <Card className="glass-card border-none shadow-md">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-green-50">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-green-600/70">{label}</p>
                    <h4 className="text-2xl font-bold text-green-900">{value}</h4>
                </div>
            </CardContent>
        </Card>
    );
}
function AuditLogItem({ type, msg, time }: { type: string, msg: string, time: string }) {
    return (
        <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-green-50 shadow-sm">
            <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-[10px] font-bold py-0">{type}</Badge>
                <p className="text-xs font-medium text-green-900">{msg}</p>
            </div>
            <span className="text-[10px] font-bold text-green-600/40 uppercase tracking-tighter">{time}</span>
        </div>
    );
}
