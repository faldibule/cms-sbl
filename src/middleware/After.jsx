import { Navigate } from "react-router";
import { useRecoilValue } from "recoil";
import { authentication } from "@recoil/Authentication";

function After(props) {
   const { auth } = useRecoilValue(authentication);
   if (!auth) {
      return <Navigate to={"/login"} />;
   }

   return props.children;
}

export default After;