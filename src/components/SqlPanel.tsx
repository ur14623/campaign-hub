import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Download, FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

const sampleResults = [
  { msisdn: "0912345678", status: "Active", activation_date: "2025-01-15", redemption: "Yes" },
  { msisdn: "0923456789", status: "Active", activation_date: "2025-01-14", redemption: "No" },
  { msisdn: "0934567890", status: "Inactive", activation_date: "2025-01-13", redemption: "Yes" },
  { msisdn: "0945678901", status: "Active", activation_date: "2025-01-12", redemption: "Yes" },
  { msisdn: "0956789012", status: "Active", activation_date: "2025-01-11", redemption: "No" },
];

export function SqlPanel() {
  const [query, setQuery] = useState(`SELECT 
  msisdn,
  status,
  activation_date,
  redemption
FROM campaign_customers
WHERE campaign_id = 'WIN_BACK_CHURNER'
  AND activation_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY activation_date DESC
LIMIT 100;`);

  const [results, setResults] = useState(sampleResults);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunQuery = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResults(sampleResults);
      setIsLoading(false);
      toast.success("Query executed successfully");
    }, 1000);
  };

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    toast.success(`Exporting to ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>SQL Query Panel</span>
            <Button onClick={handleRunQuery} disabled={isLoading}>
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? "Running..." : "Run Query"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-mono text-sm min-h-[150px]"
            placeholder="Enter your SQL query here..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Query Results ({results.length} rows)</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MSISDN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Activation Date</TableHead>
                  <TableHead>Redemption</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{row.msisdn}</TableCell>
                    <TableCell>
                      <span className={row.status === "Active" ? "text-success" : "text-muted-foreground"}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell>{row.activation_date}</TableCell>
                    <TableCell>
                      <span className={row.redemption === "Yes" ? "text-success" : "text-muted-foreground"}>
                        {row.redemption}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
