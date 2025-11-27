import { Suspense } from "react";
import DecryptPage from "./DecryptPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-6">Loading…</div>}>
      <DecryptPage />
    </Suspense>
  );
}
