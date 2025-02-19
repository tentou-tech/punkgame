import CheckboxDropdown from "components/CheckBox/CheckBoxDropDown";
import ComicCard from "components/Comic/ComicCard";
import Layout from "components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ComicListContext } from "src/context/comicList";
import { contentService } from "src/services/contentService";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import useSWR from "swr";
import { useWindowSize } from "usehooks-ts";
import LatestManga from "./LatestManga";
import HeadComponent from 'components/Head'

export default function Page(props) {
  if (props.justHead || props.pageProps?.justHead) {
    return <HeadComponent data={props.pageProps?.metadata || props.metadata} />
  }
  return (
    <>
      <HeadComponent data={props.pageProps?.metadata || props.metadata} />
      <PageContent />
    </>
  )
}
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

const LIMIT = 20;
function PageContent() {
  const { width } = useWindowSize();
  const router = useRouter();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { data: trendingComic } = useSWR({ key: "get-trending-comic" }, contentService.comic.getTrendingComic);
  const { data: tags } = useSWR("get-all-tag", contentService.getTagList);
  const { latestData, setLatestData } = useContext(ComicListContext);
  const fetchLatestManga = async (isRefresh?: boolean) => {
    const selectedTags = latestData.selectedTags.filter((tag) => tag.key != 0).map((tag) => tag.key) || undefined;
    const status = latestData.selectedStatus.filter((status) => status.key != "All status").map((status) => status.key) || undefined;
    const data = await contentService.comic.getLatestComic(
      LIMIT,
      isRefresh ? 0 : latestData.offset,
      selectedTags.length == tags?.length ? undefined : selectedTags,
      status.length == 3 ? undefined : status,
    );
    if (data?.length) {
      if (isRefresh) {
        setLatestData({
          list: [...data],
          offset: data?.length,
          remaining: true,
        });
      } else {
        setLatestData({
          list: [...latestData.list, ...data],
          offset: latestData.offset + data?.length,
          remaining: true,
        });
      }
    } else {
      if (isRefresh) {
        setLatestData({
          list: [],
          offset: 0,
          remaining: false,
        });
      } else {
        setLatestData({
          offset: latestData.offset,
          remaining: false,
        });
      }
    }
  };
  useEffect(() => {
    if (latestData.list.length == 0 && isFirstLoad) {
      fetchLatestManga();
      setIsFirstLoad(false);
    }
  }, []);
  useEffect(() => {
    if (!isFirstLoad) {
      fetchLatestManga(true);
    }
  }, [latestData.selectedTags.length, latestData.selectedStatus.length]);
  if (width >= 768) {
    return <LatestManga />;
  }
  
  return (
    <div className="bg-background pb-4 min-h-screen text-white space-y-4">
      <div onClick={() => router.back()} className="flex sticky z-10 bg-background py-4 top-14 items-center gap-3 text-xl font-medium px-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 17L10 12L15 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Manga
      </div>
      {!!trendingComic?.length && (
        <div className="space-y-3">
          <div className="px-4 text-lg font-medium">Trending</div>
          <div>
            <Swiper slidesPerView="auto" slidesOffsetBefore={16} slidesOffsetAfter={16} spaceBetween={16}>
              {trendingComic?.map((comic, index) => (
                <SwiperSlide key={index} className="!w-fit rounded-md overflow-hidden">
                  <ComicCard {...comic} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
      <div className="space-y-3 px-4">
        <div className=" text-lg font-medium">Latest update</div>
        <div className="flex items-center gap-4 [&>div]:!w-fit text-gray-400">
          <CheckboxDropdown
            allKey={0}
            selected={latestData.selectedTags}
            onChange={(newData) => setLatestData({ selectedTags: newData })}
            options={[
              {
                key: 0,
                value: "All genres",
              },
            ].concat(
              tags?.map((tag) => ({
                key: tag.id,
                value: tag.en,
              })) || [],
            )}
          />
          <span className="w-[1px] h-4 bg-gray-400" />
          <CheckboxDropdown
            allKey={"All status"}
            selected={latestData.selectedStatus}
            onChange={(newData) => setLatestData({ selectedStatus: newData })}
            options={[
              {
                key: "All status",
                value: "All status",
              },
              {
                key: "Finished",
                value: "Finished",
              },
              {
                key: "Ongoing",
                value: "Ongoing",
              },
              {
                key: "Upcoming",
                value: "Upcoming",
              },
            ]}
          />
        </div>
        <InfiniteScroll
          className="grid grid-cols-2 gap-4  md:grid-cols-3 lg:grid-cols-4"
          dataLength={latestData.list.length}
          next={fetchLatestManga}
          hasMore={latestData.remaining}
          loader={<h4 className="w-full text-center font-medium text-sm">Loading...</h4>}
        >
          {latestData.list?.map((comic, index) => (
            <ComicCard key={index} {...comic} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    metadata: {
      title: 'Punkga.Me | Manga Collection',
      description:
        'Read free manga online with fast updates, high-quality translations, and officially licensed chapters. Start reading today!',
    },
    ...(await serverSideTranslations(locale, ['common'])),
  },
})
