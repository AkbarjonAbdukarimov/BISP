import axios from "axios";

const url = "/";
//@ts-ignore
const checkEnvironment = () => {
  let base_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/"
      : "https://example.com"; // https://v2ds.netlify.app

  return base_url;
};
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
    baseURL: checkEnvironment(),
  });
}
export default buildClient;
