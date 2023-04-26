import axios from "axios";

const url = "/";

function buildClient({ req }) {
  // if (typeof window === "undefined") {
  //   // We are on the server
  //   return axios.create({
  //     baseURL:
  //       "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
  //     headers: req.headers,
  //   });
  // } else {
  //   // We must be on the browser
  //   return axios.create({
  //     //@ts-ignore
  //     baseUrl: "/",
  //   });
  // }
  return axios.create({
    //@ts-ignore
    baseUrl: "https://manzil.dev/",
  });
}
export default buildClient;
