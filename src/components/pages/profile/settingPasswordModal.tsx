import { Box, Modal } from '@mui/material'
import OutlineTextField from 'components/Input/TextField/Outline'
import Button from 'components/core/Button'
import SuccessImg from 'images/Mascot2.png'
import CheckSquare from 'images/icons/check_square_fill.svg'
import _ from 'lodash'
import Image from 'next/image'
import { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Context } from 'src/context'
import { validatePassword } from 'src/utils'
export default function SettingPasswordModal({ open, setOpen, profile }) {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [rePasswordError, setRePasswordError] = useState('')
  const { updateProfile, account } = useContext(Context)
  const [repasswordValidateSuccess, setRepasswordValidateSuccess] = useState(false)
  const { t } = useTranslation()
  const r1 = useRef<any>()
  useEffect(() => {
    _.delay(() => {
      if (!open) {
        setSuccess(false)
        setLoading(false)
        setRepasswordValidateSuccess(false)
        setNewPassword('')
        setRePassword('')
        setRePasswordError('')
      }
    }, 1000)
  }, [open])
  useEffect(() => {
    setRePasswordError('')
    if (rePassword == newPassword && newPassword) {
      setRepasswordValidateSuccess(true)
    } else {
      setRepasswordValidateSuccess(false)
    }
  }, [rePassword, newPassword])

  const setPasswordHandler = async () => {
    try {
      if (newPassword != rePassword) {
        setRePasswordError(t('Password doesn’t match'))
        return
      }
      if (!validatePassword(newPassword)) {
        setRePasswordError(
          t(
            'Password needs to be at least 6 characters long and contain at least one number, one uppercase letter, one lowercase letter and one special character'
          )
        )
        return
      }
      setLoading(true)
      const res = await updateProfile({
        new_password: newPassword,
        confirm_new_password: rePassword,
      })
      if (res) {
        setLoading(false)
        setSuccess(true)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !success && setOpen(false)}
      aria-labelledby="change-password-modal"
      aria-describedby="modal-to-change-password"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 1,
          borderRadius: 2,
          minHeight: success && '400px',
        }}
      >
        <div className={`pt-6 px-6 pb-4 w-[322px] transition-all duration-300 h-auto`}>
          <div className={` flex flex-col gap-6 transition-all duration-300 ${success ? 'opacity-0' : 'opacity-100'}`}>
            <p className='text-center text-xl leading-6 font-bold'>{t('Set password')}</p>
            <div>
              <OutlineTextField
                label={t('New password')}
                value={newPassword}
                onChange={setNewPassword}
                type='password'
                placeholder={t('Enter new password')}
                onKeyDown={(e) => {
                  if (e.which == 13) {
                    r1.current?.focus()
                  }
                }}
              />
              <OutlineTextField
                label={t('Confirm new password')}
                value={rePassword}
                onChange={setRePassword}
                type='password'
                trailingComponent={
                  <div className='flex items-center gap-[10px]'>
                    {repasswordValidateSuccess ? <Image src={CheckSquare} alt='' /> : null}
                  </div>
                }
                errorMsg={rePasswordError}
                placeholder={t('Re-enter new password')}
                inputRef={r1}
              />
            </div>
            <Button size='sm' className='w-full' disabled={!newPassword || !rePassword} loading={loading} onClick={setPasswordHandler}>
              {t('Confirm')}
            </Button>
          </div>
          <div
            className={`absolute inset-0 py-6 px-4 flex flex-col gap-4 transition-all duration-300 ${success ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
            <p className='text-center text-xl leading-6 font-bold'>{t('Password set')}!</p>
            <Image src={SuccessImg} alt='' className='mx-auto max-h-[188px] w-[188px]' />
            <p className='text-sm leading-[18px] font-semibold text-center w-[274px] mx-auto text-[#414141]'>
              {t('You can use the new password to log in Punkga now')}
            </p>
            <Button
              className='w-full'
              onClick={() => {
                setOpen(false)
              }}>
              {t('Confirm')}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  )
}
