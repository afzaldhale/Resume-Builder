import UserSidebar from "../UserSidebar";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

const Requests = () => {
  const requests = [
    {
      id: 1,
      resumeName: "Software Engineer Resume",
      requestDate: "2025-01-15",
      status: "approved",
    },
    {
      id: 2,
      resumeName: "Product Manager Resume",
      requestDate: "2025-01-20",
      status: "pending",
    },
    {
      id: 3,
      resumeName: "Data Analyst Resume",
      requestDate: "2025-01-10",
      status: "approved",
    },
  ];

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
      <UserSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Download Requests</h1>
            <p className="text-muted-foreground">Track the status of your resume download requests</p>
          </div>

          <Card className="shadow-soft">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resume Name</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.resumeName}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
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

export default Requests;
