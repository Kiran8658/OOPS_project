import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface StatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: string; // Could be JSON or formatted string for report
}

export function StatDetailModal({ isOpen, onClose, title, data }: StatDetailModalProps) {
  const handleDownload = () => {
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title} Details</DialogTitle>
          <DialogDescription>
            Detailed analytics data for {title}.
          </DialogDescription>
        </DialogHeader>
        <pre className="whitespace-pre-wrap p-4 bg-gray-100 rounded-md text-sm">{data}</pre>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleDownload} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
