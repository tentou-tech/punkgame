import HeadComponent from 'components/Head'
import Layout from 'components/Layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Banner from 'components/pages/event/literature-infinity/assets/banner.png'
import BannerDesktop from 'components/pages/event/literature-infinity/assets/banner-desktop.png'
import Image from 'next/image'
import Mascot from 'components/pages/event/literature-infinity/assets/mascot-1.png'
import Mascot2 from 'components/pages/event/literature-infinity/assets/mascot-2.png'
import Mascot3 from 'components/pages/event/literature-infinity/assets/mascot-3.png'
import Lixi from 'components/pages/event/literature-infinity/assets/li-xi.png'
import Link from 'next/link'
import moment from 'moment'
import Button from 'components/pages/event/literature-infinity/Button'
import { useWindowSize } from 'usehooks-ts'
import Rule from 'components/pages/event/literature-infinity/Rule'
export default function Page(props) {
  if (props.justHead || props.pageProps?.justHead) {
    return <HeadComponent data={props.pageProps?.metadata || props.metadata} />
  }
  return (
    <>
      <HeadComponent data={props.pageProps?.metadata || props.metadata} />
      <PageContent />
    </>
  )
}
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

const PageContent = () => {
  const { width } = useWindowSize()
  if (width >= 1024) {
    return (
      <div className='min-h-screen bg-background-bg-primary relative'>
        <Image src={BannerDesktop} alt='' className='w-screen h-auto' />
        <div className='pk-container py-4 grid min-[1490px]:grid-cols-[65%_auto] gap-8'>
          <div className='gap-4 flex justify-between flex-col h-full'>
            <div>
              <div className='text-xl font-medium flex items-center gap-1.5'>
                Literature Infinity
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  onClick={() => {
                    navigator.share({
                      url: window.location.href,
                    })
                  }}>
                  <path
                    d='M17.3032 8.32119C18.7726 8.32119 19.9638 7.13 19.9638 5.6606C19.9638 4.19119 18.7726 3 17.3032 3C15.8338 3 14.6426 4.19119 14.6426 5.6606C14.6426 7.13 15.8338 8.32119 17.3032 8.32119Z'
                    stroke='#0B0B0B'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M6.6606 14.5302C8.13 14.5302 9.32119 13.339 9.32119 11.8696C9.32119 10.4002 8.13 9.20898 6.6606 9.20898C5.19119 9.20898 4 10.4002 4 11.8696C4 13.339 5.19119 14.5302 6.6606 14.5302Z'
                    stroke='#0B0B0B'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M17.3032 20.7372C18.7726 20.7372 19.9638 19.546 19.9638 18.0766C19.9638 16.6072 18.7726 15.416 17.3032 15.416C15.8338 15.416 14.6426 16.6072 14.6426 18.0766C14.6426 19.546 15.8338 20.7372 17.3032 20.7372Z'
                    stroke='#0B0B0B'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M8.95801 13.207L15.0153 16.7368'
                    stroke='#0B0B0B'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M15.0064 7L8.95801 10.5297'
                    stroke='#0B0B0B'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <div className='text-sm text-text-primary font-medium flex gap-2.5 mt-1.5 flex-row items-center'>
                <div>Starts at: Jan 25, 2025</div>
                <span className='w-1 h-1 rounded-full bg-[#646464] inline-block'></span>
                <div>Ends at: Feb 23, 2025</div>
              </div>
              <div className='mt-4 text-sm text-text-teriary'>
                Embark on a journey through two rounds of literary challenges, with additional side events and quests to
                spark your creativity. Unleash your artistic interpretation of storytelling and earn rewards along the
                way!
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <Link
                href='/events/literature-infinity/round-1'
                className='w-full rounded-2xl p-4 bg-white flex items-center gap-3 shadow-xl'>
                <Image src={Mascot} alt='' className='w-[86px] h-auto' />
                <div className='space-y-1.5 flex-1'>
                  <div className='text-text-primary font-bold text-lg'>Round 1: OC Design</div>
                  <div className='text-text-secondary text-sm'>
                    Introduce a character that begins your story journey.
                  </div>
                  <div className='flex gap-1.5 items-center text-text-secondary text-xs'>
                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='22' viewBox='0 0 20 22' fill='none'>
                      <mask id='path-1-inside-1_9114_59397' fill='white'>
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M9.97024 21.0853C12.7814 21.0853 15.0686 18.8422 15.1397 16.0482C17.8505 15.887 19.9991 13.6375 19.9991 10.8863C19.9991 8.151 17.8754 5.91175 15.187 5.72734C15.0022 3.03926 12.7631 0.916016 10.0281 0.916016C7.21699 0.916016 4.92975 3.15914 4.85865 5.95315C2.14821 6.11473 0 8.36402 0 11.115C0 13.8501 2.12327 16.0892 4.81137 16.2739C4.99613 18.962 7.23523 21.0853 9.97024 21.0853ZM10.1023 8.13124L7.20396 11.0296L10.1023 13.928L13.0007 11.0296L10.1023 8.13124Z'
                        />
                      </mask>
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M9.97024 21.0853C12.7814 21.0853 15.0686 18.8422 15.1397 16.0482C17.8505 15.887 19.9991 13.6375 19.9991 10.8863C19.9991 8.151 17.8754 5.91175 15.187 5.72734C15.0022 3.03926 12.7631 0.916016 10.0281 0.916016C7.21699 0.916016 4.92975 3.15914 4.85865 5.95315C2.14821 6.11473 0 8.36402 0 11.115C0 13.8501 2.12327 16.0892 4.81137 16.2739C4.99613 18.962 7.23523 21.0853 9.97024 21.0853ZM10.1023 8.13124L7.20396 11.0296L10.1023 13.928L13.0007 11.0296L10.1023 8.13124Z'
                        fill='#5F6A4E'
                      />
                      <path
                        d='M15.1397 16.0482L15.0507 14.5508L13.6753 14.6327L13.6402 16.01L15.1397 16.0482ZM19.9991 10.8863L21.4991 10.8863V10.8863H19.9991ZM15.187 5.72734L13.6905 5.83021L13.7802 7.13437L15.0844 7.22382L15.187 5.72734ZM4.85865 5.95315L4.94791 7.45049L6.32312 7.36851L6.35816 5.99131L4.85865 5.95315ZM4.81137 16.2739L6.30784 16.1711L6.21822 14.8671L4.91423 14.7774L4.81137 16.2739ZM7.20396 11.0296L6.1433 9.96894L5.08264 11.0296L6.1433 12.0903L7.20396 11.0296ZM10.1023 8.13124L11.163 7.07058L10.1023 6.00992L9.04167 7.07058L10.1023 8.13124ZM10.1023 13.928L9.04167 14.9886L10.1023 16.0493L11.163 14.9886L10.1023 13.928ZM13.0007 11.0296L14.0613 12.0903L15.122 11.0296L14.0613 9.96894L13.0007 11.0296ZM13.6402 16.01C13.5897 17.9928 11.9657 19.5853 9.97024 19.5853V22.5853C13.597 22.5853 16.5475 19.6916 16.6392 16.0864L13.6402 16.01ZM18.4991 10.8863C18.4991 12.8389 16.9738 14.4365 15.0507 14.5508L15.2288 17.5456C18.7272 17.3375 21.4991 14.4361 21.4991 10.8863L18.4991 10.8863ZM15.0844 7.22382C16.9915 7.35464 18.4991 8.94503 18.4991 10.8863H21.4991C21.4991 7.35697 18.7594 4.46886 15.2897 4.23086L15.0844 7.22382ZM10.0281 2.41602C11.9692 2.41602 13.5595 3.92332 13.6905 5.83021L16.6835 5.62448C16.445 2.1552 13.5571 -0.583984 10.0281 -0.583984V2.41602ZM6.35816 5.99131C6.40862 4.00851 8.03264 2.41602 10.0281 2.41602V-0.583984C6.40134 -0.583984 3.45088 2.30977 3.35913 5.91499L6.35816 5.99131ZM1.5 11.115C1.5 9.16254 3.02505 7.56512 4.94791 7.45049L4.76938 4.45581C1.27136 4.66434 -1.5 7.5655 -1.5 11.115H1.5ZM4.91423 14.7774C3.00732 14.6464 1.5 13.0561 1.5 11.115H-1.5C-1.5 14.644 1.23922 17.5319 4.70852 17.7704L4.91423 14.7774ZM9.97024 19.5853C8.02919 19.5853 6.4389 18.078 6.30784 16.1711L3.3149 16.3768C3.55335 19.8461 6.44126 22.5853 9.97024 22.5853V19.5853ZM8.26462 12.0903L11.163 9.1919L9.04167 7.07058L6.1433 9.96894L8.26462 12.0903ZM11.163 12.8673L8.26462 9.96894L6.1433 12.0903L9.04167 14.9886L11.163 12.8673ZM11.94 9.96894L9.04167 12.8673L11.163 14.9886L14.0613 12.0903L11.94 9.96894ZM9.04167 9.1919L11.94 12.0903L14.0613 9.96894L11.163 7.07058L9.04167 9.1919Z'
                        fill='#D7D39B'
                        mask='url(#path-1-inside-1_9114_59397)'
                      />
                    </svg>
                    Start: 25/1 - 2/2
                  </div>
                </div>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                  <path
                    d='M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z'
                    fill='#30C49D'
                  />
                  <path
                    d='M8.87444 5.823L12.189 9.8005L8.87444 13.778M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z'
                    stroke='white'
                    strokeWidth='1.25824'
                  />
                </svg>
              </Link>
              <Link
                href='/events/literature-infinity/round-2'
                className={`w-full rounded-2xl p-4 flex items-center gap-3 shadow-xl bg-white`}>
                <Image src={Mascot2} alt='' className='w-[86px] h-auto' />
                <div className='space-y-1.5 flex-1'>
                  <div className='text-text-primary font-bold text-lg'>Round 2: One-shot comics</div>
                  <div className='text-text-secondary text-sm'>Craft a manga to expand your infinite universe.</div>
                  <div className='flex gap-1.5 items-center text-text-secondary text-xs'>
                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='22' viewBox='0 0 20 22' fill='none'>
                      <mask id='path-1-inside-1_9114_59397' fill='white'>
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M9.97024 21.0853C12.7814 21.0853 15.0686 18.8422 15.1397 16.0482C17.8505 15.887 19.9991 13.6375 19.9991 10.8863C19.9991 8.151 17.8754 5.91175 15.187 5.72734C15.0022 3.03926 12.7631 0.916016 10.0281 0.916016C7.21699 0.916016 4.92975 3.15914 4.85865 5.95315C2.14821 6.11473 0 8.36402 0 11.115C0 13.8501 2.12327 16.0892 4.81137 16.2739C4.99613 18.962 7.23523 21.0853 9.97024 21.0853ZM10.1023 8.13124L7.20396 11.0296L10.1023 13.928L13.0007 11.0296L10.1023 8.13124Z'
                        />
                      </mask>
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M9.97024 21.0853C12.7814 21.0853 15.0686 18.8422 15.1397 16.0482C17.8505 15.887 19.9991 13.6375 19.9991 10.8863C19.9991 8.151 17.8754 5.91175 15.187 5.72734C15.0022 3.03926 12.7631 0.916016 10.0281 0.916016C7.21699 0.916016 4.92975 3.15914 4.85865 5.95315C2.14821 6.11473 0 8.36402 0 11.115C0 13.8501 2.12327 16.0892 4.81137 16.2739C4.99613 18.962 7.23523 21.0853 9.97024 21.0853ZM10.1023 8.13124L7.20396 11.0296L10.1023 13.928L13.0007 11.0296L10.1023 8.13124Z'
                        fill='#5F6A4E'
                      />
                      <path
                        d='M15.1397 16.0482L15.0507 14.5508L13.6753 14.6327L13.6402 16.01L15.1397 16.0482ZM19.9991 10.8863L21.4991 10.8863V10.8863H19.9991ZM15.187 5.72734L13.6905 5.83021L13.7802 7.13437L15.0844 7.22382L15.187 5.72734ZM4.85865 5.95315L4.94791 7.45049L6.32312 7.36851L6.35816 5.99131L4.85865 5.95315ZM4.81137 16.2739L6.30784 16.1711L6.21822 14.8671L4.91423 14.7774L4.81137 16.2739ZM7.20396 11.0296L6.1433 9.96894L5.08264 11.0296L6.1433 12.0903L7.20396 11.0296ZM10.1023 8.13124L11.163 7.07058L10.1023 6.00992L9.04167 7.07058L10.1023 8.13124ZM10.1023 13.928L9.04167 14.9886L10.1023 16.0493L11.163 14.9886L10.1023 13.928ZM13.0007 11.0296L14.0613 12.0903L15.122 11.0296L14.0613 9.96894L13.0007 11.0296ZM13.6402 16.01C13.5897 17.9928 11.9657 19.5853 9.97024 19.5853V22.5853C13.597 22.5853 16.5475 19.6916 16.6392 16.0864L13.6402 16.01ZM18.4991 10.8863C18.4991 12.8389 16.9738 14.4365 15.0507 14.5508L15.2288 17.5456C18.7272 17.3375 21.4991 14.4361 21.4991 10.8863L18.4991 10.8863ZM15.0844 7.22382C16.9915 7.35464 18.4991 8.94503 18.4991 10.8863H21.4991C21.4991 7.35697 18.7594 4.46886 15.2897 4.23086L15.0844 7.22382ZM10.0281 2.41602C11.9692 2.41602 13.5595 3.92332 13.6905 5.83021L16.6835 5.62448C16.445 2.1552 13.5571 -0.583984 10.0281 -0.583984V2.41602ZM6.35816 5.99131C6.40862 4.00851 8.03264 2.41602 10.0281 2.41602V-0.583984C6.40134 -0.583984 3.45088 2.30977 3.35913 5.91499L6.35816 5.99131ZM1.5 11.115C1.5 9.16254 3.02505 7.56512 4.94791 7.45049L4.76938 4.45581C1.27136 4.66434 -1.5 7.5655 -1.5 11.115H1.5ZM4.91423 14.7774C3.00732 14.6464 1.5 13.0561 1.5 11.115H-1.5C-1.5 14.644 1.23922 17.5319 4.70852 17.7704L4.91423 14.7774ZM9.97024 19.5853C8.02919 19.5853 6.4389 18.078 6.30784 16.1711L3.3149 16.3768C3.55335 19.8461 6.44126 22.5853 9.97024 22.5853V19.5853ZM8.26462 12.0903L11.163 9.1919L9.04167 7.07058L6.1433 9.96894L8.26462 12.0903ZM11.163 12.8673L8.26462 9.96894L6.1433 12.0903L9.04167 14.9886L11.163 12.8673ZM11.94 9.96894L9.04167 12.8673L11.163 14.9886L14.0613 12.0903L11.94 9.96894ZM9.04167 9.1919L11.94 12.0903L14.0613 9.96894L11.163 7.07058L9.04167 9.1919Z'
                        fill='#D7D39B'
                        mask='url(#path-1-inside-1_9114_59397)'
                      />
                    </svg>
                    Start: 3/2 - 23/3
                  </div>
                </div>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
                  <path
                    d='M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z'
                    fill='#30C49D'
                  />
                  <path
                    d='M8.87444 5.823L12.189 9.8005L8.87444 13.778M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z'
                    stroke='white'
                    strokeWidth='1.25824'
                  />
                </svg>
              </Link>
            </div>
          </div>
          <div>
            <Rule>
              <button className='w-full h-10 p-2.5 bg-[#2fc39c] rounded-[10px] border border-[#e3ffe9] justify-center items-center inline-flex overflow-hidden'>
                <div className='px-1 justify-center items-center gap-2.5 flex'>
                  <div className='text-center text-white text-sm font-semibold leading-tight'>View rule</div>
                </div>
              </button>
            </Rule>
            <div className='mt-8'>
              <div className='text-[#3d3d3d] text-lg font-medium leading-relaxed'>Event</div>
              <div className='mt-4 grid grid-cols-2 gap-8'>
                <div className='p-4 rounded-lg flex flex-col items-center bg-white'>
                  <Image src={Lixi} alt='' className='h-24 -mt-7' />
                  <div className='space-y-2 text-center mt-2 font-bold font-ibmplex'>
                    <div className='text-xs leading-none'>The year of snake’s</div>
                    <div className='text-lg leading-none uppercase'>Li Xi of Fortune</div>
                  </div>
                  <div className='text-xs text-text-secondary mt-3 text-center'>
                    Open your Li Xi to reveal surprise rewards inside!
                  </div>
                  <Button className='mt-3'>
                    <Link href={'/events/li-xi'}>Open Your LiXi</Link>
                  </Button>
                </div>
                <div className='p-4 rounded-lg flex flex-col items-center bg-white'>
                  <Image src={Mascot3} alt='' className='h-24 -mt-7' />
                  <div className='space-y-2 text-center mt-2 font-bold font-ibmplex'>
                    <div className='text-xs leading-none'>LUCKY</div>
                    <div className='text-lg leading-none'>QUEST</div>
                  </div>
                  <div className='text-xs text-text-secondary mt-3 text-center'>
                    A series of mini-challenges to earn extra rewards!
                  </div>
                  <Button className='mt-3'>
                    <Link href={'/campaigns'}>Go to Quest</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='min-h-screen bg-background-bg-primary relative'>
      <div className='absolute top-4 right-4 flex gap-1.5'>
        <Rule>
          <button className='text-xs font-medium bg-[#30C49D] border border-[#E4FFEA] rounded-md py-0.5 px-2.5 text-white'>
            View Rule
          </button>
        </Rule>
        <button
          onClick={() => {
            navigator.share({
              url: window.location.href,
            })
          }}
          className='text-xs font-medium bg-[#30C49D] border border-[#E4FFEA] rounded-md h-6 aspect-square grid place-items-center text-white'>
          <svg xmlns='http://www.w3.org/2000/svg' width='12' height='10' viewBox='0 0 12 10' fill='none'>
            <path d='M12 5L7.2 0V2.5C4.8 2.5 0 4 0 10C0 9.16643 1.44 7.5 7.2 7.5V10L12 5Z' fill='white' />
          </svg>
        </button>
      </div>
      <Image src={Banner} alt='' className='w-full h-auto' />
      <div className='-mt-16 p-4'>
        <div className='flex flex-col gap-4'>
          <Link
            href='/events/literature-infinity/round-1'
            className='w-full rounded-2xl p-4 bg-white flex items-center gap-3 shadow-xl'>
            <Image src={Mascot} alt='' className='w-20 h-auto' />
            <div className='space-y-1.5 flex-1'>
              <div className='text-text-primary font-bold text-lg'>ROUND 1</div>
              <div className='text-text-secondary text-sm'>Submit a character</div>
              <div className='flex gap-1.5 items-center text-text-secondary text-xs'>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='22' viewBox='0 0 20 22' fill='none'>
                  <mask id='path-1-inside-1_9114_59397' fill='white'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M9.97024 21.0853C12.7814 21.0853 15.0686 18.8422 15.1397 16.0482C17.8505 15.887 19.9991 13.6375 19.9991 10.8863C19.9991 8.151 17.8754 5.91175 15.187 5.72734C15.0022 3.03926 12.7631 0.916016 10.0281 0.916016C7.21699 0.916016 4.92975 3.15914 4.85865 5.95315C2.14821 6.11473 0 8.36402 0 11.115C0 13.8501 2.12327 16.0892 4.81137 16.2739C4.99613 18.962 7.23523 21.0853 9.97024 21.0853ZM10.1023 8.13124L7.20396 11.0296L10.1023 13.928L13.0007 11.0296L10.1023 8.13124Z'
                    />
                  </mask>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M9.97024 21.0853C12.7814 21.0853 15.0686 18.8422 15.1397 16.0482C17.8505 15.887 19.9991 13.6375 19.9991 10.8863C19.9991 8.151 17.8754 5.91175 15.187 5.72734C15.0022 3.03926 12.7631 0.916016 10.0281 0.916016C7.21699 0.916016 4.92975 3.15914 4.85865 5.95315C2.14821 6.11473 0 8.36402 0 11.115C0 13.8501 2.12327 16.0892 4.81137 16.2739C4.99613 18.962 7.23523 21.0853 9.97024 21.0853ZM10.1023 8.13124L7.20396 11.0296L10.1023 13.928L13.0007 11.0296L10.1023 8.13124Z'
                    fill='#5F6A4E'
                  />
                  <path
                    d='M15.1397 16.0482L15.0507 14.5508L13.6753 14.6327L13.6402 16.01L15.1397 16.0482ZM19.9991 10.8863L21.4991 10.8863V10.8863H19.9991ZM15.187 5.72734L13.6905 5.83021L13.7802 7.13437L15.0844 7.22382L15.187 5.72734ZM4.85865 5.95315L4.94791 7.45049L6.32312 7.36851L6.35816 5.99131L4.85865 5.95315ZM4.81137 16.2739L6.30784 16.1711L6.21822 14.8671L4.91423 14.7774L4.81137 16.2739ZM7.20396 11.0296L6.1433 9.96894L5.08264 11.0296L6.1433 12.0903L7.20396 11.0296ZM10.1023 8.13124L11.163 7.07058L10.1023 6.00992L9.04167 7.07058L10.1023 8.13124ZM10.1023 13.928L9.04167 14.9886L10.1023 16.0493L11.163 14.9886L10.1023 13.928ZM13.0007 11.0296L14.0613 12.0903L15.122 11.0296L14.0613 9.96894L13.0007 11.0296ZM13.6402 16.01C13.5897 17.9928 11.9657 19.5853 9.97024 19.5853V22.5853C13.597 22.5853 16.5475 19.6916 16.6392 16.0864L13.6402 16.01ZM18.4991 10.8863C18.4991 12.8389 16.9738 14.4365 15.0507 14.5508L15.2288 17.5456C18.7272 17.3375 21.4991 14.4361 21.4991 10.8863L18.4991 10.8863ZM15.0844 7.22382C16.9915 7.35464 18.4991 8.94503 18.4991 10.8863H21.4991C21.4991 7.35697 18.7594 4.46886 15.2897 4.23086L15.0844 7.22382ZM10.0281 2.41602C11.9692 2.41602 13.5595 3.92332 13.6905 5.83021L16.6835 5.62448C16.445 2.1552 13.5571 -0.583984 10.0281 -0.583984V2.41602ZM6.35816 5.99131C6.40862 4.00851 8.03264 2.41602 10.0281 2.41602V-0.583984C6.40134 -0.583984 3.45088 2.30977 3.35913 5.91499L6.35816 5.99131ZM1.5 11.115C1.5 9.16254 3.02505 7.56512 4.94791 7.45049L4.76938 4.45581C1.27136 4.66434 -1.5 7.5655 -1.5 11.115H1.5ZM4.91423 14.7774C3.00732 14.6464 1.5 13.0561 1.5 11.115H-1.5C-1.5 14.644 1.23922 17.5319 4.70852 17.7704L4.91423 14.7774ZM9.97024 19.5853C8.02919 19.5853 6.4389 18.078 6.30784 16.1711L3.3149 16.3768C3.55335 19.8461 6.44126 22.5853 9.97024 22.5853V19.5853ZM8.26462 12.0903L11.163 9.1919L9.04167 7.07058L6.1433 9.96894L8.26462 12.0903ZM11.163 12.8673L8.26462 9.96894L6.1433 12.0903L9.04167 14.9886L11.163 12.8673ZM11.94 9.96894L9.04167 12.8673L11.163 14.9886L14.0613 12.0903L11.94 9.96894ZM9.04167 9.1919L11.94 12.0903L14.0613 9.96894L11.163 7.07058L9.04167 9.1919Z'
                    fill='#D7D39B'
                    mask='url(#path-1-inside-1_9114_59397)'
                  />
                </svg>
                Start: 25/1 - 2/2
              </div>
            </div>
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path
                d='M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z'
                fill='#30C49D'
              />
              <path
                d='M8.87444 5.823L12.189 9.8005L8.87444 13.778M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z'
                stroke='white'
                strokeWidth='1.25824'
              />
            </svg>
          </Link>
          <Link
            href='/events/literature-infinity/round-2'
            className={`w-full rounded-2xl p-4 flex items-center gap-3 shadow-xl bg-white`}>
            <Image src={Mascot2} alt='' className='w-20 h-auto' />
            <div className='space-y-1.5 flex-1'>
              <div className='text-text-primary font-bold text-lg'>ROUND 2</div>
              <div className='text-text-secondary text-sm'>Submit Manga</div>
              <div className='flex gap-1.5 items-center text-text-secondary text-xs'>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='22' viewBox='0 0 20 22' fill='none'>
                  <mask id='path-1-inside-1_9114_59397' fill='white'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M9.97024 21.0853C12.7814 21.0853 15.0686 18.8422 15.1397 16.0482C17.8505 15.887 19.9991 13.6375 19.9991 10.8863C19.9991 8.151 17.8754 5.91175 15.187 5.72734C15.0022 3.03926 12.7631 0.916016 10.0281 0.916016C7.21699 0.916016 4.92975 3.15914 4.85865 5.95315C2.14821 6.11473 0 8.36402 0 11.115C0 13.8501 2.12327 16.0892 4.81137 16.2739C4.99613 18.962 7.23523 21.0853 9.97024 21.0853ZM10.1023 8.13124L7.20396 11.0296L10.1023 13.928L13.0007 11.0296L10.1023 8.13124Z'
                    />
                  </mask>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M9.97024 21.0853C12.7814 21.0853 15.0686 18.8422 15.1397 16.0482C17.8505 15.887 19.9991 13.6375 19.9991 10.8863C19.9991 8.151 17.8754 5.91175 15.187 5.72734C15.0022 3.03926 12.7631 0.916016 10.0281 0.916016C7.21699 0.916016 4.92975 3.15914 4.85865 5.95315C2.14821 6.11473 0 8.36402 0 11.115C0 13.8501 2.12327 16.0892 4.81137 16.2739C4.99613 18.962 7.23523 21.0853 9.97024 21.0853ZM10.1023 8.13124L7.20396 11.0296L10.1023 13.928L13.0007 11.0296L10.1023 8.13124Z'
                    fill='#5F6A4E'
                  />
                  <path
                    d='M15.1397 16.0482L15.0507 14.5508L13.6753 14.6327L13.6402 16.01L15.1397 16.0482ZM19.9991 10.8863L21.4991 10.8863V10.8863H19.9991ZM15.187 5.72734L13.6905 5.83021L13.7802 7.13437L15.0844 7.22382L15.187 5.72734ZM4.85865 5.95315L4.94791 7.45049L6.32312 7.36851L6.35816 5.99131L4.85865 5.95315ZM4.81137 16.2739L6.30784 16.1711L6.21822 14.8671L4.91423 14.7774L4.81137 16.2739ZM7.20396 11.0296L6.1433 9.96894L5.08264 11.0296L6.1433 12.0903L7.20396 11.0296ZM10.1023 8.13124L11.163 7.07058L10.1023 6.00992L9.04167 7.07058L10.1023 8.13124ZM10.1023 13.928L9.04167 14.9886L10.1023 16.0493L11.163 14.9886L10.1023 13.928ZM13.0007 11.0296L14.0613 12.0903L15.122 11.0296L14.0613 9.96894L13.0007 11.0296ZM13.6402 16.01C13.5897 17.9928 11.9657 19.5853 9.97024 19.5853V22.5853C13.597 22.5853 16.5475 19.6916 16.6392 16.0864L13.6402 16.01ZM18.4991 10.8863C18.4991 12.8389 16.9738 14.4365 15.0507 14.5508L15.2288 17.5456C18.7272 17.3375 21.4991 14.4361 21.4991 10.8863L18.4991 10.8863ZM15.0844 7.22382C16.9915 7.35464 18.4991 8.94503 18.4991 10.8863H21.4991C21.4991 7.35697 18.7594 4.46886 15.2897 4.23086L15.0844 7.22382ZM10.0281 2.41602C11.9692 2.41602 13.5595 3.92332 13.6905 5.83021L16.6835 5.62448C16.445 2.1552 13.5571 -0.583984 10.0281 -0.583984V2.41602ZM6.35816 5.99131C6.40862 4.00851 8.03264 2.41602 10.0281 2.41602V-0.583984C6.40134 -0.583984 3.45088 2.30977 3.35913 5.91499L6.35816 5.99131ZM1.5 11.115C1.5 9.16254 3.02505 7.56512 4.94791 7.45049L4.76938 4.45581C1.27136 4.66434 -1.5 7.5655 -1.5 11.115H1.5ZM4.91423 14.7774C3.00732 14.6464 1.5 13.0561 1.5 11.115H-1.5C-1.5 14.644 1.23922 17.5319 4.70852 17.7704L4.91423 14.7774ZM9.97024 19.5853C8.02919 19.5853 6.4389 18.078 6.30784 16.1711L3.3149 16.3768C3.55335 19.8461 6.44126 22.5853 9.97024 22.5853V19.5853ZM8.26462 12.0903L11.163 9.1919L9.04167 7.07058L6.1433 9.96894L8.26462 12.0903ZM11.163 12.8673L8.26462 9.96894L6.1433 12.0903L9.04167 14.9886L11.163 12.8673ZM11.94 9.96894L9.04167 12.8673L11.163 14.9886L14.0613 12.0903L11.94 9.96894ZM9.04167 9.1919L11.94 12.0903L14.0613 9.96894L11.163 7.07058L9.04167 9.1919Z'
                    fill='#D7D39B'
                    mask='url(#path-1-inside-1_9114_59397)'
                  />
                </svg>
                Start: 3/2 - 23/3
              </div>
            </div>
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'>
              <path
                d='M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z'
                fill='#30C49D'
              />
              <path
                d='M8.87444 5.823L12.189 9.8005L8.87444 13.778M10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z'
                stroke='white'
                strokeWidth='1.25824'
              />
            </svg>
          </Link>
        </div>
        <div className='mt-4'>
          <div className='text-text-primary font-medium text-lg ml-2'>Event</div>
          <div className='mt-3 grid min-[425px]:grid-cols-2 gap-4'>
            <div className='p-4 rounded-lg flex flex-col items-center bg-white'>
              <Image src={Lixi} alt='' className='w-28 h-auto -mt-7' />
              <div className='space-y-2 text-center mt-2 font-bold font-ibmplex'>
                <div className='text-xs leading-none'>The year of snake’s</div>
                <div className='text-lg leading-none'>EVENT</div>
              </div>
              <div className='text-xs text-text-secondary mt-3 text-center'>
                Open your Li Xi to reveal surprise rewards inside!
              </div>
              <Button className='mt-3'>
                <Link href={'/events/li-xi'}>Open Your LiXi</Link>
              </Button>
            </div>
            <div className='p-4 rounded-lg flex flex-col items-center bg-white'>
              <Image src={Mascot3} alt='' className='w-28 h-auto -mt-7' />
              <div className='space-y-2 text-center mt-2 font-bold font-ibmplex'>
                <div className='text-xs leading-none'>LUCKY</div>
                <div className='text-lg leading-none'>QUEST</div>
              </div>
              <div className='text-xs text-text-secondary mt-3 text-center'>
                A series of mini-challenges to earn extra rewards!
              </div>
              <Button className='mt-3'>
                <Link href={'/campaigns'}>Go to Quest</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const props = {
    title: 'Literature Infinity Contest| Win 20M VND with Creative Comics',
    description: 'Join the Literature Infinity Contest to celebrate Vietnamese literature and the Year of the Snake!',
    image: '/assets/images/literature-infinity-thumb.png',
  }
  return {
    props: {
      metadata: props,
      ...(await serverSideTranslations(context?.locale!, ['common'])),
    },
  }
}
