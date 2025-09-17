import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { PropsWithChildren } from "react";

export default function AppQueryProvider({ children }: PropsWithChildren) {
     const [client] = useState(
          () =>
               new QueryClient({
                    defaultOptions: { queries: { refetchOnWindowFocus: false } },
               })
     );

     return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}