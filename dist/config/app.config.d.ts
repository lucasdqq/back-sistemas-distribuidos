export interface AppConfig {
    server: {
        port: number;
    };
    rabbitmq: {
        host: string;
        port: number;
        username: string;
        password: string;
        virtualHost: string;
        ssl: {
            enabled: boolean;
        };
    };
    core: {
        queue: string;
    };
}
export declare const config: AppConfig;
//# sourceMappingURL=app.config.d.ts.map