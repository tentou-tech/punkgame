import LIXI from '../assets/LIXI.png'
import Year from '../assets/2025.png'
import Mai from '../assets/mai.png'
import lixi1 from '../assets/lixi1.png'
import podium from '../assets/podium.png'
import star_bg from '../assets/star_bg.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import CountdownTimer from '../components/CountdownTimer'
import getConfig from 'next/config'
import moment from 'moment'

export default function ComingSoon() {
  const { locale } = useRouter()
  const { t } = useTranslation()
  const config = getConfig()
  const router = useRouter()

  return (
    <div
      style={{
        backgroundImage: `url(${star_bg.src})`,
        backgroundSize: '100% auto',
        backgroundRepeat: 'no-repeat',
      }}
      className='bg-[#860204] h-screen w-screen flex flex-col pt-20 items-center'>
      <div
        className='absolute top-0 left-0 z-50  p-4 flex items-center gap-3 cursor-pointer'
        onClick={() => router.push('/events')}>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M15 17L10 12L15 7' stroke='#fff' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
        <div className='text-white text-lg font-medium leading-relaxed'>Event List</div>
      </div>
      <div className='first-section relative'>
        <Image src={Year} className='relative w-[calc(100vw-20px)] md:w-[384px] z-10' alt='' />
        <Image
          src={LIXI}
          className='absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] w-[120px]'
          alt=''
        />
        <Image
          src={Mai}
          className='absolute bottom-14 -right-2 md:bottom-10  md:-right-16 z-[1] w-[100px] md:w-[168px]'
          alt=''
        />
        <Image src={lixi1} className='absolute bottom-2 left-0  z-[1] w-[70px]' alt='' />
      </div>
      <div className='second-section relative md:w-[500px] flex flex-col justify-center items-center'>
        <Image
          src={podium}
          className='absolute top-6 left-1/2 -translate-x-1/2 -translate-y-1/4 z-[1] w-[calc(100vw-40px)] md:w-[384px]'
          alt=''
        />
        <div className='relative z-10'>
          <CountdownTimer targetDate={config.EVENT_START || '2025-01-31T00:00:00'} />
        </div>{' '}
        <div className='relative z-10 text-[#FABA77] text-center'>
          Unwrap your blessings at 10:00 UTC+7, January 31st, 2025
        </div>
      </div>
    </div>
  )
}
