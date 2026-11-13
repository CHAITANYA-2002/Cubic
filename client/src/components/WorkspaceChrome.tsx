import { Toaster } from "@/components/ui/toaster";

/** Toasts are only used by the admin workspace, so they load with it. */
export default function WorkspaceChrome() {
  return <Toaster />;
}
