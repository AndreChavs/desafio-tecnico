import React from "react";
import { useRouter } from "next/router";
import { FullscreenLoading } from "@/components/Loading";
import { publicApiUrl } from "../../../config/API_URL";

export default function CreateTypePaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");

  if(!publicApiUrl) throw new Error('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `${publicApiUrl}/api/payment/types/create`
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name})
      });

      const json = await res.json();
      console.log({ res, json, name });

      if (!res.ok) {
        alert("Erro ao criar tipo de pagamento");
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Erro de rede ao tentar enviar.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <>
      <FullscreenLoading loading={loading} />

      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Criar novo Tipo de Pagamento</h1>

        <form
          className="bg-white shadow-md rounded-md p-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>

            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-black"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
