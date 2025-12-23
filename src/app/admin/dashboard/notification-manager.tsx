"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateHomeNotification } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export function NotificationManager() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const firestore = useFirestore();
  const notificationRef = useMemoFirebase(() => doc(firestore, "site-content", "home-notification"), [firestore]);
  const { data: notification, isLoading: fetching } = useDoc(notificationRef);

  useEffect(() => {
    if (notification) {
      setTitle(notification.title || "");
      setMessage(notification.message || "");
      setActive(notification.active || false);
    }
  }, [notification]);

  const handleSave = async () => {
    setLoading(true);
    const result = await updateHomeNotification(title, message, active);
    setLoading(false);

    if (result.success) {
      toast({ title: "Success", description: "Notification updated successfully." });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.error });
    }
  };

  if (fetching) return <div className="text-center py-8">Loading notification settings...</div>;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Home Page Notification</CardTitle>
            <CardDescription>Update the announcement banner on the main page.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="notify-active" checked={active} onCheckedChange={setActive} />
            <Label htmlFor="notify-active">{active ? "Active" : "Inactive"}</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notify-title">Alert Title</Label>
          <Input 
            id="notify-title" 
            placeholder="e.g., Upcoming Event!" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notify-message">Alert Description</Label>
          <Textarea 
            id="notify-message" 
            placeholder="Details about the event or announcement..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            rows={4}
          />
        </div>
        <Button onClick={handleSave} className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Notification"}
        </Button>
      </CardContent>
    </Card>
  );
}
