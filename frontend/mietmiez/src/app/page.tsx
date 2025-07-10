"use client";

import { useRouter } from "next/navigation";

/**
 * default page of the server. This redirects to "/home" because a server wrapper is needed
 * @constructor
 */
export default function HomeWrapperCaller() {
  const router = useRouter();
  router.push("/home");
  return (
    <main>
      <p>Du bist hier falsch</p>
    </main>
  );
}
