import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  try {
    const ad = JSON.parse(await req.text());
    await AdvertisementCommunication.createAdvertisement(ad);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Erstellen der Anzeige" },
      { status: 500 },
    );
  }
}
