import Layout from "components/Layout";
import ArtworkDetail from "components/pages/artworks/ArtworkDetail";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Context } from "src/context";
import { contentService } from "src/services/contentService";
import useSWR from "swr";
import { useWindowSize } from "usehooks-ts";
export default function Page(props) {
  if (props.justHead) {
    return <></>;
  }
  return <PageContent />;
}
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

const LIMIT = 20;
function PageContent() {
  const { width } = useWindowSize();
  const router = useRouter();
  const artworkId = router.query.id as string;
  const [relatedList, setRelatedList] = useState([]);
  const [remaining, setRemaining] = useState(true);
  const [offset, setOffset] = useState(0);
  const { account } = useContext(Context);
  const { data: artworkData } = useSWR({ key: "get-artwork", id: artworkId, userId: account?.id }, ({ id, userId }) => contentService.artwork.getArtworkDetail(userId, id));
  const fetchRelatedArtwork = async () => {
    const artworkData = await contentService.artwork.getRelatedArtwork(artworkId, LIMIT, offset, account?.id);
    const list = artworkData?.data?.artworks;
    if (list?.length) {
      setRelatedList([...relatedList, ...list]);
      setOffset(offset + LIMIT);
    } else {
      setRemaining(false);
      setOffset(relatedList.length);
    }
  };
  useEffect(() => {
    fetchRelatedArtwork();
  }, []);
  return (
    <div className='bg-background min-h-screen text-white'>
      <div className='md:container md:mx-auto lg:w-[30%]'>
        {width < 768 && (
          <div
            onClick={() => router.back()}
            className='flex sticky top-14 p-4 bg-background z-10 items-center gap-3 text-sm font-medium '>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'>
              <path
                d='M15 17L10 12L15 7'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Back
          </div>
        )}
        {artworkData && (
          <div className='px-4'>
            <ArtworkDetail data={artworkData} />
          </div>
        )}
        <InfiniteScroll
          className='px-4 space-y-10 mt-10 md:mt-0 md:pt-10'
          dataLength={relatedList.length}
          next={fetchRelatedArtwork}
          hasMore={remaining}
          loader={<h4 className='w-full text-center font-medium text-sm'>Loading...</h4>}>
          {relatedList?.map((artwork, index) => (
            <ArtworkDetail data={artwork} key={index} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});
