"use client";

import { useRouter } from "next/navigation";

/**
 * a client email field to send a user via the passed email address
 * @param mail - the email adress to send a new mail to
 * @constructor
 */
export default function EmailField({ mail }: { mail: string }) {
  const router = useRouter();
  return <button onClick={() => router.push(`mailto:${mail}`)}>{mail}</button>;
}
