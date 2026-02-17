import { RouterProvider } from "react-router-dom";
import { SessionContextProvider } from "./Context/SessionContext";
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
              background: "#16a34a", 
              color: "#ffffff",      
              fontWeight: "600",
              borderRadius: "8px",
              padding: "14px 18px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        />
        
      </>
    </SessionContextProvider>
  );
}

export default App;


