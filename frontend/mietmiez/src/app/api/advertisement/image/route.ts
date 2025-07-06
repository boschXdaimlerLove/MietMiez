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
  const id = await req.text();
  return await AdvertisementCommunication.fetchImage(id);
}
