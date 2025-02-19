import HeadComponent from 'components/Head'
import Layout from 'components/Layout'
import Button from 'components/pages/event/literature-infinity/Button'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Mascot4 from 'components/pages/event/literature-infinity/assets/mascot-4.png'
import Image from 'next/image'
import Link from 'next/link'
import { useWindowSize } from 'usehooks-ts'
import { debounce } from 'lodash'
import { contentService } from 'src/services/contentService'
import { useContext, useEffect, useState } from 'react'
import { Context } from 'src/context'
import { toast } from 'react-toastify'
import InfiniteScroll from 'react-infinite-scroll-component'
import Modal from 'components/pages/characters/Modal'
import CharacterDetail from 'components/pages/characters/CharacterDetail'
import Rule from 'components/pages/event/literature-infinity/Rule'
import LazyImage from 'components/Image'
import TextField from 'components/Input/TextField'
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
  const router = useRouter()
  const { width } = useWindowSize()
  const { account } = useContext(Context)
  const [characterList, setCharacterList] = useState([])
  const [offset, setOffset] = useState(0)
  const [remaining, setRemaining] = useState(true)
  const [search, setSearch] = useState('')
  useEffect(() => {
    fetchCharacter()
  }, [])
  const fetchCharacter = async () => {
    try {
      const data = await contentService.character.getCharacters({
        userId: account?.id,
        offset,
        contestId: '6',
        limit: '10000',
        sort: 'Created_At_Desc',
      })
      if (data.data.story_character.length) {
        setCharacterList([...characterList, ...data.data.story_character])
        setOffset(offset + 20)
        setRemaining(true)
      } else {
        setRemaining(false)
      }
    } catch (error) {
      toast(error.message, {
        type: 'error',
      })
    }
  }

  return (
    <div className={`min-h-screen bg-background-bg-primary ${width >= 1280 ? 'pk-container py-10' : ''}`}>
      <div className='sticky top-14 lg:top-20 z-50 bg-background-bg-primary p-4 flex items-center gap-3'>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          onClick={() => router.push('/events/literature-infinity')}>
          <path d='M15 17L10 12L15 7' stroke='#6D6D6D' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
        <div className='text-[#3d3d3d] text-lg font-medium leading-relaxed'>Round 1 - Submit a character</div>
      </div>
      <div className='p-4'>
        <Button className='w-full xl:max-w-80 xl:mx-auto'>
          <Link href={'/events/literature-infinity/round-1/submit'}>Submit character</Link>
        </Button>
        <Rule>
          <div className='text-center xl:max-w-80 xl:mx-auto text-[#5c9efe] text-xs font-medium underline leading-[18px] mt-3'>
            View rules and reward
          </div>
        </Rule>
        <div className='mt-8'>
          <TextField
            defaultValue={search}
            onChange={debounce((v) => setSearch(v.trim()), 1000)}
            className='bg-neutral-100 text-black max-w-lg [&_input::placeholder]:!text-text-quatenary '
            placeholder={'Search by character name'}
          />
          {characterList.length ? (
            <>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 mt-5'>
                {characterList
                  .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
                  .map((character, index) => (
                    <Character key={index} data={character} />
                  ))}
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center gap-4'>
              <Image src={Mascot4} alt='' className='w-40 h-auto mt-12' />
              <div className='text-center text-[#4f4f4f] text-sm font-normal leading-tight'>
                Be the first to submit a character
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
const Character = ({ data }) => {
  const searchParams = new URLSearchParams(window.location.search)
  const [open, setOpen] = useState(searchParams.get('character_id') == data.id)
  const { width } = useWindowSize()
  const router = useRouter()
  useEffect(() => {
    if (open) {
      router.replace(`/events/literature-infinity/round-1?character_id=${data.id}`)
    } else {
      router.replace(`/events/literature-infinity/round-1`)
    }
  }, [open])
  return (
    <>
      <div
        className='relative rounded-lg overflow-hidden [&:hover>div]:block cursor-pointer'
        onClick={() => {
          setOpen(true)
        }}>
        <LazyImage
          src={data.avatar_url}
          width={500}
          height={500}
          alt=''
          className='w-full aspect-square object-cover'
        />
        <div className='absolute hidden w-full bottom-0 p-2 lg:pt-10 lg:p-4 bg-[linear-gradient(180deg,rgba(0,0,0,0.00)_6.71%,#000_76.24%)]'>
          <div className='text-sm font-bold text-white'>{data?.name || 'Unknown artwork title'}</div>
          <div className='text-sm font-medium text-white'>
            by{' '}
            <span className='text-text-brand-hover'>
              {data?.authorizer_user?.creator?.pen_name || data?.authorizer_user?.nickname || 'Unknown creator'}
            </span>
          </div>
        </div>
      </div>
      {width >= 768 ? (
        <Modal open={open} setOpen={setOpen}>
          <div className='w-screen max-w-screen-2xl relative mx-auto flex items-center gap-4'>
            <div className='absolute top-3 right-3 cursor-pointer'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                onClick={() => setOpen(false)}>
                <path d='M16 8L8 16M16 16L8 8' stroke='#fff' stroke-width='1.5' stroke-linecap='round' />
              </svg>
            </div>
            <div className='bg-[#1C1C1C] text-white p-8 h-full w-full'>
              <CharacterDetail id={data.id} />
            </div>
          </div>
        </Modal>
      ) : (
        open && (
          <Modal open={open} setOpen={setOpen}>
            <div className='fixed bg-[#1C1C1C] text-white top-14 left-0 w-screen h-[calc(100dvh-56px)] flex flex-col'>
              <div className='flex-1 overflow-auto p-4'>
                <div className='flex justify-end'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    onClick={() => setOpen(false)}>
                    <path d='M16 8L8 16M16 16L8 8' stroke='#fff' stroke-width='1.5' stroke-linecap='round' />
                  </svg>
                </div>
                <CharacterDetail id={data.id} />
              </div>
            </div>
          </Modal>
        )
      )}
    </>
  )
}
export const getServerSideProps = async (context) => {
  const characterId = context.query.character_id
  if (characterId) {
    const host = context.req.headers.host || context.req.headers.Host
    const res = await fetch(
      host.includes('dev') || host.includes('localhost')
        ? `https://api.dev.punkga.me/story-event/character/get-by-id/${characterId}`
        : host.includes('staging')
        ? `https://api.staging.punkga.me/story-event/character/get-by-id/${characterId}`
        : `https://api.punkga.me/story-event/character/get-by-id/${characterId}`
    )
    const data = await res.json()
    const characterData = data?.data?.story_character_by_pk
    const props = {
      title: characterData?.name || 'Literature Infinity Contest| Win 20M VND with Creative Comics',
      description:
        characterData?.description ||
        'Join the Literature Infinity Contest to celebrate Vietnamese literature and the Year of the Snake!',
      image: characterData?.avatar_url || '/assets/images/literature-infinity-thumb.png',
    }
    return {
      props: {
        metadata: props,
        ...(await serverSideTranslations(context?.locale!, ['common'])),
      },
    }
  }
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
