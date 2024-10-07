import React from 'react'
import Header from '@/components/header'

type Props = { children: React.ReactNode }

const Layout = (props: Props) => {
  return (
    <Header children={props.children} />
  )
}

export default Layout