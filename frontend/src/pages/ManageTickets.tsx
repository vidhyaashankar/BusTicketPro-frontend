import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, ArrowUpDown, AlertTriangle, CheckCircle2, Clock, Ban } from "lucide-react";
import { format } from "date-fns";
import { ticketService } from "../services/ticketService";
import { Ticket } from "../interface/ticket";

const ROUTES = [
  "Mumbai - Pune",
  "Delhi - Jaipur",
  "Bengaluru - Chennai",
  "Hyderabad - Vijayawada",
  "Kolkata - Durgapur",
  "Ahmedabad - Surat"
];

export default function ManageTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRoute, setFilterRoute] = useState("");
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = filterRoute 
        ? await ticketService.getByRoute(filterRoute) 
        : await ticketService.getAll();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filterRoute]);

  const handleCancel = async () => {
    if (!cancelId) return;
    setIsCancelling(true);
    try {
      await ticketService.cancel(cancelId);
      setTickets(tickets.map(t => t.id === cancelId ? { ...t, status: 'CANCELLED' } : t));
      setCancelId(null);
    } catch (error) {
      console.error("Failed to cancel ticket", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <Clock className="w-3 h-3" /> BOOKED
        </span>;
      case 'CANCELLED':
        return <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <Ban className="w-3 h-3" /> CANCELLED
        </span>;
      case 'COMPLETED':
        return <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit">
          <CheckCircle2 className="w-3 h-3" /> COMPLETED
        </span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Tickets</h1>
          <p className="text-zinc-500 mt-1">View, filter, and manage all passenger bookings.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none min-w-[200px]"
              value={filterRoute}
              onChange={(e) => setFilterRoute(e.target.value)}
            >
              <option value="">All Routes</option>
              {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button 
            onClick={() => setFilterRoute("")}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" /> Reset
          </button>
        </div>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-bottom border-zinc-800 bg-zinc-950/50">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Passenger</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Route & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Seat</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Fare</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8">
                      <div className="h-4 bg-zinc-800 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-zinc-500">
                      <Search className="w-10 h-10 opacity-20" />
                      <p className="text-sm">No tickets found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{ticket.passengerName}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">ID: #{ticket.id.toString().padStart(5, '0')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-zinc-300">{ticket.route}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{format(new Date(ticket.departureTime), 'MMM dd, yyyy • HH:mm')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg text-xs font-mono border border-zinc-700">
                        {ticket.seatNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white">${ticket.fare.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ticket.status === 'BOOKED' && (
                        <button
                          onClick={() => setCancelId(ticket.id)}
                          className="text-rose-500 hover:text-rose-400 text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {cancelId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="bg-rose-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="text-rose-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cancel Ticket?</h3>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                Are you sure you want to cancel this booking? This action cannot be undone and the seat will be released for other passengers.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelId(null)}
                  className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="flex-1 px-6 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/50 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {isCancelling ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Yes, Cancel"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
