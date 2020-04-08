// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider, connect } from 'react-redux';
import { ArkPackage, BaseConfigType } from '@skyslit/ark-react';
import DefaultModule from './module';
import DeveloperMenuModal from './tools';
import './../node_modules/@fortawesome/fontawesome-free/css/all.css';
import './assets/styles/main.scss';

export interface PackageType {
    Default: DefaultModule
}

export type ConfigType = BaseConfigType

const _package = ArkPackage.getInstance<PackageType, ConfigType>();
_package.registerModule('Default', new DefaultModule());

_package.registerThemes(
    {
        id: 'sketchy',
        type: 'light',
        url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/sketchy/bootstrap.min.css'
    },
    {
        id: 'minty',
        type: 'light',
        url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/minty/bootstrap.min.css'
    },
    {
        id: 'journal',
        type: 'light',
        url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/journal/bootstrap.min.css'
    },
    {
        id: 'cyborg',
        type: 'dark',
        url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/cyborg/bootstrap.min.css'
    },
    {
        id: 'darkly',
        type: 'dark',
        url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/darkly/bootstrap.min.css'
    },
    {
        id: 'slate',
        type: 'dark',
        url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/slate/bootstrap.min.css'
    },
    {
        id: 'superhero',
        type: 'dark',
        url: 'https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/superhero/bootstrap.min.css'
    }
)

_package.configure({
    autoConfigureInitialRoutes: true
})

_package.initialize('Browser', (err, opts) => {
    ReactDOM.render(
        <HelmetProvider>
            <Provider store={opts.setupStore(true)}>
                <opts.Router />
                <DeveloperMenuModal packageRef={_package} />
            </Provider>
        </HelmetProvider>,
        document.getElementById('root')
    );
}, connect);