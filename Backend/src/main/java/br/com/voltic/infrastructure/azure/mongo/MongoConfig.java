package br.com.voltic.infrastructure.azure.mongo;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.ReadPreference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.lang.NonNull;

@Configuration
@EnableMongoRepositories(basePackages = "br.com.voltic.repository")
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database}")
    private String database;

    @Override
    @NonNull
    protected String getDatabaseName() {
        return database.trim();
    }

    @Override
    public void configureClientSettings(MongoClientSettings.Builder builder) {
        builder
            .applyConnectionString(new ConnectionString(mongoUri.trim()))
            .readPreference(ReadPreference.primary())
            .retryWrites(false);
    }
}
