import { useContext, useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContex";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  // console.log("success and orderId: "+success,orderId);
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async()=>{
    const response = await axios.post(url+'/api/order/verify',{success,orderId});
    if(response.data.success){
      toast.success('Payment is successful');
      navigate("/myorders");
    }
    else{
      navigate("/");
    }
  }

  useEffect(()=>{
    verifyPayment();
  },[])

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
