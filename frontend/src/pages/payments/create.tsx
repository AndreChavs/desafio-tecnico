import { useState } from "react";
import PaymentForm from "../../components/PaymentForm";
import { FullscreenLoading } from "@/components/Loading";

export default function CreatePaymentPage() {
  
const [loading, setLoading] = useState<boolean>(false);

  

  return (
    <>
    <FullscreenLoading loading={loading} />
        <div style={{ padding: 20 }}>
        <h1>Criar Pagamento</h1>
        <PaymentForm            
            loading={loading} 
            setLoading={setLoading}
        />
        </div>
    </>
  );
}