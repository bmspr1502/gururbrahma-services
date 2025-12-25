"use client";

import { useState, useEffect } from "react";
import { getInquiries, updateInquiryStatus, updateInquirySchedule, deleteInquiry } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { User, Phone, Calendar as CalendarIcon, Hash, Mail, Clock, FileText, ArrowUpDown, Trash2, CheckCircle2, CalendarClock, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

export function InquiryList() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClosed, setShowClosed] = useState(false);
  const [sortKey, setSortKey] = useState<"timestamp" | "preferredDate">("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  const fetchInquiries = async () => {
    setLoading(true);
    const result = await getInquiries(showClosed);
    if (result.success && result.data) {
      setInquiries(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, [showClosed]);

  const handleStatusUpdate = async (id: string, status: any) => {
    const res = await updateInquiryStatus(id, status);
    if (res.success) {
      toast({ title: "Status Updated", description: `Enquiry marked as ${status}.` });
      fetchInquiries();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    const res = await deleteInquiry(id);
    if (res.success) {
      toast({ title: "Deleted", description: "Enquiry has been removed." });
      fetchInquiries();
    }
  };

  const handleScheduleUpdate = async (id: string, date: Date, time: string) => {
    const res = await updateInquirySchedule(id, date, time);
    if (res.success) {
      toast({ title: "Schedule Updated", description: "User has been notified of the change." });
      fetchInquiries();
    }
  };

  const sortedInquiries = [...inquiries].sort((a, b) => {
    const valA = new Date(a[sortKey]).getTime();
    const valB = new Date(b[sortKey]).getTime();
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const toggleSort = (key: any) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border border-primary/10 shadow-sm">
        <div className="flex items-center space-x-2">
          <Checkbox id="showClosed" checked={showClosed} onCheckedChange={(checked) => setShowClosed(!!checked)} />
          <label htmlFor="showClosed" className="text-sm font-medium leading-none cursor-pointer">Show Completed / Deleted</label>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toggleSort("timestamp")} className={sortKey === "timestamp" ? "border-primary text-primary" : ""}>
            Enquiry Date {sortKey === "timestamp" && (sortOrder === "asc" ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />)}
          </Button>
          <Button variant="outline" size="sm" onClick={() => toggleSort("preferredDate")} className={sortKey === "preferredDate" ? "border-primary text-primary" : ""}>
            Preferred Date {sortKey === "preferredDate" && (sortOrder === "asc" ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />)}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">Loading inquiries...</div>
        ) : sortedInquiries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">No inquiries found matching current filters.</div>
        ) : (
          sortedInquiries.map((inquiry) => (
            <InquiryCard 
              key={inquiry.id} 
              inquiry={inquiry} 
              onStatusUpdate={handleStatusUpdate} 
              onScheduleUpdate={handleScheduleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

function InquiryCard({ inquiry, onStatusUpdate, onScheduleUpdate, onDelete }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState<Date | undefined>(new Date(inquiry.preferredDate));
  const [newTime, setNewTime] = useState(inquiry.preferredTime);

  const statusColors: any = {
    open: "bg-blue-500 hover:bg-blue-600",
    confirmed: "bg-yellow-500 hover:bg-yellow-600 text-black",
    completed: "bg-green-600 hover:bg-green-700",
  };

  return (
    <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow transition-colors duration-200">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">{inquiry.serviceName}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            Submitted {format(new Date(inquiry.timestamp), "PPP p")}
          </CardDescription>
        </div>
        <Badge className={statusColors[inquiry.status || "open"]}>
          {(inquiry.status || "open").toUpperCase()}
        </Badge>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-primary/60" />
            <span className="font-semibold text-base">{inquiry.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-primary/60" />
            <a href={`mailto:${inquiry.email}`} className="hover:text-primary transition-colors">{inquiry.email}</a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-primary/60" />
            <a href={`tel:${inquiry.phone}`} className="hover:text-primary transition-colors">{inquiry.phone}</a>
          </div>
          {inquiry.rashiNakshatra && (
            <div className="flex items-center gap-3 text-sm">
              <Hash className="w-4 h-4 text-primary/60" />
              <span>{inquiry.rashiNakshatra}</span>
            </div>
          )}
        </div>

        <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm font-medium">
              <CalendarIcon className="w-4 h-4 text-accent" />
              <span>{format(new Date(inquiry.preferredDate), "PPP")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <Clock className="w-4 h-4 text-accent" />
              <span>{inquiry.preferredTime}</span>
            </div>
          </div>
          
          <hr className="border-primary/10" />
          
          {inquiry.description && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-bold">
                <FileText className="w-3 h-3" /> Note
              </div>
              <p className="text-sm italic text-muted-foreground">"{inquiry.description}"</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="bg-primary/5 border-t border-primary/10 p-4 flex flex-wrap justify-between gap-4">
        <div className="flex flex-wrap gap-2">
           <Button 
            size="sm" 
            variant={inquiry.status === "open" ? "default" : "outline"} 
            className={inquiry.status === "open" ? "bg-blue-600 hover:bg-blue-700" : "text-blue-600 border-blue-600 hover:bg-blue-50"}
            onClick={() => onStatusUpdate(inquiry.id, "open")}
          >
            Open
          </Button>
          <Button 
            size="sm" 
            variant={inquiry.status === "confirmed" ? "default" : "outline"}
            className={inquiry.status === "confirmed" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "text-yellow-600 border-yellow-600 hover:bg-yellow-50"}
            onClick={() => onStatusUpdate(inquiry.id, "confirmed")}
          >
            Confirm
          </Button>
          <Button 
            size="sm" 
            variant={inquiry.status === "completed" ? "default" : "outline"}
            className={inquiry.status === "completed" ? "bg-green-600 hover:bg-green-700" : "text-green-600 border-green-600 hover:bg-green-50"}
            onClick={() => onStatusUpdate(inquiry.id, "completed")}
          >
            Complete
          </Button>
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <CalendarClock className="w-4 h-4" /> Change Schedule
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 space-y-4" align="end">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">New Date</label>
                <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={setNewDate}
                  initialFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">New Time</label>
                <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              </div>
              <Button 
                className="w-full" 
                onClick={() => {
                  if (newDate) onScheduleUpdate(inquiry.id, newDate, newTime);
                }}
              >
                Save & Notify User
              </Button>
            </PopoverContent>
          </Popover>

          <Button size="icon" variant="destructive" onClick={() => onDelete(inquiry.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
