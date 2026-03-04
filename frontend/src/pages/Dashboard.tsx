import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, Users, Ticket, Ban, DollarSign, Bus } from "lucide-react";
import { format } from "date-fns";
import { ticketService } from "../services/ticketService";
import { authService } from "../services/authService";
import { Stats } from "../interface/ticket";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, userData] = await Promise.all([
          ticketService.getStatistics(),
          authService.me()
        ]);
        setStats(statsData);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-12 w-48 bg-zinc-800 rounded-lg"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-800 rounded-2xl"></div>)}
    </div>
  </div>;

  const cards = [
    {
      label: "Total Revenue",
      value: `$${stats?.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "From booked tickets only"
    },
    {
      label: "Total Tickets",
      value: stats?.totalTickets,
      icon: Ticket,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "All time bookings"
    },
    {
      label: "Active Bookings",
      value: stats?.activeTickets,
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      description: "Currently booked"
    },
    {
      label: "Cancelled",
      value: stats?.cancelledTickets,
      icon: Ban,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      description: "Refunded/Cancelled"
    }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Welcome back, {user?.name || "Passenger"}
        </h1>
        <p className="text-zinc-500 mt-1">Real-time analytics for your bus operations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className={card.bg + " absolute top-0 right-0 p-8 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"}></div>
            <div className="relative z-10">
              <div className={card.color + " mb-4"}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className="text-sm font-medium text-zinc-400 mt-1">{card.label}</div>
              <div className="text-xs text-zinc-600 mt-4">{card.description}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Booking Distribution</h3>
            <TrendingUp className="text-emerald-500 w-5 h-5" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm text-zinc-400">Active vs Cancelled</span>
              <span className="text-xs font-mono text-zinc-500">Updated {format(new Date(), 'HH:mm')}</span>
            </div>
            <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${(stats?.activeTickets || 0) / (stats?.totalTickets || 1) * 100}%` }}
              ></div>
              <div 
                className="h-full bg-rose-500 transition-all duration-1000" 
                style={{ width: `${(stats?.cancelledTickets || 0) / (stats?.totalTickets || 1) * 100}%` }}
              ></div>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-zinc-400">Active ({Math.round((stats?.activeTickets || 0) / (stats?.totalTickets || 1) * 100)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-zinc-400">Cancelled ({Math.round((stats?.cancelledTickets || 0) / (stats?.totalTickets || 1) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
          <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
            <Bus className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Fleet Status</h3>
          <p className="text-zinc-500 text-sm max-w-xs mt-2">
            All routes are currently operational. No delays reported for the next 24 hours.
          </p>
          <button
            onClick={() => navigate("/manage")}
            className="mt-6 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            View Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
