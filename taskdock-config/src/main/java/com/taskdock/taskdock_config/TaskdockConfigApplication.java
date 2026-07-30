package com.taskdock.taskdock_config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class TaskdockConfigApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskdockConfigApplication.class, args);
	}

}
