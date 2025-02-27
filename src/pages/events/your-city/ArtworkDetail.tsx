import { Skeleton } from '@mui/material'
import Copy2Clipboard from 'components/Copy2Clipboard'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from 'src/context'
import { ModalContext } from 'src/context/modals'
import { eventService } from 'src/services/eventService'
import { formatNumber, shorten } from 'src/utils'
import useSWR from 'swr'
import Image1 from 'components/pages/event/your-city/assets/image719.png'
import Dropdown, { DropdownMenu, DropdownToggle } from 'components/Dropdown'
import Link from 'next/link'
import Modal from 'components/pages/event/your-city/Modal'
import ReactHtmlParser from 'react-html-parser'
import { storyChain } from 'src/services/wagmi/config'

export default function ArtworkDetail({ id }) {
  const { account } = useContext(Context)
  const { setSignInOpen } = useContext(ModalContext)
  const { data } = useSWR(
    {
      key: 'get artwork detail',
      id,
      userId: account?.id,
    },
    ({ id, userId }) => eventService.story.getArtworkDetail(userId, id)
  )
  const artworkData = data?.data?.data?.story_artwork_by_pk
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [openReport, setOpenReport] = useState(false)
  const [reason, setReason] = useState('')
  const likeHandler = async () => {
    try {
      if (!account) {
        setSignInOpen(true)
        return
      }
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      setIsLiked((prevState) => !prevState)
      if (isLiked) {
        await eventService.story.unlikeArtwork(artworkData.artwork.id)
      } else {
        await eventService.story.likeArtwork(artworkData.artwork.id)
      }
    } catch (error) {
      toast(error.message, {
        type: 'error',
      })
    }
  }
  const reportHandler = async () => {
    try {
      await eventService.report({
        artwork_id: artworkData.artwork.id,
        reason,
      })
      toast('Report successfully', {
        type: 'success',
      })
      setOpenReport(false)
    } catch (error) {
      toast(error.message, {
        type: 'error',
      })
    }
  }
  useEffect(() => {
    setIsLiked(!!artworkData?.artwork?.likes?.length)
    setLikeCount(artworkData?.artwork?.likes_aggregate?.aggregate?.count || 0)
  }, [artworkData?.artwork?.likes?.length])

  if (!artworkData) {
    return (
      <div className='mt-3 md:mt-0 text-start md:h-full'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-[70%_auto] md:gap-9 md:h-full'>
          <div className='w-full aspect-square max-h-[90vh]'>
            <Skeleton className='w-full !h-full !transform-none' />
          </div>
          <div className=''>
            <Skeleton />
            <Skeleton className='w-1/2' />
            <Skeleton className='w-1/3' />
            <Skeleton className='w-1/3' />
            <Skeleton className='w-full !h-40 !transform-none' />
          </div>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className='mt-3 md:mt-0 text-start md:h-full'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-[60%_auto] md:gap-9 md:h-full'>
          <Image
            src={artworkData?.artwork?.url}
            alt=''
            width={1080}
            height={1080}
            className='rounded-lg w-full max-h-[90vh] aspect-square border-[3px] border-neutral-black object-cover'
          />
          <div className='relative'>
            <div className='text-xs font-medium space-y-1.5'>
              <div className='flex items-start gap-8'>
                <div className='text-lg font-medium w-full'>{artworkData?.artwork?.name}</div>
                <Dropdown>
                  <DropdownToggle>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      className='cursor-pointer'>
                      <path
                        d='M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z'
                        stroke='black'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z'
                        stroke='black'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z'
                        stroke='black'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </DropdownToggle>
                  <DropdownMenu customClass='right-0'>
                    <div className='p-4 rounded-lg bg-white text-black space-y-4 text-xs'>
                      <div
                        className='cursor-pointer'
                        onClick={() => {
                          navigator.share({
                            url: location.href,
                          })
                        }}>
                        Share
                      </div>
                      <div className='cursor-pointer' onClick={() => setOpenReport(true)}>
                        Report
                      </div>
                      <Link
                        className='block'
                        target='_blank'
                        href={`${storyChain.blockExplorers.secondary.url}ipa/${artworkData?.story_ip_asset?.ip_asset_id}`}>
                        View on Story Protocol
                      </Link>
                    </div>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className='w-fit'>
                by{' '}
                <Link
                  target='_blank'
                  href={`/artist/${artworkData?.artwork?.creator?.slug}`}
                  className='text-text-brand-defaul'>
                  {artworkData?.artwork?.creator?.pen_name}
                </Link>
              </div>
              <div className='h-[18px] flex items-center gap-1.5 leading-tight'>
                IP ID:{' '}
                <Link
                  target='_blank'
                  href={`${storyChain.blockExplorers.secondary.url}ipa/${artworkData?.story_ip_asset?.ip_asset_id}`}
                  className='text-text-brand-defaul'>
                  {shorten(artworkData?.story_ip_asset?.ip_asset_id)}
                </Link>{' '}
                <Copy2Clipboard text={artworkData?.story_ip_asset?.ip_asset_id} />
              </div>
            </div>
            <p className='text-sm w-full mt-4 whitespace-pre-wrap'>
              {ReactHtmlParser(artworkData?.artwork?.description)}
            </p>
            <div className='flex items-center gap-1 mt-3 cursor-pointer w-fit' onClick={likeHandler}>
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M3.17115 5.17428C3.92126 4.42439 4.93849 4.00313 5.99915 4.00313C7.0598 4.00313 8.07703 4.42439 8.82714 5.17428L9.99914 6.34528L11.1711 5.17428C11.5401 4.79224 11.9815 4.48751 12.4695 4.27787C12.9575 4.06824 13.4824 3.95789 14.0135 3.95328C14.5447 3.94866 15.0714 4.04987 15.563 4.25099C16.0545 4.45211 16.5012 4.74913 16.8767 5.1247C17.2523 5.50027 17.5493 5.94688 17.7504 6.43846C17.9516 6.93005 18.0528 7.45676 18.0481 7.98788C18.0435 8.519 17.9332 9.04388 17.7235 9.5319C17.5139 10.0199 17.2092 10.4613 16.8271 10.8303L9.99914 17.6593L3.17115 10.8303C2.42126 10.0802 2 9.06293 2 8.00228C2 6.94162 2.42126 5.92439 3.17115 5.17428V5.17428Z'
                  stroke='#222222'
                  fill={isLiked ? 'red' : 'none'}
                  strokeWidth='1.5'
                  strokeLinejoin='round'
                />
              </svg>
              <span className='text-sm font-semibold'>{formatNumber(likeCount)}</span>
            </div>
            <div className='mt-4 text-lg font-semibold'>Characters</div>
            <div className='overflow-auto no-scrollbar -mx-4 mt-4 w-screen md:w-full flex [&>*]:ml-4'>
              {artworkData?.story_artwork_characters?.map(({ story_character }) => (
                <Link
                  href={`/characters?character_id=${story_character.id}`}
                  key={story_character.id}
                  className='shrink-0'>
                  <Image
                    src={story_character.avatar_url}
                    alt=''
                    width={100}
                    height={100}
                    className='w-[100px] border-[3px] border-neutral-black aspect-square rounded-md'
                  />
                  <div className='mt-4 text-xs font-medium'>{story_character.name}</div>
                  <div className='mt-0.5 text-xs font-medium'>
                    by <span className='text-text-brand-defaul'>{story_character.authorizer_user.nickname}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Image src={Image1} alt='' className='absolute bottom-0 right-0 w-3/5 hidden lg:block' />
          </div>
        </div>
      </div>
      <Modal open={openReport} setOpen={setOpenReport}>
        <div className='flex flex-col gap-4 items-center max-w-xl px-8 py-4 bg-[#ffffff] text-neutral-black rounded-mlg border-[3px] border-neutral-black w-screen'>
          <div className='text-lg font-semibold w-full text-center'>REPORT THIS ARTWORK</div>
          <div className='w-full space-y-1.5'>
            <div className='text-lg font-medium'>{artworkData?.artwork?.name}</div>
            <div className='w-fit text-xs'>
              by{' '}
              <Link
                target='_blank'
                href={`/artist/${artworkData?.artwork?.creator?.slug}`}
                className='text-text-brand-defaul'>
                {artworkData?.artwork?.creator?.pen_name}
              </Link>
            </div>
          </div>
          <textarea
            className='bg-white border border-black rounded-lg text-sm placeholder:text-neutral-600 px-4 py-2 w-full min-h-40'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div
            onClick={reportHandler}
            className='p-2.5 text-center font-roboto text-[22px] uppercase font-bold text-white bg-neutral-black w-64 cursor-pointer'>
            {'Submit'}
          </div>
        </div>
      </Modal>
    </>
  )
}
