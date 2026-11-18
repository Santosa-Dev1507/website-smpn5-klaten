import { Suspense } from "react";
import KisiKisiClient from "./KisiKisiClient";

export default function KisiKisiPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", background: "#fdf8f2" }} />}>
      <KisiKisiClient />
    </Suspense>
  );
}
