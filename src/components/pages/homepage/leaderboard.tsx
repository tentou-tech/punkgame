import Avatar from 'assets/images/avatar.svg'
import Mascot from 'assets/images/mascot.png'
import ProfileCard from 'components/Card/ProfileCard'
import Popover from 'components/Popover'
import Image from 'next/image'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Context } from 'src/context'
import { getLeaderboard } from 'src/services'
import useSWR from 'swr'
export default function LeaderBoard() {
  const { account } = useContext(Context)
  const { data } = useSWR(
    'get_leaderboard',
    async () => {
      const data = await getLeaderboard()
      return data?.user_level || []
    },
    { refreshInterval: 10000 }
  )
  const { t } = useTranslation()
  return (
    <div className='overflow-auto'>
      <div className='bg-[#f0f0f0] rounded-[10px] mt-10 min-w-[300px] md:min-w-[400px] lg:min-h-[426px]'>
        <div className='py-3 md:py-4 px-4 md:px-[32px] w-full h-full flex flex-col'>
          <div
            className={`leading-5 md:text-xl md:leading-[25px] cursor-pointer font-bold w-full text-center pb-[2px] mb-2 md:mb-3 text-[#414141] border-[#414141] border-b-[3px]`}>
            {t('Leaderboard')}
          </div>
          {data?.length > 0 ? (
            <>
              <div className='flex px-[6px] py-2 md:px-[18px] md:py-[11px] border-b-[1px] border-medium-gray text-subtle-dark font-bold text-xs leading-[15px] md:text-sm md:leading-[18px]'>
                <div className='mr-14 md:mr-[70px]'>Rank</div>
                <div className='w-full'>User</div>
                <div className='w-[98px] md:w-[88px] shrink-0 text-center'>Level</div>
                <div className='w-12 shrink-0 text-center'>XP</div>
              </div>
              <div
                className={`${account ? 'h-[208px] md:h-[480px]' : 'h-[240px] md:h-[520px]'
                  } flex flex-col relative overflow-auto`}>
                <div className={`absolute inset-0  gap-2 md:gap-3 flex flex-col text-subtle-dark h-full py-2 md:py-3`}>
                  {data?.map((item, index) => (
                    <div key={index} className='cursor-pointer bg-white rounded-[10px]'>
                      <Popover freeMode popoverRender={() => <ProfileCard hideEmail data={item.authorizer_user} />}>
                        <div className='flex py-1 md:py-[6px] px-4 md:px-[18px] text-xs leading-[15px] md:text-sm md:leading-[18px] items-center'>
                          <div className='w-[24px] md:w-9 mr-[10px]'>#{index + 1}</div>
                          <div className='flex items-center gap-[5px] md:gap-[10px] justify-self-start w-full'>
                            <Image
                              className='w-6 h-6 md:w-7 md:h-7 rounded-full'
                              width={28}
                              height={28}
                              src={item.authorizer_user.picture || Avatar}
                              alt=''
                            />
                            <div className='truncate'>{item.authorizer_user.nickname}</div>
                          </div>
                          <div className='w-[98px] md:w-[88px] shrink-0 text-center'>{item?.level || 0}</div>
                          <div className='w-12 shrink-0 text-center'>{item.xp}</div>
                        </div>
                      </Popover>
                    </div>
                  ))}
                </div>
              </div>
              {account && (
                <div className='flex justify-between py-2 md:py-0 md:pt-5 px-3 md:px-[10px] border-t-[1px] border-medium-gray text-subtle-dark text-xs leading-[15px] md:text-sm md:leading-[18px]'>
                  <div>
                    {/* {t('Your rank')}: <strong>#{account.rank}</strong> */}
                  </div>
                  <div>
                    {t('Your level')}: <strong>{account.level}</strong>
                  </div>
                  <div>
                    XP: <strong>{account.xp}</strong>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='flex flex-col items-center'>
              <Image src={Mascot} alt='mascot' />
              <div className='text-[#414141] font-bold text-xl mt-5'>Coming soon</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
