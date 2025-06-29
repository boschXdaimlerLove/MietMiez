"use client";

import {useRouter} from "next/navigation";

export default function HomeWrapperCaller() {
    const router = useRouter();
    router.push("/home");
    return (<main><p>Du bist hier falsch</p></main>);
}
