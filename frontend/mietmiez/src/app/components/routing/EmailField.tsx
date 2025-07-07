"use client";

import { useRouter } from "next/navigation";

export default function EmailField({ mail }: { mail: string }) {
  const router = useRouter();
  return <button onClick={() => router.push(`mailto:${mail}`)}>{mail}</button>;
}
