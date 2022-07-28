import React from 'react'

function PublicRoutes({component: Component, ...rest}) {
  return (
    <>
        <Component {...rest} />
    </>
  )
}

export default PublicRoutes;