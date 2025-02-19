import Button from 'components/core/Button'
import Checkbox from 'components/core/Checkbox'
import Layout from 'components/Layout'
import QuestItem from 'components/pages/available-quests/quest'
import ClamQuestSuccessModal from 'components/pages/campaigns/questItem/claimQuestSuccessModal'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import getConfig from 'next/config'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from 'src/context'
import { ModalContext } from 'src/context/modals'
import { campaignService } from 'src/services/campaignService'
import { userService } from 'src/services/userService'
import useSWR from 'swr'

export default function Page(props) {
  if (props.justHead) {
    return <></>
  }
  return <AvailableQuests />
}
Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
function AvailableQuests() {
  const { account } = useContext(Context)
  const { setSignInOpen } = useContext(ModalContext)
  const [completedQuest, setCompletedQuest] = useState()
  const [openClaimSuccessModal, setClaimSuccessModalOpen] = useState(false)
  const [enrollLoading, setEnrollLoading] = useState(false)
  const config = getConfig()
  const {
    data: authData,
    isLoading,
    mutate,
  } = useSWR(
    {
      key: 'fetch_campaign_auth_data',
      slug: config.DAILY_QUEST_CAMPAIGN_SLUG || 'daily-quest-campaign',
      account: account?.id,
    },
    ({ key, slug, account }) => (account ? campaignService.getCampaignAuthorizedData(slug) : null),
    {
      revalidateOnFocus: false,
    }
  )
  const { data: availableQuests, mutate: availableQuestsMutate } = useSWR(
    { key: 'get_available_quests', account: account?.id },
    ({ account }) => (account ? userService.getAvailableQuests() : null),
    { refreshInterval: 30000 }
  )
  const [rewardNFTChecked, setRewardNFTChecked] = useState(false)
  const enrollHandler = async () => {
    try {
      if (!account) {
        setSignInOpen(true)
      } else {
        setEnrollLoading(true)
        const res = await campaignService.enrollCampaign(authData.id)
        await mutate()
        await availableQuestsMutate()
        if (res?.errors?.message) {
          toast(res?.errors?.message, {
            type: 'error',
          })
          console.error(res?.errors?.message)
          setEnrollLoading(false)
          return
        }
        toast(`Enroll successful`, {
          type: 'success',
        })
        setEnrollLoading(false)
      }
    } catch (error) {
      mutate()
      setEnrollLoading(false)
      toast(`Enroll failed`, {
        type: 'error',
      })
      console.error(error)
    }
  }

  const isEnrolled = !!authData?.campaignQuests
  return (
    <div className='bg-background p-4 text-white min-h-screen'>
      <div className='flex items-center justify-between'>
        <div className='text-xl font-medium'>Available quests</div>
        <Link href={'/campaigns'} className='flex items-center text-xs font-semibold'>
          View campaign list
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M10 7L15 12L10 17' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </Link>
      </div>

      {isLoading ? (
        <></>
      ) : isEnrolled ? (
        <div className='mt-3'>
          <Checkbox
            label={'Reward NFT'}
            checked={rewardNFTChecked}
            onClick={() => setRewardNFTChecked(!rewardNFTChecked)}
          />
          <div className='mt-4 space-y-4'>
            {availableQuests?.map((quest, index) => (
              <QuestItem
                key={quest.id}
                quest={quest}
                refreshCallback={async (status) => {
                  setCompletedQuest(quest)
                  await availableQuestsMutate()
                  if (status == 'SUCCEEDED') setClaimSuccessModalOpen(true)
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-8 mt-16'>
          <div className='max-w-64 text-sm font-medium text-text-quatenary'>
            Daily Quest offers you a new creative challenge every day. Complete quests to earn rewards and share your
            progress with the community
          </div>
          <Button size='sm' className='min-w-32' onClick={enrollHandler} loading={enrollLoading}>
            Get Started
          </Button>
        </div>
      )}
      {completedQuest && (
        <ClamQuestSuccessModal
          openClaimSuccessModal={openClaimSuccessModal}
          setClaimSuccessModalOpen={setClaimSuccessModalOpen}
          quest={completedQuest}
        />
      )}
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})
