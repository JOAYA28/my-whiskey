import { Suspense } from "react";
import WhiskyTestApp from "@/components/WhiskyTestApp";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <WhiskyTestApp />
    </Suspense>
  );
}
