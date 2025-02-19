import UserGreen from 'assets/images/userGreen.svg'
import Dropdown, { DropdownMenu, DropdownToggle } from 'components/Dropdown'
import { ImageZoom } from 'components/Image/ImageZoom'
import DOMPurify from 'dompurify'
import moment from 'moment'
import getConfig from 'next/config'
import Image from 'next/image'
import Link from 'next/link'
import pluralize from 'pluralize'
import { useContext, useState } from 'react'
import ReactShowMoreText from 'react-show-more-text'
import { toast } from 'react-toastify'
import { Context } from 'src/context'
import { ModalContext } from 'src/context/modals'
import { PostListContext } from 'src/context/postList'
import { contentService } from 'src/services/contentService'
import { eventService } from 'src/services/eventService'
import { storyChain } from 'src/services/wagmi/config'
export default function Post({ data }) {
  const { likedList, setLikedList } = useContext(PostListContext)
  const { account } = useContext(Context)
  const { setSignInOpen } = useContext(ModalContext)
  const likeData = likedList.find(
    (e) =>
      e.id == `manga-${data?.manga?.id}` ||
      e.id == `artwork-${data?.artwork?.id}` ||
      e.id == `character-${data?.character?.id}`
  )
  const [likeCount, setLikeCount] = useState(
    likeData?.likeCount ||
      data?.artwork?.likes_aggregate?.aggregate?.count ||
      data?.artwork?.likes_aggregate?.aggregate?.count ||
      data?.character?.likes_aggregate?.aggregate?.count ||
      0
  )
  const [isLiked, setIsLiked] = useState(
    !!likeData
      ? true
      : data.type == 'Manga'
      ? data?.manga?.chapters[0]?.chapters_likes?.length > 0
      : data.type == 'Artwork'
      ? data?.artwork?.likes?.length > 0
      : data?.character?.likes?.length > 0
  )
  const likeHandler = async () => {
    try {
      if (!account) {
        setSignInOpen(true)
        return
      }
      if (isLiked) {
        setLikeCount((prev) => prev - 1)
        setIsLiked(false)
        if (data.type == 'Manga') {
          setLikedList(likedList.filter((e) => e.id != `manga-${data.manga.id}`))
          await contentService.chapter.unlikeChapter(data?.manga?.chapters[0]?.id)
        }
        if (data.type == 'Artwork') {
          setLikedList(likedList.filter((e) => e.id != `artwork-${data.artwork.id}`))
          await eventService.story.unlikeArtwork(data?.artwork?.id)
        }
        if (data.type == 'Character') {
          setLikedList(likedList.filter((e) => e.id != `character-${data.character.id}`))
          await eventService.story.unlikeCharacter(data?.character?.id)
        }
      } else {
        const newLikeCount = likeCount + 1
        setLikeCount(newLikeCount)
        setIsLiked(true)
        if (data.type == 'Manga') {
          setLikedList([...likedList, { id: `manga-${data.manga.id}`, likeCount: newLikeCount }])
          await contentService.chapter.likeChapter(data?.manga?.chapters[0]?.id)
        }
        if (data.type == 'Artwork') {
          setLikedList([...likedList, { id: `artwork-${data.artwork.id}`, likeCount: newLikeCount }])
          await eventService.story.likeArtwork(data?.artwork?.id)
        }
        if (data.type == 'Character') {
          setLikedList([...likedList, { id: `character-${data.character.id}`, likeCount: newLikeCount }])
          await eventService.story.likeCharacter(data?.character?.id)
        }
      }
    } catch (error) {
      toast(error.message, {
        type: 'error',
      })
    }
  }
  if (data.type == 'Manga') {
    const languageData = data.manga.manga_languages.find((e) => e.is_main_language)
    const chapterImages =
      data.manga.chapters[0]?.chapter_languages?.find((e) => e.language.is_main)?.detail ||
      data.manga.chapters[0]?.chapter_languages[0]?.detail ||
      []
    if (chapterImages.length == 0) return null
    return (
      <div className='space-y-4 md:bg-neutral-950 md:p-4 md:rounded-lg'>
        {data.manga.manga_creators.length > 1 ? (
          <div className='flex items-center gap-4'>
            <div className='w-10 h-10 relative shrink-0'>
              <Image
                src={data.manga.manga_creators[1].creator?.avatar_url || UserGreen}
                alt=''
                width={40}
                height={40}
                className='w-7 h-7 rounded-full object-cover absolute top-0 right-0'
              />
              <Image
                src={data.manga.manga_creators[0].creator?.avatar_url || UserGreen}
                alt=''
                width={40}
                height={40}
                className='w-7 h-7 rounded-full object-cover absolute bottom-0 left-0 bg-black'
              />
            </div>
            <div className='space-y-1'>
              <div className='text-sm font-semibold text-text-brand-focus'>
                {`${data.manga.manga_creators[0].creator.pen_name || data.manga.manga_creators[0].creator.name} + ${
                  data.manga.manga_creators.length - 1
                } ${pluralize('co-authors', data.manga.manga_creators.length - 1)}`}
              </div>
              <div className='text-xxs text-neutral-400'>{moment(data.manga.latest_published).fromNow()}</div>
            </div>
          </div>
        ) : (
          <Link href={`/artist/${data.manga.manga_creators[0].creator.slug}`} className='flex items-center gap-4'>
            <Image
              src={data.manga.manga_creators[0].creator?.avatar_url || UserGreen}
              alt=''
              width={40}
              height={40}
              className='w-10 h-10 rounded-full object-cover'
            />
            <div className='space-y-1'>
              <div className='text-sm font-semibold text-text-brand-focus'>
                {data.manga.manga_creators[0].creator.pen_name || data.manga.manga_creators[0].creator.name}
              </div>
              <div className='text-xxs text-neutral-400'>{moment(data.manga.latest_published).fromNow()}</div>
            </div>
          </Link>
        )}
        <Link href={`/comic/${data.manga.slug}/chapter/${data.manga.chapters[0].chapter_number}`} className='block'>
          <div className='text-lg font-medium'>{languageData?.title}</div>
          <div className='space-y-1.5'>
            <ReactShowMoreText
              lines={2}
              more='View more'
              less='View less'
              className='text-sm'
              anchorClass='text-text-info-primary text-sm font-medium'
              expanded={false}
              truncatedEndingComponent={'... '}>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(languageData.description) }}></div>
            </ReactShowMoreText>
          </div>
        </Link>
        <div className='space-y-2'>
          <Link
            href={`/comic/${data.manga.slug}/chapter/${data.manga.chapters[0].chapter_number}`}
            className='w-full h-full block aspect-square'>
            {chapterImages.length == 1 ? (
              <Image
                width={300}
                height={300}
                src={chapterImages[0].image_path}
                alt=''
                className='w-full h-full object-cover'
              />
            ) : chapterImages.length == 2 ? (
              <div className='w-full h-full grid grid-cols-2 gap-2'>
                <Image
                  width={300}
                  height={300}
                  src={chapterImages[0].image_path}
                  alt=''
                  className='w-full h-full object-cover'
                />
                <Image
                  width={300}
                  height={300}
                  src={chapterImages[1].image_path}
                  alt=''
                  className='w-full h-full object-cover'
                />
              </div>
            ) : (
              <div className='w-full h-full grid grid-cols-2 gap-2'>
                <Image
                  width={300}
                  height={300}
                  src={chapterImages[0].image_path}
                  alt=''
                  className='w-full h-full object-cover min-h-0'
                />
                <div className='grid grid-cols-1 gap-2 h-full min-h-0'>
                  <Image
                    width={300}
                    height={300}
                    src={chapterImages[1].image_path}
                    alt=''
                    className='w-full h-full object-cover min-h-0'
                  />
                  <div className='w-full h-full relative min-h-0'>
                    <Image
                      width={300}
                      height={300}
                      src={chapterImages[2].image_path}
                      alt=''
                      className='w-full h-full object-cover'
                    />
                    {chapterImages.length > 3 && (
                      <div className='absolute top-0 left-0 w-full h-full bg-black/50 grid place-items-center text-lg font-medium'>
                        +{chapterImages.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Link>
          <div className='text-xs font-semibold text-neutral-400 leading-8'>
            {likeCount} {pluralize('likes', likeCount)}
          </div>
          <div className='h-8 flex items-center justify-between'>
            <div onClick={likeHandler} className='cursor-pointer flex items-center gap-1 text-sm font-semibold'>
              {isLiked ? (
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='red'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3.17115 5.17232C3.92126 4.42244 4.93849 4.00118 5.99915 4.00118C7.0598 4.00118 8.07703 4.42244 8.82714 5.17232L9.99914 6.34332L11.1711 5.17232C11.5401 4.79028 11.9815 4.48555 12.4695 4.27592C12.9575 4.06628 13.4824 3.95594 14.0135 3.95132C14.5447 3.94671 15.0714 4.04791 15.563 4.24904C16.0545 4.45016 16.5012 4.74717 16.8767 5.12274C17.2523 5.49832 17.5493 5.94492 17.7504 6.43651C17.9516 6.92809 18.0528 7.45481 18.0481 7.98593C18.0435 8.51705 17.9332 9.04193 17.7235 9.52994C17.5139 10.018 17.2092 10.4593 16.8271 10.8283L9.99914 17.6573L3.17115 10.8283C2.42126 10.0782 2 9.06098 2 8.00032C2 6.93967 2.42126 5.92244 3.17115 5.17232V5.17232Z'
                    stroke='red'
                    strokeWidth='1.5'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3.17115 5.17232C3.92126 4.42244 4.93849 4.00118 5.99915 4.00118C7.0598 4.00118 8.07703 4.42244 8.82714 5.17232L9.99914 6.34332L11.1711 5.17232C11.5401 4.79028 11.9815 4.48555 12.4695 4.27592C12.9575 4.06628 13.4824 3.95594 14.0135 3.95132C14.5447 3.94671 15.0714 4.04791 15.563 4.24904C16.0545 4.45016 16.5012 4.74717 16.8767 5.12274C17.2523 5.49832 17.5493 5.94492 17.7504 6.43651C17.9516 6.92809 18.0528 7.45481 18.0481 7.98593C18.0435 8.51705 17.9332 9.04193 17.7235 9.52994C17.5139 10.018 17.2092 10.4593 16.8271 10.8283L9.99914 17.6573L3.17115 10.8283C2.42126 10.0782 2 9.06098 2 8.00032C2 6.93967 2.42126 5.92244 3.17115 5.17232V5.17232Z'
                    stroke='#F6F6F6'
                    strokeWidth='1.5'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
              {isLiked ? 'Liked' : 'Like'}
            </div>
            <Link href={`/comic/${data.manga.slug}`} className='flex items-center gap-1 text-sm font-semibold'>
              View all chapters
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M10 7L15 12L10 17'
                  stroke='white'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }
  if (data.type == 'Artwork') {
    return (
      <div className='space-y-4 md:bg-neutral-950 md:p-4 md:rounded-lg'>
        <Link href={`/artist/${data.artwork.creator.slug}`} className='flex items-center gap-4'>
          <Image
            src={data.artwork.creator?.avatar_url || UserGreen}
            alt=''
            width={40}
            height={40}
            className='w-10 h-10 rounded-full object-cover shrink-0'
          />
          <div className='space-y-1'>
            <div className='text-sm font-semibold text-text-brand-focus'>
              {data.artwork.creator.pen_name || data.artwork.creator.name}
            </div>
            <div className='text-xxs text-neutral-400'>{moment(data.updated_at).fromNow()}</div>
          </div>
        </Link>
        <div className='block'>
          <div className='flex items-center gap-2'>
            <div className='text-lg font-medium'>{data.artwork.name}</div>
            {data.artwork.story_artworks[0] && (
              <div className='h-4 px-2 py-1 bg-[#0057ff] rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] justify-start items-center gap-1 inline-flex'>
                <div className='text-white text-[10px] font-bold leading-[15px]'>IP Registered</div>
              </div>
            )}
          </div>
          <div className='space-y-1.5'>
            <ReactShowMoreText
              lines={2}
              more='View more'
              less='View less'
              className='text-sm'
              anchorClass='text-text-info-primary text-sm font-medium'
              expanded={false}
              truncatedEndingComponent={'... '}>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.artwork.description) }}></div>
            </ReactShowMoreText>
          </div>
        </div>
        <div className='space-y-2'>
          <div className='w-full overflow-hidden max-h-[90vh] flex items-center justify-center'>
            <ImageZoom src={data.artwork.url} width={3000} height={3000} alt='' className='' />
          </div>
          <div className='text-xs font-semibold text-neutral-400 leading-8'>
            {likeCount} {pluralize('likes', likeCount)}
          </div>
          <div className='h-8 flex items-center justify-between'>
            <div onClick={likeHandler} className='cursor-pointer flex items-center gap-1 text-sm font-semibold'>
              {isLiked ? (
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='red'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3.17115 5.17232C3.92126 4.42244 4.93849 4.00118 5.99915 4.00118C7.0598 4.00118 8.07703 4.42244 8.82714 5.17232L9.99914 6.34332L11.1711 5.17232C11.5401 4.79028 11.9815 4.48555 12.4695 4.27592C12.9575 4.06628 13.4824 3.95594 14.0135 3.95132C14.5447 3.94671 15.0714 4.04791 15.563 4.24904C16.0545 4.45016 16.5012 4.74717 16.8767 5.12274C17.2523 5.49832 17.5493 5.94492 17.7504 6.43651C17.9516 6.92809 18.0528 7.45481 18.0481 7.98593C18.0435 8.51705 17.9332 9.04193 17.7235 9.52994C17.5139 10.018 17.2092 10.4593 16.8271 10.8283L9.99914 17.6573L3.17115 10.8283C2.42126 10.0782 2 9.06098 2 8.00032C2 6.93967 2.42126 5.92244 3.17115 5.17232V5.17232Z'
                    stroke='red'
                    strokeWidth='1.5'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3.17115 5.17232C3.92126 4.42244 4.93849 4.00118 5.99915 4.00118C7.0598 4.00118 8.07703 4.42244 8.82714 5.17232L9.99914 6.34332L11.1711 5.17232C11.5401 4.79028 11.9815 4.48555 12.4695 4.27592C12.9575 4.06628 13.4824 3.95594 14.0135 3.95132C14.5447 3.94671 15.0714 4.04791 15.563 4.24904C16.0545 4.45016 16.5012 4.74717 16.8767 5.12274C17.2523 5.49832 17.5493 5.94492 17.7504 6.43651C17.9516 6.92809 18.0528 7.45481 18.0481 7.98593C18.0435 8.51705 17.9332 9.04193 17.7235 9.52994C17.5139 10.018 17.2092 10.4593 16.8271 10.8283L9.99914 17.6573L3.17115 10.8283C2.42126 10.0782 2 9.06098 2 8.00032C2 6.93967 2.42126 5.92244 3.17115 5.17232V5.17232Z'
                    stroke='#F6F6F6'
                    strokeWidth='1.5'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
              {isLiked ? 'Liked' : 'Like'}
            </div>
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
                <div className='p-4 rounded-lg bg-gray-900 text-white space-y-4 text-sm'>
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      navigator.share({
                        url: `${window.location.origin}/artworks/${data.artwork.id}`,
                      })
                    }}>
                    Share
                  </div>
                  {data.artwork.story_artworks[0] && (
                    <Link
                      className='block'
                      target='_blank'
                      href={`${storyChain.blockExplorers.secondary.url}ipa/${data.artwork.story_artworks[0]?.story_ip_asset?.ip_asset_id}`}>
                      View on Story Protocol
                    </Link>
                  )}
                </div>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    )
  }
  if (data.type == 'Character') {
    return (
      <div className='space-y-4 md:bg-neutral-950 md:p-4 md:rounded-lg'>
        <div className='flex items-center gap-4'>
          <Image
            src={data.character.authorizer_user.creator?.avatar_url || UserGreen}
            alt=''
            width={40}
            height={40}
            className='w-10 h-10 rounded-full object-cover shrink-0'
          />
          <div className='space-y-1'>
            <div className='text-sm font-semibold text-text-brand-focus'>
              {data.character.authorizer_user.creator?.pen_name ||
                data.character.authorizer_user.creator?.name ||
                data.character.authorizer_user.nickname}
            </div>
            <div className='text-xxs text-neutral-400'>{moment(data.updated_at).fromNow()}</div>
          </div>
        </div>
        <div className='block'>
          <div className='flex items-center gap-2'>
            <div className='text-lg font-medium'>{data.character.name}</div>
          </div>
          <div className='space-y-1.5'>
            <ReactShowMoreText
              lines={2}
              more='View more'
              less='View less'
              className='text-sm'
              anchorClass='text-text-info-primary text-sm font-medium'
              expanded={false}
              truncatedEndingComponent={'... '}>
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.character.description) }}></div>
            </ReactShowMoreText>
          </div>
        </div>
        <div className='space-y-2'>
          <div className='w-full overflow-hidden max-h-[90vh] flex items-center justify-center'>
            <ImageZoom src={data.character.avatar_url} width={3000} height={3000} alt='' className='' />
          </div>
          <div className='text-xs font-semibold text-neutral-400 leading-8'>
            {likeCount} {pluralize('likes', likeCount)}
          </div>
          <div className='h-8 flex items-center justify-between'>
            <div onClick={likeHandler} className='cursor-pointer flex items-center gap-1 text-sm font-semibold'>
              {isLiked ? (
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='red'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3.17115 5.17232C3.92126 4.42244 4.93849 4.00118 5.99915 4.00118C7.0598 4.00118 8.07703 4.42244 8.82714 5.17232L9.99914 6.34332L11.1711 5.17232C11.5401 4.79028 11.9815 4.48555 12.4695 4.27592C12.9575 4.06628 13.4824 3.95594 14.0135 3.95132C14.5447 3.94671 15.0714 4.04791 15.563 4.24904C16.0545 4.45016 16.5012 4.74717 16.8767 5.12274C17.2523 5.49832 17.5493 5.94492 17.7504 6.43651C17.9516 6.92809 18.0528 7.45481 18.0481 7.98593C18.0435 8.51705 17.9332 9.04193 17.7235 9.52994C17.5139 10.018 17.2092 10.4593 16.8271 10.8283L9.99914 17.6573L3.17115 10.8283C2.42126 10.0782 2 9.06098 2 8.00032C2 6.93967 2.42126 5.92244 3.17115 5.17232V5.17232Z'
                    stroke='red'
                    strokeWidth='1.5'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3.17115 5.17232C3.92126 4.42244 4.93849 4.00118 5.99915 4.00118C7.0598 4.00118 8.07703 4.42244 8.82714 5.17232L9.99914 6.34332L11.1711 5.17232C11.5401 4.79028 11.9815 4.48555 12.4695 4.27592C12.9575 4.06628 13.4824 3.95594 14.0135 3.95132C14.5447 3.94671 15.0714 4.04791 15.563 4.24904C16.0545 4.45016 16.5012 4.74717 16.8767 5.12274C17.2523 5.49832 17.5493 5.94492 17.7504 6.43651C17.9516 6.92809 18.0528 7.45481 18.0481 7.98593C18.0435 8.51705 17.9332 9.04193 17.7235 9.52994C17.5139 10.018 17.2092 10.4593 16.8271 10.8283L9.99914 17.6573L3.17115 10.8283C2.42126 10.0782 2 9.06098 2 8.00032C2 6.93967 2.42126 5.92244 3.17115 5.17232V5.17232Z'
                    stroke='#F6F6F6'
                    strokeWidth='1.5'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
              {isLiked ? 'Liked' : 'Like'}
            </div>
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
                <div className='p-4 rounded-lg bg-gray-900 text-white space-y-4 text-sm'>
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      navigator.share({
                        url: `${window.location.origin}/characters?character_id=${data.character.id}`,
                      })
                    }}>
                    Share
                  </div>
                  {data.character.story_ip_asset?.ip_asset_id && (
                    <Link
                      className='block'
                      target='_blank'
                      href={`${storyChain.blockExplorers.secondary.url}ipa/${data.character?.story_ip_asset?.ip_asset_id}`}>
                      View on Story Protocol
                    </Link>
                  )}
                </div>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    )
  }
}
