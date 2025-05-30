import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "@/styles/index.scss";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { WithMobileBlocker } from "./mobile-blocker.tsx";

const theme = createTheme({
  fontFamily: "Manrope, sans-serif",
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <WithMobileBlocker>
        <App />
      </WithMobileBlocker>
    </MantineProvider>
  </QueryClientProvider>
);
