import { Pagination } from '@mui/material'
import Button from 'components/core/Button'
import IPModal from 'components/pages/event/ava-2024/IPModal'
import RuleAndAward from 'components/pages/event/ava-2024/RuleAndAward'
import Background from 'components/pages/event/ava-2024/assets/Main_Map.png'
import Map from 'components/pages/event/ava-2024/assets/Map.svg'
import Frame from 'components/pages/event/ava-2024/assets/artwork-frame.png'
import CharacterFrame from 'components/pages/event/ava-2024/assets/character-frame.png'
import DecorLeft from 'components/pages/event/ava-2024/assets/decor-left.png'
import DecorMiddle from 'components/pages/event/ava-2024/assets/decor-middle.png'
import DecorRight from 'components/pages/event/ava-2024/assets/decor-right.png'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Context } from 'src/context'
import { ModalContext } from 'src/context/modals'
import usePage from 'src/hooks/usePage'
import { eventService } from 'src/services/eventService'
import { shorten } from 'src/utils'
import useSWR from 'swr'
import { useWindowSize } from 'usehooks-ts'
import { storyChain } from 'src/services/wagmi/config'

export default function Page(props) {
  if (props.justHead) {
    return <></>
  }
  return <PageDetail {...props} />
}
const artworkPerPage = 12
function PageDetail() {
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const { account } = useContext(Context)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<any>()
  const [page, setPage] = usePage()
  const [showSlider, setShowSlider] = useState(false)
  const { data, mutate, isLoading } = useSWR(
    { key: 'get-ava-artwork', user_id: account?.id, page },
    ({ user_id, page }) => eventService.story.getArtwork(user_id, page),
    {
      revalidateOnFocus: false,
    }
  )
  useEffect(() => {
    if (selected) {
      const ip = data?.data?.data?.story_artwork.find((char) => char.id == selected.id)
      if (ip) {
        setSelected(ip)
        return
      }
    }
    if (data?.data?.data?.story_artwork?.[0]) {
      setSelected(data?.data?.data?.story_artwork?.[0])
    }
  }, [data?.data?.data?.story_artwork])
  const artworks = data?.data?.data?.story_artwork
  const count = Math.ceil((data?.data?.data?.story_artwork_aggregate?.aggregate?.count || 1) / artworkPerPage)
  const prevHandler = () => {
    const currentIndex = artworks.findIndex((d) => d.id == selected.id)
    if (currentIndex > 0) {
      setSelected(artworks[currentIndex - 1])
      setPage(Math.ceil(currentIndex / artworkPerPage))
    }
  }
  const nextHandler = () => {
    const currentIndex = artworks.findIndex((d) => d.id == selected.id)
    if (currentIndex < artworks.length - 1) {
      setSelected(artworks[currentIndex + 1])
      setPage(Math.ceil((currentIndex + 2) / artworkPerPage))
    }
  }
  return (
    <>
      <div
        className='bg-no-repeat min-h-[1500px] bg-fixed w-full -mt-20 relative bg-cover'
        style={{ backgroundImage: `url(${Background.src})` }}>
        <div className='absolute left-0 top-[15%] h-screen'>
          <svg width='143' height='660' viewBox='0 0 143 660' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M0.17773 560.63L0.177726 483.726L143 483.726L143 527.671L33.1367 527.671L55.1094 549.644L143 549.644L143 593.589L55.1094 593.589L33.1367 615.562L143 615.562L143 659.507L0.177734 659.507L0.177731 582.603L14.1304 571.616L0.17773 560.63ZM110.041 428.794L143 428.794L143 472.739L0.177726 472.739L0.177723 395.835L33.1367 362.876L143 362.876L143 406.821L132.014 406.821L110.041 428.794ZM88.0683 406.821L55.1094 406.821L33.1367 428.794L66.0957 428.794L88.0683 406.821ZM33.1367 242.026L143 242.026L143 285.972L55.1094 285.972L33.1367 307.944L143 307.944L143 351.89L0.177721 351.89L0.177717 274.985L33.1367 242.026ZM110.041 165.122L77.082 165.122L77.082 121.177L143 121.177L143 198.081L110.041 231.04L0.177715 231.04L0.177711 121.177L33.1367 121.177L33.1367 187.095L88.0683 187.095L110.041 165.122ZM110.041 66.2451L143 66.2451L143 110.19L0.17771 110.19L0.177707 33.2861L33.1367 0.327145L143 0.32714L143 44.2725L132.014 44.2725L110.041 66.2451ZM88.0683 44.2725L55.1093 44.2725L33.1367 66.2451L66.0957 66.2451L88.0683 44.2725Z'
              fill='#222222'
            />
          </svg>
        </div>
        <Image src={DecorLeft} alt='' className='absolute top-16 left-0 w-[10%]' />
        <Image src={DecorMiddle} alt='' className='absolute top-[48px] lg:top-[68px] left-[60%] w-[10%]' />
        <Image src={DecorRight} alt='' className='absolute top-16 right-0 w-[10%]' />

        <div className='relative pk-container mx-auto pt-24 text-white'>
          <div className='lg:py-10'>
            <div className='grid grid-cols-1 lg:grid-cols-[22fr_11fr] mt-4 gap-8 min-h-[1000px] relative'>
              <div className='shrink-0 w-full'>
                <div className='flex justify-between relative z-20 items-center gap-10 h-10 lg:hidden mb-5 flex-row-reverse'>
                  <div className='w-[8.5%] mr-10'>
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
                  <div className='text-3xl font-medium'>{t('Artworks')}</div>
                </div>
                {artworks?.length ? (
                  <>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-6'>
                      {artworks?.map((artwork, index) => (
                        <div
                          className={`rounded-xl cursor-pointer relative overflow-hidden ${
                            artwork.id == selected?.id ? 'border-[#00E160]' : 'border-black'
                          } border-[3px]`}
                          key={index}
                          onClick={() => {
                            setSelected(artwork)
                            setShowModal(true)
                          }}>
                          <div className='absolute inset-0'>
                            <Image
                              src={artwork.display_url}
                              width={300}
                              height={300}
                              alt=''
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <Image src={Frame} alt='' className='w-full h-full relative' />
                        </div>
                      ))}
                    </div>
                    <div className='mt-8 flex justify-center'>
                      <Pagination
                        shape='rounded'
                        className='[&_.Mui-selected]:!bg-white [&_.Mui-selected]:!text-text-primary [&_.MuiPaginationItem-root:not(.Mui-selected)]:!text-text-quatenary'
                        page={page}
                        onChange={(e, p) => {
                          window.scrollTo(0, 0)
                          setPage(p)
                        }}
                        count={count}
                      />
                    </div>
                  </>
                ) : isLoading ? (
                  <></>
                ) : (
                  <div>{t('No artwork submitted')}</div>
                )}
              </div>
              <div className='sticky top-[12vh] h-fit hidden lg:block'>
                <div className='flex justify-end relative z-10 items-center gap-10 h-10'>
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
                <div className='relative z-0'>
                  {selected && (
                    <Content selected={selected} mutate={mutate} setShowSlider={() => setShowSlider(true)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {width < 1024 && showModal && selected && (
        <>
          <div className='fixed inset-0 bg-black/80 z-40' onClick={() => setShowModal(false)}></div>
          <div className='fixed bottom-0 inset-x-0 z-50'>
            <div className='absolute -top-4 right-6' onClick={() => setShowModal(false)}>
              <svg
                width='45'
                height='26'
                viewBox='0 0 45 26'
                fill='none'
                className='absolute -bottom-2.5 -left-[50%] w-[200%]'
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'>
                <rect width='45' height='26' fill='url(#paint0_linear_5355_21799)' />
                <rect width='45' height='26' fill='url(#pattern0_5355_21799)' fillOpacity='0.1' />
                <defs>
                  <pattern
                    id='pattern0_5355_21799'
                    patternContentUnits='objectBoundingBox'
                    width='0.123563'
                    height='0.115385'>
                    <use xlinkHref='#image0_5355_21799' transform='scale(0.000287356 0.000497347)' />
                  </pattern>
                  <linearGradient
                    id='paint0_linear_5355_21799'
                    x1='22.5'
                    y1='0'
                    x2='22.5'
                    y2='26'
                    gradientUnits='userSpaceOnUse'>
                    <stop stopColor='#00E161' stopOpacity='0' />
                    <stop offset='1' stopColor='#00E161' stopOpacity='0.5' />
                  </linearGradient>
                  <image
                    id='image0_5355_21799'
                    width='430'
                    height='232'
                    xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAa4AAADoCAYAAAC3gwBfAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIhSURBVHgB7dUBDQAgDMCwg3/PgI2FNpmGzQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwt/U6AwARewAgxLgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIg5QJRWAF7kuBzRgAAAABJRU5ErkJggg=='
                  />
                </defs>
              </svg>

              <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                width='22'
                height='22'
                viewBox='0 0 22 22'
                fill='none'>
                <path
                  d='M3.87221 1.28569C3.15796 0.571438 1.99993 0.571438 1.28569 1.28569C0.571438 1.99994 0.571438 3.15796 1.28569 3.87221L8.41348 11L1.28569 18.1278C0.571438 18.842 0.571438 20.0001 1.28569 20.7143C1.99993 21.4286 3.15796 21.4286 3.87221 20.7143L11 13.5865L18.1278 20.7143C18.842 21.4286 20.0001 21.4286 20.7143 20.7143C21.4286 20.0001 21.4286 18.842 20.7143 18.1278L13.5865 11L20.7143 3.87221C21.4286 3.15796 21.4286 1.99994 20.7143 1.28569C20.0001 0.571438 18.842 0.571438 18.1278 1.28569L11 8.41348L3.87221 1.28569Z'
                  fill='#00E161'
                  fillOpacity='0.8'
                />
                <path
                  d='M3.87221 1.28569C3.15796 0.571438 1.99993 0.571438 1.28569 1.28569C0.571438 1.99994 0.571438 3.15796 1.28569 3.87221L8.41348 11L1.28569 18.1278C0.571438 18.842 0.571438 20.0001 1.28569 20.7143C1.99993 21.4286 3.15796 21.4286 3.87221 20.7143L11 13.5865L18.1278 20.7143C18.842 21.4286 20.0001 21.4286 20.7143 20.7143C21.4286 20.0001 21.4286 18.842 20.7143 18.1278L13.5865 11L20.7143 3.87221C21.4286 3.15796 21.4286 1.99994 20.7143 1.28569C20.0001 0.571438 18.842 0.571438 18.1278 1.28569L11 8.41348L3.87221 1.28569Z'
                  fill='url(#pattern0_5355_21800)'
                  fillOpacity='0.1'
                />
                <path
                  d='M3.87221 1.28569C3.15796 0.571438 1.99993 0.571438 1.28569 1.28569C0.571438 1.99994 0.571438 3.15796 1.28569 3.87221L8.41348 11L1.28569 18.1278C0.571438 18.842 0.571438 20.0001 1.28569 20.7143C1.99993 21.4286 3.15796 21.4286 3.87221 20.7143L11 13.5865L18.1278 20.7143C18.842 21.4286 20.0001 21.4286 20.7143 20.7143C21.4286 20.0001 21.4286 18.842 20.7143 18.1278L13.5865 11L20.7143 3.87221C21.4286 3.15796 21.4286 1.99994 20.7143 1.28569C20.0001 0.571438 18.842 0.571438 18.1278 1.28569L11 8.41348L3.87221 1.28569Z'
                  stroke='#00E161'
                  strokeWidth='0.5'
                  strokeLinecap='round'
                />
                <defs>
                  <pattern
                    id='pattern0_5355_21800'
                    patternContentUnits='objectBoundingBox'
                    width='0.15'
                    height='0.0809302'>
                    <use xlinkHref='#image0_5355_21800' transform='scale(0.000348837)' />
                  </pattern>
                  <image
                    id='image0_5355_21800'
                    width='430'
                    height='232'
                    xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAa4AAADoCAYAAAC3gwBfAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIhSURBVHgB7dUBDQAgDMCwg3/PgI2FNpmGzQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwt/U6AwARewAgxLgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIgxbgASDEuAFKMC4AU4wIg5QJRWAF7kuBzRgAAAABJRU5ErkJggg=='
                  />
                </defs>
              </svg>
            </div>
            <Content
              selected={selected}
              mutate={mutate}
              setShowSlider={() => {
                setShowSlider(true)
                setShowModal(false)
              }}
            />
          </div>
        </>
      )}
      {showSlider && (
        <div className='fixed inset-0 z-50'>
          <div className='absolute inset-0 bg-[#000000CC]' onClick={() => setShowSlider(false)}></div>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-4 justify-center max-w-[95vw] w-full lg:w-fit'>
            {/* <div className='cursor-pointer p-1' onClick={prevHandler}>
              <svg width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g clipPath='url(#clip0_6205_29201)'>
                  <path
                    d='M5.33187 11.5635L16.0122 0.883412C16.2592 0.636194 16.5889 0.5 16.9406 0.5C17.2922 0.5 17.6219 0.636194 17.8689 0.883412L18.6555 1.66975C19.1673 2.18213 19.1673 3.01491 18.6555 3.52651L9.68695 12.495L18.6654 21.4735C18.9124 21.7207 19.0488 22.0503 19.0488 22.4017C19.0488 22.7535 18.9124 23.083 18.6654 23.3305L17.8789 24.1166C17.6317 24.3638 17.3021 24.5 16.9505 24.5C16.5989 24.5 16.2691 24.3638 16.0221 24.1166L5.33187 13.4267C5.08426 13.1787 4.94826 12.8476 4.94904 12.4956C4.94826 12.1422 5.08426 11.8113 5.33187 11.5635Z'
                    fill='white'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_6205_29201'>
                    <rect width='24' height='24' fill='white' transform='matrix(-1 0 0 1 24 0.5)' />
                  </clipPath>
                </defs>
              </svg>
            </div> */}
            <div className=' lg:bg-neutral-700 lg:p-8 lg:pt-4 lg:rounded-mlg'>
              <div className='flex flex-col items-center gap-4 lg:rounded-xl lg:bg-neutral-950 lg:p-4 max-h-[90vh] overflow-auto'>
                <Image
                  src={selected.display_url}
                  width={500}
                  height={500}
                  alt=''
                  className='w-full object-contain h-full max-h-[80vh]'
                />
                <div className='text-sm font-semibold text-white'>{selected.name}</div>
              </div>
            </div>
            {/* <div className='cursor-pointer p-1' onClick={nextHandler}>
              <svg width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g clipPath='url(#clip0_6205_29197)'>
                  <path
                    d='M18.6681 11.5635L7.98783 0.883412C7.74081 0.636194 7.41105 0.5 7.05945 0.5C6.70784 0.5 6.37809 0.636194 6.13106 0.883412L5.34453 1.66975C4.83273 2.18213 4.83273 3.01491 5.34453 3.52651L14.313 12.495L5.33458 21.4735C5.08756 21.7207 4.95117 22.0503 4.95117 22.4017C4.95117 22.7535 5.08756 23.083 5.33458 23.3305L6.12111 24.1166C6.36833 24.3638 6.69789 24.5 7.0495 24.5C7.4011 24.5 7.73086 24.3638 7.97788 24.1166L18.6681 13.4267C18.9157 13.1787 19.0517 12.8476 19.051 12.4956C19.0517 12.1422 18.9157 11.8113 18.6681 11.5635Z'
                    fill='white'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_6205_29197'>
                    <rect width='24' height='24' fill='white' transform='translate(0 0.5)' />
                  </clipPath>
                </defs>
              </svg>
            </div> */}
          </div>
        </div>
      )}
    </>
  )
}
const Content = ({ selected, mutate, setShowSlider }) => {
  const { t } = useTranslation()
  const { account } = useContext(Context)
  const { setSignInOpen } = useContext(ModalContext)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedIP, setSelectedIP] = useState<any>()
  const likeHandler = async () => {
    try {
      if (!account) {
        setSignInOpen(true)
        return
      }
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      setIsLiked((prevState) => !prevState)
      if (isLiked) {
        await eventService.story.unlikeArtwork(selected?.artwork?.id)
      } else {
        await eventService.story.likeArtwork(selected?.artwork?.id)
      }
      mutate()
    } catch (error) {
      toast(error.message, {
        type: 'error',
      })
    }
  }
  useEffect(() => {
    setIsLiked(!!selected?.artwork?.likes?.length)
    setLikeCount(selected?.artwork?.likes_aggregate?.aggregate?.count)
  }, [selected.id])
  return (
    <>
      <div className='mt-6 rounded-mlg border-[3px] text-white relative border-black bg-[#191919] h-fit min-w-[350px] w-full max-h-[70vh] overflow-auto'>
        <Skew className='absolute top-1 left-1' />
        <Skew className='absolute top-1 right-1' />
        <Image
          src={selected.display_url}
          alt=''
          width={300}
          height={300}
          className='w-full aspect-[452/320] object-cover relative z-40'
        />
        <div className='px-5 -mt-[58px] z-50 relative py-6 bg-[linear-gradient(0deg,#191919_68.29%,rgba(25,25,25,0.00)_100%)]'>
          <div className='flex justify-between items-center'>
            <div className='space-y-1'>
              <div className='font-jaro text-2xl'>{selected.name}</div>
              <div>
                {selected?.story_ip_asset?.ip_asset_id && (
                  <Link
                    href={`${storyChain.blockExplorers.secondary.url}ipa/${selected?.story_ip_asset?.ip_asset_id}`}
                    target='_blank'
                    className='text-brand-default text-sm'>
                    {shorten(selected?.story_ip_asset?.ip_asset_id)}
                  </Link>
                )}
              </div>
              <div className='text-sm font-medium'>
                {t('by')}{' '}
                <Link
                  target='_blank'
                  href={`/artist/${selected?.authorizer_user?.creator?.slug}`}
                  className='text-brand-default'>
                  {selected?.authorizer_user?.creator?.pen_name || 'Punkga'}
                </Link>
              </div>
            </div>
            <div className='flex items-center gap-1'>
              <span>{likeCount}</span>
              <svg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g clipPath='url(#clip0_6200_28004)'>
                  <path
                    d='M19.5892 5.66515C19.2913 4.97545 18.8618 4.35044 18.3247 3.82512C17.7872 3.29823 17.1535 2.87952 16.458 2.59176C15.7368 2.29218 14.9633 2.13884 14.1824 2.14064C13.0868 2.14064 12.0179 2.44065 11.089 3.00732C10.8668 3.14288 10.6557 3.29177 10.4557 3.454C10.2557 3.29177 10.0445 3.14288 9.82231 3.00732C8.89341 2.44065 7.8245 2.14064 6.72892 2.14064C5.94001 2.14064 5.17555 2.29175 4.45332 2.59176C3.75553 2.88066 3.12662 3.29622 2.58661 3.82512C2.04882 4.34984 1.61921 4.975 1.32214 5.66515C1.01325 6.38295 0.855469 7.14518 0.855469 7.92964C0.855469 8.66966 1.00658 9.44078 1.30659 10.2252C1.5577 10.8808 1.91771 11.5608 2.37772 12.2475C3.10662 13.3342 4.10887 14.4676 5.35334 15.6165C7.4156 17.5209 9.45786 18.8365 9.54453 18.8899L10.0712 19.2276C10.3045 19.3765 10.6046 19.3765 10.8379 19.2276L11.3646 18.8899C11.4512 18.8343 13.4913 17.5209 15.5558 15.6165C16.8002 14.4676 17.8025 13.3342 18.5314 12.2475C18.9914 11.5608 19.3536 10.8808 19.6025 10.2252C19.9025 9.44078 20.0536 8.66966 20.0536 7.92964C20.0558 7.14518 19.8981 6.38295 19.5892 5.66515ZM10.4557 17.4698C10.4557 17.4698 2.54439 12.4008 2.54439 7.92964C2.54439 5.66515 4.41776 3.82956 6.72892 3.82956C8.35339 3.82956 9.76231 4.73625 10.4557 6.06072C11.149 4.73625 12.5579 3.82956 14.1824 3.82956C16.4936 3.82956 18.3669 5.66515 18.3669 7.92964C18.3669 12.4008 10.4557 17.4698 10.4557 17.4698Z'
                    fill='white'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_6200_28004'>
                    <rect width='19.9115' height='19.9115' fill='white' transform='translate(0.498047 0.789062)' />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className='mt-3 grid grid-cols-[2fr_1fr] gap-3'>
            <Button size='sm' variant='outlined' color='neutral' className='w-full' onClick={setShowSlider}>
              {t('View Artwork')}
            </Button>
            <Button size='sm' color='neutral' className='w-full' onClick={likeHandler}>
              {t(isLiked ? 'Liked' : 'Like')}
            </Button>
          </div>
        </div>
        <div className='mt-4 px-5 pb-5'>
          <div className='font-jaro text-2xl'>{t('Character IP')}</div>
          <div className='mt-4 grid grid-cols-3'>
            {selected.story_artwork_characters?.map((char, index) => (
              <div
                onClick={() => setSelectedIP(char.story_character)}
                className={`rounded-xl relative overflow-hidden border-black border-[3px]`}
                key={index}>
                <div className='absolute inset-0'>
                  <Image
                    src={char.story_character.avatar_url}
                    width={300}
                    height={300}
                    alt=''
                    className='w-full h-full object-cover'
                  />
                </div>
                <Image src={CharacterFrame} priority alt='' className='w-full h-full relative' />
              </div>
            ))}
          </div>
        </div>
      </div>
      <IPModal open={!!selectedIP} onClose={() => setSelectedIP(undefined)} data={selectedIP} mutate={mutate} />
    </>
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
