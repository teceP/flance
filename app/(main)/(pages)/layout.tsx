import React from 'react'

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {
  return (
    <div className="border-l-[1px] border-t-[1px] pb-20 h-screen border-muted-foreground/20 overflow-scroll p-8 bg-gray-100 min-h-screen">
      {children}
    </div>
  )
}

export default Layout