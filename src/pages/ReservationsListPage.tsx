import { useEffect, useState } from "react";
import { parkingService } from "../services/api";
import type { Reservation } from "../services/api";
import LoadingSpinner from "../components/atoms/LoadingSpinner";
import ErrorMessage from "../components/atoms/ErrorMessage";
import PageTitle from "../components/atoms/PageTitle";
import ProtectedRoute from "../components/atoms/ProtectedRoute";

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString();
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const estados = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "cancelled", label: "Cancelado" },
  { value: "active", label: "Activo" },
  { value: "completed", label: "Completado" },
];
const pagos = [
  { value: "", label: "Todos" },
  { value: "paid", label: "Pagado" },
  { value: "pending", label: "No pagado" },
];

const estadoLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  active: "Activo",
  completed: "Completado",
};

const pagoLabels: Record<string, string> = {
  paid: "Sí",
  refunded: "Reembolsado",
  pending: "No",
};

const ReservationsListPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState("");
  const [pago, setPago] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await parkingService.getAllReservations();
        setReservations(data);
      } catch (err) {
        setError("Error al obtener las reservaciones.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  // Filtros
  const filtered = reservations
    .filter((r) => (userIdFilter ? String(r.userId) === userIdFilter : true))
    .filter((r) => (estado ? r.status?.toLowerCase() === estado : true))
    .filter((r) =>
      pago
        ? pago === "paid"
          ? r.paymentStatus?.toLowerCase() === "paid"
          : r.paymentStatus?.toLowerCase() !== "paid"
        : true
    )
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6">
        <PageTitle title="Reservas" />
        <div className="flex flex-wrap gap-4 mb-2">
          <label className="flex items-center gap-2">
            ID de usuario:
            <input
              type="text"
              className="border rounded px-2 py-1"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              placeholder="Buscar por ID"
            />
          </label>
          <label className="flex items-center gap-2">
            Estado:
            <select
              className="border rounded px-2 py-1"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              {estados.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Pagado:
            <select
              className="border rounded px-2 py-1"
              value={pago}
              onChange={(e) => setPago(e.target.value)}
            >
              {pagos.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {filtered.length === 0 ? (
          <div className="text-gray-500">No hay reservaciones.</div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Identificador</th>
                  <th className="px-4 py-2 text-left">ID de usuario</th>
                  <th className="px-4 py-2 text-left">Fecha de inicio</th>
                  <th className="px-4 py-2 text-left">Fecha fin</th>
                  <th className="px-4 py-2 text-left">Hora de inicio</th>
                  <th className="px-4 py-2 text-left">Monto total</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Pagado</th>
                  <th className="px-4 py-2 text-left">Notas</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2">{r.id}</td>
                    <td className="px-4 py-2">{r.userId}</td>
                    <td className="px-4 py-2">{formatDate(r.startTime)}</td>
                    <td className="px-4 py-2">{formatDate(r.endTime)}</td>
                    <td className="px-4 py-2">{formatTime(r.startTime)}</td>
                    <td className="px-4 py-2">S/ {r.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      {estadoLabels[r.status?.toLowerCase()] || r.status}
                    </td>
                    <td className="px-4 py-2">
                      {r.paymentStatus
                        ? pagoLabels[r.paymentStatus.toLowerCase()] ||
                          r.paymentStatus
                        : "No"}
                    </td>
                    <td className="px-4 py-2">{r.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ReservationsListPage;
