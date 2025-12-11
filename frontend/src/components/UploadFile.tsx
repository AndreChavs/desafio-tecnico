import React, { SetStateAction } from "react";
import { FullscreenLoading } from "./Loading";
import { publicApiUrl } from "../../config/API_URL";

interface UploadFileProps {
    id:number;
    loading: boolean;
    setLoading: React.Dispatch<SetStateAction<boolean>>;
}

export default function ReceiptUploadForm({id, loading, setLoading}:UploadFileProps) {
  const [file, setFile] = React.useState<File | null>(null);
  if(!publicApiUrl) throw new Error('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    if (!file) {
      alert("Selecione um arquivo.");
      return;
    }

    const data = new FormData();
    data.append("file", file);

    try {
      const url = `${publicApiUrl}/api/payment/upload-receipt/${id}`
        const res = await fetch(url, {
          method: "POST",
          body: data,
        });
    
        const json = await res.json();
        console.log(json);
    
        if (!res.ok) {
          alert(json.error?.message || "Erro ao enviar");
          return;
        }
    
        alert("Enviado com sucesso!");
        
    } catch (error) {
        console.error(error);
        alert("Erro de rede ao tentar enviar.");
    } finally {
        setLoading(false)
    }
  };

  return (
    <>
    <FullscreenLoading loading={loading} />
    <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg mx-auto bg-white shadow-xl rounded-xl p-8 space-y-6 border border-gray-200"
        >
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
            Upload de Comprovante
        </h2>

        {/* INPUT DE ARQUIVO */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
            Comprovante (PDF/Imagem)
            </label>

            <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFile}
            className="
                block w-full text-sm text-gray-700 
                file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 
                file:text-sm file:font-medium 
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700 
                cursor-pointer
            "
            />

            <p className="text-xs text-gray-500">
            Tamanho máximo: 5MB. Formatos aceitos: JPG, PNG, PDF.
            </p>
        </div>

        {/* BOTÃO */}
        <div className="flex justify-end pt-4">
            <button
            type="submit"
            className="
                inline-flex items-center justify-center 
                px-5 py-2 rounded-lg font-medium 
                bg-blue-600 text-white 
                hover:bg-blue-700 transition
                disabled:opacity-60 disabled:cursor-not-allowed
            "
            >
            Enviar Comprovante
            </button>
        </div>
    </form>
    </>

  );
}
