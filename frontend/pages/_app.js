import store from "../redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  //login ve register sayfalarında layout olmayacak
  const routesWithNoLayout = ["/", "/register"];
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <ToastContainer autoClose={2500} />
        {routesWithNoLayout.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ThemeProvider>
    </Provider>
  );
}
