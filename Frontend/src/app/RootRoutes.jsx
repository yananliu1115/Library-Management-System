import React from 'react'
import { Redirect } from 'react-router-dom'
import chartsRoute from './views/charts/ChartsRoute'
import dashboardRoutes from './views/dashboard/DashboardRoutes'
import materialRoutes from './views/material-kit/MaterialRoutes'
import boardRoutes from './views/board/BoardRoutes'
import aboutRoutes from './views/about/AboutRoutes'

const redirectRoute = [
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/dashboard" />,


    },
]

const errorRoute = [
    {
        component: () => <Redirect to="/session/404" />,
    },
]


const routes = [
    ...dashboardRoutes,
    ...materialRoutes,
    ...chartsRoute,
    ...redirectRoute,
    ...errorRoute,
    ...boardRoutes,
    ...aboutRoutes,
]

export default routes
