import { Skeleton } from '@mui/material'
import Copy2Clipboard from 'components/Copy2Clipboard'
import Dropdown, { DropdownMenu, DropdownToggle } from 'components/Dropdown'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import InfiniteScroll from 'react-infinite-scroll-component'
import { toast } from 'react-toastify'
import { Context } from 'src/context'
import { ModalContext } from 'src/context/modals'
import { eventService } from 'src/services/eventService'
import { storyChain } from 'src/services/wagmi/config'
import { formatNumber, shorten } from 'src/utils'

export default function CharacterDetail({ id }) {
  const { account } = useContext(Context)
  const { setSignInOpen } = useContext(ModalContext)
  const [characterData, setCharacterData] = useState(null)
  const [artworks, setArtworks] = useState([])
  const [remaining, setRemaining] = useState(true)
  const [page, setPage] = useState(1)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const fetchCharacterData = async (isInit?: boolean) => {
    try {
      const res = await eventService.story.getCharacterDetail(account?.id, id, page)
      if (res?.data?.data?.story_character_by_pk) {
        if (isInit) {
          setCharacterData(res.data.data.story_character_by_pk)
        }
        setIsLiked(res.data.data.story_character_by_pk.likes?.length)
        setLikeCount(res.data.data.story_character_by_pk.likes_aggregate?.aggregate?.count || 0)
        const newArtworks = [...artworks, ...(res.data.data.story_character_by_pk.story_artwork_characters || [])]
        setArtworks(newArtworks)
        if (
          res.data.data.story_character_by_pk.story_artwork_characters_aggregate.aggregate.count > newArtworks.length
        ) {
          setRemaining(true)
          setPage((prev) => prev + 1)
        } else {
          setRemaining(false)
        }
      }
    } catch (error) {
      toast(error.message, {
        type: 'error',
      })
    }
  }
  const likeHandler = async () => {
    try {
      if (!account) {
        setSignInOpen(true)
        return
      }
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      setIsLiked((prevState) => !prevState)
      if (isLiked) {
        await eventService.story.unlikeCharacter(id)
      } else {
        await eventService.story.likeCharacter(id)
      }
    } catch (error) {
      toast(error.message, {
        type: 'error',
      })
    }
  }
  useEffect(() => {
    fetchCharacterData(true)
  }, [])

  if (!characterData) {
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
            src={characterData?.avatar_url}
            alt=''
            width={1080}
            height={1080}
            className='rounded-lg w-full max-h-[90vh] aspect-square border-[3px] border-neutral-black object-cover'
          />
          <div className='relative'>
            <div className='text-xs font-medium space-y-1.5'>
              <div className='flex items-start gap-8'>
                <div className='text-lg font-medium w-full'>{characterData?.name}</div>
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
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z'
                        stroke='white'
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
                      <Link
                        className='block'
                        target='_blank'
                        href={`${storyChain.blockExplorers.secondary.url}ipa/${characterData?.story_ip_asset?.ip_asset_id}`}>
                        View on Story Protocol
                      </Link>
                    </div>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className='w-fit'>
                by{' '}
                {characterData?.authorizer_user?.creator?.slug ? (
                  <Link
                    target='_blank'
                    href={`/artist/${characterData?.authorizer_user?.creator?.slug}`}
                    className='text-text-brand-defaul'>
                    {characterData?.authorizer_user?.creator?.pen_name}
                  </Link>
                ) : (
                  <span className='text-text-brand-defaul'>
                    {characterData?.authorizer_user?.creator?.pen_name ||
                      characterData?.authorizer_user?.nickname ||
                      'PunkgaMe'}
                  </span>
                )}
              </div>
              <div className='h-[18px] flex items-center gap-1.5 leading-tight'>
                IP ID:{' '}
                <Link
                  target='_blank'
                  href={`${storyChain.blockExplorers.secondary.url}ipa/${characterData?.story_ip_asset?.ip_asset_id}`}
                  className='text-text-brand-defaul'>
                  {shorten(characterData?.story_ip_asset?.ip_asset_id)}
                </Link>{' '}
                <Copy2Clipboard text={characterData?.story_ip_asset?.ip_asset_id}>
                  <svg width='18' height='19' viewBox='0 0 18 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M8.98537 5.9041V7.9291C8.98537 8.3019 9.28758 8.6041 9.66037 8.6041H11.6854M13.0354 3.2041H8.31021C7.56463 3.2041 6.96021 3.80851 6.96021 4.55409V5.9041M13.0354 3.2041H13.4119C13.602 3.2041 13.783 3.28416 13.9139 3.42195C14.1107 3.629 14.4225 3.94781 14.7229 4.2166C14.9583 4.42727 15.3282 4.80534 15.5497 5.03511C15.6695 5.15937 15.7354 5.32529 15.7354 5.49788L15.7354 5.9041M13.0354 3.2041V5.2291C13.0354 5.60189 13.3376 5.9041 13.7104 5.9041H15.7354M15.7354 5.9041L15.7352 12.6541C15.7352 13.3997 15.1308 14.0041 14.3852 14.0041H11.6852M10.6729 6.9166C10.3725 6.64781 10.0607 6.329 9.86391 6.12195C9.73295 5.98417 9.55201 5.9041 9.36192 5.9041H4.26021C3.51463 5.9041 2.91021 6.50851 2.91021 7.2541L2.91016 15.3541C2.91015 16.0997 3.51457 16.7041 4.26015 16.7041L10.3352 16.7041C11.0808 16.7041 11.6852 16.0997 11.6852 15.3541L11.6854 8.19788C11.6854 8.02529 11.6195 7.85937 11.4997 7.73512C11.2782 7.50534 10.9083 7.12727 10.6729 6.9166Z'
                      stroke='white'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </Copy2Clipboard>
              </div>
            </div>
            <p className='text-sm w-full mt-4 whitespace-pre-wrap'>{ReactHtmlParser(characterData?.description)}</p>
            <div className='flex items-center gap-1 mt-3 cursor-pointer w-fit' onClick={likeHandler}>
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M3.17115 5.17428C3.92126 4.42439 4.93849 4.00313 5.99915 4.00313C7.0598 4.00313 8.07703 4.42439 8.82714 5.17428L9.99914 6.34528L11.1711 5.17428C11.5401 4.79224 11.9815 4.48751 12.4695 4.27787C12.9575 4.06824 13.4824 3.95789 14.0135 3.95328C14.5447 3.94866 15.0714 4.04987 15.563 4.25099C16.0545 4.45211 16.5012 4.74913 16.8767 5.1247C17.2523 5.50027 17.5493 5.94688 17.7504 6.43846C17.9516 6.93005 18.0528 7.45676 18.0481 7.98788C18.0435 8.519 17.9332 9.04388 17.7235 9.5319C17.5139 10.0199 17.2092 10.4613 16.8271 10.8303L9.99914 17.6593L3.17115 10.8303C2.42126 10.0802 2 9.06293 2 8.00228C2 6.94162 2.42126 5.92439 3.17115 5.17428V5.17428Z'
                  stroke='#fff'
                  fill={isLiked ? 'red' : 'none'}
                  strokeWidth='1.5'
                  strokeLinejoin='round'
                />
              </svg>
              <span className='text-sm font-semibold'>{formatNumber(likeCount)}</span>
            </div>
            <div className='mt-4 text-lg font-semibold'>Appears in</div>
            <div id='artwork-list' className='w-full mt-4 max-h-[450px] md:max-h-[70vh] md:h-fit overflow-auto'>
              <InfiniteScroll
                loader={<h4>Loading...</h4>}
                scrollableTarget='artwork-list'
                next={fetchCharacterData}
                dataLength={artworks.length}
                className=' flex gap-4 flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 !overflow-x-hidden'
                hasMore={remaining}>
                {artworks?.map(({ story_artwork }) => (
                  <div key={story_artwork.id} className='shrink-0 flex gap-2 md:flex-col'>
                    <Image
                      src={story_artwork.display_url}
                      alt=''
                      width={100}
                      height={100}
                      className='w-[100px] md:w-full border-[3px] border-neutral-black aspect-square rounded-md'
                    />
                    <div>
                      <div className='text-xs font-medium'>{story_artwork.name}</div>
                      <div className='mt-0.5 text-xs font-medium'>
                        by{' '}
                        {story_artwork?.authorizer_user?.creator ? (
                          <Link
                            target='_blank'
                            href={`/artist/${story_artwork?.authorizer_user?.creator?.slug}`}
                            className='text-text-brand-defaul'>
                            {story_artwork?.authorizer_user?.creator?.pen_name}
                          </Link>
                        ) : (
                          <span className='text-text-brand-defaul'>
                            {story_artwork?.authorizer_user?.nickname || 'PunkgaMe'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
