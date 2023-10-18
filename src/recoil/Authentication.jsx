import { atom, selector } from "recoil";
import http from "@variable/Api";

const authentication = atom({
   key: "authentication",
   default: selector({
      key: "default-authentication",
      get: async () => {
         let auth = false;
         let user = null;
         let profile_picture = null
         try {
            const { data } = await http.get(`user/auth`);
            const profile_url = localStorage.getItem("profile_picture");
            auth = data.meta.status === "success" ? true : false;
            user = data.data;
            profile_picture = profile_url
         } catch(e) {
            auth = false;
            user = null;
         }
         return {
            auth,
            user,
            profile_picture
         };
      },
   }),
});

export { authentication };