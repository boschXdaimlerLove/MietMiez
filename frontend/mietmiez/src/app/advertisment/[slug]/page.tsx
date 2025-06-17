export default function AdvertismentPage({params} : {params : {slug: string}}) {
  return <div>{params.slug}</div>;
}