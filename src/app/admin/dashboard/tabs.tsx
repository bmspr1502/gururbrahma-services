"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Newspaper, Video, Bell } from "lucide-react";
import { NotificationManager } from "./notification-manager";
import { PostManager } from "./post-manager";
import { VideoManager } from "./video-manager";
import { InquiryList } from "./inquiry-list";

export function DashboardTabs() {
  return (
    <Tabs defaultValue="inquiries" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="inquiries" className="flex gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Inquiries</span>
        </TabsTrigger>
        <TabsTrigger value="posts" className="flex gap-2">
          <Newspaper className="w-4 h-4" />
          <span className="hidden sm:inline">Posts</span>
        </TabsTrigger>
        <TabsTrigger value="videos" className="flex gap-2">
          <Video className="w-4 h-4" />
          <span className="hidden sm:inline">Videos</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex gap-2">
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="inquiries">
        <InquiryList />
      </TabsContent>
      
      <TabsContent value="posts">
        <PostManager />
      </TabsContent>
      
      <TabsContent value="videos">
        <VideoManager />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationManager />
      </TabsContent>
    </Tabs>
  );
}
