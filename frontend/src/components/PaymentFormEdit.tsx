import React, { SetStateAction } from "react";
import { PaymentType, CreatePaymentDto, Payment } from "../types/payment";
import { useRouter } from "next/router";
import { publicApiUrl } from "../../config/API_URL";

interface Props {
  initial?: Payment;
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}

export default function PaymentFormEdit({
  initial,
  loading,
  setLoading,
}: Props) {
  const [types, setTypes] = React.useState<PaymentType[]>([]);
  const router = useRouter();
  if(!publicApiUrl) throw new Error('')

  const [form, setForm] = React.useState<CreatePaymentDto>({
    date: initial?.date || "",
    paymentTypeId: initial?.paymentTypeId || 1,
    description: initial?.description || "",
    amount: initial?.amount || 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `${publicApiUrl}/api/payment/${initial?.id}`
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          paymentTypeId: Number(form.paymentTypeId),
        }),
      });

      const json = await res.json();
      console.log({ res, json });

      if (!res.ok) {
        alert(json.error?.message || "Erro ao criar pagamento");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Erro de rede ao tentar enviar.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      setLoading(true); 
      const url = `${publicApiUrl}/api/payment/types` 
      const res = await fetch(url);
      const json = await res.json();
      console.log({ res, json });
      if (!res.ok) {
        alert('Erro ao buscar lista de dados');
        return;
      }  
      setTypes(json.paymentType);
      setLoading(false);
      
    } catch (error) {
      console.error(error);
      alert("Erro de rede ao tentar enviar.");
    } finally {
      setLoading(false)
    }
  };

  React.useEffect(() => {
    if(initial?.id){
      fetchTypes();
    }    
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (<>
  {form.paymentTypeId &&   
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 space-y-8 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
        Cadastro de Pagamento
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DATE */}
        <div className="flex flex-col">
          <label className="form-label">Data</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        {/* PAYMENT TYPE */}
        <div className="flex flex-col">
          <label className="form-label">Tipo de Pagamento</label>
          <select
            name="paymentTypeId"
            value={form.paymentTypeId}
            onChange={handleChange}
            className="input bg-white"
          >
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col">
        <label className="form-label">Descrição</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className="input"
          placeholder="Ex: Pagamento de hospedagem..."
        />
      </div>

      {/* AMOUNT */}
      <div className="flex flex-col">
        <label className="form-label">Valor</label>
        <input
          type="number"
          name="amount"
          value={form.amount as any}
          onChange={handleChange}
          step="0.01"
          required
          className="input"
          placeholder="0.00"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            setForm({
              date: "",
              paymentTypeId: types[0]?.id || 1,
              description: "",
              amount: 0,
            })
          }
          className="btn-secondary"
        >
          Limpar
        </button>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  }</>
  );
}
