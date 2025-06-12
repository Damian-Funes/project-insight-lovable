
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotificationBell = () => {
  return (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="w-5 h-5" />
    </Button>
  );
};
