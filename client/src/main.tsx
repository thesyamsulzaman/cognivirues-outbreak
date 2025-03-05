import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "@/styles/index.scss";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
  fontFamily: "Manrope, sans-serif",
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </QueryClientProvider>
);
