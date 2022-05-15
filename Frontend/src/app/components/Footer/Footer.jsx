import React from 'react'
import useSettings from 'app/hooks/useSettings'
import {  Toolbar, AppBar, ThemeProvider } from '@mui/material'
import { styled, useTheme } from '@mui/system'
import { topBarHeight } from 'app/utils/constant'

const AppFooter = styled(Toolbar)(() => ({
    display: 'flex',
    alignItems: 'center',
    minHeight: topBarHeight,
    '@media (max-width: 499px)': {
        display: 'table',
        width: '100%',
        minHeight: 'auto',
        padding: '1rem 0',
        '& .container': {
            flexDirection: 'column !important',
            '& a': {
                margin: '0 0 16px !important',
            },
        },
    },
}))


const Footer = () => {
    const theme = useTheme()
    const { settings } = useSettings()

    const footerTheme = settings.themes[settings.footer.theme] || theme

    return (
        <ThemeProvider theme={footerTheme}>
            <AppBar
                color="primary"
                position="static"
                sx={{ zIndex: 96 }}
            >
                <AppFooter>
                    {/* <FooterContent>
                        <a href="https://ui-lib.com/downloads/matx-pro-react-admin/">
                            <Button variant="contained" color="secondary">
                                Get MatX Pro
                            </Button>
                        </a>
                        <Span sx={{ m: "auto" }}></Span>
                        <Paragraph sx={{ m: 0 }}>
                            Design and Developed by{' '}
                            <a href="http://ui-lib.com">UI Lib</a>
                        </Paragraph>
                    </FooterContent> */}
                </AppFooter>
            </AppBar>
        </ThemeProvider>
    )
}

export default Footer
