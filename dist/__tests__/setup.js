"use strict";
process.env.NODE_ENV = "test";
process.env.PORT = "4012";
process.env.RABBITMQ_HOST = "localhost";
process.env.RABBITMQ_PORT = "5672";
process.env.RABBITMQ_USERNAME = "guest";
process.env.RABBITMQ_PASSWORD = "guest";
process.env.RABBITMQ_VIRTUAL_HOST = "/";
process.env.RABBITMQ_SSL_ENABLED = "false";
process.env.CORE_QUEUE = "test-queue";
//# sourceMappingURL=setup.js.map