import HeadComponent from 'components/Head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { compose } from 'ramda'
import Comic from './comic'
import withApi from './with-api'
import Layout from 'components/Layout'
const ComposedComic = compose(withApi)(Comic)

export default function Page(props) {
  if (props.justHead || props.pageProps?.justHead) {
    return <HeadComponent data={props.pageProps?.metadata || props.metadata} />
  }
  return (
    <>
      <HeadComponent data={props.pageProps?.metadata || props.metadata} />
      <ComposedComic />
    </>
  )
}
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
export const getServerSideProps = async (context) => {
  if (context.params?.comicSlug) {
    const host = context.req.headers.host || context.req.headers.Host
    const res = await fetch(
      host.includes('dev')
        ? `https://api.dev.punkga.me/manga/${context.params?.comicSlug}`
        : host.includes('staging')
        ? `https://api.staging.punkga.me/manga/${context.params?.comicSlug}`
        : `https://api.punkga.me/manga/${context.params?.comicSlug}`
    )
    const data = await res.json()
    const manga = data?.data?.manga?.[0]
    if (!manga)
      return {
        props: {
          ...(await serverSideTranslations(context?.locale!, ['common'])),
        },
      }
    const props = {
      image: manga.poster,
      title: '',
      description: '',
      canonical: `https://punkga.me/comic/${context.params?.comicSlug}`,
    }
    if (context.locale == 'en') {
      const mangaLanguages =
        manga.manga_languages.find((ml) => ml.language_id == 1) ||
        manga.manga_languages.find((ml) => ml.is_main_language)
      props.title = mangaLanguages?.title
      props.description = mangaLanguages?.description
    } else {
      const mangaLanguages =
        manga.manga_languages.find((ml) => ml.language_id == 2) ||
        manga.manga_languages.find((ml) => ml.is_main_language)
      props.title = mangaLanguages?.title
      props.description = mangaLanguages?.description
    }
    return {
      props: {
        metadata: props,
        ...(await serverSideTranslations(context?.locale!, ['common'])),
      },
    }
  }
}
