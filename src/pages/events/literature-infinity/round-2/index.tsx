import HeadComponent from 'components/Head'
import Layout from 'components/Layout'
import Button from 'components/pages/event/literature-infinity/Button'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Mascot4 from 'components/pages/event/literature-infinity/assets/mascot-4.png'
import Image from 'next/image'
import Link from 'next/link'
import { useWindowSize } from 'usehooks-ts'
import moment from 'moment'
import getConfig from 'next/config'
import { useEffect, useState } from 'react'
import { contentService } from 'src/services/contentService'
import { toast } from 'react-toastify'
import InfiniteScroll from 'react-infinite-scroll-component'
import ComicCard from 'components/Comic/ComicCard'
import Rule from 'components/pages/event/literature-infinity/Rule'
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
  return <Layout>{page}</Layout>
}

const PageContent = () => {
  const router = useRouter()
  const { width } = useWindowSize()
  return (
    <div className={`min-h-screen bg-background-bg-primary ${width >= 1280 ? 'pk-container py-10' : ''}`}>
      <div className='sticky top-14 lg:top-20 z-50 bg-background-bg-primary p-4 flex items-center gap-3'>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          onClick={() => router.push('/events/literature-infinity')}>
          <path d='M15 17L10 12L15 7' stroke='#6D6D6D' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
        <div className='text-[#3d3d3d] text-lg font-medium leading-relaxed'>
          Round 2 - Submit a manga on Creator Portal
        </div>
      </div>
      {moment().isBefore(moment('2025-02-03')) ? (
        <div className='flex flex-col gap-4 items-center w-full px-4'>
          <div className='flex justify-center mt-10 flex-col items-center'>
            <div className='h-[72px] max-w-[443px] w-full p-4 bg-[#feedd6] rounded-md justify-start items-start gap-5 inline-flex'>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M17.542 15.5891L10.8845 3.22578C10.4127 2.34922 9.15564 2.34922 8.68337 3.22578L2.02634 15.5891C1.92388 15.7794 1.87252 15.993 1.87725 16.209C1.88199 16.4251 1.94267 16.6363 2.05336 16.8219C2.16406 17.0075 2.32099 17.1613 2.50884 17.2681C2.69669 17.375 2.90904 17.4313 3.12517 17.4316H16.4412C16.6575 17.4317 16.8701 17.3756 17.0582 17.2688C17.2463 17.1621 17.4035 17.0084 17.5144 16.8227C17.6254 16.637 17.6862 16.4258 17.691 16.2095C17.6959 15.9933 17.6445 15.7795 17.542 15.5891ZM9.78415 15.5176C9.62963 15.5176 9.47859 15.4718 9.35011 15.3859C9.22164 15.3001 9.1215 15.1781 9.06237 15.0353C9.00324 14.8925 8.98777 14.7355 9.01791 14.5839C9.04806 14.4324 9.12246 14.2932 9.23172 14.1839C9.34098 14.0746 9.48019 14.0002 9.63174 13.9701C9.78328 13.9399 9.94037 13.9554 10.0831 14.0145C10.2259 14.0737 10.3479 14.1738 10.4337 14.3023C10.5196 14.4308 10.5654 14.5818 10.5654 14.7363C10.5654 14.9435 10.4831 15.1422 10.3366 15.2888C10.1901 15.4353 9.99135 15.5176 9.78415 15.5176ZM10.6326 7.66016L10.4084 12.4258C10.4084 12.5915 10.3425 12.7505 10.2253 12.8677C10.1081 12.9849 9.94913 13.0508 9.78337 13.0508C9.61761 13.0508 9.45864 12.9849 9.34143 12.8677C9.22422 12.7505 9.15837 12.5915 9.15837 12.4258L8.93415 7.66211C8.92911 7.54828 8.94704 7.4346 8.98688 7.32784C9.02671 7.22109 9.08763 7.12344 9.166 7.04073C9.24437 6.95802 9.33859 6.89194 9.44305 6.84642C9.5475 6.8009 9.66006 6.77688 9.774 6.77578H9.7822C9.89691 6.77572 10.0105 6.79891 10.116 6.84393C10.2215 6.88896 10.3168 6.95489 10.3961 7.03776C10.4754 7.12063 10.5371 7.21871 10.5775 7.32608C10.6179 7.43346 10.6361 7.5479 10.631 7.6625L10.6326 7.66016Z'
                  fill='#F73B3B'
                />
              </svg>
              <div className='grow shrink basis-0 text-[#3d3d3d] text-sm font-normal leading-tight'>
                Round 2 is currently unavailable. Please return on February 3rd, 2025.
              </div>
            </div>
          </div>
          {width >= 1024 ? (
            <Image src={Mascot4} alt='' className='w-40 h-auto mt-12' />
          ) : (
            <div className='flex flex-col items-center gap-4 bg-white rounded-md p-4 w-full'>
              <Image src={Mascot4} alt='' className='w-40 h-auto' />
              <Link
                href={`${getConfig().ADMIN_URL}`}
                target='_blank'
                className='w-full h-10 px-3 py-2 bg-white rounded-lg border border-[#d1d1d1] flex-col justify-center items-start gap-3 inline-flex'>
                <div className='self-stretch justify-start items-center gap-1.5 inline-flex'>
                  <svg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M6.64851 8.74164L4.7873 10.6028C4.09219 11.298 3.69246 12.2438 3.69976 13.2378C3.70707 14.2318 4.09805 15.1834 4.82615 15.889C5.53172 16.6171 6.48349 17.0081 7.47734 17.0154C8.49386 17.0228 9.41728 16.6456 10.1124 15.9505L11.9736 14.0893M14.351 11.7574L16.2122 9.89619C16.9073 9.20108 17.3071 8.25528 17.2997 7.26127C17.2924 6.26725 16.9015 5.31568 16.1734 4.61007C15.468 3.90467 14.5163 3.51366 13.5223 3.50635C12.5283 3.49905 11.5824 3.87609 10.8872 4.57122L9.02603 6.43244M7.67734 13.0222L13.261 7.43852'
                      stroke='#6D6D6D'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>

                  <div className='grow shrink basis-0 text-[#2d72fb] text-sm font-normal  leading-tight'>
                    creator.punkga.me
                  </div>
                  <svg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M17.167 11.1876L17.167 5.75003C17.167 4.09317 15.8238 2.75002 14.167 2.75003L8.72949 2.7501M12.167 17.7501L6.54199 17.7501C5.50646 17.7501 4.66699 16.9106 4.66699 15.8751L4.66699 7.7501C4.66699 6.71456 5.50646 5.8751 6.54199 5.8751L12.167 5.87509C13.2025 5.87509 14.042 6.71456 14.042 7.75009L14.042 15.8751C14.042 16.9106 13.2025 17.7501 12.167 17.7501Z'
                      stroke='#2D72FB'
                      stroke-width='1.5'
                      stroke-linecap='round'
                    />
                  </svg>
                </div>
              </Link>
              <div className='text-[#4f4f4f] text-sm font-normal  leading-tight'>
                Round 2 manga submissions will be made through the Creator Portal (desktop version). Feel free to
                explore the portal beforehand.
              </div>
            </div>
          )}
        </div>
      ) : (
        <ListComic />
      )}
    </div>
  )
}
const ListComic = () => {
  const { width } = useWindowSize()
  const [comicList, setComicList] = useState([])
  const [offset, setOffset] = useState(0)
  const [remaining, setRemaining] = useState(true)
  useEffect(() => {
    fetchCharacter()
  }, [])
  const fetchCharacter = async () => {
    try {
      const data = await contentService.comic.getLatestComic(20, offset, [1029])
      if (data.length) {
        setComicList([...comicList, ...data])
        setOffset(offset + 20)
        setRemaining(true)
      } else {
        setRemaining(false)
      }
    } catch (error) {
      toast(error.message, {
        type: 'error',
      })
    }
  }
  return (
    <div className='p-4'>
      {width >= 1024 ? (
        <>
          <Button className='w-full xl:max-w-80 xl:mx-auto'>
            <Link href={`${getConfig().ADMIN_URL}/creator/literature-infinity`}>Go to Creator Portal</Link>
          </Button>
          <Rule>
            <div className='text-center xl:max-w-80 xl:mx-auto text-[#5c9efe] text-xs font-medium underline leading-[18px] mt-3'>
              View rules and reward
            </div>
          </Rule>
        </>
      ) : (
        <>
          <div className='flex flex-col items-center gap-4 bg-white rounded-md p-4 w-full'>
            <Image src={Mascot4} alt='' className='w-40 h-auto' />
            <Link
              href={`${getConfig().ADMIN_URL}`}
              target='_blank'
              className='w-full h-10 px-3 py-2 bg-white rounded-lg border border-[#d1d1d1] flex-col justify-center items-start gap-3 inline-flex'>
              <div className='self-stretch justify-start items-center gap-1.5 inline-flex'>
                <svg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M6.64851 8.74164L4.7873 10.6028C4.09219 11.298 3.69246 12.2438 3.69976 13.2378C3.70707 14.2318 4.09805 15.1834 4.82615 15.889C5.53172 16.6171 6.48349 17.0081 7.47734 17.0154C8.49386 17.0228 9.41728 16.6456 10.1124 15.9505L11.9736 14.0893M14.351 11.7574L16.2122 9.89619C16.9073 9.20108 17.3071 8.25528 17.2997 7.26127C17.2924 6.26725 16.9015 5.31568 16.1734 4.61007C15.468 3.90467 14.5163 3.51366 13.5223 3.50635C12.5283 3.49905 11.5824 3.87609 10.8872 4.57122L9.02603 6.43244M7.67734 13.0222L13.261 7.43852'
                    stroke='#6D6D6D'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>

                <div className='grow shrink basis-0 text-[#2d72fb] text-sm font-normal  leading-tight'>
                  creator.punkga.me
                </div>
                <svg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M17.167 11.1876L17.167 5.75003C17.167 4.09317 15.8238 2.75002 14.167 2.75003L8.72949 2.7501M12.167 17.7501L6.54199 17.7501C5.50646 17.7501 4.66699 16.9106 4.66699 15.8751L4.66699 7.7501C4.66699 6.71456 5.50646 5.8751 6.54199 5.8751L12.167 5.87509C13.2025 5.87509 14.042 6.71456 14.042 7.75009L14.042 15.8751C14.042 16.9106 13.2025 17.7501 12.167 17.7501Z'
                    stroke='#2D72FB'
                    stroke-width='1.5'
                    stroke-linecap='round'
                  />
                </svg>
              </div>
            </Link>
            <div className='text-[#4f4f4f] text-sm font-normal  leading-tight'>
              Round 2 manga submissions will be made through the Creator Portal (desktop version). Feel free to explore
              the portal beforehand.
            </div>
          </div>
        </>
      )}
      <div className='mt-8'>
        <div className='text-[#3d3d3d] text-lg font-medium leading-relaxed'>Submission</div>
        {comicList.length ? (
          <>
            <InfiniteScroll
              dataLength={comicList.length}
              next={fetchCharacter}
              hasMore={remaining}
              loader={<h4>Loading...</h4>}
              className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3'>
              {comicList.map((comic, index) => (
                <div className='[&>div]:bg-transparent [&>div]:text-black [&_.text-text-brand-hover]:text-brand-600'>
                  <ComicCard key={index} {...comic} />
                </div>
              ))}
            </InfiniteScroll>
          </>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <Image src={Mascot4} alt='' className='w-40 h-auto mt-12' />
            <div className='text-center text-[#4f4f4f] text-sm font-normal leading-tight'>
              Be the first to submit a manga
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export const getServerSideProps = async (context) => {
  const props = {
    title: 'Literature Infinity Contest| Win 20M VND with Creative Comics',
    description: 'Join the Literature Infinity Contest to celebrate Vietnamese literature and the Year of the Snake!',
    image: '/assets/images/literature-infinity-thumb.png',
  }
  return {
    props: {
      metadata: props,
      ...(await serverSideTranslations(context?.locale!, ['common'])),
    },
  }
}
