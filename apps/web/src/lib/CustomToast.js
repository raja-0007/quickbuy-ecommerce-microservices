import { Bot, CircleAlert, CircleCheckBig, CircleX } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const customToast = ({ message, type}) => {
    const toastIcons = {
        success: <CircleCheckBig className='text-green-400 size-5'/>,
        error: <CircleX className='text-red-400 size-5'/>,
        warning: <CircleAlert className='text-yellow-400 size-5'/>,
        default: <Bot className='text-green-400 size-5'/>
    }
  return (
    toast(message, {
        // type: type,
        position: 'top-right',
        icon: toastIcons[type] || toastIcons.default,
        duration: 1500,
    })
  )
}

export default customToast