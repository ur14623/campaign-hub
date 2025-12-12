import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Database, Copy, Edit, Trash2, Calendar, Tag, Code, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SQLQuery {
  id: string;
  title: string;
  description: string;
  sql: string;
  type: string;
  createdAt: string;
  sampleOutput: { columns: string[]; rows: string[][] };
}

const mockQueries: SQLQuery[] = [
  {
    id: "1",
    title: "Active Customers",
    description: "Get all active customers with their last transaction date and total spending",
    sql: `SELECT 
  c.customer_id,
  c.customer_name,
  c.phone_number,
  MAX(t.transaction_date) as last_transaction,
  SUM(t.amount) as total_spending
FROM customers c
JOIN transactions t ON c.customer_id = t.customer_id
WHERE c.status = 'active'
GROUP BY c.customer_id, c.customer_name, c.phone_number
ORDER BY total_spending DESC;`,
    type: "Customer",
    createdAt: "2024-01-15",
    sampleOutput: {
      columns: ["customer_id", "customer_name", "phone_number", "last_transaction", "total_spending"],
      rows: [
        ["C001", "Abebe Kebede", "0911234567", "2024-01-14", "15,000"],
        ["C002", "Sara Tadesse", "0922345678", "2024-01-13", "12,500"],
      ]
    }
  },
  {
    id: "2",
    title: "Active Users Monthly",
    description: "Monthly active users count with growth percentage comparison",
    sql: `SELECT 
  DATE_TRUNC('month', activity_date) as month,
  COUNT(DISTINCT user_id) as active_users,
  LAG(COUNT(DISTINCT user_id)) OVER (ORDER BY DATE_TRUNC('month', activity_date)) as prev_month,
  ROUND(((COUNT(DISTINCT user_id) - LAG(COUNT(DISTINCT user_id)) OVER (ORDER BY DATE_TRUNC('month', activity_date))) * 100.0 / 
    NULLIF(LAG(COUNT(DISTINCT user_id)) OVER (ORDER BY DATE_TRUNC('month', activity_date)), 0)), 2) as growth_pct
FROM user_activity
GROUP BY DATE_TRUNC('month', activity_date)
ORDER BY month DESC;`,
    type: "Analytics",
    createdAt: "2024-01-10",
    sampleOutput: {
      columns: ["month", "active_users", "prev_month", "growth_pct"],
      rows: [
        ["2024-01", "45,230", "42,100", "7.43"],
        ["2023-12", "42,100", "39,800", "5.78"],
      ]
    }
  },
  {
    id: "3",
    title: "Activity Summary SQL",
    description: "Comprehensive activity summary by customer segment and transaction type",
    sql: `SELECT 
  cs.segment_name,
  tt.type_name,
  COUNT(*) as transaction_count,
  SUM(t.amount) as total_amount,
  AVG(t.amount) as avg_amount
FROM transactions t
JOIN customer_segments cs ON t.customer_segment_id = cs.id
JOIN transaction_types tt ON t.type_id = tt.id
WHERE t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY cs.segment_name, tt.type_name
ORDER BY total_amount DESC;`,
    type: "Report",
    createdAt: "2024-01-08",
    sampleOutput: {
      columns: ["segment_name", "type_name", "transaction_count", "total_amount", "avg_amount"],
      rows: [
        ["Premium", "Transfer", "12,450", "8,500,000", "682.73"],
        ["Standard", "Recharge", "28,320", "4,250,000", "150.07"],
      ]
    }
  },
  {
    id: "4",
    title: "Churned Customers Report",
    description: "Identify customers who haven't transacted in the last 90 days",
    sql: `SELECT 
  c.customer_id,
  c.customer_name,
  c.registration_date,
  MAX(t.transaction_date) as last_activity,
  CURRENT_DATE - MAX(t.transaction_date) as days_inactive
FROM customers c
LEFT JOIN transactions t ON c.customer_id = t.customer_id
GROUP BY c.customer_id, c.customer_name, c.registration_date
HAVING MAX(t.transaction_date) < CURRENT_DATE - INTERVAL '90 days'
   OR MAX(t.transaction_date) IS NULL
ORDER BY days_inactive DESC;`,
    type: "Customer",
    createdAt: "2024-01-05",
    sampleOutput: {
      columns: ["customer_id", "customer_name", "registration_date", "last_activity", "days_inactive"],
      rows: [
        ["C156", "Mulugeta Haile", "2023-05-20", "2023-10-01", "106"],
        ["C289", "Tigist Alemu", "2023-06-15", "2023-10-15", "92"],
      ]
    }
  },
  {
    id: "5",
    title: "Revenue by Region",
    description: "Total revenue breakdown by geographic region with customer count",
    sql: `SELECT 
  r.region_name,
  COUNT(DISTINCT c.customer_id) as customer_count,
  SUM(t.amount) as total_revenue,
  AVG(t.amount) as avg_transaction
FROM regions r
JOIN customers c ON r.id = c.region_id
JOIN transactions t ON c.customer_id = t.customer_id
WHERE t.transaction_date >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY r.region_name
ORDER BY total_revenue DESC;`,
    type: "Report",
    createdAt: "2024-01-02",
    sampleOutput: {
      columns: ["region_name", "customer_count", "total_revenue", "avg_transaction"],
      rows: [
        ["Addis Ababa", "125,000", "45,000,000", "360"],
        ["Oromia", "85,000", "28,500,000", "335"],
      ]
    }
  },
  {
    id: "6",
    title: "Daily Transaction Volume",
    description: "Track daily transaction volumes and amounts for the past week",
    sql: `SELECT 
  DATE(transaction_date) as date,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  COUNT(DISTINCT customer_id) as unique_customers
FROM transactions
WHERE transaction_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(transaction_date)
ORDER BY date DESC;`,
    type: "Analytics",
    createdAt: "2023-12-28",
    sampleOutput: {
      columns: ["date", "transaction_count", "total_amount", "unique_customers"],
      rows: [
        ["2024-01-15", "15,234", "2,850,000", "8,450"],
        ["2024-01-14", "14,890", "2,720,000", "8,120"],
      ]
    }
  },
];

