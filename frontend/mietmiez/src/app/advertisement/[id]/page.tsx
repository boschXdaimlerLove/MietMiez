import AdvertisementFetched from "@/app/objects/advertisement/AdvertisementFetched";
import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import User from "@/app/objects/user/user";
import UserCommunication from "@/app/server_communication/server/UserCommunication";
import AdvertisementEdit from "@/app/components/advertisement/AdvertisementEdit";

export default async function AdvertisementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const advertisement: AdvertisementFetched =
    await AdvertisementCommunication.fetchAdvertisement(id);

  let isLoggedIn: boolean = false;

  let user: User;
  try {
    user = await UserCommunication.fetchSelfUser();
    if (user.email === advertisement.user.email) {
      isLoggedIn = true;
    }
  } catch {
    isLoggedIn = false;
  }

  return (
    <AdvertisementEdit
      isLoggedIn={isLoggedIn}
      advertisement={JSON.stringify(advertisement)}
    />
  );
}
