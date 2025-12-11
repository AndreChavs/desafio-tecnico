import { useEffect, useState } from "react";
import { Payment } from "../types/payment";
import PaymentTable from "../components/PaymentTable";
import Link from "next/link";
import { FullscreenLoading } from "@/components/Loading";
import { publicApiUrl } from "../../config/API_URL";



export default function HomePage() {
  const [payments, setPayments] = useState<Payment[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const [type, setType] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  if(!publicApiUrl) throw new Error('')

  const load = async () => {
    setLoading(true);

    try {
      const url = `${publicApiUrl}/api/payment/findAll`
      const res = await fetch(url);
      const json = await res.json();

      console.log({ res, json });

      if (!res.ok) {
        throw new Error(json.error?.message || "Erro ao carregar pagamentos");
      }

      setPayments(json.payments);
    } catch (error) {
      console.error(error);
      alert("Erro inesperado ao buscar pagamentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = payments?.filter((p) => {
    const passType = type ? p.paymentTypeId === Number(type) : true;
    const passStart = dateStart ? p.date >= dateStart : true;
    const passEnd = dateEnd ? p.date <= dateEnd : true;
    return passType && passStart && passEnd;
  });

  return (<>
      <FullscreenLoading loading={loading} />
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Pagamentos</h1>

          <Link legacyBehavior href="/payments/create" className="inline-block">
            <a className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition">
              Criar novo pagamento
            </a>
          </Link>
          <Link legacyBehavior href="/payments/createType" className="inline-block">
            <a className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition">
              Criar tipo de pagamento
            </a>
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <input
                className="w-full border border-gray-300 rounded-md p-2 text-sm text-black"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="ID do tipo (ex: 1)"
              />
            </div>

            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2 text-sm text-black"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>

            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2 text-sm text-black"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
              />
            </div>

            <div className="col-span-1 flex items-end">
              <button
                onClick={() => { setType(""); setDateStart(""); setDateEnd(""); }}
                className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 px-3 py-2 rounded-md transition"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        <PaymentTable payments={filtered} />
      </div>
    </div>
  </>
  );
}