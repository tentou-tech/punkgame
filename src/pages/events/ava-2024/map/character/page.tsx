import Background from 'components/pages/event/ava-2024/assets/Main_Map.png'
import Decor from 'components/pages/event/ava-2024/assets/decor.svg'
import DecorLeft from 'components/pages/event/ava-2024/assets/decor-left.png'
import DecorRight from 'components/pages/event/ava-2024/assets/decor-right.png'
import DecorMiddle from 'components/pages/event/ava-2024/assets/decor-middle.png'
import Frame2 from 'components/pages/event/ava-2024/assets/frame-2.svg'
import Frame from 'components/pages/event/ava-2024/assets/frame.svg'
import Point from 'components/pages/event/ava-2024/assets/point.svg'
import DarkPoint from 'components/pages/event/ava-2024/assets/dark-point.svg'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { useWindowSize } from 'usehooks-ts'
import { storyChain } from 'src/services/wagmi/config'
import { Pagination } from '@mui/material'
import Dropdown, { DropdownMenu, DropdownToggle } from 'components/Dropdown'
import Button from 'components/core/Button'
import Modal from 'components/pages/event/ava-2024/Modal'
import RuleAndAward from 'components/pages/event/ava-2024/RuleAndAward'
import Map from 'components/pages/event/ava-2024/assets/Map.svg'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Context } from 'src/context'
import { eventService } from 'src/services/eventService'
import { ModalContext } from 'src/context/modals'
import { shorten } from 'src/utils'
import Tooltip from 'components/Tooltip'
import usePage from 'src/hooks/usePage'
export default function Page(props) {
  if (props.justHead) {
    return <></>
  }
  return <Event {...props} />
}
function Event() {
  const { locale, replace } = useRouter()
  const searchParams = new URLSearchParams(location.search)
  const { t } = useTranslation()
  const { account } = useContext(Context)
  const { setSignInOpen } = useContext(ModalContext)
  const [open, setOpen] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isCollected, setIsCollected] = useState(false)
  const [collectedCount, setCollectedCount] = useState(0)
  const [page, setPage] = usePage()
  const [count, setCount] = useState(1)
  const [selectedCharacter, setSelectedCharacter] = useState<any>()
  const [sort, setSort] = useState('Created_At_Desc')
  const [characters, setCharacters] = useState([])
  const { width } = useWindowSize()
  const [type, setType] = useState(searchParams.get('type') || 'all')
  const { data, mutate } = useSWR(
    { ket: 'get-characters', userId: account?.id, page, sort, type },
    ({ userId, page, sort, type }) => eventService.story.getCharacters(userId, page, sort, type),
    {
      revalidateOnFocus: false,
    }
  )
  const collectedCharacters = useSWR(
    { key: 'get-collected-characters', userId: account?.id },
    ({ userId }) => (userId ? eventService.story.getCollectedCharacters() : null),
    {
      revalidateOnFocus: false,
    }
  )
  const collectedCharacter = collectedCharacters?.data?.data?.data?.user_collect_character
  const characterData = width < 1024 ? selectedCharacter : selectedCharacter || characters?.[0]
  useEffect(() => {
    if (data?.data?.data?.story_character) {
      setCharacters(data?.data?.data?.story_character)
      setCount(Math.ceil((data?.data?.data?.story_character_aggregate?.aggregate?.count || 0) / 20))
    }
  }, [data?.data?.data?.story_character])
  useEffect(() => {
    setLikeCount(characterData?.likes_aggregate?.aggregate?.count)
    setCollectedCount(characterData?.user_collect_characters_aggregate?.aggregate?.count)
    setIsLiked(!!characterData?.likes?.length)
    setIsCollected(!!characterData?.user_collect_characters?.length)
  }, [characterData?.id])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])
  const collectHandler = async () => {
    try {
      setLoading(true)
      await eventService.story.collectCharacter(characterData?.id)
      await collectedCharacters.mutate()
      setCollectedCount((prev) => prev + 1)
      setLoading(false)
      setOpen(false)
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
        <Image src={DecorLeft} alt='' className='absolute top-16 left-0 w-[10%]' />
        <Image src={DecorMiddle} alt='' className='absolute top-[48px] lg:top-[68px] left-[60%] w-[10%]' />
        <Image src={DecorRight} alt='' className='absolute top-16 right-0 w-[10%]' />

        <div className='relative pk-container mx-auto pt-24 text-white'>
          <div className='lg:py-10'>
            {!!characters?.length && (
              <div className='grid grid-cols-1 lg:grid-cols-[22fr_11fr] mt-4 gap-8 min-h-[1000px] relative'>
                <div className='shrink-0 w-full'>
                  <div className='flex justify-between relative z-10 items-center gap-10 h-10 lg:hidden mb-5 flex-row-reverse'>
                    <div>
                      <Link href={!collectedCharacter?.length ? '#' : '/events/ava-2024/map/character/collected'}>
                        <Button color='neutral' size='sm' className='h-10' disabled={!collectedCharacter?.length}>
                          {t('Your collected')}
                        </Button>
                      </Link>
                    </div>
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
                  <div className='flex justify-between items-center h-10'>
                    <div className='text-3xl font-medium'>{t('Character')}</div>
                    <div className='flex gap-2.5'>
                      <Tooltip label={t('Dream point')}>
                        <div className='h-10 rounded-md px-4 flex gap-2 items-center justify-center bg-[#191919]'>
                          <Image src={Point} alt='' className='w-8 h-auto' />
                          <span className='text-sm font-semibold'>{3 - (collectedCharacter?.length || 0)}</span>
                        </div>
                      </Tooltip>
                      <Dropdown>
                        <DropdownToggle>
                          <div className='h-10 rounded-md px-4 flex gap-2 items-center justify-center bg-[#191919] cursor-pointer'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='16'
                              height='16'
                              viewBox='0 0 16 16'
                              fill='none'>
                              <path
                                d='M15.1378 10.194C15.0128 10.0691 14.8432 9.99884 14.6665 9.99884C14.4897 9.99884 14.3201 10.0691 14.1951 10.194L11.9998 12.3894V1.9987C11.9998 1.82189 11.9295 1.65232 11.8045 1.52729C11.6795 1.40227 11.5099 1.33203 11.3331 1.33203C11.1563 1.33203 10.9867 1.40227 10.8617 1.52729C10.7367 1.65232 10.6664 1.82189 10.6664 1.9987V12.3894L8.47112 10.194C8.34538 10.0726 8.17698 10.0054 8.00218 10.0069C7.82738 10.0084 7.66018 10.0785 7.53657 10.2022C7.41297 10.3258 7.34285 10.493 7.34133 10.6678C7.33981 10.8426 7.40701 11.011 7.52845 11.1367L10.8618 14.47C10.9237 14.5321 10.9973 14.5814 11.0783 14.615C11.1593 14.6486 11.2461 14.6659 11.3338 14.6659C11.4215 14.6659 11.5083 14.6486 11.5893 14.615C11.6703 14.5814 11.7439 14.5321 11.8058 14.47L15.1391 11.1367C15.2639 11.0115 15.3339 10.8419 15.3336 10.6651C15.3334 10.4883 15.2629 10.3189 15.1378 10.194Z'
                                fill='white'
                              />
                              <path
                                d='M8.47123 4.86059L5.1379 1.52726C5.07581 1.46504 5.00192 1.41586 4.92057 1.38259C4.75748 1.31518 4.57432 1.31518 4.41123 1.38259C4.32988 1.41586 4.25599 1.46504 4.1939 1.52726L0.860565 4.86059C0.73556 4.98577 0.665402 5.15549 0.665528 5.33239C0.665653 5.5093 0.736049 5.67892 0.861232 5.80392C0.986414 5.92893 1.15613 5.99909 1.33304 5.99896C1.50995 5.99884 1.67956 5.92844 1.80456 5.80326L3.9999 3.60792V13.9986C3.9999 14.1754 4.07014 14.345 4.19516 14.47C4.32018 14.595 4.48975 14.6653 4.66656 14.6653C4.84338 14.6653 5.01295 14.595 5.13797 14.47C5.26299 14.345 5.33323 14.1754 5.33323 13.9986V3.60792L7.52857 5.80326C7.6543 5.9247 7.8227 5.99189 7.9975 5.99037C8.1723 5.98885 8.33951 5.91874 8.46311 5.79514C8.58672 5.67153 8.65683 5.50432 8.65835 5.32952C8.65987 5.15473 8.59267 4.98632 8.47123 4.86059Z'
                                fill='white'
                              />
                            </svg>
                            <span className='text-sm font-semibold'>{t('Sort by')}</span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'>
                              <path
                                d='M7 10L12.0008 14.58L17 10'
                                stroke='white'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                          </div>
                        </DropdownToggle>
                        <DropdownMenu customClass='!bg-[#191919] rounded-md'>
                          <div className='space-y-2 p-2 text-sm'>
                            <div
                              className={`cursor-pointer px-2 ${sort == 'Created_At_Desc' ? 'text-brand-default' : ''}`}
                              onClick={() => setSort('Created_At_Desc')}>
                              {t('Newest')}
                            </div>
                            <div
                              className={`cursor-pointer px-2 ${sort == 'Created_At_Asc' ? 'text-brand-default' : ''}`}
                              onClick={() => setSort('Created_At_Asc')}>
                              {t('Oldest')}
                            </div>
                            <div
                              className={`cursor-pointer px-2 ${
                                sort == 'User_Collect_Desc' ? 'text-brand-default' : ''
                              }`}
                              onClick={() => setSort('User_Collect_Desc')}>
                              {t('Most collected')}
                            </div>
                            <div
                              className={`cursor-pointer px-2 ${
                                sort == 'User_Collect_Asc' ? 'text-brand-default' : ''
                              }`}
                              onClick={() => setSort('User_Collect_Asc')}>
                              {t('Least collected')}
                            </div>
                          </div>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                  {locale == 'vn' ? (
                    <p className='text-xs leading-[18px] mt-2 font-medium'>
                      Đây là những nhân vật được sáng tạo bởi người tham gia cuộc thi. Bạn có thể thu thập tối đa 3 nhân
                      vật để có quyền sử dụng hình ảnh của chúng trong truyện và tranh của bạn. Mỗi nhân vật sẽ tốn 1
                      Dream để thu thập
                      <br />
                      Ngoài ra chúng tôi có những IP mặc định để bạn có thể sử dụng chúng miễn phí mà không cần thu thập
                      <br />
                      Tất cả các nhân vật đều được đăng ký là tài sản trí tuệ (IP) tại Story Protocol
                    </p>
                  ) : (
                    <p className='text-xs leading-[18px] mt-2 font-medium'>
                      Here are all the characters created by participants of the contest. You can collect up to 3 of
                      them to have the right to use their images in your submission. Each character will cost you 1
                      Clover.
                      <br />
                      Additionally, we offer some default IPs that you can use for free without needing to collect them.
                      <br />
                      All characters are registered as Intellectual Property (IP) on Story Protocol.
                    </p>
                  )}
                  <div className='mt-6 flex gap-2 -skew-x-12'>
                    <div className='h-9 w-3 rounded bg-white'></div>
                    <div
                      className={`h-9 grid place-items-center rounded ${
                        type == 'all' ? 'bg-white text-black' : 'bg-gray-500 text-white'
                      } text-sm font-semibold px-3.5 cursor-pointer`}
                      onClick={() => {
                        setPage(1)
                        setType('all')
                      }}>
                      <span className='skew-x-12'>{t('All')}</span>
                    </div>
                    <div
                      className={`h-9 grid place-items-center rounded ${
                        type == 'sponsored' ? 'bg-white text-black' : 'bg-gray-500 text-white'
                      } text-sm font-semibold px-3.5 cursor-pointer`}
                      onClick={() => {
                        setPage(1)
                        setType('sponsored')
                      }}>
                      <span className='skew-x-12'>{t('Sponsored')}</span>
                    </div>
                    <div
                      className={`h-9 grid place-items-center rounded ${
                        type == 'user' ? 'bg-white text-black' : 'bg-gray-500 text-white'
                      } text-sm font-semibold px-3.5 cursor-pointer`}
                      onClick={() => {
                        setPage(1)
                        setType('user')
                      }}>
                      <span className='skew-x-12'>{t('By contestants')}</span>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-6'>
                    {characters?.map((character, index) => (
                      <div
                        className={`relative rounded-xl border-[3px] ${
                          characterData?.id == character.id ? 'border-brand-default' : 'border-black'
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
                            className='w-full aspect-square object-cover relative'
                          />
                          {character.is_default_character && (
                            <div className='absolute top-3 right-3 text-xs text-black bg-white rounded-md px-1 font-semibold'>
                              {t('Free')}
                            </div>
                          )}
                        </div>
                        <Image src={Frame} alt='' className='w-full  relative rounded-mlg' />
                      </div>
                    ))}
                  </div>
                  <div className='mt-8 flex justify-center'>
                    <Pagination
                      shape='rounded'
                      className='[&_.Mui-selected]:!bg-white [&_.Mui-selected]:!text-text-primary [&_.MuiPaginationItem-root:not(.Mui-selected)]:!text-text-quatenary'
                      page={page}
                      onChange={(e, p) => setPage(p)}
                      count={count}
                    />
                  </div>
                </div>
                <div className='sticky top-[12vh] h-fit hidden lg:block'>
                  <div className='flex justify-between relative z-10 items-center gap-10 h-10'>
                    <div className='flex-1'>
                      {account && (
                        <Link href={!collectedCharacter?.length ? '#' : '/events/ava-2024/map/character/collected'}>
                          <Button color='neutral' size='sm' className='h-10' disabled={!collectedCharacter?.length}>
                            {t('Your collected')}
                          </Button>
                        </Link>
                      )}
                    </div>
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
                  <div className='mt-6 rounded-mlg border-[3px] relative border-black p-5 bg-[#191919] h-fit min-w-[350px] w-full'>
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
                          {characterData?.is_default_character && <div className='text-sm mt-3'>{t('Free')}</div>}
                          <div className='font-jaro text-2xl line-clamp-2'>{characterData?.name}</div>
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
                              {characterData?.authorizer_user.nickname || 'Punkga'}
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
                        {!(
                          characterData?.is_default_character ||
                          isCollected ||
                          account?.id == characterData?.authorizer_user?.id ||
                          (collectedCharacter?.length || 0) >= 3
                        ) && (
                          <Button
                            color='neutral'
                            size='sm'
                            className='!w-2/3 shrink-0 [&>*]:w-full'
                            onClick={() => {
                              if (account) {
                                setShowModal(false)
                                setOpen(true)
                              } else {
                                setSignInOpen(true)
                              }
                            }}>
                            <div className='flex items-center justify-between'>
                              <div>{t('Collect IP')}</div>
                              <div className='flex items-center gap-1'>
                                -1 <Image src={DarkPoint} alt='' className='h-5 w-auto ml-1' />
                              </div>
                            </div>
                          </Button>
                        )}
                        <Button size='sm' color='neutral' variant='outlined' className='!w-full' onClick={likeHandler}>
                          {t(isLiked ? 'Liked' : 'Like')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {width < 1024 && (
        <Modal open={showModal} setOpen={setShowModal} className='[&_.static]:p-0'>
          {characterData && (
            <div className='rounded-mlg border-[3px] relative border-black p-3 bg-[#191919] h-fit min-w-[350px] w-full'>
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
                    {characterData?.is_default_character && <div className='text-sm mt-3'>{t('Free')}</div>}
                    <div className='font-jaro text-2xl line-clamp-2'>{characterData?.name}</div>
                    {characterData?.story_ip_asset?.ip_asset_id && (
                      <Link
                        href={`${storyChain.blockExplorers.secondary.url}ipa/${characterData?.story_ip_asset?.ip_asset_id}`}
                        target='_blank'
                        className='text-brand-default text-sm'>
                        {shorten(characterData?.story_ip_asset?.ip_asset_id)}
                      </Link>
                    )}
                    <div className='text-sm font-medium'>
                      {t('by')} <span className='text-brand-default'>{characterData?.authorizer_user.nickname}</span>
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
                <div className='flex gap-1.5 mt-4 flex-col'>
                  {!(
                    characterData?.is_default_character ||
                    account?.id == characterData?.authorizer_user?.id ||
                    isCollected ||
                    (collectedCharacter?.length || 0) >= 3
                  ) && (
                    <Button
                      color='neutral'
                      size='sm'
                      className='!w-full shrink-0 flex item-center justify-between [&>*]:w-full'
                      onClick={() => {
                        if (account) {
                          setShowModal(false)
                          setOpen(true)
                        } else {
                          setSignInOpen(true)
                        }
                      }}>
                      <div className='flex items-center justify-between'>
                        <div>{t('Collect IP')}</div>
                        <div className='flex items-center gap-1'>
                          -1 <Image src={DarkPoint} alt='' className='h-5 w-auto ml-1' />
                        </div>
                      </div>
                    </Button>
                  )}
                  <Button size='sm' color='neutral' variant='outlined' className='!w-full' onClick={likeHandler}>
                    {t(isLiked ? 'Liked' : 'Like')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
      <Modal open={open} setOpen={setOpen} title={t('Collect IP')}>
        {characterData && (
          <div>
            <div className='p-4 rounded-xl flex flex-col gap-4 items-center bg-neutral-950'>
              <div className='relative rounded-xl border-[3px] overflow-hidden border-black  cursor-pointer'>
                <div className='absolute bottom-0 inset-x-0 w-full'>
                  <Image src={characterData?.avatar_url} width={200} height={200} alt='' className='w-full  relative' />
                </div>
                <Image src={Frame} alt='' className='w-32 relative rounded-mlg' />
              </div>
              <div className='text-sm font-semibold text-center'>
                {locale == 'en'
                  ? `Sure to collect ${characterData?.name} with 1 Dream point?`
                  : `Bạn có chắc chắn muốn thu thập ${characterData?.name} bằng 1 điểm Dream?`}
              </div>
            </div>
            <div className='flex gap-2.5 mt-4 w-full'>
              <Button color='neutral' size='sm' variant='outlined' className='!w-1/3' onClick={() => setOpen(false)}>
                {t('Cancel')}
              </Button>
              <Button size='sm' color='neutral' className='!w-2/3' onClick={collectHandler} loading={loading}>
                {t('Collect IP')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
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
