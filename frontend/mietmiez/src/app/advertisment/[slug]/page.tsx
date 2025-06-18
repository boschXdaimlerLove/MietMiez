export default function AdvertisementPage({params} : {params : {slug: string}}) {
  return <div>{params.slug}</div>;
}
