import clsx from 'clsx'

const MenuItem = ({
  children,
  className,
  onClick,
  disabled = false
}: {
  children: React.ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  disabled?: boolean
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'flex items-center px-4 py-2',
        className,
        disabled && 'opacity-30 pointer-events-none'
      )}
    >
      {children}
    </div>
  )
}

export default MenuItem
