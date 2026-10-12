package com.trafficflow.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:#{null}}")
    private String rawUrl;

    @Value("${spring.datasource.username:#{null}}")
    private String username;

    @Value("${spring.datasource.password:#{null}}")
    private String password;

    @Value("${DB_HOST:#{null}}")
    private String dbHost;

    @Value("${DB_PORT:#{null}}")
    private String dbPort;

    @Value("${DB_NAME:#{null}}")
    private String dbName;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        String jdbcUrl = rawUrl;
        String user = username;
        String pass = password;

        try {
            // Check if Render or Cloud PaaS provided postgres:// or postgresql:// URI
            if (jdbcUrl != null && (jdbcUrl.startsWith("postgres://") || jdbcUrl.startsWith("postgresql://"))) {
                String clean = jdbcUrl.replace("postgres://", "http://").replace("postgresql://", "http://");
                URI uri = new URI(clean);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                if (uri.getUserInfo() != null) {
                    String[] parts = uri.getUserInfo().split(":");
                    user = parts[0];
                    if (parts.length > 1) {
                        pass = parts[1];
                    }
                }
                jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + "?sslmode=require";
                log.info("Converted Render PostgreSQL URI to JDBC URL: jdbc:postgresql://{}:{}{}", host, port, path);
            } else if (dbHost != null && !dbHost.isBlank()) {
                int port = (dbPort != null && !dbPort.isBlank()) ? Integer.parseInt(dbPort) : 5432;
                String db = (dbName != null && !dbName.isBlank()) ? dbName : "trafficflow";
                jdbcUrl = "jdbc:postgresql://" + dbHost + ":" + port + "/" + db + "?sslmode=require";
                log.info("Constructed PostgreSQL JDBC URL from DB_HOST={}", dbHost);
            }

            // Fallback if no URL was provided or host is localhost in production container
            if (jdbcUrl == null || jdbcUrl.isBlank()) {
                jdbcUrl = "jdbc:h2:mem:trafficflow;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_LOWER=TRUE";
                user = "sa";
                pass = "";
                log.info("No external DB_URL configured; initializing in-memory H2 fallback datasource.");
            }

            config.setJdbcUrl(jdbcUrl);
            if (user != null) config.setUsername(user);
            if (pass != null) config.setPassword(pass);

            // Resilient pool settings for cloud environments
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setIdleTimeout(30000);
            config.setMaxLifetime(600000);
            config.setConnectionTimeout(15000);

            log.info("Connecting datasource to: {}", jdbcUrl.replaceAll(":[^:@]+@", ":***@"));
            return new HikariDataSource(config);
        } catch (Exception ex) {
            log.error("Target database unavailable ({}). Activating resilient embedded H2 datasource.", ex.getMessage());
            HikariConfig fallback = new HikariConfig();
            fallback.setJdbcUrl("jdbc:h2:mem:trafficflow;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_LOWER=TRUE");
            fallback.setUsername("sa");
            fallback.setPassword("");
            return new HikariDataSource(fallback);
        }
    }
}
