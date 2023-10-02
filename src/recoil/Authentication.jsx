import { atom, selector } from "recoil";
import http from "@variable/Api";

const authentication = atom({
   key: "authentication",
   default: selector({
      key: "default-authentication",
      get: async () => {
         let auth = false;
         let user = null;
         try {
            const { data } = await http.get(`user/auth`);
            auth = data.meta.status === "success" ? true : false;
            user = data.data;
         } catch(e) {
            console.log(e)
            auth = false;
            user = null;
         }
         return {
            auth,
            user,
         };
      },
   }),
});

export { authentication };