const queryTypes = ["All", "Customer", "Analytics", "Report", "Campaign"];

const SQLQueryLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuery, setSelectedQuery] = useState<SQLQuery | null>(null);
  const itemsPerPage = 5;

  // Smart search with fuzzy matching
  const getSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return mockQueries
      .map(query => ({
        ...query,
        relevance: (() => {
          const title = query.title.toLowerCase();
          if (title === term) return 100;
          if (title.startsWith(term)) return 90;
          if (title.includes(term)) return 70;
          // Fuzzy match - check if characters appear in order
          let termIndex = 0;
          for (const char of title) {
            if (char === term[termIndex]) termIndex++;
            if (termIndex === term.length) break;
          }
          return termIndex === term.length ? 50 : 0;
        })()
      }))
      .filter(q => q.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  }, [searchTerm]);

  // Filtered queries
  const filteredQueries = useMemo(() => {
    return mockQueries.filter(query => {
      const matchesSearch = !searchTerm || 
        query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "All" || query.type === selectedType;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const queryDate = new Date(query.createdAt);
        const now = new Date();
        if (dateFilter === "week") {
          matchesDate = (now.getTime() - queryDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        } else if (dateFilter === "month") {
          matchesDate = (now.getTime() - queryDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        } else if (dateFilter === "year") {
          matchesDate = (now.getTime() - queryDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
        }
      }
      
      return matchesSearch && matchesType && matchesDate;
    });
  }, [searchTerm, selectedType, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredQueries.length / itemsPerPage);
  const paginatedQueries = filteredQueries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCopySQL = (sql: string) => {
    navigator.clipboard.writeText(sql);
    toast({ title: "Copied!", description: "SQL query copied to clipboard" });
  };

  const handleSelectSuggestion = (query: SQLQuery) => {
    setSearchTerm(query.title);
    setShowSuggestions(false);
    setSelectedQuery(query);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">SQL Query Library</h1>
        <p className="text-muted-foreground mt-1">Browse, search, and manage your SQL queries</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Smart Search */}
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && getSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                  {getSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2"
                      onMouseDown={() => handleSelectSuggestion(suggestion)}
                    >
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {suggestion.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px]">
                <Tag className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {queryTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Query List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Stored Queries ({filteredQueries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paginatedQueries.map((query) => (
              <div
                key={query.id}
                className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => setSelectedQuery(query)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{query.title}</h3>
                      <Badge variant="secondary">{query.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {query.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {query.createdAt}
                      </span>
                    </div>
                  </div>
                  <Code className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}

            {paginatedQueries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No queries found matching your criteria
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Query Detail Dialog */}
      <Dialog open={!!selectedQuery} onOpenChange={() => setSelectedQuery(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedQuery && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {selectedQuery.title}
                  <Badge variant="secondary">{selectedQuery.type}</Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedQuery.description}</p>
                </div>

                {/* SQL Code */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">SQL Code</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopySQL(selectedQuery.sql)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy SQL
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="text-foreground">{selectedQuery.sql}</code>
                  </pre>
                </div>

                {/* Sample Output */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Sample Output</h4>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {selectedQuery.sampleOutput.columns.map((col) => (
                            <TableHead key={col}>{col}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedQuery.sampleOutput.rows.map((row, idx) => (
                          <TableRow key={idx}>
                            {row.map((cell, cellIdx) => (
                              <TableCell key={cellIdx}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-4 border-t border-border">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SQLQueryLibrary;
