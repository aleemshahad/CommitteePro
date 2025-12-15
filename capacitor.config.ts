import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.committeepro.app',
    appName: 'CommitteePro',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: "#8A2BE2",
            showSpinner: false,
        },
        StatusBar: {
            style: 'dark',
            backgroundColor: "#8A2BE2"
        }
    }
};

export default config;
