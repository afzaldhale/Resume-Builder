import { useEffect, useMemo, useState } from "react";
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
import api from "../../../api/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { LazyTemplateRenderer } from "../../resume-templates/TemplateRegistry";
import type { ResumeData } from "../../resume-templates/types";

/* =======================
   TYPES
======================= */

interface Request {
  id: number;
  user_name: string;
  resume_title: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
}

interface PreviewData {
  title: string;
  templateId: number;
  resumeData: ResumeData;
}

/* =======================
   CONSTANTS
======================= */

const PAGE_SIZE = 10;

/* =======================
   DATE FORMATTER
======================= */

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
};

/* =======================
   COMPONENT
======================= */

const AdminRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  /* =======================
     FETCH REQUESTS
  ======================= */

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/admin/requests");
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* =======================
     OPTIMISTIC UPDATE
  ======================= */

  const updateRequestStatus = (id: number, status: "approved" | "rejected") => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status } : req
      )
    );
  };

  /* =======================
     APPROVE
  ======================= */

  const handleApprove = async (id: number) => {
    try {
      updateRequestStatus(id, "approved");
      await api.put(`/api/admin/requests/${id}/approve`);
      toast.success("Resume approved");
    } catch (error) {
      toast.error("Approval failed");
      fetchRequests(); // rollback safety
    }
  };

  /* =======================
     REJECT
  ======================= */

  const handleReject = async (id: number) => {
    try {
      updateRequestStatus(id, "rejected");
      await api.put(`/api/admin/requests/${id}/reject`);
      toast.success("Resume rejected");
    } catch (error) {
      toast.error("Rejection failed");
      fetchRequests(); // rollback safety
    }
  };

  const handlePreview = async (id: number) => {
    try {
      setPreviewLoading(true);
      setPreviewOpen(true);
      const res = await api.get(`/api/admin/requests/${id}/preview`);
      setPreviewData(res.data?.resume ?? null);
    } catch {
      toast.error("Failed to load preview");
      setPreviewOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  /* =======================
     PAGINATION
  ======================= */

  const totalPages = Math.ceil(requests.length / PAGE_SIZE);

  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return requests.slice(start, start + PAGE_SIZE);
  }, [requests, page]);

  /* =======================
     STATUS BADGE
  ======================= */

  const getStatusBadge = (status: Request["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success">Approved</Badge>;
      case "pending":
        return <Badge className="bg-warning">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-destructive">Rejected</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading requests...
      </div>
    );
  }

  /* =======================
     UI
  ======================= */

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Requests</h1>
            <p className="text-muted-foreground">
              Review and approve resume download requests
            </p>
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
                {paginatedRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.user_name}
                    </TableCell>

                    <TableCell>{request.resume_title}</TableCell>

                    <TableCell>{formatDate(request.created_at)}</TableCell>

                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(request.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {request.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-success"
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request.id)}
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

            {/* PAGINATION */}
            <div className="flex justify-end items-center gap-3 p-4 border-t">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Prev
              </Button>

              <span className="text-sm">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{previewData?.title || "Resume Preview"}</DialogTitle>
            <DialogDescription>
              Review the submitted resume before approving or rejecting it.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-muted rounded-lg p-4">
            {previewLoading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Loading preview...
              </div>
            ) : previewData ? (
              <div className="w-full overflow-auto">
                <div className="mx-auto w-fit scale-[0.6] origin-top">
                  <LazyTemplateRenderer
                    templateId={previewData.templateId}
                    data={previewData.resumeData}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No preview available.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequests;
