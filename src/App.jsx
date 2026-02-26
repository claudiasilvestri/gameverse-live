import { RouterProvider } from "react-router-dom";
import { SessionContextProvider } from "./context/SessionContext";
import { Toaster } from "sonner";
import router from "./Routes";

export function App() {
  return (
    <SessionContextProvider>
      <>
        <RouterProvider router={router} />

        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              background: "var(--secondary)",
              color: "var(--text-light)",
              fontWeight: "600",
              borderRadius: "var(--radius)",
              padding: "14px 18px",
              boxShadow: "var(--shadow-soft)",
            },
          }}
        />
      </>
    </SessionContextProvider>
  );
}

export default App;
