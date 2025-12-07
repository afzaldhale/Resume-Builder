import AdminSidebar from "../../AdminSidebar";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";

const AdminRequests = () => {
  const requests = [
    {
      id: 1,
      userName: "John Doe",
      resumeTitle: "Software Engineer Resume",
      requestDate: "2025-01-20",
      status: "pending",
    },
    {
      id: 2,
      userName: "Jane Smith",
      resumeTitle: "Product Manager Resume",
      requestDate: "2025-01-19",
      status: "pending",
    },
    {
      id: 3,
      userName: "Bob Johnson",
      resumeTitle: "Data Analyst Resume",
      requestDate: "2025-01-18",
      status: "approved",
    },
    {
      id: 4,
      userName: "Alice Williams",
      resumeTitle: "UX Designer Resume",
      requestDate: "2025-01-17",
      status: "approved",
    },
  ];

  const handleApprove = (id: number, name: string) => {
    toast.success(`Approved resume request for ${name}`);
  };

  const handleReject = (id: number, name: string) => {
    toast.error(`Rejected resume request for ${name}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success hover:bg-success">Approved</Badge>;
      case "pending":
        return <Badge className="bg-warning hover:bg-warning">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-destructive hover:bg-destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Requests</h1>
            <p className="text-muted-foreground">Review and approve resume download requests</p>
          </div>

          <Card className="shadow-soft overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Resume Title</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.userName}</TableCell>
                    <TableCell>{request.resumeTitle}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="h-8 bg-success hover:bg-success/90"
                              onClick={() => handleApprove(request.id, request.userName)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8"
                              onClick={() => handleReject(request.id, request.userName)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminRequests;