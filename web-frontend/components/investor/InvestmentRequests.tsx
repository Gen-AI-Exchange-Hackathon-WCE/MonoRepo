"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  User,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  getInvestmentInterestsByStatus,
  updateInterestStatus,
  InvestmentInterest,
} from "@/lib/api/investor";

interface InvestmentRequestsProps {
  className?: string;
}

export function InvestmentRequests({ className }: InvestmentRequestsProps) {
  const [pendingRequests, setPendingRequests] = useState<InvestmentInterest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<InvestmentInterest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<InvestmentInterest[]>([]);
  const [isLoading, setIsLoading] = useState<{
    pending?: boolean;
    accepted?: boolean;
    rejected?: boolean;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [processingRequest, setProcessingRequest] = useState<number | null>(null);

  // Load requests by status
  const loadRequests = async (status: "PENDING" | "ACCEPTED" | "REJECTED") => {
    setIsLoading(prev => ({ ...prev, [status.toLowerCase()]: true }));
    try {
      const response = await getInvestmentInterestsByStatus(status);
      if (response.success && response.data) {
        switch (status) {
          case "PENDING":
            setPendingRequests(response.data);
            break;
          case "ACCEPTED":
            setAcceptedRequests(response.data);
            break;
          case "REJECTED":
            setRejectedRequests(response.data);
            break;
        }
      }
    } catch (err: any) {
      console.error(`Failed to load ${status.toLowerCase()} requests:`, err);
      setError(err.message || `Failed to load ${status.toLowerCase()} requests`);
    } finally {
      setIsLoading(prev => ({ ...prev, [status.toLowerCase()]: false }));
    }
  };

  // Load all requests on mount
  useEffect(() => {
    loadRequests("PENDING");
    loadRequests("ACCEPTED");
    loadRequests("REJECTED");
  }, []);

  // Handle accept/reject request
  const handleRequestAction = async (
    interestId: number,
    isAccepted: boolean
  ) => {
    setProcessingRequest(interestId);
    try {
      const response = await updateInterestStatus({
        interestId,
        isAccepted,
      });

      if (response.success) {
        // Remove from pending and add to appropriate list
        const request = pendingRequests.find(r => r.id === interestId);
        if (request) {
          setPendingRequests(prev => prev.filter(r => r.id !== interestId));
          const updatedRequest = { ...request, status: isAccepted ? "ACCEPTED" as const : "REJECTED" as const };
          
          if (isAccepted) {
            setAcceptedRequests(prev => [updatedRequest, ...prev]);
          } else {
            setRejectedRequests(prev => [updatedRequest, ...prev]);
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to update request status:", err);
      setError(err.message || "Failed to update request status");
    } finally {
      setProcessingRequest(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const RequestCard = ({ request, showActions = false }: { 
    request: InvestmentInterest; 
    showActions?: boolean; 
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={request.artist?.profile?.profilePhoto || undefined} />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">
                {request.artist?.name || `Artist ${request.artistId}`}
              </h3>
              {request.artist?.profile?.businessLocation && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {request.artist.profile.businessLocation}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                request.status === "PENDING"
                  ? "secondary"
                  : request.status === "ACCEPTED"
                  ? "default"
                  : "destructive"
              }
            >
              {request.status === "PENDING" && <Clock className="w-3 h-3 mr-1" />}
              {request.status === "ACCEPTED" && <CheckCircle className="w-3 h-3 mr-1" />}
              {request.status === "REJECTED" && <XCircle className="w-3 h-3 mr-1" />}
              {request.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Message</h4>
            <p className="text-sm text-gray-600 line-clamp-3">{request.message}</p>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(request.createdAt)}
            </div>
          </div>

          {showActions && request.status === "PENDING" && (
            <div className="flex gap-2 pt-3 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRequestAction(request.id, false)}
                disabled={processingRequest === request.id}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => handleRequestAction(request.id, true)}
                disabled={processingRequest === request.id}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Accept
              </Button>
            </div>
          )}

          {request.status !== "PENDING" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Full Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    Investment Request from {request.artist?.name || `Artist ${request.artistId}`}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Message:</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {request.message}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Received on {formatDate(request.createdAt)}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Investment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Accepted ({acceptedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Rejected ({rejectedRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {isLoading.pending ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <RequestCard key={request.id} request={request} showActions />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Pending Requests
                  </h3>
                  <p className="text-gray-500">
                    You don't have any pending investment requests at the moment.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4 mt-6">
              {isLoading.accepted ? (
                <div className="text-center py-4">Loading accepted requests...</div>
              ) : acceptedRequests.length > 0 ? (
                <div className="space-y-4">
                  {acceptedRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Accepted Requests
                  </h3>
                  <p className="text-gray-500">
                    You haven't accepted any investment requests yet.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 mt-6">
              {isLoading.rejected ? (
                <div className="text-center py-4">Loading rejected requests...</div>
              ) : rejectedRequests.length > 0 ? (
                <div className="space-y-4">
                  {rejectedRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Rejected Requests
                  </h3>
                  <p className="text-gray-500">
                    You haven't rejected any investment requests.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}