// components/PaymentTable.tsx
import { Payment } from "../types/payment";
import { parseISO, format, addHours } from "date-fns";
import Link from "next/link";
import React from "react";
import ReceiptUploadForm from "./UploadFile";

interface Props {
  payments: Payment[] | [];
}

export default function PaymentTable({ payments }: Props) {
  const [modal, setModal] = React.useState(false)
  const [id, setId] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  console.log(payments)
  return (
    <>
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b">ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b">Data</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b">Tipo</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b">Descrição</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b">Arquivo</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b">Valor</th>
            <th className="px-4 py-2 text-left text-sm font-semibold border-b">Ações</th>
          </tr>
        </thead>

        <tbody className="text-gray-800">
          {payments?.map((p, index) => (
            <tr
              key={p.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50 transition`}
            >
              <td className="px-4 py-2 border-b">{p.id}</td>
              <td className="px-4 py-2 border-b">
                {format(addHours(parseISO(p.date), +3), "dd/MM/yyyy")}
              </td>
              <td className="px-4 py-2 border-b">{p.paymentTypeId}</td>
              <td className="px-4 py-2 border-b">{p.description}</td>
              <td className="px-4 py-2 border-b">
                <Link target="_blank" href={`http://localhost:8000${p.receiptPath}`} className="text-blue-600 hover:underline font-medium">
                  {p.receiptPath}
                </Link>
              </td>
              <td className="px-4 py-2 border-b font-medium">
                R$ {Number(p.amount).toFixed(2)}
              </td>
              <td className="px-4 py-2 border-b">
                <Link
                  href={`/payments/${p.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Editar
                </Link>
                <p></p>
                <button
                  onClick={() => {
                    setId(p.id)
                    setModal(!modal)
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  UploadFile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/*  */}
      {
        modal && <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
          onClick={() => setModal(!modal)}
        />

        {/* MODAL CARD */}
        <div
          className="
            relative z-50 w-full max-w-md 
            bg-white rounded-xl shadow-xl 
            p-6 space-y-4 border border-gray-200
            animate-fade-in
          "
        >
          {id && <ReceiptUploadForm id={id} loading={loading} setLoading={setLoading}/>}          
        </div>
      </div>
      }      
    </>
  );
}
