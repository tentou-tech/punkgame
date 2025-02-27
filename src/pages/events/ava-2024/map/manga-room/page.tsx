import { Pagination } from '@mui/material'
import Button from 'components/core/Button'
import IPModal from 'components/pages/event/ava-2024/IPModal'
import RuleAndAward from 'components/pages/event/ava-2024/RuleAndAward'
import Background from 'components/pages/event/ava-2024/assets/Main_Map.png'
import Map from 'components/pages/event/ava-2024/assets/Map.svg'
import CharacterFrame from 'components/pages/event/ava-2024/assets/character-frame.png'
import DecorLeft from 'components/pages/event/ava-2024/assets/decor-left.png'
import DecorMiddle from 'components/pages/event/ava-2024/assets/decor-middle.png'
import DecorRight from 'components/pages/event/ava-2024/assets/decor-right.png'
import MangaFrame from 'components/pages/event/ava-2024/assets/manga-frame.png'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
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
function PageDetail() {
  const { locale, push } = useRouter()
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const { account } = useContext(Context)
  const { setSignInOpen } = useContext(ModalContext)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<any>()
  const [page, setPage] = usePage()
  const [type, setType] = useState('all')
  const { data, mutate, isLoading } = useSWR(
    { ket: 'get-ava-manga', page, userId: account?.id },
    ({ page, userId }) => eventService.story.getManga(page, userId),
    {
      revalidateOnFocus: false,
    }
  )
  useEffect(() => {
    if (selected) {
      const character = data?.data?.data?.story_manga.find((char) => char.id == selected.id)
      if (character) {
        setSelected(character)
        return
      }
    }
    if (data?.data?.data?.story_manga?.[0]) {
      setSelected(data?.data?.data?.story_manga?.[0])
    }
  }, [data?.data?.data?.story_manga])
  const mangas = data?.data?.data?.story_manga
  const count = Math.ceil((data?.data?.data?.story_manga_aggregate?.aggregate?.count || 1) / 9)
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
                <div className='flex justify-end relative z-20 items-center gap-10 h-10 lg:hidden mb-5 flex-row-reverse'>
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
                  <div className='text-3xl font-medium'>{t('Mangas')}</div>
                </div>
                {mangas?.length ? (
                  <>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-6'>
                      {mangas?.map((manga, index) => (
                        <div
                          className={`rounded-xl cursor-pointer relative overflow-hidden ${
                            manga.id == selected?.id ? 'border-[#00E160]' : 'border-black'
                          } border-[3px]`}
                          key={index}
                          onClick={() => {
                            setSelected(manga)
                            setShowModal(true)
                          }}>
                          <div className='absolute inset-0'>
                            <Image
                              src={manga.manga.poster}
                              width={300}
                              height={300}
                              alt=''
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <Image src={MangaFrame} alt='' className='w-full h-full relative' />
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
                  <div>{t('No manga submitted')}</div>
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
                <div className='relative z-0'>{selected && <Content selected={selected} mutate={mutate} />}</div>
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
            <Content selected={selected} mutate={mutate} />
          </div>
        </>
      )}
    </>
  )
}
const Content = ({ selected, mutate }) => {
  const { locale, push } = useRouter()
  const { t } = useTranslation()
  const [selectedIP, setSelectedIP] = useState<any>()
  const { width } = useWindowSize()
  const mangaName =
    (locale == 'en'
      ? selected.manga.manga_languages.find((l) => l.language_id == 1)?.title
      : selected.manga.manga_languages.find((l) => l.language_id == 2)?.title) ||
    selected.manga.manga_languages.find((l) => l.is_main_language)?.title
  return (
    <>
      <div className='mt-6 rounded-mlg border-[3px] text-white relative border-black bg-[#191919] h-fit min-w-[350px] w-full max-h-[70vh] overflow-auto'>
        <Skew className='absolute top-1 left-1' />
        <Skew className='absolute top-1 right-1' />
        <Image
          src={selected.manga.banner}
          alt=''
          width={300}
          height={300}
          className='w-full aspect-[452/170] object-cover relative z-40'
        />
        <div className='px-5 -mt-[58px] z-50 relative py-6 bg-[linear-gradient(0deg,#191919_68.29%,rgba(25,25,25,0.00)_100%)]'>
          <div className='space-y-1'>
            <div className='font-jaro text-2xl'>{mangaName}</div>
            <div className='flex w-full items-center justify-between'>
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
              <div className='flex items-center text-sm gap-1.5'>
                {selected?.manga?.manga_total_likes?.likes || 0}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  className='w-5 h-5'
                  fill='none'>
                  <path
                    d='M23.01 5.87714C22.651 5.04581 22.1333 4.29247 21.4859 3.65928C20.8381 3.02421 20.0742 2.51953 19.2359 2.17268C18.3667 1.81159 17.4344 1.62676 16.4931 1.62893C15.1725 1.62893 13.8842 1.99053 12.7645 2.67357C12.4967 2.83696 12.2422 3.01643 12.0011 3.21196C11.76 3.01643 11.5056 2.83696 11.2377 2.67357C10.1181 1.99053 8.82969 1.62893 7.50915 1.62893C6.55826 1.62893 5.63683 1.81107 4.76629 2.17268C3.92522 2.52089 3.16719 3.02178 2.51629 3.65928C1.86807 4.29175 1.35025 5.04527 0.992188 5.87714C0.619866 6.74232 0.429688 7.66107 0.429688 8.6066C0.429688 9.49857 0.61183 10.428 0.973438 11.3736C1.27612 12.1637 1.71004 12.9834 2.26451 13.8111C3.14308 15.1209 4.35112 16.487 5.85112 17.8718C8.33683 20.1673 10.7984 21.753 10.9029 21.8173L11.5377 22.2245C11.819 22.4039 12.1806 22.4039 12.4618 22.2245L13.0967 21.8173C13.2011 21.7504 15.66 20.1673 18.1484 17.8718C19.6484 16.487 20.8565 15.1209 21.735 13.8111C22.2895 12.9834 22.7261 12.1637 23.0261 11.3736C23.3877 10.428 23.5699 9.49857 23.5699 8.6066C23.5725 7.66107 23.3824 6.74232 23.01 5.87714ZM12.0011 20.1057C12.0011 20.1057 2.4654 13.9959 2.4654 8.6066C2.4654 5.87714 4.72344 3.66464 7.50915 3.66464C9.46719 3.66464 11.1654 4.7575 12.0011 6.35392C12.8368 4.7575 14.535 3.66464 16.4931 3.66464C19.2788 3.66464 21.5368 5.87714 21.5368 8.6066C21.5368 13.9959 12.0011 20.1057 12.0011 20.1057Z'
                    fill='white'
                  />
                </svg>
              </div>
            </div>
            <div className='text-sm font-medium'>
              {t('by')}{' '}
              <Link
                target='_blank'
                href={`/artist/${selected?.manga?.manga_creators[0]?.creator?.slug}`}
                className='text-brand-default'>
                {selected?.manga?.manga_creators[0]?.creator?.pen_name || 'Punkga'}
              </Link>
            </div>
          </div>
          <div className='mt-4 w-full'>
            <Button
              color='neutral'
              size='sm'
              className='w-full'
              onClick={() =>
                width < 1280
                  ? window.open(`/comic/${selected.manga.slug}`, '_blank')
                  : window.open(`/comic/${selected.manga.slug}/chapter/1`, '_blank')
              }>
              {t('Read manga')}
            </Button>
          </div>
        </div>
        <div className='mt-4 px-5 pb-5'>
          <div className='font-jaro text-2xl'>{t('Character IP')}</div>
          <div className='mt-4 grid grid-cols-3'>
            {selected.story_manga_characters?.map((char, index) => (
              <div
                onClick={() => setSelectedIP(char.story_character)}
                className={`rounded-xl relative overflow-hidden cursor-pointer border-black border-[3px]`}
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
