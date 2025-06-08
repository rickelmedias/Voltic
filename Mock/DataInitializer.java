package br.com.voltic;

import br.com.voltic.entity.Device;
import br.com.voltic.entity.Measurement;
import br.com.voltic.entity.User;
import br.com.voltic.repository.DeviceRepository;
import br.com.voltic.repository.MeasurementRepository;
import br.com.voltic.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepo,
            DeviceRepository deviceRepo,
            MeasurementRepository measRepo,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // 1) Cria usuário se não existir
            User user = userRepo.findByUsername("user@example.com")
                .orElseGet(() -> {
                    String id = UUID.randomUUID().toString();
                    User u = new User();
                    u.setId(id);
                    u.setUserId(id);
                    u.setUsername("user@example.com");
                    u.setPassword(passwordEncoder.encode("admin123456"));
                    u.setRoles(List.of("ROLE_USER"));
                    return userRepo.save(u);
                });

            // 2) Cria dispositivo mock e já associa ao userId
            String serial = "esp32-mock-001";
            Device device = deviceRepo.findByDeviceId(serial)
                .orElseGet(() -> {
                    String id = UUID.randomUUID().toString();
                    Device d = new Device();
                    d.setId(id);
                    d.setUserId(user.getUserId());      // partion key
                    d.setDeviceId(serial);
                    d.setName("Mock Device");
                    d.setDescription("Dispositivo gerado no startup");
                    d.setActivationCode("MOCKCODE123"); // ou UUID
                    d.setActivated(true);
                    return deviceRepo.save(d);
                });

            // 3) Gera 60 medições, uma a cada minuto, para esse device
            List<Measurement> measurements = IntStream.range(0, 60)
                .mapToObj(i -> {
                    Instant ts = Instant.now().minusSeconds(60L * i);
                    // gera valores aleatórios entre 1 e 10
                    double currRms = ThreadLocalRandom.current().nextDouble(1, 10);
                    double voltRms  = ThreadLocalRandom.current().nextDouble(100, 240);
                    Measurement m = new Measurement();
                    m.setDeviceId(device.getDeviceId()); // partition key da coleção de medidas
                    m.setTimestamp(ts);
                    m.setCurrentRms(currRms);
                    m.setVoltageRms(voltRms);
                    return m;
                })
                .collect(Collectors.toList());
            measRepo.saveAll(measurements);

            
            String serial2 = "esp32-mock-12340";
            Device device2 = deviceRepo.findByDeviceId(serial2)
                .orElseGet(() -> {
                    String id = UUID.randomUUID().toString();
                    Device d = new Device();
                    d.setId(id);
                    d.setUserId(user.getUserId());      // partion key
                    d.setDeviceId(serial2);
                    d.setName("DEVICE 12340");
                    d.setDescription("Dispositivo gerado no startup");
                    d.setActivationCode("DEV12340"); // ou UUID
                    d.setActivated(true);
                    return deviceRepo.save(d);
                });

            // 3) ESP00 Facens
            String serial3 = "ESP00";
            Device device3 = deviceRepo.findByDeviceId(serial3)
                .orElseGet(() -> {
                    String id = UUID.randomUUID().toString();
                    Device d = new Device();
                    d.setId(id);
                    d.setUserId(user.getUserId());      // partion key
                    d.setDeviceId(serial3);
                    d.setName("Device Facens");
                    d.setDescription("Device para testes na Faecens");
                    d.setActivationCode("FACENSCODE123"); // ou UUID
                    d.setActivated(true);
                    return deviceRepo.save(d);
                });
                 
            List<Measurement> measurements2 = IntStream.range(0, 60)
                .mapToObj(i -> {
                    Instant ts = Instant.now().minusSeconds(60L * i);
                    double currRms = ThreadLocalRandom.current().nextDouble(1, 10);
                    double voltRms  = ThreadLocalRandom.current().nextDouble(100, 240);
                    Measurement m = new Measurement();
                    m.setDeviceId(device2.getDeviceId());
                    m.setTimestamp(ts);
                    m.setCurrentRms(currRms);
                    m.setVoltageRms(voltRms);
                    return m;
                })
                .collect(Collectors.toList());
            measRepo.saveAll(measurements2);

            System.out.println("=== DataInitializer: Inseridos user, device e 60 medições mock ===");
        };
    }
}
