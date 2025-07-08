import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  const formData = await req.formData();
  const image = formData.get("document");
  const imageID = await AdvertisementCommunication.uploadImageForAdvertisement(
    image as File,
  );
  return NextResponse.json({ success: true, imageID });
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ success: false, id });
  }
  const res = await AdvertisementCommunication.fetchImage(id);
  if (!res.ok) {
    return NextResponse.error();
  }
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const buff = await res.arrayBuffer();
  return new NextResponse(buff, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
