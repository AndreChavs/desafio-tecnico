import { useState } from "react";
import { FullscreenLoading } from "@/components/Loading";
import { publicApiUrl } from "../../../config/API_URL";

export default function UploadReceiptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false)

  if(!publicApiUrl) throw new Error('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {      
      if (!file) return alert("Escolha um arquivo!");
      const formData = new FormData();
      formData.append("file", file);
      const url = `${publicApiUrl}/api/payment/upload-receipt/{id}`
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      setResponse(data);
      
    } catch (error) {
      console.error(error);
      alert("Erro de rede ao tentar enviar.");
    }


  }

  return (
    <>
    <FullscreenLoading loading={loading} />
        <div className="min-h-screen bg-gray-50 p-10">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Enviar Comprovante
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Arquivo do comprovante
                </label>
                <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full border border-gray-300 p-2 rounded-md"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
            >
                Enviar
            </button>
            </form>

            {response && (
            <div className="mt-6 bg-gray-100 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Resposta:</h2>
                <pre className="text-sm text-gray-800">
                {JSON.stringify(response, null, 2)}
                </pre>
            </div>
            )}
        </div>
        </div>
    </>
  );
}