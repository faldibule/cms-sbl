import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import { authentication } from "@recoil/Authentication";

function Before(props) {
   const navigate = useNavigate();
   const { auth, user } = useRecoilValue(authentication);
   useEffect(() => {
      if (auth) {
         navigate("/dashboard");
      }
   }, [auth, navigate]);

   return props.children;
}

export default Before;