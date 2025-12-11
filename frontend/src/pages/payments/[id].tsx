import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PaymentFormEdit from "@/components/PaymentFormEdit";
import { publicApiUrl } from "../../../config/API_URL";

export default function EditPaymentPage() {
  const router = useRouter();
  const { id } = router.query;
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false)

  if(!publicApiUrl) throw new Error('')

  const asyncFetch = async() => {
    setLoading(true)
    try {
      const url = `${publicApiUrl}/api/payment/find/${id}`
      const res = await fetch(url)
      const json = await res.json()
      console.log({res, json})
      if(!res.ok){
          alert(json.error.message)
          return
      }
      setPayment(json.payment)
      setLoading(false)
      
    } catch (error) {
      console.error(error);
      alert("Erro de rede ao tentar enviar.");
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      asyncFetch()
    }
  }, []);



  return (
    <div style={{ padding: 20 }}>
      <h1>Editar Pagamento #{id}</h1>
      {
        id && payment && <PaymentFormEdit 
        initial={payment}
        loading={loading} 
        setLoading={setLoading}
        />
      }      
    </div>
  );
}