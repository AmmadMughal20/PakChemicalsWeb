'use client'

import { Toaster } from '@/components/ui/toaster'
import { store } from '@/store'
import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
const ReduxProvider = ({ children }: PropsWithChildren) =>
{
    return (
        <Provider store={store}>
            {children}
            <Toaster />
        </Provider>
    )
}

export default ReduxProvider