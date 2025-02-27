import Copy2Clipboard from 'components/Copy2Clipboard'
import Dropdown, { DropdownMenu, DropdownToggle } from 'components/Dropdown'
import { ImageZoom } from 'components/Image/ImageZoom'
import DOMPurify from 'dompurify'
import getConfig from 'next/config'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useState } from 'react'
import ReactShowMoreText from 'react-show-more-text'
import { toast } from 'react-toastify'
import { Context } from 'src/context'
import { ModalContext } from 'src/context/modals'
import { eventService } from 'src/services/eventService'
import { storyChain } from 'src/services/wagmi/config'
import { formatNumber, shorten } from 'src/utils'

export default function ArtworkDetail({ data }) {
  const { setSignInOpen } = useContext(ModalContext)
  const { account } = useContext(Context)
  const [likeCount, setLikeCount] = useState(data?.artwork?.likes_aggregate?.aggregate?.count || 0)
  const [isLiked, setIsLiked] = useState(data?.artwork?.likes?.length > 0)
  const likeHandler = async () => {
    try {
      if (!account) {
        setSignInOpen(true)
        return
      }
      if (isLiked) {
        setLikeCount((prev) => prev - 1)
        setIsLiked(false)
        await eventService.story.unlikeArtwork(data?.artwork?.id)
      } else {
        const newLikeCount = likeCount + 1
        setLikeCount(newLikeCount)
        setIsLiked(true)
        await eventService.story.likeArtwork(data?.id)
      }
    } catch (error) {
      toast(error.message, {
        type: 'error',
      })
    }
  }
  return (
    <div>
      <div className='w-full overflow-hidden max-h-[70vh]'>
        <ImageZoom src={data.url} width={3000} height={3000} alt='' className='' />
      </div>
      <div className='mt-4'>
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
            {formatNumber(likeCount)}
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
                      url: location.href,
                    })
                  }}>
                  Share
                </div>
                {data.story_artworks?.[0]?.story_ip_asset?.ip_asset_id && (
                  <Link
                    className='block'
                    target='_blank'
                    href={`${storyChain.blockExplorers.secondary.url}ipa/${data.story_artworks?.[0].story_ip_asset.ip_asset_id}`}>
                    View on Story Protocol
                  </Link>
                )}
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className='mt-4 space-y-1.5'>
          <div className='flex items-center gap-2'>
            <div className='text-lg font-medium'>{data.name}</div>
            {data.story_artworks?.[0]?.story_ip_asset?.ip_asset_id && (
              <div className='h-4 px-2 py-1 bg-[#0057ff] rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] justify-start items-center gap-1 inline-flex'>
                <div className='text-white text-[10px] font-bold leading-[15px]'>IP Registered</div>
              </div>
            )}
          </div>
          <div className='w-fit text-sm'>
            by{' '}
            <Link target='_blank' href={`/artist/${data?.artwork?.creator?.slug}`} className='text-text-brand-defaul'>
              {data?.artwork?.creator?.pen_name || data?.artwork?.authorizer_user?.nickname || 'Unknown creator'}
            </Link>
          </div>
          {data.story_artworks?.[0]?.story_ip_asset?.ip_asset_id && (
            <div className='h-[18px] flex items-center gap-1.5 leading-tight'>
              IP ID:{' '}
              <Link
                target='_blank'
                href={`${storyChain.blockExplorers.secondary.url}ipa/${data.story_artworks?.[0]?.story_ip_asset?.ip_asset_id}`}
                className='text-text-brand-defaul'>
                {shorten(data.story_artworks?.[0]?.story_ip_asset?.ip_asset_id)}
              </Link>{' '}
              <Copy2Clipboard text={data.story_artworks?.[0]?.story_ip_asset?.ip_asset_id}>
                <svg width='18' height='19' viewBox='0 0 18 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M8.98537 5.75078V7.77578C8.98537 8.14858 9.28758 8.45078 9.66037 8.45078H11.6854M13.0354 3.05078H8.31021C7.56463 3.05078 6.96021 3.65519 6.96021 4.40077V5.75078M13.0354 3.05078H13.4119C13.602 3.05078 13.783 3.13084 13.9139 3.26863C14.1107 3.47568 14.4225 3.79449 14.7229 4.06328C14.9583 4.27395 15.3282 4.65202 15.5497 4.88179C15.6695 5.00605 15.7354 5.17197 15.7354 5.34456L15.7354 5.75078M13.0354 3.05078V5.07578C13.0354 5.44857 13.3376 5.75078 13.7104 5.75078H15.7354M15.7354 5.75078L15.7352 12.5008C15.7352 13.2464 15.1308 13.8508 14.3852 13.8508H11.6852M10.6729 6.76328C10.3725 6.49449 10.0607 6.17568 9.86391 5.96863C9.73295 5.83085 9.55201 5.75078 9.36192 5.75078H4.26021C3.51463 5.75078 2.91021 6.35519 2.91021 7.10078L2.91016 15.2007C2.91015 15.9463 3.51457 16.5508 4.26015 16.5508L10.3352 16.5508C11.0808 16.5508 11.6852 15.9464 11.6852 15.2008L11.6854 8.04456C11.6854 7.87197 11.6195 7.70605 11.4997 7.5818C11.2782 7.35202 10.9083 6.97395 10.6729 6.76328Z'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </Copy2Clipboard>
            </div>
          )}
        </div>
        <div className='mt-4'>
          <ReactShowMoreText
            lines={2}
            more='View more'
            less='View less'
            className='text-sm'
            anchorClass='text-text-info-primary text-sm font-medium'
            expanded={false}
            truncatedEndingComponent={'... '}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description) }}></div>
          </ReactShowMoreText>
        </div>
      </div>
    </div>
  )
}
