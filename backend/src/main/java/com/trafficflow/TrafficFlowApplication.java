package com.trafficflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TrafficFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrafficFlowApplication.class, args);
    }
}
