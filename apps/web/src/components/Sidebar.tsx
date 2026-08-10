import React from "react";
import { Sparkles, Calendar, Bell, Bookmark } from "lucide-react";

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-full">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sticky top-24">
        <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Our Sidebar
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Explore community updates, latest announcements, and featured topics.
        </p>

        <ul className="space-y-2">
          <li className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 text-sm text-foreground transition-colors cursor-pointer">
            <Bookmark className="w-4 h-4 text-primary" />
            <span>Latest Posts</span>
          </li>
          <li className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 text-sm text-foreground transition-colors cursor-pointer">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Announcements</span>
          </li>
          <li className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 text-sm text-foreground transition-colors cursor-pointer">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Calendars & Events</span>
          </li>
        </ul>
      </div>
    </aside>
  );
};
