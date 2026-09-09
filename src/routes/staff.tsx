import { Outlet, createFileRoute } from "@tanstack/react-router";

import { StaffShell } from "@/components/bank/shell";

export const Route = createFileRoute("/staff")({
  ssr: false,
  component: () => (
    <StaffShell>
      <Outlet />
    </StaffShell>
  ),
});
