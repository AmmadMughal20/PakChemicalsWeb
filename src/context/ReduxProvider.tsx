'use client'

import { Toaster } from '@/components/ui/toaster'
import { persistor, store } from '@/store'
import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
const ReduxProvider = ({ children }: PropsWithChildren) =>
{
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
                <Toaster />
            </PersistGate>
        </Provider>
    )
}

export default ReduxProvider