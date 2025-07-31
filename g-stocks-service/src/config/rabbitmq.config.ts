import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import configuration from './configuration';
const config = configuration();
export const rabbitMQConfig: RabbitMQConfig = {
  exchanges: [
    { name: 'inventory', type: 'topic' },
    { name: 'orders', type: 'topic' },
  ],
  uri: config.rabbitmq.uri,
  connectionInitOptions: { wait: false },
};
