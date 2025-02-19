import Spinner from 'components/Spinner'
import Modal from 'components/pages/event/your-city/Modal'
import Point from 'components/pages/event/your-city/assets/dp.svg'
import Logo from 'components/pages/event/your-city/assets/logo-punktober.png'
import Mark from 'components/pages/event/your-city/assets/mark.svg'
import html2canvas from 'html2canvas'
import moment from 'moment-timezone'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { eventService } from 'src/services/eventService'
import { formatNumber, imageUrlToBase64 } from 'src/utils'
import useSWR from 'swr'
import { useWindowSize } from 'usehooks-ts'
import ArtworkDetail from '../ArtworkDetail'
export default function Page(props) {
  if (props.justHead) {
    return <></>
  }
  return <PageContent {...props} />
}
function PageContent() {
  const { t } = useTranslation()
  const { query } = useRouter()
  const [openArtworkDetail, setOpenArtworkDetail] = useState(false)
  const { width } = useWindowSize()
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const userId = query.userId
  const { data } = useSWR(`get-user-artwork-${userId}`, () => eventService.punktober.getUserArtworks(userId as string))
  const artworks = data?.data?.data?.user_artwork_topic.sort((a, b) => {
    return moment(a.artwork_topic.date, 'YYYY-MM-DD').isAfter(moment(b.artwork_topic.date, 'YYYY-MM-DD')) ? 1 : -1
  }) as any[]
  const [tab, setTab] = useState<'calendar' | 'collection'>('calendar')
  const captureRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const handleSaveAsImage = async () => {
    if (!captureRef.current) return
    try {
      if (loading) return
      setLoading(true)
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        logging: true,
        allowTaint: true,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'my-city.png'
      link.click()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Error capturing the element:', error)
    }
  }
  if (!artworks) {
    return (
      <div className='flex p-5 justify-center items-center min-h-[70vh]'>
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className='w-full flex flex-col items-center p-4 lg:p-8 lg:max-w-[1160px] lg:mx-auto min-h-[70vh] relative'>
        <Image src={Logo} alt='' className='h-[74px] w-auto lg:absolute lg:top-8 lg:h-14 lg:left-8' />
        <div className='font-bold uppercase font-roboto mt-4 lg:text-4xl'>
          City of {artworks?.[0].authorizer_user.nickname}
        </div>
        <div className='grid grid-cols-[1fr_auto_1fr] gap-10 w-full mt-4'>
          <div className='flex flex-col items-center gap-2.5'>
            <div className='text-gray-800 text-sm'>{t('Submitted')}</div>
            <div className='text-gray-black text-xl font-semibold'>{artworks.length} Artworks</div>
          </div>
          <div className='w-[1px] h-14 bg-neutral-black'></div>
          <div className='flex flex-col items-center gap-2.5'>
            <div className='text-gray-800 text-sm'>{t('Earned')}</div>
            <div className='text-gray-black text-xl font-semibold flex items-center gap-1'>
              {formatNumber(artworks.reduce((total, item) => total + ( item.reward_amount || 0 ), 0))}{' '}
              <Image src={Point} width={24} height={24} alt='' />
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center lg:justify-between w-full mt-8'>
          <div className='hidden lg:flex gap-4 bg-[#E1E1E1] p-1 rounded-full'>
            <div
              onClick={() => setTab('calendar')}
              className={`h-[30px] flex items-center gap-1.5 px-2.5 ${
                tab == 'calendar' ? 'bg-white rounded-full text-text-primary' : 'text-text-teriary'
              }`}>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M16 3L16 6M8 3L8 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M14 4H10L10 6C10 7.10457 9.10457 8 8 8C6.89543 8 6 7.10457 6 6L6 4.07612C5.02492 4.17203 4.36857 4.38879 3.87868 4.87868C3 5.75736 3 7.17157 3 10V15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15V10C21 7.17157 21 5.75736 20.1213 4.87868C19.6314 4.38879 18.9751 4.17203 18 4.07612L18 6C18 7.10457 17.1046 8 16 8C14.8954 8 14 7.10457 14 6L14 4ZM7 12C7 11.4477 7.44772 11 8 11L16 11C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13L8 13C7.44772 13 7 12.5523 7 12ZM8 15C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17L16 17C16.5523 17 17 16.5523 17 16C17 15.4477 16.5523 15 16 15L8 15Z'
                  fill='currentColor'
                />
              </svg>
              <span className='text-sm font-medium'>View as calendar</span>
            </div>
            <div
              onClick={() => setTab('collection')}
              className={`h-[30px] flex items-center gap-1.5 px-2.5 ${
                tab == 'collection' ? 'bg-white rounded-full text-text-primary' : 'text-text-teriary'
              }`}>
              <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M8.09974 12.5984V15.2983C8.09974 16.7831 6.88469 17.9982 5.39983 17.9982H2.69991C1.21505 17.9982 0 16.7831 0 15.2983V12.5984C0 11.1135 1.21505 9.89844 2.69991 9.89844H5.39983C6.88469 9.89844 8.09974 11.1135 8.09974 12.5984Z'
                  fill='currentColor'
                />
                <path
                  d='M8.09974 2.69991V5.39983C8.09974 6.88469 6.88469 8.09974 5.39983 8.09974H2.69991C1.21505 8.09974 0 6.88469 0 5.39983V2.69991C0 1.21505 1.21505 0 2.69991 0H5.39983C6.88469 0 8.09974 1.21505 8.09974 2.69991Z'
                  fill='currentColor'
                />
                <path
                  d='M18.0001 12.5984V15.2983C18.0001 16.7831 16.7851 17.9982 15.3002 17.9982H12.6003C11.1154 17.9982 9.90039 16.7831 9.90039 15.2983V12.5984C9.90039 11.1135 11.1154 9.89844 12.6003 9.89844H15.3002C16.7851 9.89844 18.0001 11.1135 18.0001 12.5984Z'
                  fill='currentColor'
                />
                <path
                  d='M18.0001 2.69991V5.39983C18.0001 6.88469 16.7851 8.09974 15.3002 8.09974H12.6003C11.1154 8.09974 9.90039 6.88469 9.90039 5.39983V2.69991C9.90039 1.21505 11.1154 0 12.6003 0H15.3002C16.7851 0 18.0001 1.21505 18.0001 2.69991Z'
                  fill='currentColor'
                />
              </svg>
              <span className='text-sm font-medium'>View as collection</span>
            </div>
          </div>
          {width >= 1024 ? (
            (tab == 'calendar' && false) ? (
              <div
                onClick={handleSaveAsImage}
                className='text-[#009640] font-medium text-sm flex items-center gap-1.5 w-full lg:w-fit justify-center cursor-pointer'>
                Save as image
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M4 15.2044L4 18.8925C4 19.4514 4.21071 19.9875 4.58579 20.3827C4.96086 20.778 5.46957 21 6 21H18C18.5304 21 19.0391 20.778 19.4142 20.3827C19.7893 19.9875 20 19.4514 20 18.8925V15.2044M12.0011 3V14.9425M12.0011 14.9425L16.5725 10.3793M12.0011 14.9425L7.42969 10.3793'
                    stroke='#009640'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            ) : (
              <div
                onClick={() => {
                  navigator.share({
                    url: location.href,
                  })
                }}
                className='text-[#009640] font-medium text-sm flex items-center gap-1.5 w-full lg:w-fit justify-center'>
                Share collection
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M17.3032 8.32119C18.7726 8.32119 19.9638 7.13 19.9638 5.6606C19.9638 4.19119 18.7726 3 17.3032 3C15.8338 3 14.6426 4.19119 14.6426 5.6606C14.6426 7.13 15.8338 8.32119 17.3032 8.32119Z'
                    stroke='#009640'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M6.6606 14.5321C8.13 14.5321 9.32119 13.3409 9.32119 11.8715C9.32119 10.4021 8.13 9.21094 6.6606 9.21094C5.19119 9.21094 4 10.4021 4 11.8715C4 13.3409 5.19119 14.5321 6.6606 14.5321Z'
                    stroke='#009640'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M17.3032 20.7353C18.7726 20.7353 19.9638 19.5441 19.9638 18.0747C19.9638 16.6053 18.7726 15.4141 17.3032 15.4141C15.8338 15.4141 14.6426 16.6053 14.6426 18.0747C14.6426 19.5441 15.8338 20.7353 17.3032 20.7353Z'
                    stroke='#009640'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M8.95703 13.2109L15.0143 16.7407'
                    stroke='#009640'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M15.0055 7L8.95703 10.5297'
                    stroke='#009640'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            )
          ) : (
            <div
              onClick={() => {
                navigator.share({
                  url: location.href,
                })
              }}
              className='text-[#009640] font-medium text-sm flex items-center gap-1.5 w-full lg:w-fit justify-center'>
              Share collection
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M16.6673 9.9974L11.334 4.16406V7.08073C8.66732 7.08073 3.33398 8.83073 3.33398 15.8307C3.33398 14.8582 4.93398 12.9141 11.334 12.9141V15.8307L16.6673 9.9974Z'
                  fill='#009640'
                  stroke='#009640'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
          )}
        </div>
        {width < 1024 || (tab === 'collection' && width >= 1024) ? (
          <div className='grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 mt-4 lg:mt-7 self-start lg:grid-cols-7 lg:gap-0 lg:border lg:border-black'>
            {artworks.map((artwork, index) => (
              <div
                onClick={() => {
                  setSelectedArtwork(artwork)
                  setOpenArtworkDetail(true)
                }}
                key={artwork.id}
                className='rounded-lg overflow-hidden lg:rounded-none [&:hover>div]:flex relative cursor-pointer'>
                <Image
                  src={artwork.story_artwork.display_url}
                  alt=''
                  width={300}
                  height={300}
                  className='w-full aspect-square lg:aspect-[165/116] object-cover'
                />
                {(index == 6 || index == 14 || index == 19 || index == 30) && (
                  <span className='absolute top-0 right-0 w-full h-full p-3'>
                    <Image src={Mark} alt='' className='w-full h-full' />
                  </span>
                )}
                <div className='hidden absolute top-0 right-0 w-full h-full flex-col items-center bg-white gap-1.5 bg-opacity-80 p-3'>
                  <div className='text-lg font-semibold'>
                    {moment.tz(artwork.artwork_topic.date, 'Asia/Ho_Chi_Minh').format('DD-MM')}
                  </div>
                  <div className='text-xs font-medium'>{artwork.artwork_topic.title}</div>
                  <Image
                    src={artwork.artwork_topic.sponser_logo}
                    alt=''
                    width={60}
                    height={60}
                    className='w-[30px] h-[30px] rounded-full object-cover'
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={captureRef}
            className='border divide-y divide-neutral-200 border-black w-full mt-7 text-neutral-black'
            id='artwork-calendar'>
            <div className='w-full grid grid-cols-7 divide-x divide-neutral-200 font-medium text-xl'>
              <div className='p-3 grid place-items-center text-red-500'>S</div>
              <div className='p-3 grid place-items-center'>M</div>
              <div className='p-3 grid place-items-center'>T</div>
              <div className='p-3 grid place-items-center'>W</div>
              <div className='p-3 grid place-items-center'>T</div>
              <div className='p-3 grid place-items-center'>F</div>
              <div className='p-3 grid place-items-center'>S</div>
            </div>
            {[
              ['2024-12-08', '2024-12-09', '2024-12-10', '2024-12-11', '2024-12-12', '2024-12-13', '2024-12-14'],
              ['2024-12-15', '2024-12-16', '2024-12-17', '2024-12-18', '2024-12-19', '2024-12-20', '2024-12-21'],
              ['2024-12-22', '2024-12-23', '2024-12-24', '2024-12-25', '2024-12-26', '2024-12-27', '2024-12-28'],
              ['2024-12-29', '2024-12-30', '2024-12-31', '2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04'],
              ['2025-01-05', '2025-01-06', '2025-01-07', '2025-01-08', '2025-01-09', '2025-01-10', '2025-01-11'],
              ['2025-01-12', '2025-01-13', '2025-01-14', '2025-01-15', '2025-01-16', '2025-01-17', '2025-01-18'],
            ].map((dates, index) => (
              <div className='w-full grid grid-cols-7 divide-x divide-neutral-200 font-medium text-lg' key={index}>
                {dates.map((date, index2) => {
                  const artwork = artworks.find((artwork) => artwork.artwork_topic.date == date)
                  const artworkIndex = artworks.findIndex((artwork) => artwork.artwork_topic.date == date)
                  return (
                    <div key={index2} className='w-full aspect-square cursor-pointer relative'>
                      <div
                        className={`p-3 w-full text-center ${
                          moment
                            .tz(date, 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh')
                            .isBefore(moment.tz('2024-12-14', 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh')) ||
                          moment
                            .tz(date, 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh')
                            .isAfter(moment.tz('2025-01-13', 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh'))
                            ? 'text-gray-400'
                            : moment.tz(date, 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh').day() == 0
                            ? 'text-red-500'
                            : ''
                        }`}>
                        {date == '2025-01-01'
                          ? '01/01'
                          : moment.tz(date, 'YYYY-MM-DD', 'Asia/Ho_Chi_Minh').format('DD')}
                      </div>
                      {artwork && (
                        <div
                          onClick={() => {
                            setSelectedArtwork(artwork)
                            setOpenArtworkDetail(true)
                          }}
                          key={artwork.id}
                          className='rounded-lg overflow-hidden lg:rounded-none [&:hover>div]:flex absolute top-0 right-0 w-full h-full cursor-pointer'>
                          <Image
                            src={artwork.story_artwork.display_url}
                            alt=''
                            width={300}
                            height={300}
                            className='w-full h-full lg:aspect-square object-cover'
                          />
                          {(artworkIndex == 6 || artworkIndex == 14 || artworkIndex == 19 || artworkIndex == 30) && (
                            <span className='absolute top-0 right-0 w-full h-full p-3'>
                              <Image src={Mark} alt='' className='w-full h-full' />
                            </span>
                          )}
                          <div className='hidden absolute top-0 right-0 w-full h-full flex-col items-center bg-white gap-1.5 bg-opacity-80 p-3'>
                            <div className='text-lg font-semibold'>
                              {moment.tz(artwork.artwork_topic.date, 'Asia/Ho_Chi_Minh').format('DD-MM')}
                            </div>
                            <div className='text-xs font-medium'>{artwork.artwork_topic.title}</div>
                            <Image
                              src={artwork.artwork_topic.sponser_logo}
                              alt=''
                              width={60}
                              height={60}
                              className='w-[30px] h-[30px] rounded-full object-cover'
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
      {width >= 768 ? (
        <Modal open={openArtworkDetail} setOpen={setOpenArtworkDetail}>
          <div className='w-screen max-w-screen-2xl relative mx-auto flex items-center gap-4'>
            <div className='absolute top-0 right-5 cursor-pointer'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                onClick={() => setOpenArtworkDetail(false)}>
                <path d='M16 8L8 16M16 16L8 8' stroke='#fff' strokeWidth='1.5' strokeLinecap='round' />
              </svg>
            </div>
            <div
              className='cursor-pointer'
              onClick={() => {
                const index = artworks.findIndex((artwork) => artwork.id == selectedArtwork.id)
                if (index > 0) {
                  setSelectedArtwork(artworks[index - 1])
                }
              }}>
              <svg xmlns='http://www.w3.org/2000/svg' width='46' height='46' viewBox='0 0 46 46' fill='none'>
                <path
                  d='M10.2209 21.2051L30.6915 0.734872C31.1649 0.261039 31.7969 0 32.4709 0C33.1448 0 33.7768 0.261039 34.2503 0.734872L35.7578 2.24201C36.7387 3.22409 36.7387 4.82024 35.7578 5.80081L18.5681 22.9905L35.7768 40.1992C36.2503 40.673 36.5117 41.3047 36.5117 41.9782C36.5117 42.6525 36.2503 43.2842 35.7768 43.7584L34.2693 45.2651C33.7955 45.739 33.1638 46 32.4899 46C31.816 46 31.184 45.739 30.7105 45.2651L10.2209 24.7762C9.74629 24.3009 9.48563 23.6662 9.48713 22.9916C9.48563 22.3143 9.74629 21.68 10.2209 21.2051Z'
                  fill='white'
                />
              </svg>
            </div>
            <div className='bg-[#ffffff] p-8 h-full w-full relative'>
              <ArtworkDetail id={selectedArtwork?.story_artwork?.id} />
            </div>
            <div
              className='cursor-pointer'
              onClick={() => {
                const index = artworks.findIndex((artwork) => artwork.id == selectedArtwork.id)
                if (index < artworks.length - 1) {
                  setSelectedArtwork(artworks[index + 1])
                }
              }}>
              <svg xmlns='http://www.w3.org/2000/svg' width='46' height='46' viewBox='0 0 46 46' fill='none'>
                <path
                  d='M35.7791 21.2051L15.3085 0.734872C14.8351 0.261039 14.2031 0 13.5291 0C12.8552 0 12.2232 0.261039 11.7497 0.734872L10.2422 2.24201C9.26128 3.22409 9.26128 4.82024 10.2422 5.80081L27.4319 22.9905L10.2232 40.1992C9.74969 40.673 9.48828 41.3047 9.48828 41.9782C9.48828 42.6525 9.74969 43.2842 10.2232 43.7584L11.7307 45.2651C12.2045 45.739 12.8362 46 13.5101 46C14.184 46 14.816 45.739 15.2895 45.2651L35.7791 24.7762C36.2537 24.3009 36.5144 23.6662 36.5129 22.9916C36.5144 22.3143 36.2537 21.68 35.7791 21.2051Z'
                  fill='white'
                />
              </svg>
            </div>
          </div>
        </Modal>
      ) : (
        openArtworkDetail && (
          <Modal open={openArtworkDetail} setOpen={setOpenArtworkDetail}>
            <div className='fixed bg-[#ffffff] top-14 left-0 w-screen h-[calc(100dvh-56px)] flex flex-col'>
              <div className='flex-1 overflow-auto p-4'>
                <div className='flex justify-end'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    onClick={() => setOpenArtworkDetail(false)}>
                    <path d='M16 8L8 16M16 16L8 8' stroke='#0B0B0B' strokeWidth='1.5' strokeLinecap='round' />
                  </svg>
                </div>
                <ArtworkDetail id={selectedArtwork?.story_artwork?.id} />
              </div>
            </div>
          </Modal>
        )
      )}
    </>
  )
}
const Base64Image = ({ src, className, ...rest }) => {
  const [data, setData] = useState<string>('')
  const ref = useRef()
  function imageToUri(img, callback) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = function () {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.style.objectFit = 'cover'
      ctx.drawImage(img, 0, 0)

      callback(canvas.toDataURL('image/png'))

      canvas.remove()
    }
  }

  useEffect(() => {
    imageToUri(ref.current, function (uri) {
      setData(uri)
    })
  }, [])
  return (
    <div className='relative'>
      {data && (
        <Image
          src={data}
          alt='image'
          width={400}
          height={400}
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
      )}
      <Image src={src} alt='' crossOrigin='anonymous' className={`${className} relative`} {...rest} ref={ref} />
    </div>
  )
}
