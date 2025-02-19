import Button from 'components/core/Button'
import Checkbox from 'components/core/Checkbox'
import Layout from 'components/Layout'
import QuestItem from 'components/pages/available-quests/quest'
import ClamQuestSuccessModal from 'components/pages/campaigns/questItem/claimQuestSuccessModal'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Context } from 'src/context'
import { ModalContext } from 'src/context/modals'
import { campaignService } from 'src/services/campaignService'
import { userService } from 'src/services/userService'
import useSWR from 'swr'
import getConfig from 'next/config'
export default function DailyQuest() {
  const { account } = useContext(Context)
  const { setSignInOpen } = useContext(ModalContext)
  const [completedQuest, setCompletedQuest] = useState()
  const [openClaimSuccessModal, setClaimSuccessModalOpen] = useState(false)
  const [enrollLoading, setEnrollLoading] = useState(false)
  const {
    data: authData,
    isLoading,
    mutate,
  } = useSWR(
    { key: 'fetch_campaign_auth_data', slug: getConfig().DAILY_QUEST_CAMPAIGN_SLUG || 'daily-quest-campaign', account: account?.id },
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
    <>
      {isLoading ? (
        <></>
      ) : isEnrolled ? (
        <>
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
        </>
      ) : (
        <>
          <div className='text-sm font-medium text-text-quatenary'>
            Daily Quest offers you a new creative challenge every day. Complete quests to earn rewards and share your
            progress with the community
          </div>
          <Button size='sm' className='w-full' onClick={enrollHandler} loading={enrollLoading}>
            Get Started
          </Button>
        </>
      )}
      {completedQuest && (
        <ClamQuestSuccessModal
          openClaimSuccessModal={openClaimSuccessModal}
          setClaimSuccessModalOpen={setClaimSuccessModalOpen}
          quest={completedQuest}
        />
      )}
    </>
  )
}
