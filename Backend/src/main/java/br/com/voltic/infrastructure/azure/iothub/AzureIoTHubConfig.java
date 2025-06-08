package br.com.voltic.infrastructure.azure.iothub;

import com.azure.messaging.eventhubs.EventHubClientBuilder;
import com.azure.messaging.eventhubs.EventHubConsumerAsyncClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureIoTHubConfig {

    @Value("${azure.iothub.connection-string}")
    private String connectionString;

    @Bean
    public EventHubConsumerAsyncClient eventHubConsumerAsyncClient() {
        return new EventHubClientBuilder()
            .connectionString(connectionString)
            .consumerGroup("$Default")
            .buildAsyncConsumerClient();
    }
}
