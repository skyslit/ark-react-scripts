// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { ArkPackage, BaseConfigType } from '@skyslit/ark-react';
import DefaultModule from './module';
import './../node_modules/bootstrap/dist/css/bootstrap.min.css';

export interface PackageType {
    Default: DefaultModule
}

export type ConfigType = BaseConfigType

const _package = ArkPackage.getInstance<PackageType, ConfigType>();
_package.configure({
    autoConfigureInitialRoutes: true
})

_package.registerModule('Default', new DefaultModule());

_package.initialize('Browser', (err, opts) => {
    ReactDOM.render(
        <HelmetProvider>
            <Provider store={opts.setupStore(true)}>
                <opts.Router />
            </Provider>
        </HelmetProvider>,
        document.getElementById('root')
    );
});