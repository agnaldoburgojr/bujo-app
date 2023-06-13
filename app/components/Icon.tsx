import { FC } from "react"
import './styles.css'

export type IconName = 'zap' | 'plus' | 'settings' | 'task' | 'next' | 'done' | 'delete'

type Props = {
  name: IconName
  isStatic?: boolean
  onClick?: () => void
  dark?: boolean
}

export const Icon: FC<Props> = ({name, isStatic = false, onClick, dark=false}) => {
  const getIcon = () => {
    switch (name) {
      case 'zap':
        return zap()
      case 'plus':
        return plus()
      case 'settings':
        return settings()
      case 'task':
        return task()
      case 'next':
        return next()
      case 'done':
        return done()
      case 'delete':
        return del()
      default:
      return null
    }
  }

  return (
    <span className={`${isStatic ? '' : 'icon'} ${dark ? 'dark' : ''}`} onClick={onClick}>
      {getIcon()}
    </span>
  )
}

const zap = () => (
  <svg  
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      stroke="#E4E5EC"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const del = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="#E4E5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)

const done = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="#E4E5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 6L18 18" stroke="#E4E5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)

const next = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="#E4E5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)

const plus = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="#E4E5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5 12H19" stroke="#E4E5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

)

const settings = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#E4E5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="#E4E5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="#E4E5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)

const task = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#E4E5EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)