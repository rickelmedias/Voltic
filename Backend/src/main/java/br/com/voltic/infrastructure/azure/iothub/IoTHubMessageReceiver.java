package br.com.voltic.infrastructure.azure.iothub;

import com.azure.messaging.eventhubs.EventHubConsumerAsyncClient;
import com.azure.messaging.eventhubs.models.PartitionEvent;
import com.azure.messaging.eventhubs.models.EventPosition;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import reactor.core.Disposable;
import reactor.core.scheduler.Schedulers;

@Component
public class IoTHubMessageReceiver {

    private static final Logger logger = LoggerFactory.getLogger(IoTHubMessageReceiver.class);

    private final EventHubConsumerAsyncClient consumerClient;
    private final EventHubListener eventHubListener;
    private Disposable subscription;

    public IoTHubMessageReceiver(EventHubConsumerAsyncClient consumerClient,
                                 EventHubListener eventHubListener) {
        this.consumerClient = consumerClient;
        this.eventHubListener = eventHubListener;
    }

    @PostConstruct
    public void subscribeToNewMessages() {
        logger.info("Iniciando subscrição de novas mensagens (EventPosition.latest())...");

        subscription = consumerClient.getPartitionIds()
            .flatMap(partitionId ->
                consumerClient.receiveFromPartition(partitionId, EventPosition.latest())
            )
            .publishOn(Schedulers.boundedElastic())
            .subscribe(
                this::processEvent,
                this::handleError,
                this::handleComplete
            );

        logger.info("Subscrição ativa. Vou processar só mensagens novas a partir de agora.");
    }

    private void processEvent(PartitionEvent partitionEvent) {
        try {
            String jsonMessage = partitionEvent.getData().getBodyAsString();
            eventHubListener.onMessage(jsonMessage);
        } catch (Exception e) {
            logger.error("Erro ao processar evento: ", e);
        }
    }

    private void handleError(Throwable error) {
        logger.error("Erro na subscrição do Event Hub: {}", error.getMessage(), error);
        if (subscription != null && !subscription.isDisposed()) {
            subscription.dispose();
        }
        // pequena espera antes de reconectar
        try { Thread.sleep(5000); } catch (InterruptedException ignored) {}
        subscribeToNewMessages();
    }

    private void handleComplete() {
        logger.info("Recebimento de novas mensagens completado.");
    }

    @PreDestroy
    public void cleanup() {
        logger.info("Encerrando subscrição do IoT Hub...");
        if (subscription != null && !subscription.isDisposed()) {
            subscription.dispose();
        }
        consumerClient.close();
        logger.info("Client fechado.");
    }
}
