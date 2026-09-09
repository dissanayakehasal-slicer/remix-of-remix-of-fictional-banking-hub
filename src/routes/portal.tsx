import { Outlet, createFileRoute } from "@tanstack/react-router";

import { PortalShell } from "@/components/bank/shell";

export const Route = createFileRoute("/portal")({
  ssr: false,
  component: () => (
    <PortalShell>
      <Outlet />
    </PortalShell>
  ),
});
