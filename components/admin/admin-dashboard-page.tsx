"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  CalendarCheck,
  DollarSign,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminDashboardData } from "@/lib/actions/get-admin-dashboard-data";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  BOOKED: "#3b82f6",
  ONGOING: "#8b5cf6",
  CANCELLED: "#ef4444",
  COMPLETED: "#10b981",
};

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

function formatCurrency(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: number;
  subtitle?: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {trend !== undefined && (
          <div
            className={`mt-1 flex items-center text-xs font-medium ${
              trend >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {Math.abs(trend)} from last month
          </div>
        )}
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
  valuePrefix = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  valuePrefix?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">
          {valuePrefix}
          {typeof payload[0].value === "number"
            ? payload[0].value.toLocaleString()
            : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

export function AdminDashboardPage({ data }: { data: AdminDashboardData }) {
  const {
    totalUsers,
    newUsersThisMonth,
    userGrowth,
    totalRooms,
    statusCounts,
    activeBookings,
    bookingGrowth,
    recentBookings,
    totalRevenue,
    monthlyRevenue,
    revenueChartData,
    bookingChartData,
    statusChartData,
    recentTransactions,
  } = data;

  return (
    <ScrollArea className="h-full bg-muted/40">
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your booking platform performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={totalUsers.toLocaleString()}
            icon={Users}
            trend={userGrowth}
            subtitle={`${newUsersThisMonth} new this month`}
          />
          <StatCard
            title="Total Rooms"
            value={totalRooms.toString()}
            icon={Building2}
          />
          <StatCard
            title="Active Bookings"
            value={activeBookings.toString()}
            icon={CalendarCheck}
            trend={bookingGrowth}
            subtitle={`${statusCounts.PENDING ?? 0} pending approval`}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            subtitle={`${formatCurrency(monthlyRevenue)} this month`}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Revenue This Month
              </CardTitle>
              <CardDescription>
                Daily successful transaction volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip content={<CustomTooltip valuePrefix="$" />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Booking Status
              </CardTitle>
              <CardDescription>Distribution by current state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            STATUS_COLORS[entry.name] ||
                            PIE_COLORS[index % PIE_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                {statusChartData.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[s.name] || "#6b7280",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {s.name} ({s.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Weekly Bookings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Bookings (Last 7 Days)
              </CardTitle>
              <CardDescription>New bookings created per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="bookings"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Recent Transactions
              </CardTitle>
              <CardDescription>Latest payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No transactions yet.
                  </p>
                )}
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {tx.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.provider} • {tx.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings Table */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Recent Bookings
                </CardTitle>
                <CardDescription>
                  Latest 10 bookings across all rooms
                </CardDescription>
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                {recentBookings.length} shown
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Room</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.room.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{booking.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {booking.user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-medium"
                        style={{
                          borderColor:
                            STATUS_COLORS[booking.status] || undefined,
                          color: STATUS_COLORS[booking.status] || undefined,
                          backgroundColor: STATUS_COLORS[booking.status]
                            ? `${STATUS_COLORS[booking.status]}15`
                            : undefined,
                        }}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      ${(booking.room.rate / 100).toFixed(2)}/hr
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}