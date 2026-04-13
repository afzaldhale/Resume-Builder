import { useEffect, useRef, useState } from "react";
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
import { Button } from "../ui/button";
import { Download, RefreshCcw, Loader2, Clock, CheckCircle2, FileText, XCircle } from "lucide-react";
import api from "@/api/axios";
import { toast } from "sonner";

interface Request {
  id: number;
  resume_id: number;
  resume_title: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
}

interface ResumeListItem {
  id: number;
  title: string;
  created_at: string;
  status: "draft" | "pending" | "approved" | "rejected";
}

const Requests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRequests = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await api.get("/api/resumes/mine");
      const resumes: ResumeListItem[] = res.data.resumes ?? [];

      const requestItems = resumes
        .filter((resume) => resume.status !== "draft")
        .map((resume) => ({
          id: resume.id,
          resume_id: resume.id,
          resume_title: resume.title,
          created_at: resume.created_at,
          status: resume.status as Request["status"],
        }));

      setRequests(requestItems);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load requests");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    pollingRef.current = setInterval(() => {
      fetchRequests(true);
    }, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const downloadPDF = async (resumeId: number) => {
    try {
      setDownloadingId(resumeId);

      const res = await api.get(`/api/resumes/${resumeId}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume-${resumeId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("PDF download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: Request["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success">Approved</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const totalRequests = requests.length;
  const approvedCount = requests.filter((request) => request.status === "approved").length;
  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const rejectedCount = requests.filter((request) => request.status === "rejected").length;

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Download Requests</h1>
              <p className="text-muted-foreground">
                See how many requests you have made, track approval status, and download approved PDFs from here.
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={() => fetchRequests()}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-3xl font-bold mt-2">{totalRequests}</p>
                </div>
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </Card>

            <Card className="p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold mt-2">{pendingCount}</p>
                </div>
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </Card>

            <Card className="p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold mt-2">{approvedCount}</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </Card>

            <Card className="p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold mt-2">{rejectedCount}</p>
                </div>
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </Card>
          </div>

          <Card className="shadow-soft">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resume Name</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      No requests found yet. Submit a resume for approval and it will appear here.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.resume_title}</TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        {request.status === "approved" ? (
                          <Button
                            size="sm"
                            disabled={downloadingId === request.resume_id}
                            onClick={() => downloadPDF(request.resume_id)}
                          >
                            {downloadingId === request.resume_id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Preparing...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {request.status === "pending"
                              ? "Waiting for approval"
                              : "Not available"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Requests;
