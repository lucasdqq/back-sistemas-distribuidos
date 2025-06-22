export const AppConfig = {
  server: {
    port: 4012,
  },
  rabbitmq: {
    host: "chimpanzee.rmq.cloudamqp.com",
    port: 5671,
    username: "edxgujmk",
    password: "Wm1vy2ea99LIfZh-ZZyl3DhWlLDlNcdH",
    virtualHost: "edxgujmk",
    ssl: {
      enabled: true,
    },
  },
  core: {
    queue: "lotes_de_dados",
  },
  mongodb: {
    //uri: "mongodb://mongo:27017/agregador_db",
    uri: "mongodb://localhost:27017/agregador_db",
  },
};
