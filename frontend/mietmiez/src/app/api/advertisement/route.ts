import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import { NextResponse } from "next/server";

/**
 * POST handler for creating an advertisement
 * Works as passthrough to the server communication layer
 * @param req - the HTTP request
 * @constructor
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const ad = JSON.parse(await req.text());
    await AdvertisementCommunication.createAdvertisement(ad);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error while creating advertisement" },
      { status: 500 },
    );
  }
}

/**
 * PATCH handler for updating an advertisement
 * Works as passthrough to the server communication layer
 * @param req - the HTTP request
 * @constructor
 */
export async function PATCH(req: Request): Promise<Response> {
  try {
    const ad = JSON.parse(await req.text());
    await AdvertisementCommunication.updateAdvertisement(ad);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "error while updating advertisement" },
      { status: 500 },
    );
  }
}

/**
 * DELETE handler for deleting an advertisement
 * Works as passthrough to the server communication layer
 * @param req - the HTTP request
 * @constructor
 */
export async function DELETE(req: Request): Promise<Response> {
  try {
    const ad = JSON.parse(await req.text());
    await AdvertisementCommunication.deleteAdvertisement(ad.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Löschen der Anzeige" },
      { status: 500 },
    );
  }
}
