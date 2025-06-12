
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

interface ReportType {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  period: string;
  size: string;
}

interface ReportsTableProps {
  reportTypes: ReportType[];
}

export const ReportsTable = memo(({ reportTypes }: ReportsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Relatórios Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reportTypes.map((report, index) => (
            <Card key={index} className="border border-border hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-chart-primary to-chart-secondary rounded-lg flex items-center justify-center">
                      <report.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className="bg-chart-primary/10 text-chart-primary border-chart-primary">
                          {report.period}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-chart-primary hover:bg-chart-primary/90"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

ReportsTable.displayName = 'ReportsTable';
