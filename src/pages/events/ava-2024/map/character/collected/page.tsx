import Background from 'components/pages/event/ava-2024/assets/Main_Map.png'
import Decor from 'components/pages/event/ava-2024/assets/decor.svg'
import Frame2 from 'components/pages/event/ava-2024/assets/frame-2.svg'
import Frame from 'components/pages/event/ava-2024/assets/frame.svg'
import { useRouter } from 'next/router'
import { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { storyChain } from 'src/services/wagmi/config'
import Button from 'components/core/Button'
import Modal from 'components/pages/event/ava-2024/Modal'
import RuleAndAward from 'components/pages/event/ava-2024/RuleAndAward'
import Map from 'components/pages/event/ava-2024/assets/Map.svg'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Context } from 'src/context'
import { eventService } from 'src/services/eventService'
import { useWindowSize } from 'usehooks-ts'
import { shorten } from 'src/utils'

export default function Event() {
  const { locale } = useRouter()
  const { t } = useTranslation()
  const { account } = useContext(Context)
  const [open, setOpen] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [collectedCount, setCollectedCount] = useState(0)
  const [selectedCharacter, setSelectedCharacter] = useState<any>()
  const guideContentRef = useRef<any>()
  const { data, mutate } = useSWR(
    { key: 'get-collected-characters', userId: account?.id },
    ({ userId }) => (userId ? eventService.story.getCollectedCharacters() : null),
    {
      revalidateOnFocus: false,
    }
  )
  const characters = data?.data?.data?.user_collect_character.map((c) => c.story_character)
  const characterData = selectedCharacter || characters?.[0]
  useEffect(() => {
    setLikeCount(characterData?.likes_aggregate?.aggregate?.count)
    setCollectedCount(characterData?.user_collect_characters_aggregate?.aggregate?.count)
    setIsLiked(!!characterData?.likes?.length)
  }, [characterData?.id])
  const { width } = useWindowSize()
  const likeHandler = async () => {
    try {
      if (isLiked) {
        await eventService.story.unlikeCharacter(characterData?.id)
      } else {
        await eventService.story.likeCharacter(characterData?.id)
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

  return (
    <>
      <div
        className='bg-no-repeat min-h-[1500px] bg-fixed w-full -mt-20 relative bg-cover'
        style={{ backgroundImage: `url(${Background.src})` }}>
        <div className='absolute left-0 top-0 h-screen'>
          <svg width='143' height='1198' viewBox='0 0 143 1198' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M33.1367 1131.59L55.1094 1153.56L110.041 1153.56L110.041 1087.64L143 1087.64L143 1197.51L33.1367 1197.51L0.177733 1164.55L0.177729 1087.64L55.1094 1087.64L55.1094 1131.59L33.1367 1131.59ZM66.0957 1032.71L44.123 1010.74L0.177726 1010.74L0.177724 966.794L143 966.794L143 1010.74L88.0684 1010.74L110.041 1032.71L143 1032.71L143 1076.66L0.177729 1076.66L0.177727 1032.71L66.0957 1032.71ZM110.041 911.862L143 911.862L143 955.808L0.177724 955.808L0.17772 878.903L33.1367 845.944L143 845.944L143 889.89L132.014 889.89L110.041 911.862ZM88.0683 889.89L55.1094 889.89L33.1367 911.862L66.0957 911.862L88.0683 889.89ZM33.1367 791.013L66.0957 791.013L88.0683 769.04L33.1367 769.04L33.1367 791.013ZM132.014 769.04L110.041 791.013L143 791.013L143 834.958L0.177718 834.958L0.177713 725.095L77.082 725.095L99.0547 747.067L121.027 725.095L143 725.095L143 769.04L132.014 769.04ZM110.041 670.163L143 670.163L143 714.108L0.177713 714.108L0.17771 637.204L33.1367 604.245L143 604.245L143 648.19L132.014 648.19L110.041 670.163ZM88.0683 648.19L55.1094 648.19L33.1367 670.163L66.0957 670.163L88.0683 648.19ZM33.1367 527.341L55.1093 549.313L110.041 549.313L110.041 483.396L143 483.395L143 593.259L33.1367 593.259L0.177706 560.3L0.177703 483.396L55.1093 483.396L55.1093 527.341L33.1367 527.341ZM33.1367 395.505L143 395.505L143 439.45L33.1367 439.45L33.1367 472.409L0.177702 472.409L0.177698 362.546L33.1367 362.546L33.1367 395.505ZM33.1367 285.642L55.1093 307.614L110.041 307.614L110.041 241.696L143 241.696L143 351.56L33.1367 351.56L0.177696 318.601L0.177692 241.696L55.1093 241.696L55.1093 285.642L33.1367 285.642ZM99.0546 241.696L99.0546 296.628L66.0957 296.628L66.0957 241.696L99.0546 241.696ZM33.1367 186.765L66.0957 186.765L88.0683 164.792L33.1367 164.792L33.1367 186.765ZM132.014 164.792L110.041 186.765L143 186.765L143 230.71L0.177692 230.71L0.177687 120.847L77.082 120.847L99.0546 142.819L121.027 120.847L143 120.847L143 164.792L132.014 164.792ZM33.1367 43.9424L33.1367 65.915L55.1093 65.915L55.1093 -0.00293411L143 -0.00293795L143 109.86L99.0546 109.86L99.0546 65.915L110.041 65.915L110.041 43.9424L88.0683 43.9424L88.0683 109.86L0.177687 109.86L0.177682 -0.00293171L44.123 -0.00293363L44.123 43.9424L33.1367 43.9424Z'
              fill='#222222'
            />
          </svg>
        </div>
        <Image src={Decor} alt='' className='absolute -top-[4%] inset-x-0 w-full' />
        <div className='relative pk-container mx-auto pt-24 text-white'>
          {!account ? (
            <div className='w-full text-center py-10'>{t('Login to continue')}</div>
          ) : (
            <div className='lg:py-10'>
              {!!characters?.length && (
                <div className='grid grid-cols-1 lg:grid-cols-[22fr_11fr] mt-4 gap-8 min-h-[1000px] relative'>
                  <div className='shrink-0 w-full'>
                    <div className='flex justify-between items-center w-full flex-row-reverse pr-5 mb-5 gap-10 h-10 relative z-10 lg:hidden'>
                      <div className='w-[10.5%]'>
                        <RuleAndAward />
                      </div>
                      <Link
                        href={`/events/ava-2024/map`}
                        className='flex items-center text-sm font-semibold gap-2 whitespace-nowrap '>
                        <Image src={Map} alt='' className='w-[50px]' />
                        {t('Back to map')}
                      </Link>
                    </div>
                    <div className='h-10'>
                      <div className=' text-xl md:text-3xl font-medium flex items-center gap-1'>
                        <Link href='/events/ava-2024/map/character'>
                          <svg
                            width='32'
                            height='33'
                            viewBox='0 0 32 33'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                              d='M0 16.5C0 7.66344 7.16344 0.5 16 0.5H19.2V32.5H16C7.16344 32.5 0 25.3366 0 16.5Z'
                              fill='white'
                            />
                            <rect x='18.3999' y='0.5' width='4' height='32' fill='white' />
                            <path
                              d='M21.6001 32.5V0.5H27.5558C30.3377 0.5 32.4353 3.10057 31.9226 5.91389L27.7573 28.771C27.3633 30.9332 25.5285 32.5 23.3904 32.5H21.6001Z'
                              fill='white'
                            />
                            <g clipPath='url(#clip0_5358_41234)'>
                              <path
                                d='M11.1995 15.935L17.6077 9.52692C17.7559 9.37859 17.9538 9.29688 18.1647 9.29688C18.3757 9.29688 18.5735 9.37859 18.7218 9.52692L19.1937 9.99872C19.5008 10.3062 19.5008 10.8058 19.1937 11.1128L13.8126 16.4939L19.1996 21.881C19.3479 22.0293 19.4297 22.227 19.4297 22.4379C19.4297 22.649 19.3479 22.8467 19.1996 22.9951L18.7277 23.4668C18.5794 23.6152 18.3817 23.6969 18.1707 23.6969C17.9597 23.6969 17.7619 23.6152 17.6137 23.4668L11.1995 17.0529C11.0509 16.9041 10.9693 16.7054 10.9698 16.4942C10.9693 16.2822 11.0509 16.0837 11.1995 15.935Z'
                                fill='black'
                              />
                            </g>
                            <defs>
                              <clipPath id='clip0_5358_41234'>
                                <rect
                                  width='14.4'
                                  height='14.4'
                                  fill='white'
                                  transform='matrix(-1 0 0 1 22.3999 9.30078)'
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </Link>
                        {t('My collected characters')}
                      </div>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-6'>
                      {characters?.map((character, index) => (
                        <div
                          className={`relative rounded-xl border-[3px] ${
                            selectedCharacter?.id == character.id || (!selectedCharacter && index == 0)
                              ? 'border-brand-default'
                              : 'border-black'
                          } overflow-hidden cursor-pointer`}
                          onClick={() => {
                            setSelectedCharacter(character)
                            if (width < 1024) {
                              setShowModal(true)
                            }
                          }}
                          key={character.id}>
                          <div className='absolute bottom-0 inset-x-0 w-full'>
                            <Image
                              src={character.avatar_url}
                              width={300}
                              height={300}
                              alt=''
                              className='w-full relative'
                            />
                          </div>
                          <Image src={Frame} alt='' className='w-full  relative rounded-mlg' />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='sticky top-[12vh] h-fit hidden lg:block'>
                    <div className='flex justify-between items-center gap-10 h-10 relative z-10'>
                      <div className='flex-1'></div>
                      <div className='w-[10.5%]'>
                        <RuleAndAward />
                      </div>
                      <Link
                        href={`/events/ava-2024/map`}
                        className='flex items-center text-sm font-semibold gap-2 whitespace-nowrap '>
                        <Image src={Map} alt='' className='w-[50px]' />
                        {t('Back to map')}
                      </Link>
                    </div>
                    <div className='mt-6 rounded-mlg border-[3px] border-black p-5 bg-[#191919] h-fit min-w-[350px] w-full relative'>
                      <Skew className='absolute top-1.5 right-1.5' />
                      <Skew className='absolute top-1.5 left-1.5' />
                      <div className='relative'>
                        <Ruler className='w-full mb-2' />
                        <div className='relative'>
                          <Image src={Frame2} alt='' className='w-full relative' />
                          <div className='absolute inset-x-4 bottom-4 w-[calc(100%-32px)] aspect-[384/543] rounded overflow-hidden'>
                            <Image
                              src={characterData?.descripton_url}
                              alt=''
                              width={400}
                              height={800}
                              className='w-full h-full object-cover relative'
                            />
                          </div>
                          <div className='absolute top-1 h-full -left-3'>
                            <Ruler1 className='h-full' />
                          </div>
                        </div>
                        <div className='flex items-center gap-3 w-full overflow-hidden'>
                          <div className='space-y-1.5 flex-1 min-w-0'>
                            <div className='font-jaro text-2xl line-clamp-2'>{characterData.name}</div>
                            {characterData?.story_ip_asset?.ip_asset_id && (
                              <Link
                                href={`${storyChain.blockExplorers.secondary.url}ipa/${characterData?.story_ip_asset?.ip_asset_id}`}
                                target='_blank'
                                className='text-brand-default text-sm'>
                                {shorten(characterData?.story_ip_asset?.ip_asset_id)}
                              </Link>
                            )}
                            <div className='text-sm font-medium'>
                              {t('by')}{' '}
                              <span className='text-brand-default'>
                                {characterData.authorizer_user.nickname || 'Punkga'}
                              </span>
                            </div>
                          </div>
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
                        <div className='flex gap-1.5 mt-4'>
                          <Button size='sm' color='neutral' className='!w-full' onClick={likeHandler}>
                            {t(isLiked ? 'Liked' : 'Like')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {width < 1024 && (
        <Modal open={showModal} setOpen={setShowModal} className='[&_.static]:p-0'>
          <div className='rounded-mlg border-[3px] border-black p-5 bg-[#191919] h-fit min-w-[350px] w-full relative'>
            <Skew className='absolute top-1.5 right-1.5' />
            <Skew className='absolute top-1.5 left-1.5' />
            <div className='relative'>
              <Ruler className='w-full mb-2' />
              <div className='relative'>
                <Image src={Frame2} alt='' className='w-full relative' />
                <div className='absolute inset-x-4 bottom-4 w-[calc(100%-32px)] aspect-[384/543] rounded overflow-hidden'>
                  <Image
                    src={characterData?.descripton_url}
                    alt=''
                    width={400}
                    height={800}
                    className='w-full h-full object-cover relative'
                  />
                </div>
                <div className='absolute top-1 h-full -left-3'>
                  <Ruler1 className='h-full' />
                </div>
              </div>
              <div className='flex items-center gap-3 w-full overflow-hidden'>
                <div className='space-y-1.5 flex-1 min-w-0'>
                  <div className='font-jaro text-2xl line-clamp-2'>{characterData.name}</div>
                  {characterData?.story_ip_asset?.ip_asset_id && (
                    <Link
                      href={`${storyChain.blockExplorers.secondary.url}ipa/${characterData?.story_ip_asset?.ip_asset_id}`}
                      target='_blank'
                      className='text-brand-default text-sm'>
                      {shorten(characterData?.story_ip_asset?.ip_asset_id)}
                    </Link>
                  )}
                  <div className='text-sm font-medium'>
                    {t('by')}{' '}
                    <span className='text-brand-default'>{characterData.authorizer_user.nickname || 'Punkga'}</span>
                  </div>
                </div>
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
              <div className='flex gap-1.5 mt-4'>
                <Button size='sm' color='neutral' className='!w-full' onClick={likeHandler}>
                  {t(isLiked ? 'Liked' : 'Like')}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
const Ruler = ({ className }) => {
  return (
    <svg
      width='412'
      height='5'
      viewBox='0 0 412 5'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      className={className}>
      <rect width='412' height='5' fill='url(#pattern0_4937_32125)' fill-opacity='0.6' />
      <defs>
        <pattern id='pattern0_4937_32125' patternContentUnits='objectBoundingBox' width='0.109223' height='1'>
          <use xlinkHref='#image0_4937_32125' transform='scale(0.00121359 0.1)' />
        </pattern>
        <image
          id='image0_4937_32125'
          width='90'
          height='10'
          xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAKCAYAAAA0Jkn1AAAAAXNSR0IArs4c6QAAAFxJREFUSEvt1DEKACAMQ9H0Cr3/GXsFRdxEIYvi8Lu4BIfX0KiqJkmZGeNl7ggE0Hdg11+BfuMsoH+Ddk8Muf3m7EYDuAd0XYA+nA4X0M0BDfQUcBvze45GP2p0B9GZ6Avn1eu/AAAAAElFTkSuQmCC'
        />
      </defs>
    </svg>
  )
}
const Ruler1 = ({ className }) => {
  return (
    <svg
      width='5'
      height='576'
      viewBox='0 0 5 576'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      className={className}>
      <rect
        width='576'
        height='5.00003'
        transform='matrix(-4.37114e-08 1 1 4.37114e-08 0 0)'
        fill='url(#pattern0_4937_32127)'
        fill-opacity='0.6'
      />
      <defs>
        <pattern id='pattern0_4937_32127' patternContentUnits='objectBoundingBox' width='0.078125' height='0.999995'>
          <use xlinkHref='#image0_4937_32127' transform='scale(0.000868056 0.0999995)' />
        </pattern>
        <image
          id='image0_4937_32127'
          width='90'
          height='10'
          xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAKCAYAAAA0Jkn1AAAAAXNSR0IArs4c6QAAAFxJREFUSEvt1DEKACAMQ9H0Cr3/GXsFRdxEIYvi8Lu4BIfX0KiqJkmZGeNl7ggE0Hdg11+BfuMsoH+Ddk8Muf3m7EYDuAd0XYA+nA4X0M0BDfQUcBvze45GP2p0B9GZ6Avn1eu/AAAAAElFTkSuQmCC'
        />
      </defs>
    </svg>
  )
}
const Skew = ({ className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='11'
      height='11'
      viewBox='0 0 11 11'
      fill='none'
      className={className}>
      <path
        d='M11 5.5C11 8.53757 8.53757 11 5.5 11C2.46243 11 0 8.53757 0 5.5C0 2.46243 2.46243 0 5.5 0C8.53757 0 11 2.46243 11 5.5Z'
        fill='#3D3B3E'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5.5 10.1538C8.07025 10.1538 10.1538 8.07025 10.1538 5.5C10.1538 2.92975 8.07025 0.846154 5.5 0.846154C2.92975 0.846154 0.846154 2.92975 0.846154 5.5C0.846154 8.07025 2.92975 10.1538 5.5 10.1538ZM5.5 11C8.53757 11 11 8.53757 11 5.5C11 2.46243 8.53757 0 5.5 0C2.46243 0 0 2.46243 0 5.5C0 8.53757 2.46243 11 5.5 11Z'
        fill='black'
      />
      <path
        d='M3.13738 4.3327C2.80694 4.00225 2.80694 3.4665 3.13738 3.13605C3.46783 2.80561 4.00358 2.80561 4.33403 3.13605L7.92395 6.72598C8.2544 7.05642 8.2544 7.59218 7.92395 7.92262C7.59351 8.25307 7.05775 8.25307 6.72731 7.92262L3.13738 4.3327Z'
        fill='#181818'
      />
      <path
        d='M6.7259 3.13348C7.05634 2.80303 7.5921 2.80303 7.92254 3.13348C8.25298 3.46392 8.25298 3.99968 7.92254 4.33012L4.33261 7.92005C4.00217 8.25049 3.46641 8.25049 3.13597 7.92005C2.80553 7.5896 2.80553 7.05385 3.13597 6.7234L6.7259 3.13348Z'
        fill='#181818'
      />
    </svg>
  )
}
