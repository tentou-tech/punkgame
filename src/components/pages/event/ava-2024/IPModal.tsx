import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import MobileBackground from './assets/ip-modal-mobile-background.png'
import Background from './assets/ip-modal-background.png'
import Point from 'components/pages/event/ava-2024/assets/point.svg'
import Image from 'next/image'
import { eventService } from 'src/services/eventService'
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { shorten } from 'src/utils'
import { Context } from 'src/context'
import Button from 'components/core/Button'
import { ModalContext } from 'src/context/modals'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { storyChain } from 'src/services/wagmi/config'

export default function IPModal({
  open,
  onClose,
  data,
  mutate,
}: {
  open: boolean
  onClose: () => void
  data: any
  mutate: any
}) {
  const { account } = useContext(Context)
  const { locale } = useRouter()
  const { setSignInOpen } = useContext(ModalContext)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isCollected, setIsCollected] = useState(false)
  const [collectedCount, setCollectedCount] = useState(0)
  const cancelButtonRef = useRef(null)
  const collectedCharacters = useSWR(
    { key: 'get-collected-characters', userId: account?.id },
    ({ userId }) => (userId ? eventService.story.getCollectedCharacters() : null),
    {
      revalidateOnFocus: false,
    }
  )
  const { t } = useTranslation()
  const collectedCharacter = collectedCharacters?.data?.data?.data?.user_collect_character
  useEffect(() => {
    if (data) {
      setLikeCount(data?.likes_aggregate?.aggregate?.count)
      setCollectedCount(data?.user_collect_characters_aggregate?.aggregate?.count)
      setIsLiked(!!data?.likes?.length)
      setIsCollected(!!data?.user_collect_characters?.length)
    }
  }, [data?.id])
  const collectHandler = async () => {
    try {
      setLoading(true)
      await eventService.story.collectCharacter(data?.id)
      await collectedCharacters.mutate()
      setCollectedCount((prev) => prev + 1)
      setLoading(false)
      setIsCollected(true)
      toast(locale == 'vn' ? 'Thu thập nhân vật thành công' : 'Collect character successfully', {
        type: 'success',
      })
      mutate()
    } catch (error) {
      setLoading(false)
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
      if (isLiked) {
        await eventService.story.unlikeCharacter(data?.id)
      } else {
        await eventService.story.likeCharacter(data?.id)
      }
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      setIsLiked((prevState) => !prevState)
      mutate()
    } catch (error) {
      toast(error.message, {
        type: 'error',
      })
    }
  }
  if (!data) return null
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className={`relative z-50 `} initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child as='div'>
          <div className='fixed inset-0 bg-black/80 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full justify-center p-2 text-center items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
              <Dialog.Panel className='static transform text-white text-start transition-all'>
                <div
                  className='relative md:hidden bg-no-repeat pt-[72px] px-8 pb-4 aspect-[375/658] overflow-hidden h-[80dvh] w-[90vw] max-w-[395px] backdrop-blur-md'
                  style={{ backgroundImage: `url(${MobileBackground.src})`, backgroundSize: '100% 100%' }}>
                  <div className='h-[calc(80dvh-88px)] w-full overflow-auto no-scrollbar'>
                    {collectedCharacters?.data && (
                      <div className='bg-[#002812] rounded-md py-0.5 pr-4 pl-1.5 mb-2.5  flex gap-2 items-center w-fit'>
                        <Image src={Point} alt='' />
                        <span className='text-sm font-semibold'>{`${3 - (collectedCharacter?.length || 0)} ${t(
                          'Dream'
                        )}`}</span>
                      </div>
                    )}
                    <Image
                      src={data.descripton_url}
                      alt=''
                      width={311}
                      height={440}
                      className=' rounded-md w-full aspect-[311/440] object-cover'
                    />
                    <div className='font-jaro text-2xl line-clamp-2 mt-2.5'>{data?.name}</div>
                    {data?.story_ip_asset?.ip_asset_id && (
                      <Link
                        href={`${storyChain.blockExplorers.secondary.url}ipa/${data?.story_ip_asset?.ip_asset_id}`}
                        target='_blank'
                        className=' text-sm mt-1'>
                        ID <span className='underline'>{shorten(data?.story_ip_asset?.ip_asset_id)}</span>
                      </Link>
                    )}
                    <div className='text-sm font-medium mt-1'>
                      {t('by')} <span className=''>{data?.authorizer_user.nickname}</span>
                    </div>
                    <div className='mt-3 flex items-center gap-3'>
                      <div className='text-sm font-medium flex gap-1.5 shrink-0'>
                        {collectedCount}{' '}
                        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M4.5 1.5C4.91421 1.5 5.25 1.83579 5.25 2.25V11.25C5.25 11.6642 4.91421 12 4.5 12C4.08579 12 3.75 11.6642 3.75 11.25V2.25C3.75 1.83579 4.08579 1.5 4.5 1.5Z'
                            fill='white'
                          />
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M13.5 3C12.6716 3 12 3.67157 12 4.5C12 5.32843 12.6716 6 13.5 6C14.3284 6 15 5.32843 15 4.5C15 3.67157 14.3284 3 13.5 3ZM10.5 4.5C10.5 2.84315 11.8431 1.5 13.5 1.5C15.1569 1.5 16.5 2.84315 16.5 4.5C16.5 6.15685 15.1569 7.5 13.5 7.5C11.8431 7.5 10.5 6.15685 10.5 4.5Z'
                            fill='white'
                          />
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M4.5 12C3.67157 12 3 12.6716 3 13.5C3 14.3284 3.67157 15 4.5 15C5.32843 15 6 14.3284 6 13.5C6 12.6716 5.32843 12 4.5 12ZM1.5 13.5C1.5 11.8431 2.84315 10.5 4.5 10.5C6.15685 10.5 7.5 11.8431 7.5 13.5C7.5 15.1569 6.15685 16.5 4.5 16.5C2.84315 16.5 1.5 15.1569 1.5 13.5Z'
                            fill='white'
                          />
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M13.5 6C13.9142 6 14.25 6.33579 14.25 6.75C14.25 8.73912 13.4598 10.6468 12.0533 12.0533C10.6468 13.4598 8.73912 14.25 6.75 14.25C6.33579 14.25 6 13.9142 6 13.5C6 13.0858 6.33579 12.75 6.75 12.75C8.3413 12.75 9.86742 12.1179 10.9926 10.9926C12.1179 9.86742 12.75 8.3413 12.75 6.75C12.75 6.33579 13.0858 6 13.5 6Z'
                            fill='white'
                          />
                        </svg>
                      </div>
                      <div className='text-sm font-medium flex gap-1.5 shrink-0'>
                        {likeCount}{' '}
                        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'>
                          <path
                            d='M17.257 4.40883C16.9878 3.78533 16.5995 3.22033 16.114 2.74544C15.6281 2.26913 15.0552 1.89062 14.4265 1.63048C13.7745 1.35967 13.0753 1.22105 12.3693 1.22267C11.3789 1.22267 10.4126 1.49388 9.57289 2.00615C9.372 2.1287 9.18115 2.2633 9.00035 2.40995C8.81955 2.2633 8.6287 2.1287 8.4278 2.00615C7.58807 1.49388 6.62178 1.22267 5.63138 1.22267C4.91821 1.22267 4.22713 1.35928 3.57423 1.63048C2.94343 1.89164 2.3749 2.26731 1.88673 2.74544C1.40057 3.21979 1.0122 3.78493 0.743652 4.40883C0.464411 5.05772 0.321777 5.74678 0.321777 6.45593C0.321777 7.1249 0.458385 7.822 0.72959 8.53115C0.956599 9.12379 1.28205 9.73852 1.69789 10.3593C2.35682 11.3416 3.26285 12.3662 4.38785 13.4048C6.25213 15.1265 8.09834 16.3158 8.17669 16.364L8.65281 16.6693C8.86374 16.8039 9.13495 16.8039 9.34589 16.6693L9.822 16.364C9.90035 16.3137 11.7445 15.1265 13.6108 13.4048C14.7358 12.3662 15.6419 11.3416 16.3008 10.3593C16.7166 9.73852 17.0441 9.12379 17.2691 8.53115C17.5403 7.822 17.6769 7.1249 17.6769 6.45593C17.6789 5.74678 17.5363 5.05772 17.257 4.40883ZM9.00035 15.0803C9.00035 15.0803 1.84856 10.4979 1.84856 6.45593C1.84856 4.40883 3.54209 2.74946 5.63138 2.74946C7.0999 2.74946 8.37356 3.5691 9.00035 4.76642C9.62714 3.5691 10.9008 2.74946 12.3693 2.74946C14.4586 2.74946 16.1521 4.40883 16.1521 6.45593C16.1521 10.4979 9.00035 15.0803 9.00035 15.0803Z'
                            fill='white'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='flex gap-1.5 mt-4 flex-col'>
                      {!(
                        data?.is_default_character ||
                        account?.id == data?.authorizer_user?.id ||
                        isCollected ||
                        (collectedCharacter?.length || 0) >= 3
                      ) && (
                        <Button
                          color='neutral'
                          size='sm'
                          variant='outlined'
                          disabled={loading}
                          className='[&>span]:!w-full !w-full shrink-0 [&>span]:flex [&>span]:item-center [&>span]:justify-between'
                          onClick={() => {
                            if (account) {
                              collectHandler()
                            } else {
                              setSignInOpen(true)
                            }
                          }}>
                          <div>{t('Collect IP')}</div>
                          <div className='flex items-center gap-1'>
                            -1 <Image src={Point} alt='' className='h-5 w-auto ml-1' />
                          </div>
                        </Button>
                      )}
                      <Button size='sm' color='neutral' className='!w-full' onClick={likeHandler}>
                        {t(isLiked ? 'Liked' : 'Like')}
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                  className='relative md:block hidden bg-no-repeat py-[42px] pr-6 pl-[76px] aspect-[834/720] w-screen max-w-[834px] backdrop-blur-md'
                  style={{ backgroundImage: `url(${Background.src})`, backgroundSize: '100% 100%' }}>
                  <div className=' grid-cols-[263px_1fr] gap-8 grid no-scrollbar w-full h-full overflow-auto'>
                    <div className='rounded-xl border border-[#00E361] bg-[#00E36133] p-4 h-fit'>
                      {collectedCharacters?.data && (
                        <div className='bg-[#002812] rounded-md py-0.5 pr-4 pl-1.5 flex gap-2 mb-2.5  items-center w-fit'>
                          <Image src={Point} alt='' />
                          <span className='text-sm font-semibold'>{`${3 - (collectedCharacter?.length || 0)} ${t(
                            'Dream'
                          )}`}</span>
                        </div>
                      )}
                      <Image
                        src={data.avatar_url}
                        alt=''
                        width={311}
                        height={440}
                        className='rounded-md w-full aspect-square object-cover'
                      />
                      <div className='font-jaro text-2xl line-clamp-2 mt-2.5'>{data?.name}</div>
                      {data?.story_ip_asset?.ip_asset_id && (
                        <Link
                          href={`${storyChain.blockExplorers.secondary.url}ipa/${data?.story_ip_asset?.ip_asset_id}`}
                          target='_blank'
                          className=' text-sm mt-1'>
                          ID <span className='underline'>{shorten(data?.story_ip_asset?.ip_asset_id)}</span>
                        </Link>
                      )}
                      <div className='text-sm font-medium mt-1'>
                        {t('by')} <span className=''>{data?.authorizer_user.nickname}</span>
                      </div>
                      <div className='mt-3 flex items-center gap-3'>
                        <div className='text-sm font-medium flex gap-1.5 shrink-0'>
                          {collectedCount}{' '}
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='18'
                            height='18'
                            viewBox='0 0 18 18'
                            fill='none'>
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M4.5 1.5C4.91421 1.5 5.25 1.83579 5.25 2.25V11.25C5.25 11.6642 4.91421 12 4.5 12C4.08579 12 3.75 11.6642 3.75 11.25V2.25C3.75 1.83579 4.08579 1.5 4.5 1.5Z'
                              fill='white'
                            />
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M13.5 3C12.6716 3 12 3.67157 12 4.5C12 5.32843 12.6716 6 13.5 6C14.3284 6 15 5.32843 15 4.5C15 3.67157 14.3284 3 13.5 3ZM10.5 4.5C10.5 2.84315 11.8431 1.5 13.5 1.5C15.1569 1.5 16.5 2.84315 16.5 4.5C16.5 6.15685 15.1569 7.5 13.5 7.5C11.8431 7.5 10.5 6.15685 10.5 4.5Z'
                              fill='white'
                            />
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M4.5 12C3.67157 12 3 12.6716 3 13.5C3 14.3284 3.67157 15 4.5 15C5.32843 15 6 14.3284 6 13.5C6 12.6716 5.32843 12 4.5 12ZM1.5 13.5C1.5 11.8431 2.84315 10.5 4.5 10.5C6.15685 10.5 7.5 11.8431 7.5 13.5C7.5 15.1569 6.15685 16.5 4.5 16.5C2.84315 16.5 1.5 15.1569 1.5 13.5Z'
                              fill='white'
                            />
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M13.5 6C13.9142 6 14.25 6.33579 14.25 6.75C14.25 8.73912 13.4598 10.6468 12.0533 12.0533C10.6468 13.4598 8.73912 14.25 6.75 14.25C6.33579 14.25 6 13.9142 6 13.5C6 13.0858 6.33579 12.75 6.75 12.75C8.3413 12.75 9.86742 12.1179 10.9926 10.9926C12.1179 9.86742 12.75 8.3413 12.75 6.75C12.75 6.33579 13.0858 6 13.5 6Z'
                              fill='white'
                            />
                          </svg>
                        </div>
                        <div className='text-sm font-medium flex gap-1.5 shrink-0'>
                          {likeCount}{' '}
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='18'
                            height='18'
                            viewBox='0 0 18 18'
                            fill='none'>
                            <path
                              d='M17.257 4.40883C16.9878 3.78533 16.5995 3.22033 16.114 2.74544C15.6281 2.26913 15.0552 1.89062 14.4265 1.63048C13.7745 1.35967 13.0753 1.22105 12.3693 1.22267C11.3789 1.22267 10.4126 1.49388 9.57289 2.00615C9.372 2.1287 9.18115 2.2633 9.00035 2.40995C8.81955 2.2633 8.6287 2.1287 8.4278 2.00615C7.58807 1.49388 6.62178 1.22267 5.63138 1.22267C4.91821 1.22267 4.22713 1.35928 3.57423 1.63048C2.94343 1.89164 2.3749 2.26731 1.88673 2.74544C1.40057 3.21979 1.0122 3.78493 0.743652 4.40883C0.464411 5.05772 0.321777 5.74678 0.321777 6.45593C0.321777 7.1249 0.458385 7.822 0.72959 8.53115C0.956599 9.12379 1.28205 9.73852 1.69789 10.3593C2.35682 11.3416 3.26285 12.3662 4.38785 13.4048C6.25213 15.1265 8.09834 16.3158 8.17669 16.364L8.65281 16.6693C8.86374 16.8039 9.13495 16.8039 9.34589 16.6693L9.822 16.364C9.90035 16.3137 11.7445 15.1265 13.6108 13.4048C14.7358 12.3662 15.6419 11.3416 16.3008 10.3593C16.7166 9.73852 17.0441 9.12379 17.2691 8.53115C17.5403 7.822 17.6769 7.1249 17.6769 6.45593C17.6789 5.74678 17.5363 5.05772 17.257 4.40883ZM9.00035 15.0803C9.00035 15.0803 1.84856 10.4979 1.84856 6.45593C1.84856 4.40883 3.54209 2.74946 5.63138 2.74946C7.0999 2.74946 8.37356 3.5691 9.00035 4.76642C9.62714 3.5691 10.9008 2.74946 12.3693 2.74946C14.4586 2.74946 16.1521 4.40883 16.1521 6.45593C16.1521 10.4979 9.00035 15.0803 9.00035 15.0803Z'
                              fill='white'
                            />
                          </svg>
                        </div>
                      </div>
                      <div className='flex gap-1.5 mt-4 flex-col'>
                        {!(
                          data?.is_default_character ||
                          account?.id == data?.authorizer_user?.id ||
                          isCollected ||
                          (collectedCharacter?.length || 0) >= 3
                        ) && (
                          <Button
                            color='neutral'
                            size='sm'
                            variant='outlined'
                            disabled={loading}
                            className='[&>span]:!w-full !w-full shrink-0 [&>span]:flex [&>span]:item-center [&>span]:justify-between'
                            onClick={() => {
                              if (account) {
                                collectHandler()
                              } else {
                                setSignInOpen(true)
                              }
                            }}>
                            <div>{t('Collect IP')}</div>
                            <div className='flex items-center gap-1'>
                              -1 <Image src={Point} alt='' className='h-5 w-auto ml-1' />
                            </div>
                          </Button>
                        )}
                        <Button size='sm' color='neutral' className='!w-full' onClick={likeHandler}>
                          {t(isLiked ? 'Liked' : 'Like')}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Image
                        src={data.descripton_url}
                        alt=''
                        width={450}
                        height={637}
                        className='mt-2.5 rounded-md w-full aspect-[450/637] object-cover'
                      />
                    </div>
                  </div>
                </div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  className='absolute cursor-pointer top-0 right-0 -translate-y-[140%] md:translate-y-1/2 md:translate-x-[140%]'
                  onClick={onClose}>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M0.554955 0.554956C1.2949 -0.184985 2.49458 -0.184985 3.23452 0.554955L12 9.32044L20.7655 0.554956C21.5054 -0.184985 22.7051 -0.184985 23.445 0.554956C24.185 1.2949 24.185 2.49458 23.445 3.23452L14.6796 12L23.445 20.7655C24.185 21.5054 24.185 22.7051 23.445 23.445C22.7051 24.185 21.5054 24.185 20.7655 23.445L12 14.6796L3.23452 23.445C2.49458 24.185 1.2949 24.185 0.554955 23.445C-0.184985 22.7051 -0.184985 21.5054 0.554956 20.7655L9.32044 12L0.554956 3.23452C-0.184985 2.49458 -0.184985 1.2949 0.554955 0.554956Z'
                    fill='#00E361'
                  />
                </svg>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
