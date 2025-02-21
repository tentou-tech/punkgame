import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import Banner1 from '../assets/promotion-banner/li-xi.png'
import Banner2 from '../assets/promotion-banner/literature-infinity.png'
import Mascot from '../assets/promotion-banner/snake.png'
import { contentService } from 'src/services/contentService'
import { formatNumber } from 'src/utils'
import { EyeIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
export default function RightSection({ className }: { className?: string }) {
  const { data: trendingComic } = useSWR({ key: 'get-trending-comic' }, contentService.comic.getTrendingComic)
  return (
    <div className={className}>
      <div className='px-7 space-y-4'>
        <Link href={'/events/li-xi'} className='w-full flex gap-3 bg-[#930706] rounded-lg overflow-hidden h-24'>
          <Image src={Banner1} alt='' className='h-full w-auto' />
          <div className='flex flex-col justify-center pr-4'>
            <div className='text-white text-base font-bold leading-normal'>The year of snake’s LIXI</div>
            <div className='text-white/60 text-xs font-normal leading-[18px]'>25 Jan 2025 - 23 Feb 2025</div>
          </div>
        </Link>
        <Link href={'/events/literature-infinity'} className='w-full flex gap-3 bg-[#311a31] rounded-lg h-24'>
          <div className='relative'>
            <Image src={Banner2} alt='' className='h-full w-auto' />
            <Image src={Mascot} alt='' className='h-[108px] w-[108px] absolute right-[40%] bottom-0' />
          </div>
          <div className='flex flex-col justify-center pr-4'>
            <div className='text-white text-base font-bold leading-normal'>Literature Infinity</div>
            <div className='text-white/60 text-xs font-normal leading-[18px]'>25 Jan 2025 - 23 Mar 2025</div>
          </div>
        </Link>
      </div>
      <div className='px-7'>
        <div className='flex items-center gap-1.5'>
          <svg width='38' height='38' viewBox='0 0 38 38' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M11.9715 8H4L12.4562 18.75L4 29.5H11.9715L20.4278 18.75L11.9715 8Z' fill='white' />
            <path d='M26.5038 8H18.5322L26.9884 18.75L18.5322 29.5H26.5038L34.96 18.75L26.5038 8Z' fill='white' />
          </svg>
          <div className='text-[#f6f6f6] text-lg font-bold leading-relaxed'>Trending</div>
        </div>
        <div className='mt-4 space-y-4'>
          {trendingComic?.slice(0, 4)?.map((comic, index) => (
            <Link
              href={`/comic/${comic.slug}/chapter/1`}
              className='w-full h-[90px] justify-start items-start gap-2 inline-flex bg-neutral-950/50 rounded-lg overflow-hidden'
              key={index}>
              <div className='justify-start items-center flex'>
                <Image src={comic.image} width={100} height={100} className='w-[70px] h-[90px] relative' alt='' />
              </div>
              <div className='grow shrink basis-0 self-stretch py-2.5 flex-col justify-between items-start inline-flex'>
                <div className='self-stretch grow shrink basis-0 flex-col justify-start items-start gap-1 flex'>
                  <div className='self-stretch text-[#f6f6f6] text-base font-semibold  leading-normal'>
                    {comic.en.title}
                  </div>
                  <div className='self-stretch justify-start items-start gap-4 inline-flex'>
                    <div className='justify-start items-start gap-1 flex'>
                      <div className='text-[#f6f6f6] text-xs font-medium  leading-[18px]'>by</div>
                      <div className='text-[#2bfd84] text-xs font-medium  leading-[18px]'>
                        {`${comic.authors[0].name}${
                          comic.authors.length > 1 ? ` + ${comic.authors.length - 1} others` : ''
                        }`}
                      </div>
                    </div>
                    <div className='h-[18px] justify-start items-center gap-1 flex'>
                      <EyeIcon width={16} height={16} />
                      <div className='text-[#f6f6f6] text-xs font-medium  leading-[18px]'>
                        {formatNumber(comic.views)}
                      </div>
                    </div>
                  </div>
                </div>
                <div />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
