export default function loadEnv() {
    const isProduction = process.env.NODE_ENV === 'production';
    if(!isProduction) process.loadEnvFile();
}
