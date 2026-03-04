import { useState, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Calendar, CreditCard, Armchair, CheckCircle2, AlertCircle } from "lucide-react";
import { ticketService } from "../services/ticketService";
import { authService } from "../services/authService";

const ROUTES = [
  "Mumbai - Pune",
  "Delhi - Jaipur",
  "Bengaluru - Chennai",
  "Hyderabad - Vijayawada",
  "Kolkata - Durgapur",
  "Ahmedabad - Surat"
];

const FARES: Record<string, number> = {
  "Mumbai - Pune": 450,
  "Delhi - Jaipur": 600,
  "Bengaluru - Chennai": 550,
  "Hyderabad - Vijayawada": 400,
  "Kolkata - Durgapur": 350,
  "Ahmedabad - Surat": 300
};

export default function BookTicket() {
  const navigate = useNavigate();
  
  // Get local ISO string for min date attribute
  const getLocalISOString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime( ) - offset).toISOString().slice(0, 16);
  };
  
  const [formData, setFormData] = useState({
    passengerName: "",
    route: "",
    seatNumber: "",
    departureTime: "",
    fare: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authService.me();
      if (user) {
        setFormData(prev => ({ ...prev, passengerName: user.name }));
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.passengerName.trim()) newErrors.passengerName = "Name is required";
    if (!formData.route) newErrors.route = "Route is required";
    if (!formData.seatNumber) newErrors.seatNumber = "Seat number is required";
    if (!formData.departureTime) newErrors.departureTime = "Departure time is required";
    if (formData.fare <= 0) newErrors.fare = "Fare must be a positive number";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      console.log("Validation failed:", newErrors);
      return;
    }

    setIsSubmitting(true);
    console.log("Validation passed, calling ticketService.book...");
    try {
      const response = await ticketService.book(formData);
      console.log("Booking response:", response);
      setSuccess(true);
      setTimeout(() => navigate("/manage"), 2000);
    } catch (error: any) {
      console.error("Booking error:", error);
      const errorMsg = error.response?.data?.error || error.message || "Failed to book ticket. Please try again.";
      alert("Booking Error: " + errorMsg);
      if (error.response?.status === 409) {
        setErrors({ seatNumber: "This seat is already booked for this route and time." });
      } else if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: "Failed to book ticket. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRouteChange = (route: string) => {
    setFormData({ ...formData, route, fare: FARES[route] || 0 });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-emerald-500/20 p-6 rounded-full mb-6"
        >
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white">Booking Successful!</h2>
        <p className="text-zinc-400 mt-2">Redirecting to your tickets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Book a Ticket</h1>
        <p className="text-zinc-500 mt-1">Fill in the details below to reserve your seat.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
        {errors.general && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500 text-sm">
            <AlertCircle className="w-5 h-5" />
            {errors.general}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <User className="w-4 h-4" /> Passenger Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. John Doe"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white"
            value={formData.passengerName}
            onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
          />
          {errors.passengerName && <p className="text-rose-500 text-xs mt-1">{errors.passengerName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Route <span className="text-rose-500">*</span>
            </label>
            <select
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white appearance-none"
              value={formData.route}
              onChange={(e) => handleRouteChange(e.target.value)}
            >
              <option value="">Select Route</option>
              {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.route && <p className="text-rose-500 text-xs mt-1">{errors.route}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Armchair className="w-4 h-4" /> Seat Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. A1, B12"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white uppercase"
              value={formData.seatNumber}
              onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value.toUpperCase() })}
            />
            {errors.seatNumber && <p className="text-rose-500 text-xs mt-1">{errors.seatNumber}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Departure Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              min={getLocalISOString()}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white [color-scheme:dark]"
              value={formData.departureTime}
              onChange={(e) => {
                setFormData({ ...formData, departureTime: e.target.value });
              }}
            />
            {errors.departureTime && <p className="text-rose-500 text-xs mt-1">{errors.departureTime}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Fare
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
              <input
                type="number"
                step="0.01"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white"
                value={formData.fare || ""}
                onChange={(e) => setFormData({ ...formData, fare: parseFloat(e.target.value) || 0 })}
              />
            </div>
            {errors.fare && <p className="text-rose-500 text-xs mt-1">{errors.fare}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>Confirm Booking</>
          )}
        </button>
      </form>
    </div>
  );
}
