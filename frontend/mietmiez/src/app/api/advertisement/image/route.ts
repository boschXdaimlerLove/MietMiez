import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  const formData = await req.formData();
  const image = formData.get("document");
  console.log("Image uploaded with ID to NEXT API:", image);
  const imageID = await AdvertisementCommunication.uploadImageForAdvertisement(
    image as File,
  );
  console.log("Image ID:", imageID);
  return NextResponse.json({ success: true, imageID });
}
