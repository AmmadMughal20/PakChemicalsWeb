'use client'

import { Toaster } from '@/components/ui/toaster'
import { store } from '@/store'
import React from 'react'
import { Provider } from 'react-redux'
const ReduxProvider = ({ children }: any) =>
{
    return (
        <Provider store={store}>
            {children}
            <Toaster />
        </Provider>
    )
}

export default ReduxProvider