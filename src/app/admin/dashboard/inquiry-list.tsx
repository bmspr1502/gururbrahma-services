"use client";

import { useState, useEffect } from "react";
import { getInquiries } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User, Phone, Calendar as CalendarIcon, Hash } from "lucide-react";

export function InquiryList() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInquiries() {
      const result = await getInquiries();
      if (result.success && result.data) {
        setInquiries(result.data);
      }
      setLoading(false);
    }
    fetchInquiries();
  }, []);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Service Inquiries</CardTitle>
        <CardDescription>Recent requests submitted by users through the services page.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading inquiries...</div>
        ) : inquiries?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No inquiries received yet.</div>
        ) : (
          <div className="space-y-4">
            {inquiries?.map((inquiry: any) => (
              <Card key={inquiry.id} className="bg-muted/30 border-none shadow-none">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {inquiry.serviceName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {inquiry.createdAt ? format(new Date(inquiry.createdAt), "PPP p") : "Just now"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{inquiry.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{inquiry.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-accent font-medium">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Pref. Date: {inquiry.preferredDate ? format(new Date(inquiry.preferredDate), "PPP") : "N/A"}</span>
                        </div>
                        {inquiry.rashiNakshatra && (
                          <div className="flex items-center gap-2 text-sm">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            <span>{inquiry.rashiNakshatra}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                       <Badge className={inquiry.status === "new" ? "bg-green-500" : "bg-blue-500"}>
                         {inquiry.status || "new"}
                       </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
