import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.committeepro.app',
    appName: 'CommitteePro',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    }
};

export default config;
