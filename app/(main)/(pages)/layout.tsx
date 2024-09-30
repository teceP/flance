import React from 'react'

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {
  return (
    <div className="border-t-[70px] border-l-[1px] border-b-[1px] border-r-[1px] h-screen border-muted-foreground/20 p-8 bg-gray-100 min-h-screen overflow-y-auto">
      {children}
    </div>
  )
}

export default Layout