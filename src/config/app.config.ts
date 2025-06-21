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

export const config: AppConfig = {
  server: {
    port: parseInt(process.env.PORT || "4012"),
  },
  rabbitmq: {
    host: process.env.RABBITMQ_HOST || "chimpanzee.rmq.cloudamqp.com",
    port: parseInt(process.env.RABBITMQ_PORT || "5671"),
    username: process.env.RABBITMQ_USERNAME || "edxgujmk",
    password:
      process.env.RABBITMQ_PASSWORD || "Wm1vy2ea99LIfZh-ZZyl3DhWlLDlNcdH",
    virtualHost: process.env.RABBITMQ_VIRTUAL_HOST || "edxgujmk",
    ssl: {
      enabled: process.env.RABBITMQ_SSL_ENABLED === "true",
    },
  },
  core: {
    queue: process.env.CORE_QUEUE || "lotes_de_dados",
  },
};
