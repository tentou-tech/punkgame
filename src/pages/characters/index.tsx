import Layout from 'components/Layout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import HeadComponent from '../../components/Head'
import PageContent from './page'

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
      title: characterData?.name || 'PunkgaMe: Colorful Adventures with Unique Characters',
      description:
        characterData?.description ||
        'Explore a colorful world and embark on exciting adventures with unique characters created by talented artists!',
      image: characterData?.avatar_url || '/assets/images/characters-thumbnail.png',
    }
    return {
      props: {
        metadata: props,
        ...(await serverSideTranslations(context?.locale!, ['common'])),
      },
    }
  }
  return {
    props: {
      metadata: {
        title: 'PunkgaMe: Colorful Adventures with Unique Characters',
        description:
          'Explore a colorful world and embark on exciting adventures with unique characters created by talented artists!',
        image: `/assets/images/characters-thumbnail.png`,
      },
      ...(await serverSideTranslations(context?.locale!, ['common'])),
    },
  }
}
